import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Lang = 'ua' | 'en';

@Injectable()
export class PublicBlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang: Lang, category?: string) {
    const where: { status: 'published'; categoryId?: string } = { status: 'published' };
    if (category) {
      const cat = await this.prisma.blogCategory.findFirst({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }
    const list = await this.prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    });
    return list.map((p) => this.toListItem(p, lang));
  }

  async findBySlug(slug: string, lang: Lang) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: 'published' },
      include: { category: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return this.toResponse(post, lang);
  }

  private toListItem(post: Record<string, unknown> & { category?: Record<string, unknown> | null }, lang: Lang) {
    const title = (lang === 'ua' ? post.titleUa : post.titleEn) ?? post.titleUa ?? post.titleEn ?? '';
    const excerpt = (lang === 'ua' ? post.excerptUa : post.excerptEn) ?? post.excerptUa ?? post.excerptEn ?? '';
    const category = post.category
      ? { slug: post.category.slug, name: (lang === 'ua' ? post.category.nameUa : post.category.nameEn) ?? post.category.nameUa ?? post.category.nameEn }
      : null;
    return {
      id: post.id,
      slug: post.slug,
      title,
      excerpt,
      category,
      tags: post.tags ?? [],
      publishedAt: post.publishedAt,
    };
  }

  private toResponse(post: Record<string, unknown> & { category?: Record<string, unknown> | null }, lang: Lang) {
    const item = this.toListItem(post, lang);
    const body = (lang === 'ua' ? post.bodyUa : post.bodyEn) ?? post.bodyUa ?? post.bodyEn ?? '';
    const metaTitle = (lang === 'ua' ? post.metaTitleUa : post.metaTitleEn) ?? item.title;
    const metaDescription = (lang === 'ua' ? post.metaDescriptionUa : post.metaDescriptionEn) ?? item.excerpt;
    return { ...item, body, metaTitle, metaDescription };
  }
}
