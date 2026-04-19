import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PublicPagesService } from './public-pages.service';
import { PrismaService } from '../prisma/prisma.service';

const basePage = {
  id: 'pg1',
  slug: 'about',
  titleUa: 'Про нас',
  titleEn: 'About',
  contentUa: '<p>UA</p>',
  contentEn: '<p>EN</p>',
  metaTitleUa: 'Мета UA',
  metaTitleEn: 'Meta EN',
  metaDescriptionUa: 'Опис UA',
  metaDescriptionEn: 'Description EN',
  ogImageUa: 'https://example.com/og-ua.jpg',
  ogImageEn: 'https://example.com/og-en.jpg',
  canonical: 'https://tezaurustour.com/about',
  published: true,
};

describe('PublicPagesService', () => {
  let service: PublicPagesService;
  const prisma = {
    page: { findFirst: jest.fn(), findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicPagesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(PublicPagesService);
    jest.clearAllMocks();
  });

  describe('findBySlug()', () => {
    it('returns UA content when lang=ua', async () => {
      prisma.page.findFirst.mockResolvedValue(basePage);
      const p = await service.findBySlug('about', 'ua');
      expect(p.title).toBe('Про нас');
      expect(p.content).toBe('<p>UA</p>');
      expect(p.metaTitle).toBe('Мета UA');
    });

    it('returns EN content when lang=en', async () => {
      prisma.page.findFirst.mockResolvedValue(basePage);
      const p = await service.findBySlug('about', 'en');
      expect(p.title).toBe('About');
      expect(p.content).toBe('<p>EN</p>');
    });

    it('falls back to the other language when one is missing', async () => {
      prisma.page.findFirst.mockResolvedValue({ ...basePage, titleEn: null, contentEn: null });
      const p = await service.findBySlug('about', 'en');
      expect(p.title).toBe('Про нас');
      expect(p.content).toBe('<p>UA</p>');
    });

    it('requires published=true', async () => {
      prisma.page.findFirst.mockResolvedValue(basePage);
      await service.findBySlug('about', 'ua');
      const call = prisma.page.findFirst.mock.calls[0][0];
      expect(call.where).toEqual({ slug: 'about', published: true });
    });

    it('throws NotFoundException for unknown slug', async () => {
      prisma.page.findFirst.mockResolvedValue(null);
      await expect(service.findBySlug('missing', 'ua')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('listSlugs()', () => {
    it('returns slugs of published pages only', async () => {
      prisma.page.findMany.mockResolvedValue([{ slug: 'home' }, { slug: 'about' }]);
      const slugs = await service.listSlugs();
      expect(slugs).toEqual(['home', 'about']);
      expect(prisma.page.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { published: true } }),
      );
    });
  });
});
