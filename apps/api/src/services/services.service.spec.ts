import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma/prisma.service';

const row = {
  id: 's1',
  slug: 'cardio-de',
  nameUa: 'Кардіо',
  nameEn: 'Cardio',
  category: 'diagnostics',
  descriptionUa: null,
  descriptionEn: null,
  country: 'Germany',
  city: 'Munich',
  priceFrom: 3500,
  currency: 'EUR',
  duration: '3-5 days',
  imageUrl: null,
  tags: ['cardiology'],
  featured: true,
  published: true,
  sortOrder: 1,
  metaTitleUa: null,
  metaTitleEn: null,
  metaDescriptionUa: null,
  metaDescriptionEn: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ServicesService', () => {
  let service: ServicesService;
  const prisma = {
    service: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(ServicesService);
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    it('returns all services (no published filter)', async () => {
      prisma.service.findMany.mockResolvedValue([row]);
      await service.findAll();
      const call = prisma.service.findMany.mock.calls[0][0];
      expect(call.where).toBeUndefined();
    });
  });

  describe('findPublished()', () => {
    it('applies published:true filter', async () => {
      prisma.service.findMany.mockResolvedValue([]);
      await service.findPublished();
      expect(prisma.service.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { published: true } }),
      );
    });
  });

  describe('findFeatured()', () => {
    it('applies featured:true + published:true, caps at 6', async () => {
      prisma.service.findMany.mockResolvedValue([]);
      await service.findFeatured();
      const call = prisma.service.findMany.mock.calls[0][0];
      expect(call.where).toEqual({ published: true, featured: true });
      expect(call.take).toBe(6);
    });
  });

  describe('findOne()', () => {
    it('throws NotFoundException when missing', async () => {
      prisma.service.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns service', async () => {
      prisma.service.findUnique.mockResolvedValue(row);
      const s = await service.findOne('s1');
      expect(s).toBe(row);
    });
  });

  describe('findBySlug()', () => {
    it('throws NotFoundException when missing', async () => {
      prisma.service.findUnique.mockResolvedValue(null);
      await expect(service.findBySlug('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create()', () => {
    it('creates via prisma.service.create', async () => {
      prisma.service.create.mockResolvedValue(row);
      const res = await service.create({ slug: 'cardio-de', nameUa: 'Кардіо' });
      expect(res).toBe(row);
      expect(prisma.service.create).toHaveBeenCalledWith({ data: { slug: 'cardio-de', nameUa: 'Кардіо' } });
    });
  });

  describe('update()', () => {
    it('throws NotFoundException when target missing', async () => {
      prisma.service.findUnique.mockResolvedValue(null);
      await expect(service.update('missing', { nameUa: 'X' })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('updates when found', async () => {
      prisma.service.findUnique.mockResolvedValue(row);
      prisma.service.update.mockResolvedValue({ ...row, nameUa: 'New' });
      const res = await service.update('s1', { nameUa: 'New' });
      expect(res.nameUa).toBe('New');
    });
  });

  describe('remove()', () => {
    it('throws NotFoundException when missing', async () => {
      prisma.service.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('deletes when found', async () => {
      prisma.service.findUnique.mockResolvedValue(row);
      prisma.service.delete.mockResolvedValue(row);
      const res = await service.remove('s1');
      expect(res).toBe(row);
    });
  });
});
