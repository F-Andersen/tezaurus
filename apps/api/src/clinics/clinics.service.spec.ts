import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { PrismaService } from '../prisma/prisma.service';

const clinicRow = {
  id: 'c1',
  slug: 'charite-berlin',
  nameUa: 'Шаріте',
  nameEn: 'Charité',
  country: 'Germany',
  city: 'Berlin',
  specializations: ['Oncology'],
  descriptionUa: null,
  descriptionEn: null,
  imageUrl: null,
  metaTitleUa: null,
  metaTitleEn: null,
  metaDescriptionUa: null,
  metaDescriptionEn: null,
  published: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  images: [],
};

describe('ClinicsService', () => {
  let service: ClinicsService;
  const prisma = {
    clinic: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    clinicImage: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(ClinicsService);
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('creates a clinic with empty specializations default', async () => {
      prisma.clinic.findUnique.mockResolvedValue(null);
      prisma.clinic.create.mockResolvedValue(clinicRow);
      prisma.clinic.findUnique.mockResolvedValueOnce(null); // slug check
      prisma.clinic.findUnique.mockResolvedValueOnce(clinicRow); // findOne after create
      prisma.clinic.findUnique.mockImplementation(({ where }: { where: { slug?: string; id?: string } }) => {
        if (where.slug) return Promise.resolve(null);
        return Promise.resolve(clinicRow);
      });

      await service.create({ slug: 'charite-berlin', nameUa: 'Шаріте' });
      expect(prisma.clinic.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ slug: 'charite-berlin', specializations: [] }),
        }),
      );
    });

    it('throws ConflictException when slug already exists', async () => {
      prisma.clinic.findUnique.mockResolvedValue(clinicRow);
      await expect(service.create({ slug: 'charite-berlin' })).rejects.toBeInstanceOf(ConflictException);
      expect(prisma.clinic.create).not.toHaveBeenCalled();
    });

    it('creates ClinicImage rows when imageIds provided', async () => {
      prisma.clinic.findUnique.mockImplementation(({ where }: { where: { slug?: string; id?: string } }) => {
        if (where.slug) return Promise.resolve(null);
        return Promise.resolve(clinicRow);
      });
      prisma.clinic.create.mockResolvedValue(clinicRow);
      await service.create({ slug: 'charite-berlin', imageIds: ['m1', 'm2'] });
      expect(prisma.clinicImage.createMany).toHaveBeenCalledWith({
        data: [
          { clinicId: 'c1', mediaId: 'm1', sortOrder: 0 },
          { clinicId: 'c1', mediaId: 'm2', sortOrder: 1 },
        ],
      });
    });
  });

  describe('findAll()', () => {
    it('returns all clinics with images sorted', async () => {
      prisma.clinic.findMany.mockResolvedValue([clinicRow]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(prisma.clinic.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
      );
    });
  });

  describe('findOne()', () => {
    it('throws NotFoundException when clinic not found', async () => {
      prisma.clinic.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns clinic with included images', async () => {
      prisma.clinic.findUnique.mockResolvedValue(clinicRow);
      const c = await service.findOne('c1');
      expect(c).toBe(clinicRow);
    });
  });

  describe('update()', () => {
    it('throws ConflictException when new slug belongs to another clinic', async () => {
      prisma.clinic.findFirst.mockResolvedValue({ ...clinicRow, id: 'other' });
      await expect(service.update('c1', { slug: 'charite-berlin' })).rejects.toBeInstanceOf(ConflictException);
    });

    it('replaces ClinicImage rows when imageIds provided', async () => {
      prisma.clinic.findFirst.mockResolvedValue(null);
      prisma.clinic.findUnique.mockResolvedValue(clinicRow);
      prisma.clinic.update.mockResolvedValue(clinicRow);
      await service.update('c1', { imageIds: ['m3', 'm4'] });
      expect(prisma.clinicImage.deleteMany).toHaveBeenCalledWith({ where: { clinicId: 'c1' } });
      expect(prisma.clinicImage.createMany).toHaveBeenCalledWith({
        data: [
          { clinicId: 'c1', mediaId: 'm3', sortOrder: 0 },
          { clinicId: 'c1', mediaId: 'm4', sortOrder: 1 },
        ],
      });
    });

    it('deletes all images when imageIds=[]', async () => {
      prisma.clinic.findUnique.mockResolvedValue(clinicRow);
      prisma.clinic.update.mockResolvedValue(clinicRow);
      await service.update('c1', { imageIds: [] });
      expect(prisma.clinicImage.deleteMany).toHaveBeenCalled();
      expect(prisma.clinicImage.createMany).not.toHaveBeenCalled();
    });

    it('does not touch images when imageIds is undefined', async () => {
      prisma.clinic.findUnique.mockResolvedValue(clinicRow);
      prisma.clinic.update.mockResolvedValue(clinicRow);
      await service.update('c1', { nameUa: 'New name' });
      expect(prisma.clinicImage.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('calls prisma.clinic.delete', async () => {
      prisma.clinic.delete.mockResolvedValue(clinicRow);
      const res = await service.remove('c1');
      expect(res).toEqual({ success: true });
      expect(prisma.clinic.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
    });
  });
});
