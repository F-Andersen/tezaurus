import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get(key: string) {
    const row = await this.prisma.setting.findUnique({ where: { key } });
    return row?.value ?? null;
  }

  async set(key: string, value: object) {
    await this.prisma.setting.upsert({
      where: { key },
      create: { key, value: value as object },
      update: { value: value as object },
    });
    return this.get(key);
  }

  async getAll(keys: string[]) {
    const rows = await this.prisma.setting.findMany({ where: { key: { in: keys } } });
    const map: Record<string, unknown> = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  }

  async getPublic() {
    const keys = [
      'contacts',
      'phones',
      'messengers',
      'ga_id',
      'gtm_id',
      'disclaimer_ua',
      'disclaimer_en',
    ];
    return this.getAll(keys);
  }

  async getAdmin() {
    const keys = [
      'contacts',
      'phones',
      'email_receivers',
      'messengers',
      'ga_id',
      'gtm_id',
      'disclaimer_ua',
      'disclaimer_en',
    ];
    return this.getAll(keys);
  }

  async setBulk(data: Record<string, object>) {
    for (const [key, value] of Object.entries(data)) {
      await this.set(key, value);
    }
    return this.getAdmin();
  }
}
