import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SettingsService } from '../settings/settings.service';
import { CreateLeadDto } from './dto/create-lead.dto';

const mockLead = {
  id: 'test-id-1',
  type: 'request' as const,
  name: 'John Doe',
  phone: '+380991234567',
  email: 'john@example.com',
  requestType: 'Medical',
  country: 'UA',
  message: 'Test message',
  consent: true,
  status: 'NEW' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockPrisma = {
  lead: {
    create: jest.fn().mockResolvedValue(mockLead),
    findMany: jest.fn().mockResolvedValue([mockLead]),
    findUniqueOrThrow: jest.fn().mockResolvedValue(mockLead),
    update: jest.fn().mockResolvedValue({ ...mockLead, status: 'IN_PROGRESS' }),
  },
};

const mockEmail = {
  sendLeadNotification: jest.fn().mockResolvedValue(undefined),
};

const mockSettings = {
  get: jest.fn().mockResolvedValue(['test@example.com']),
};

describe('LeadsService', () => {
  let service: LeadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EmailService, useValue: mockEmail },
        { provide: SettingsService, useValue: mockSettings },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    jest.clearAllMocks();
    mockPrisma.lead.create.mockResolvedValue(mockLead);
    mockPrisma.lead.findMany.mockResolvedValue([mockLead]);
    mockPrisma.lead.findUniqueOrThrow.mockResolvedValue(mockLead);
    mockSettings.get.mockResolvedValue(['test@example.com']);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    const dto: CreateLeadDto = {
      type: 'request',
      name: 'John Doe',
      phone: '+380991234567',
      email: 'john@example.com',
      requestType: 'Medical',
      country: 'UA',
      message: 'Test message',
      consent: true,
    };

    it('creates a lead in the database', async () => {
      await service.create(dto);
      expect(mockPrisma.lead.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ phone: dto.phone, consent: true }),
        }),
      );
    });

    it('returns success with the new lead id', async () => {
      const result = await service.create(dto);
      expect(result).toEqual({ id: mockLead.id, success: true });
    });

    it('sends email notification when receivers exist', async () => {
      await service.create(dto);
      expect(mockEmail.sendLeadNotification).toHaveBeenCalledWith(
        mockLead,
        ['test@example.com'],
      );
    });

    it('skips email when no receivers configured', async () => {
      mockSettings.get.mockResolvedValueOnce(null);
      await service.create(dto);
      expect(mockEmail.sendLeadNotification).not.toHaveBeenCalled();
    });

    it('strips captchaToken before saving', async () => {
      await service.create({ ...dto, captchaToken: 'some-token' });
      const callArg = mockPrisma.lead.create.mock.calls[0][0];
      expect(callArg.data).not.toHaveProperty('captchaToken');
    });
  });

  describe('findAll()', () => {
    it('returns array of leads', async () => {
      const result = await service.findAll({});
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('passes status filter to prisma', async () => {
      await service.findAll({ status: 'NEW' as never });
      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: 'NEW' }) }),
      );
    });

    it('passes type filter to prisma', async () => {
      await service.findAll({ type: 'callback' });
      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ type: 'callback' }) }),
      );
    });

    it('handles empty filters', async () => {
      await service.findAll({});
      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });
  });

  describe('findOne()', () => {
    it('returns a single lead by id', async () => {
      const result = await service.findOne('test-id-1');
      expect(result).toEqual(mockLead);
      expect(mockPrisma.lead.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 'test-id-1' },
      });
    });
  });

  describe('updateStatus()', () => {
    it('updates lead status', async () => {
      const result = await service.updateStatus('test-id-1', { status: 'IN_PROGRESS' as never });
      expect(mockPrisma.lead.update).toHaveBeenCalledWith({
        where: { id: 'test-id-1' },
        data: { status: 'IN_PROGRESS' },
      });
      expect(result.status).toBe('IN_PROGRESS');
    });
  });

  describe('export()', () => {
    it('exports CSV with correct header', async () => {
      const csv = await service.export({}, 'csv');
      expect(csv).toContain('id,type,name,phone');
    });

    it('exports CSV with lead data', async () => {
      const csv = await service.export({}, 'csv');
      expect(csv).toContain(mockLead.phone);
      expect(csv).toContain(mockLead.id);
    });

    it('escapes CSV fields with commas', async () => {
      const leadWithComma = { ...mockLead, message: 'Hello, world' };
      mockPrisma.lead.findMany.mockResolvedValueOnce([leadWithComma]);
      const csv = await service.export({}, 'csv');
      expect(csv).toContain('"Hello, world"');
    });
  });
});
