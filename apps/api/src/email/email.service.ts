import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Lead } from '@prisma/client';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter() {
    if (this.transporter) return this.transporter;
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) {
      console.warn('SMTP not configured; emails will be skipped.');
      return null;
    }
    this.transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    return this.transporter;
  }

  async sendLeadNotification(lead: Lead, receivers: string[]) {
    const tr = this.getTransporter();
    if (!tr || !receivers.length) return;

    const subject = `[TEZAURUS-TOUR] Нова заявка: ${lead.type === 'request' ? 'Залишити заявку' : 'Передзвоніть мені'}`;
    const text = [
      `Тип: ${lead.type}`,
      `Ім'я: ${lead.name ?? '—'}`,
      `Телефон: ${lead.phone}`,
      lead.email ? `Email: ${lead.email}` : null,
      lead.requestType ? `Тип запиту: ${lead.requestType}` : null,
      lead.country ? `Країна: ${lead.country}` : null,
      lead.message ? `Повідомлення: ${lead.message}` : null,
      `Дата: ${lead.createdAt.toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n');

    const html = `<pre>${text.replace(/</g, '&lt;')}</pre>`;
    const from = process.env.SMTP_FROM || 'noreply@tezaurustour.com';

    await Promise.all(
      receivers.map((to) =>
        tr.sendMail({ from, to, subject, text, html }).catch((err) => console.error('Email send error:', err)),
      ),
    );
  }
}
