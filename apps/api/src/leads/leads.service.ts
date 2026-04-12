import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SettingsService } from '../settings/settings.service';
import { LeadStatus } from '@prisma/client';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
    private settings: SettingsService,
  ) {}

  async create(dto: CreateLeadDto) {
    const { captchaToken: _, ...data } = dto;
    const lead = await this.prisma.lead.create({
      data: {
        type: data.type as 'request' | 'callback',
        name: data.name,
        phone: data.phone,
        email: data.email,
        requestType: data.requestType,
        country: data.country,
        message: data.message,
        consent: data.consent,
      },
    });
    const receivers = (await this.settings.get('email_receivers')) as string[] | null;
    if (Array.isArray(receivers) && receivers.length) {
      await this.email.sendLeadNotification(lead, receivers);
    }
    return { id: lead.id, success: true };
  }

  async findAll(filters: { status?: LeadStatus; type?: string; from?: string; to?: string }) {
    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) (where.createdAt as Record<string, Date>).gte = new Date(filters.from);
      if (filters.to) (where.createdAt as Record<string, Date>).lte = new Date(filters.to);
    }
    return this.prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.lead.findUniqueOrThrow({ where: { id } });
  }

  async updateStatus(id: string, dto: UpdateLeadDto) {
    return this.prisma.lead.update({
      where: { id },
      data: { status: dto.status as LeadStatus },
    });
  }

  async export(filters: { status?: string; type?: string; from?: string; to?: string }, format: 'csv' | 'xlsx') {
    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) (where.createdAt as Record<string, Date>).gte = new Date(filters.from);
      if (filters.to) (where.createdAt as Record<string, Date>).lte = new Date(filters.to);
    }
    const leads = await this.prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } });
    if (format === 'csv') {
      const header = 'id,type,name,phone,email,requestType,country,message,consent,status,createdAt\n';
      const rows = leads.map(
        (l) =>
          `${l.id},${l.type},${escapeCsv(l.name)},${escapeCsv(l.phone)},${escapeCsv(l.email)},${escapeCsv(l.requestType)},${escapeCsv(l.country)},${escapeCsv(l.message)},${l.consent},${l.status},${l.createdAt.toISOString()}`,
      );
      return header + rows.join('\n');
    }
    return JSON.stringify(leads);
  }
}

function escapeCsv(v: string | null | undefined): string {
  if (v == null) return '';
  const s = String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
