import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClinicDto, UpdateClinicDto } from './dto/clinic.dto';

@Injectable()
export class ClinicsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClinicDto) {
    const existing = await this.prisma.clinic.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug already exists');
    const { imageIds, ...data } = dto;
    const clinic = await this.prisma.clinic.create({
      data: {
        ...data,
        specializations: data.specializations ?? [],
      },
    });
    if (imageIds?.length) {
      await this.prisma.clinicImage.createMany({
        data: imageIds.map((mediaId, i) => ({ clinicId: clinic.id, mediaId, sortOrder: i })),
      });
    }
    return this.findOne(clinic.id);
  }

  async findAll() {
    return this.prisma.clinic.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: { include: { media: true }, orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findOne(id: string) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id },
      include: { images: { include: { media: true }, orderBy: { sortOrder: 'asc' } } },
    });
    if (!clinic) throw new NotFoundException('Clinic not found');
    return clinic;
  }

  async update(id: string, dto: UpdateClinicDto) {
    if (dto.slug) {
      const existing = await this.prisma.clinic.findFirst({ where: { slug: dto.slug, NOT: { id } } });
      if (existing) throw new ConflictException('Slug already exists');
    }
    const { imageIds, ...data } = dto;
    if (imageIds !== undefined) {
      await this.prisma.clinicImage.deleteMany({ where: { clinicId: id } });
      if (imageIds.length) {
        await this.prisma.clinicImage.createMany({
          data: imageIds.map((mediaId, i) => ({ clinicId: id, mediaId, sortOrder: i })),
        });
      }
    }
    await this.prisma.clinic.update({
      where: { id },
      data: { ...data, specializations: data.specializations ?? undefined },
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.prisma.clinic.delete({ where: { id } });
    return { success: true };
  }
}
