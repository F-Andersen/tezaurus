'use client';

import { useState } from 'react';
import { submitLead } from '@/lib/api';
import type { Lang } from '@/lib/api';
import Link from 'next/link';

interface Props {
  lang: Lang;
  serviceName: string;
  serviceSlug: string;
  type: 'service' | 'clinic';
}

export function ServiceInquiryForm({ lang, serviceName, serviceSlug, type }: Props) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    consent: false,
  });

  const t = (ua: string, en: string) => (lang === 'ua' ? ua : en);
  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setError(t('Необхідно погодитися з обробкою даних', 'Please agree to data processing'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      await submitLead({
        type: 'request',
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        requestType: type === 'clinic' ? 'Medical' : 'Tourism',
        message: `[${serviceName}] ${form.message}`.trim(),
        consent: true,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Сталася помилка', 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-8 md:p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-primary mb-4 block">check_circle</span>
        <p className="font-headline text-2xl text-primary mb-2">
          {t('Заявку надіслано!', 'Request sent!')}
        </p>
        <p className="text-on-surface-variant">
          {t("Ми зв'яжемося з вами протягом 24 годин.", 'We will contact you within 24 hours.')}
        </p>
      </div>
    );
  }

  return (
    <div id="inquiry-form">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <span className="font-label text-xs tracking-[0.2em] text-on-secondary-container uppercase mb-3 block">
            {t('Безкоштовна консультація', 'Free Consultation')}
          </span>
          <h2 className="font-headline text-3xl md:text-4xl text-primary">
            {t('Залишити заявку', 'Submit Inquiry')}
          </h2>
        </div>
        <div className="bg-surface-container-low rounded-lg px-4 py-2 text-sm text-on-surface-variant">
          <span className="font-semibold text-primary">{serviceName}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
              {t("Ім'я", 'Name')} *
            </label>
            <input
              className="form-input"
              placeholder={t("Ваше ім'я", 'Your name')}
              value={form.name}
              onChange={set('name')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
              {t('Телефон', 'Phone')} *
            </label>
            <input
              className="form-input"
              type="tel"
              placeholder="+380 XX XXX XX XX"
              value={form.phone}
              onChange={set('phone')}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder={t('Ваш email', 'Your email')}
            value={form.email}
            onChange={set('email')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
            {t('Повідомлення', 'Message')}
          </label>
          <textarea
            className="form-input resize-y"
            placeholder={t(
              `Розкажіть про ваш запит щодо "${serviceName}"...`,
              `Tell us about your inquiry regarding "${serviceName}"...`
            )}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={3}
          />
        </div>

        <label className="flex gap-3 items-start cursor-pointer">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
            className="mt-0.5 w-4 h-4 shrink-0 accent-primary"
          />
          <span className="text-xs text-on-surface-variant leading-relaxed">
            {t('Я погоджуюся з обробкою персональних даних *', 'I agree to personal data processing *')}
          </span>
        </label>

        {error && (
          <p className="text-sm text-error bg-error/5 p-3 rounded-lg border-l-3 border-error">
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="submit"
            className="btn-primary rounded-full justify-center flex-1"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '...' : t('Надіслати заявку', 'Submit Inquiry')}
          </button>
          <Link
            href={`/${lang}/contacts?subject=${encodeURIComponent(serviceName)}`}
            className="btn-outline rounded-full justify-center text-center"
          >
            {t("Зв'яжіться з нами", 'Contact Us')}
          </Link>
        </div>
      </form>
    </div>
  );
}
