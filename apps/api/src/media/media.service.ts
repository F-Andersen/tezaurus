import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './s3.service';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service,
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
    await this.prisma.mediaAsset.delete({ where: { id } });
    return { success: true };
  }
}
