import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePageDto) {
    const existing = await this.prisma.page.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug already exists');
    return this.prisma.page.create({ data: dto });
  }

  async findAll() {
    return this.prisma.page.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findBySlug(slug: string) {
    return this.prisma.page.findUniqueOrThrow({ where: { slug } });
  }

  async update(id: string, dto: UpdatePageDto) {
    if (dto.slug) {
      const existing = await this.prisma.page.findFirst({ where: { slug: dto.slug, NOT: { id } } });
      if (existing) throw new ConflictException('Slug already exists');
    }
    return this.prisma.page.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.page.delete({ where: { id } });
    return { success: true };
  }
}
