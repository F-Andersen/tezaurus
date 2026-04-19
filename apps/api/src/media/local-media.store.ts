import { Injectable } from '@nestjs/common';

/**
 * In-memory сховище файлів для локального fallback-режиму (без S3).
 *
 * Тимчасове рішення Фази 1: дозволяє admin-preview та e2e тестам віддавати
 * щойно завантажені файли через `GET /api/admin/media/file/:id` без налаштованого S3.
 *
 * У Фазі 2 замінюється на реальний multer disk storage + volume `/app/uploads`.
 */
@Injectable()
export class LocalMediaStore {
  private readonly map = new Map<string, { buffer: Buffer; mimeType: string; filename: string }>();

  set(id: string, buffer: Buffer, mimeType: string, filename: string): void {
    this.map.set(id, { buffer, mimeType, filename });
  }

  get(id: string): { buffer: Buffer; mimeType: string; filename: string } | undefined {
    return this.map.get(id);
  }

  delete(id: string): void {
    this.map.delete(id);
  }
}
