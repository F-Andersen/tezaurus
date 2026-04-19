import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PublicBlogService } from './public-blog.service';
import { PrismaService } from '../prisma/prisma.service';

const category = {
  id: 'cat1',
  slug: 'medical-tourism',
  nameUa: 'Медичний туризм',
  nameEn: 'Medical Tourism',
};

const basePost = {
  id: 'p1',
  slug: 'top-5-clinics-turkey-2026',
  categoryId: 'cat1',
  category,
  titleUa: 'Топ-5 клінік Туреччини',
  titleEn: 'Top 5 Clinics in Turkey',
  excerptUa: 'Огляд UA',
  excerptEn: 'Review EN',
  bodyUa: '<p>Тіло UA</p>',
  bodyEn: '<p>Body EN</p>',
  coverImage: 'https://example.com/cover.jpg',
  metaTitleUa: 'Meta UA',
  metaTitleEn: 'Meta EN',
  metaDescriptionUa: 'Meta d UA',
  metaDescriptionEn: 'Meta d EN',
  tags: ['turkey', 'clinics'],
  status: 'published' as const,
  publishedAt: new Date('2026-03-15'),
};

describe('PublicBlogService', () => {
  let service: PublicBlogService;
  const prisma = {
    blogPost: { findMany: jest.fn(), findFirst: jest.fn() },
    blogCategory: { findFirst: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicBlogService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(PublicBlogService);
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    it('filters posts by status=published', async () => {
      prisma.blogPost.findMany.mockResolvedValue([]);
      await service.findAll('ua');
      expect(prisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'published' }),
        }),
      );
    });

    it('orders by publishedAt desc', async () => {
      prisma.blogPost.findMany.mockResolvedValue([]);
      await service.findAll('ua');
      const call = prisma.blogPost.findMany.mock.calls[0][0];
      expect(call.orderBy).toEqual({ publishedAt: 'desc' });
    });

    it('applies category filter by slug', async () => {
      prisma.blogCategory.findFirst.mockResolvedValue(category);
      prisma.blogPost.findMany.mockResolvedValue([]);
      await service.findAll('ua', 'medical-tourism');
      expect(prisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'published', categoryId: 'cat1' }),
        }),
      );
    });

    it('ignores category filter when category slug is unknown', async () => {
      prisma.blogCategory.findFirst.mockResolvedValue(null);
      prisma.blogPost.findMany.mockResolvedValue([]);
      await service.findAll('ua', 'unknown');
      const where = prisma.blogPost.findMany.mock.calls[0][0].where;
      expect(where.categoryId).toBeUndefined();
    });

    it('returns lang-aware title and excerpt', async () => {
      prisma.blogPost.findMany.mockResolvedValue([basePost]);
      const [ua] = await service.findAll('ua');
      expect(ua.title).toBe('Топ-5 клінік Туреччини');
      expect(ua.excerpt).toBe('Огляд UA');
      const [en] = await service.findAll('en');
      expect(en.title).toBe('Top 5 Clinics in Turkey');
    });
  });

  describe('findBySlug()', () => {
    it('returns mapped post with body when found', async () => {
      prisma.blogPost.findFirst.mockResolvedValue(basePost);
      const post = await service.findBySlug('top-5-clinics-turkey-2026', 'ua');
      expect(post.body).toBe('<p>Тіло UA</p>');
      expect(post.metaTitle).toBe('Meta UA');
    });

    it('throws NotFoundException when missing', async () => {
      prisma.blogPost.findFirst.mockResolvedValue(null);
      await expect(service.findBySlug('missing', 'ua')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('requires published status when searching by slug', async () => {
      prisma.blogPost.findFirst.mockResolvedValue(basePost);
      await service.findBySlug('x', 'ua');
      const call = prisma.blogPost.findFirst.mock.calls[0][0];
      expect(call.where).toEqual({ slug: 'x', status: 'published' });
    });
  });
});
