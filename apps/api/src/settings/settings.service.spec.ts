import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';

const mockSetting = { id: 's1', key: 'email_receivers', value: ['test@example.com'], updatedAt: new Date() };

const mockPrisma = {
  setting: {
    findUnique: jest.fn().mockResolvedValue(mockSetting),
    findMany: jest.fn().mockResolvedValue([mockSetting]),
    upsert: jest.fn().mockResolvedValue(mockSetting),
  },
};

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    jest.clearAllMocks();
    mockPrisma.setting.findUnique.mockResolvedValue(mockSetting);
    mockPrisma.setting.findMany.mockResolvedValue([mockSetting]);
    mockPrisma.setting.upsert.mockResolvedValue(mockSetting);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get()', () => {
    it('returns the value for a key', async () => {
      const val = await service.get('email_receivers');
      expect(val).toEqual(['test@example.com']);
    });

    it('returns null if key not found', async () => {
      mockPrisma.setting.findUnique.mockResolvedValueOnce(null);
      const val = await service.get('nonexistent');
      expect(val).toBeNull();
    });
  });

  describe('set()', () => {
    it('calls prisma upsert', async () => {
      await service.set('phones', ['+380991234567'] as unknown as object);
      expect(mockPrisma.setting.upsert).toHaveBeenCalled();
    });
  });

  describe('getAll()', () => {
    it('returns a map of settings', async () => {
      const result = await service.getAll(['email_receivers']);
      expect(result).toHaveProperty('email_receivers');
    });
  });

  describe('getPublic()', () => {
    it('does not query email_receivers key', async () => {
      await service.getPublic();
      const callArg = mockPrisma.setting.findMany.mock.calls[0][0];
      expect(callArg.where.key.in).not.toContain('email_receivers');
    });
  });

  describe('getAdmin()', () => {
    it('includes email_receivers', async () => {
      mockPrisma.setting.findMany.mockResolvedValueOnce([
        { key: 'email_receivers', value: ['admin@test.com'], updatedAt: new Date() },
      ]);
      const result = await service.getAdmin();
      expect(result).toHaveProperty('email_receivers');
    });
  });
});
