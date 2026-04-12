import { Test, TestingModule } from '@nestjs/testing';
import { PagesService } from './pages.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockPage = {
  id: 'page-id-1',
  slug: 'home',
  titleUa: 'Головна',
  titleEn: 'Home',
  contentUa: '<p>Привіт</p>',
  contentEn: '<p>Hello</p>',
  metaTitleUa: 'Головна | TEZAURUS-TOUR',
  metaTitleEn: 'Home | TEZAURUS-TOUR',
  metaDescriptionUa: 'Опис',
  metaDescriptionEn: 'Description',
  ogImageUa: null,
  ogImageEn: null,
  canonical: null,
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  page: {
    create: jest.fn().mockResolvedValue(mockPage),
    findMany: jest.fn().mockResolvedValue([mockPage]),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn().mockResolvedValue(mockPage),
    delete: jest.fn().mockResolvedValue(mockPage),
    findUniqueOrThrow: jest.fn().mockResolvedValue(mockPage),
  },
};

describe('PagesService', () => {
  let service: PagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PagesService>(PagesService);
    jest.clearAllMocks();
    mockPrisma.page.create.mockResolvedValue(mockPage);
    mockPrisma.page.findMany.mockResolvedValue([mockPage]);
    mockPrisma.page.findUnique.mockResolvedValue(mockPage);
    mockPrisma.page.findUniqueOrThrow.mockResolvedValue(mockPage);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('creates a page when slug is unique', async () => {
      mockPrisma.page.findUnique.mockResolvedValueOnce(null);
      const result = await service.create({ slug: 'home', titleUa: 'Головна' });
      expect(mockPrisma.page.create).toHaveBeenCalled();
      expect(result.slug).toBe('home');
    });

    it('throws ConflictException when slug exists', async () => {
      mockPrisma.page.findUnique.mockResolvedValueOnce(mockPage);
      await expect(service.create({ slug: 'home' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll()', () => {
    it('returns array of pages', async () => {
      const result = await service.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].slug).toBe('home');
    });
  });

  describe('findOne()', () => {
    it('returns a page by id', async () => {
      const result = await service.findOne('page-id-1');
      expect(result).toEqual(mockPage);
    });

    it('throws NotFoundException for unknown id', async () => {
      mockPrisma.page.findUnique.mockResolvedValueOnce(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('updates a page', async () => {
      mockPrisma.page.findFirst.mockResolvedValue(null);
      await service.update('page-id-1', { titleUa: 'Оновлено' });
      expect(mockPrisma.page.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'page-id-1' } }),
      );
    });

    it('throws ConflictException if new slug already taken by another page', async () => {
      mockPrisma.page.findFirst.mockResolvedValue({ id: 'other-id', slug: 'about' });
      await expect(service.update('page-id-1', { slug: 'about' })).rejects.toThrow(ConflictException);
      mockPrisma.page.findFirst.mockResolvedValue(null);
    });
  });

  describe('remove()', () => {
    it('deletes and returns success', async () => {
      const result = await service.remove('page-id-1');
      expect(mockPrisma.page.delete).toHaveBeenCalledWith({ where: { id: 'page-id-1' } });
      expect(result).toEqual({ success: true });
    });
  });
});
