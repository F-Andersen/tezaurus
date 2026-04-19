import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './s3.service';
import { LocalMediaStore } from './local-media.store';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service,
    @Optional() private localStore?: LocalMediaStore,
  ) {}

  async upload(file: Express.Multer.File, altUa?: string, altEn?: string) {
    const ext = file.originalname.split('.').pop() || 'bin';
    const key = `uploads/${randomUUID()}.${ext}`;
    const uploaded = await this.s3.upload(key, file.buffer, file.mimetype);
    if (!uploaded) {
      const localKey = `local/${Date.now()}-${file.originalname}`;
      const asset = await this.prisma.mediaAsset.create({
        data: {
          key: localKey,
          altUa: altUa ?? null,
          altEn: altEn ?? null,
          mimeType: file.mimetype,
          size: file.size,
        },
      });
      // Phase 1: зберігаємо байти в in-memory store, щоб `GET /api/admin/media/file/:id`
      // міг віддати файл. Phase 2 замінить на disk storage + volume.
      this.localStore?.set(asset.id, file.buffer, file.mimetype, file.originalname);
      return { ...asset, url: `/api/admin/media/file/${asset.id}` };
    }
    const asset = await this.prisma.mediaAsset.create({
      data: {
        key,
        altUa: altUa ?? null,
        altEn: altEn ?? null,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
    return { ...asset, url: this.s3.getPublicUrl(key) };
  }

  getLocalFile(id: string): { buffer: Buffer; mimeType: string; filename: string } | undefined {
    return this.localStore?.get(id);
  }

  async findAll() {
    const list = await this.prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
    const baseUrl = process.env.S3_PUBLIC_URL || '';
    return list.map((a) => ({
      ...a,
      url: baseUrl ? `${baseUrl.replace(/\/$/, '')}/${a.key}` : `/api/admin/media/file/${a.id}`,
    }));
  }

  async findOne(id: string) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException('Media not found');
    return asset;
  }

  async update(id: string, data: { altUa?: string; altEn?: string }) {
    return this.prisma.mediaAsset.update({
      where: { id },
      data: { altUa: data.altUa ?? undefined, altEn: data.altEn ?? undefined },
    });
  }

  async remove(id: string) {
    const asset = await this.findOne(id);
    await this.s3.delete(asset.key);
    this.localStore?.delete(id);
    await this.prisma.mediaAsset.delete({ where: { id } });
    return { success: true };
  }
}
