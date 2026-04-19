import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PublicClinicsService } from './public-clinics.service';
import { PrismaService } from '../prisma/prisma.service';

type MediaLike = { id: string; key: string; altUa?: string | null; altEn?: string | null };
type ClinicRow = Record<string, unknown> & {
  images?: Array<{ media: MediaLike; sortOrder?: number }>;
};

const baseClinic: ClinicRow = {
  id: 'c1',
  slug: 'charite-berlin',
  nameUa: 'Шаріте',
  nameEn: 'Charité',
  country: 'Germany',
  city: 'Berlin',
  specializations: ['Oncology', 'Cardiology'],
  descriptionUa: 'Опис UA',
  descriptionEn: 'Description EN',
  metaTitleUa: 'Meta UA',
  metaTitleEn: 'Meta EN',
  metaDescriptionUa: 'Meta desc UA',
  metaDescriptionEn: 'Meta desc EN',
  imageUrl: 'https://example.com/fallback.jpg',
  images: [
    {
      sortOrder: 0,
      media: { id: 'm1', key: 'uploads/a.jpg', altUa: 'фото', altEn: 'photo' },
    },
  ],
};

describe('PublicClinicsService', () => {
  let service: PublicClinicsService;
  const prisma = {
    clinic: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicClinicsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(PublicClinicsService);
    jest.clearAllMocks();
    delete process.env.S3_PUBLIC_URL;
  });

  describe('findAll()', () => {
    it('returns only published clinics (adds published:true to where)', async () => {
      prisma.clinic.findMany.mockResolvedValue([baseClinic]);
      await service.findAll('ua');
      const call = prisma.clinic.findMany.mock.calls[0][0];
      expect(call.where).toEqual(expect.objectContaining({ published: true }));
    });

    it('applies country filter when provided', async () => {
      prisma.clinic.findMany.mockResolvedValue([]);
      await service.findAll('ua', 'Germany');
      expect(prisma.clinic.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { published: true, country: 'Germany' },
        }),
      );
    });

    it('applies city filter when provided', async () => {
      prisma.clinic.findMany.mockResolvedValue([]);
      await service.findAll('en', undefined, 'Berlin');
      expect(prisma.clinic.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { published: true, city: 'Berlin' },
        }),
      );
    });

    it('returns ua name/description when lang=ua', async () => {
      prisma.clinic.findMany.mockResolvedValue([baseClinic]);
      const [c] = await service.findAll('ua');
      expect(c.name).toBe('Шаріте');
      expect(c.description).toBe('Опис UA');
    });

    it('returns en name/description when lang=en', async () => {
      prisma.clinic.findMany.mockResolvedValue([baseClinic]);
      const [c] = await service.findAll('en');
      expect(c.name).toBe('Charité');
      expect(c.description).toBe('Description EN');
    });

    it('falls back to UA when EN is missing', async () => {
      prisma.clinic.findMany.mockResolvedValue([{ ...baseClinic, nameEn: null }]);
      const [c] = await service.findAll('en');
      expect(c.name).toBe('Шаріте');
    });

    it('falls back to EN when UA is missing', async () => {
      prisma.clinic.findMany.mockResolvedValue([{ ...baseClinic, nameUa: null }]);
      const [c] = await service.findAll('ua');
      expect(c.name).toBe('Charité');
    });

    it('uses imageUrl fallback when ClinicImage relations are empty', async () => {
      prisma.clinic.findMany.mockResolvedValue([{ ...baseClinic, images: [] }]);
      const [c] = await service.findAll('ua');
      expect(c.images).toHaveLength(1);
      expect(c.images[0].url).toBe('https://example.com/fallback.jpg');
    });

    it('returns empty images array when no imageUrl and no ClinicImage relations', async () => {
      prisma.clinic.findMany.mockResolvedValue([{ ...baseClinic, images: [], imageUrl: null }]);
      const [c] = await service.findAll('ua');
      expect(c.images).toEqual([]);
    });

    it('builds ClinicImage url from S3_PUBLIC_URL when configured', async () => {
      process.env.S3_PUBLIC_URL = 'https://cdn.example.com/';
      prisma.clinic.findMany.mockResolvedValue([baseClinic]);
      const [c] = await service.findAll('ua');
      expect(c.images[0].url).toBe('https://cdn.example.com/uploads/a.jpg');
    });
  });

  describe('findBySlug()', () => {
    it('returns a published clinic by slug', async () => {
      prisma.clinic.findFirst.mockResolvedValue(baseClinic);
      const c = await service.findBySlug('charite-berlin', 'en');
      expect(c.slug).toBe('charite-berlin');
      expect(c.name).toBe('Charité');
    });

    it('throws NotFoundException when slug not found', async () => {
      prisma.clinic.findFirst.mockResolvedValue(null);
      await expect(service.findBySlug('missing', 'ua')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('filters by published=true when searching by slug', async () => {
      prisma.clinic.findFirst.mockResolvedValue(baseClinic);
      await service.findBySlug('charite-berlin', 'ua');
      const call = prisma.clinic.findFirst.mock.calls[0][0];
      expect(call.where).toEqual({ slug: 'charite-berlin', published: true });
    });
  });
});
