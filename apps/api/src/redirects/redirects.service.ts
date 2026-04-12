import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRedirectDto, UpdateRedirectDto } from './dto/redirect.dto';

@Injectable()
export class RedirectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRedirectDto) {
    const existing = await this.prisma.redirect.findUnique({ where: { fromPath: dto.fromPath } });
    if (existing) throw new ConflictException('From path already exists');
    return this.prisma.redirect.create({ data: dto });
  }

  async findAll() {
    return this.prisma.redirect.findMany({ orderBy: { fromPath: 'asc' } });
  }

  async findOne(id: string) {
    const r = await this.prisma.redirect.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Redirect not found');
    return r;
  }

  async update(id: string, dto: UpdateRedirectDto) {
    if (dto.fromPath) {
      const existing = await this.prisma.redirect.findFirst({ where: { fromPath: dto.fromPath, NOT: { id } } });
      if (existing) throw new ConflictException('From path already exists');
    }
    return this.prisma.redirect.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.redirect.delete({ where: { id } });
    return { success: true };
  }
}
