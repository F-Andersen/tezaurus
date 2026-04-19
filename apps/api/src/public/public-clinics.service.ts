import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Lang = 'ua' | 'en';

@Injectable()
export class PublicClinicsService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang: Lang, country?: string, city?: string) {
    const where: { published: boolean; country?: string; city?: string } = { published: true };
    if (country) where.country = country;
    if (city) where.city = city;
    const list = await this.prisma.clinic.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { include: { media: true }, orderBy: { sortOrder: 'asc' }, take: 1 },
      },
    });
    return list.map((c) => this.toResponse(c, lang));
  }

  async findBySlug(slug: string, lang: Lang) {
    const clinic = await this.prisma.clinic.findFirst({
      where: { slug, published: true },
      include: {
        images: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!clinic) throw new NotFoundException('Clinic not found');
    return this.toResponse(clinic, lang);
  }

  private toResponse(clinic: Record<string, unknown> & { images?: Array<{ media: Record<string, unknown> }> }, lang: Lang) {
    const name = (lang === 'ua' ? clinic.nameUa : clinic.nameEn) ?? clinic.nameUa ?? clinic.nameEn ?? '';
    const description = (lang === 'ua' ? clinic.descriptionUa : clinic.descriptionEn) ?? clinic.descriptionUa ?? clinic.descriptionEn ?? '';
    const metaTitle = (lang === 'ua' ? clinic.metaTitleUa : clinic.metaTitleEn) ?? name;
    const metaDescription = (lang === 'ua' ? clinic.metaDescriptionUa : clinic.metaDescriptionEn) ?? '';
    const baseUrl = process.env.S3_PUBLIC_URL ? process.env.S3_PUBLIC_URL.replace(/\/$/, '') : '';
    let images = (clinic.images ?? []).map((i: { media: Record<string, unknown> }) => ({
      id: i.media?.id,
      key: i.media?.key,
      url: baseUrl && i.media?.key ? `${baseUrl}/${i.media.key}` : null,
      alt: (lang === 'ua' ? i.media?.altUa : i.media?.altEn) ?? i.media?.altUa ?? i.media?.altEn,
    }));
    if (images.length === 0 && clinic.imageUrl) {
      images = [{ id: 'fallback', key: '', url: clinic.imageUrl as string, alt: name }];
    }
    return {
      id: clinic.id,
      slug: clinic.slug,
      name,
      description,
      country: clinic.country,
      city: clinic.city,
      specializations: clinic.specializations ?? [],
      metaTitle,
      metaDescription,
      images,
    };
  }
}
