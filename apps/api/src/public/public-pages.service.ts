import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Lang = 'ua' | 'en';

@Injectable()
export class PublicPagesService {
  constructor(private prisma: PrismaService) {}

  async listSlugs() {
    const pages = await this.prisma.page.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return pages.map((p) => p.slug);
  }

  async findBySlug(slug: string, lang: Lang) {
    const page = await this.prisma.page.findFirst({
      where: { slug, published: true },
    });
    if (!page) throw new NotFoundException('Page not found');
    return this.toResponse(page, lang);
  }

  private toResponse(page: Record<string, unknown>, lang: Lang) {
    const title = (lang === 'ua' ? page.titleUa : page.titleEn) ?? page.titleUa ?? page.titleEn ?? '';
    const content = (lang === 'ua' ? page.contentUa : page.contentEn) ?? page.contentUa ?? page.contentEn ?? '';
    const metaTitle = (lang === 'ua' ? page.metaTitleUa : page.metaTitleEn) ?? title;
    const metaDescription = (lang === 'ua' ? page.metaDescriptionUa : page.metaDescriptionEn) ?? '';
    const ogImage = (lang === 'ua' ? page.ogImageUa : page.ogImageEn) ?? (page.ogImageUa as string) ?? (page.ogImageEn as string);
    return {
      id: page.id,
      slug: page.slug,
      title,
      content,
      metaTitle,
      metaDescription,
      ogImage,
      canonical: page.canonical,
    };
  }
}
