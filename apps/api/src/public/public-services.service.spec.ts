import { Test, TestingModule } from '@nestjs/testing';
import { PublicServicesService } from './public-services.service';
import { PrismaService } from '../prisma/prisma.service';

const baseService = {
  id: 's1',
  slug: 'cardio-de',
  nameUa: 'Кардіо',
  nameEn: 'Cardio',
  category: 'diagnostics',
  descriptionUa: 'Опис UA',
  descriptionEn: 'Description EN',
  country: 'Germany',
  city: 'Munich',
  priceFrom: 3500,
  currency: 'EUR',
  duration: '3-5 days',
  imageUrl: 'https://example.com/s.jpg',
  tags: ['cardiology', 'diagnostics'],
  featured: true,
  published: true,
  sortOrder: 1,
  metaTitleUa: 'Meta UA',
  metaTitleEn: 'Meta EN',
  metaDescriptionUa: 'Meta d UA',
  metaDescriptionEn: 'Meta d EN',
};

describe('PublicServicesService', () => {
  let service: PublicServicesService;
  const prisma = {
    service: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicServicesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(PublicServicesService);
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    it('filters by published:true', async () => {
      prisma.service.findMany.mockResolvedValue([]);
      await service.findAll('ua');
      expect(prisma.service.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ published: true }) }),
      );
    });

    it('applies category filter', async () => {
      prisma.service.findMany.mockResolvedValue([]);
      await service.findAll('en', 'diagnostics');
      expect(prisma.service.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'diagnostics' }),
        }),
      );
    });

    it('applies country filter', async () => {
      prisma.service.findMany.mockResolvedValue([]);
      await service.findAll('en', undefined, 'Germany');
      expect(prisma.service.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ country: 'Germany' }),
        }),
      );
    });

    it('orders by sortOrder asc then createdAt desc', async () => {
      prisma.service.findMany.mockResolvedValue([]);
      await service.findAll('ua');
      const call = prisma.service.findMany.mock.calls[0][0];
      expect(call.orderBy).toEqual([{ sortOrder: 'asc' }, { createdAt: 'desc' }]);
    });

    it('returns EN name when lang=en', async () => {
      prisma.service.findMany.mockResolvedValue([baseService]);
      const [s] = await service.findAll('en');
      expect(s.name).toBe('Cardio');
      expect(s.description).toBe('Description EN');
    });

    it('returns UA name when lang=ua', async () => {
      prisma.service.findMany.mockResolvedValue([baseService]);
      const [s] = await service.findAll('ua');
      expect(s.name).toBe('Кардіо');
    });

    it('falls back to UA name when EN is missing', async () => {
      prisma.service.findMany.mockResolvedValue([{ ...baseService, nameEn: null }]);
      const [s] = await service.findAll('en');
      expect(s.name).toBe('Кардіо');
    });

    it('exposes tags and featured flag', async () => {
      prisma.service.findMany.mockResolvedValue([baseService]);
      const [s] = await service.findAll('ua');
      expect(s.tags).toEqual(['cardiology', 'diagnostics']);
      expect(s.featured).toBe(true);
    });
  });

  describe('findBySlug()', () => {
    it('returns null for unpublished services', async () => {
      prisma.service.findUnique.mockResolvedValue({ ...baseService, published: false });
      const s = await service.findBySlug('cardio-de', 'ua');
      expect(s).toBeNull();
    });

    it('returns null when service not found', async () => {
      prisma.service.findUnique.mockResolvedValue(null);
      const s = await service.findBySlug('missing', 'ua');
      expect(s).toBeNull();
    });

    it('returns mapped service for published items', async () => {
      prisma.service.findUnique.mockResolvedValue(baseService);
      const s = await service.findBySlug('cardio-de', 'en');
      expect(s).not.toBeNull();
      expect(s!.name).toBe('Cardio');
      expect(s!.metaTitle).toBe('Meta EN');
    });
  });
});
