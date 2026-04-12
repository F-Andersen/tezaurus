import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Lang = 'ua' | 'en';

@Injectable()
export class PublicServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang: Lang, category?: string, country?: string) {
    const where: Record<string, unknown> = { published: true };
    if (category) where.category = category;
    if (country) where.country = country;

    const items = await this.prisma.service.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return items.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: lang === 'en' ? (s.nameEn || s.nameUa) : (s.nameUa || s.nameEn),
      description: lang === 'en' ? (s.descriptionEn || s.descriptionUa) : (s.descriptionUa || s.descriptionEn),
      category: s.category,
      country: s.country,
      city: s.city,
      priceFrom: s.priceFrom,
      currency: s.currency,
      duration: s.duration,
      imageUrl: s.imageUrl,
      tags: s.tags,
      featured: s.featured,
    }));
  }

  async findBySlug(slug: string, lang: Lang) {
    const s = await this.prisma.service.findUnique({ where: { slug } });
    if (!s || !s.published) return null;
    return {
      id: s.id,
      slug: s.slug,
      name: lang === 'en' ? (s.nameEn || s.nameUa) : (s.nameUa || s.nameEn),
      description: lang === 'en' ? (s.descriptionEn || s.descriptionUa) : (s.descriptionUa || s.descriptionEn),
      category: s.category,
      country: s.country,
      city: s.city,
      priceFrom: s.priceFrom,
      currency: s.currency,
      duration: s.duration,
      imageUrl: s.imageUrl,
      tags: s.tags,
      featured: s.featured,
      metaTitle: lang === 'en' ? (s.metaTitleEn || s.metaTitleUa) : (s.metaTitleUa || s.metaTitleEn),
      metaDescription: lang === 'en' ? (s.metaDescriptionEn || s.metaDescriptionUa) : (s.metaDescriptionUa || s.metaDescriptionEn),
    };
  }
}
