import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MediaService } from './media.service';
import { S3Service } from './s3.service';
import { PrismaService } from '../prisma/prisma.service';

const asset = {
  id: 'a1',
  key: 'uploads/abc.png',
  altUa: null,
  altEn: null,
  mimeType: 'image/png',
  size: 1024,
  createdAt: new Date(),
};

function fakeFile(): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'cat.png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 1024,
    buffer: Buffer.from('fake'),
    destination: '',
    filename: '',
    path: '',
    stream: undefined as never,
  };
}

describe('MediaService', () => {
  let service: MediaService;
  const prisma = {
    mediaAsset: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const s3 = {
    upload: jest.fn(),
    delete: jest.fn(),
    getPublicUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: PrismaService, useValue: prisma },
        { provide: S3Service, useValue: s3 },
      ],
    }).compile();
    service = module.get(MediaService);
    jest.clearAllMocks();
    delete process.env.S3_PUBLIC_URL;
  });

  describe('upload()', () => {
    it('stores local fallback when S3 is not configured', async () => {
      s3.upload.mockResolvedValue(false);
      prisma.mediaAsset.create.mockResolvedValue(asset);
      const res = await service.upload(fakeFile(), 'alt UA', 'alt EN');
      expect(prisma.mediaAsset.create).toHaveBeenCalled();
      expect(res.url).toMatch(/^\/api\/admin\/media\/file\//);
    });

    it('uses S3 path when upload returns true', async () => {
      s3.upload.mockResolvedValue(true);
      s3.getPublicUrl.mockReturnValue('https://cdn.example.com/uploads/abc.png');
      prisma.mediaAsset.create.mockResolvedValue(asset);
      const res = await service.upload(fakeFile());
      expect(res.url).toBe('https://cdn.example.com/uploads/abc.png');
    });

    it('passes altUa and altEn to prisma.create', async () => {
      s3.upload.mockResolvedValue(true);
      s3.getPublicUrl.mockReturnValue('https://x/y.png');
      prisma.mediaAsset.create.mockResolvedValue(asset);
      await service.upload(fakeFile(), 'alt-ua', 'alt-en');
      expect(prisma.mediaAsset.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ altUa: 'alt-ua', altEn: 'alt-en' }),
      });
    });
  });

  describe('findAll()', () => {
    it('returns assets with S3 public url when S3_PUBLIC_URL is set', async () => {
      process.env.S3_PUBLIC_URL = 'https://cdn.example.com/';
      prisma.mediaAsset.findMany.mockResolvedValue([asset]);
      const list = await service.findAll();
      expect(list[0].url).toBe('https://cdn.example.com/uploads/abc.png');
    });

    it('falls back to local file endpoint when S3_PUBLIC_URL is absent', async () => {
      prisma.mediaAsset.findMany.mockResolvedValue([asset]);
      const list = await service.findAll();
      expect(list[0].url).toBe('/api/admin/media/file/a1');
    });
  });

  describe('findOne()', () => {
    it('throws NotFoundException when asset is missing', async () => {
      prisma.mediaAsset.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('deletes from S3 and DB', async () => {
      prisma.mediaAsset.findUnique.mockResolvedValue(asset);
      s3.delete.mockResolvedValue(true);
      prisma.mediaAsset.delete.mockResolvedValue(asset);
      const res = await service.remove('a1');
      expect(s3.delete).toHaveBeenCalledWith('uploads/abc.png');
      expect(prisma.mediaAsset.delete).toHaveBeenCalledWith({ where: { id: 'a1' } });
      expect(res).toEqual({ success: true });
    });

    it('throws NotFoundException when asset not found', async () => {
      prisma.mediaAsset.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
