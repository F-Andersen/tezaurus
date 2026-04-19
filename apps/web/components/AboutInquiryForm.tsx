'use client';

import { useState } from 'react';
import type { Lang } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function AboutInquiryForm({ lang }: { lang: Lang }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
    consent: false,
  });

  const t = (ua: string, en: string) => (lang === 'ua' ? ua : en);
  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
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
      const res = await fetch(`${API}/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'request',
          name: form.name,
          email: form.email || undefined,
          requestType: form.service || 'General',
          message: form.message || undefined,
          phone: '-',
          consent: true,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSent(true);
    } catch {
      setError(t('Сталася помилка', 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-secondary mb-4 block">check_circle</span>
        <p className="font-headline text-2xl text-primary mb-2">
          {t('Заявку надіслано!', 'Inquiry sent!')}
        </p>
        <p className="text-on-surface-variant text-sm">
          {t('Наш куратор зв\'яжеться з вами протягом 4 годин.', 'A dedicated curator will respond within 4 business hours.')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
            {t("Повне ім'я", 'Full Name')}
          </label>
          <input
            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/30 focus:border-secondary focus:ring-0 transition-all py-3 px-4 rounded-t-lg font-light text-on-surface"
            placeholder={t("Ваше ім'я", 'Johnathan Doe')}
            value={form.name}
            onChange={set('name')}
            required
          />
        </div>
        <div className="space-y-3">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
            Email
          </label>
          <input
            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/30 focus:border-secondary focus:ring-0 transition-all py-3 px-4 rounded-t-lg font-light text-on-surface"
            type="email"
            placeholder="j.doe@example.com"
            value={form.email}
            onChange={set('email')}
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
          {t('Послуга', 'Service of Interest')}
        </label>
        <select
          className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/30 focus:border-secondary focus:ring-0 transition-all py-3 px-4 rounded-t-lg font-light text-on-surface"
          value={form.service}
          onChange={set('service')}
        >
          <option value="">{t('Оберіть послугу', 'Select a service')}</option>
          <option value="Wellness">{t('Превентивний велнес-ретрит', 'Preventative Wellness Retreat')}</option>
          <option value="Surgical">{t('Хірургічна координація', 'Specialized Surgical Coordination')}</option>
          <option value="PostOp">{t('Пост-операційний консьєрж', 'Post-Operative Concierge')}</option>
          <option value="General">{t('Загальний медичний запит', 'General Medical Inquiry')}</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
          {t('Конфіденційне повідомлення', 'Confidential Message')}
        </label>
        <textarea
          className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/30 focus:border-secondary focus:ring-0 transition-all py-3 px-4 rounded-t-lg font-light text-on-surface resize-y"
          placeholder={t('Опишіть ваш запит конфіденційно...', 'Describe your requirements in confidence...')}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          rows={4}
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
          {t(
            'Я погоджуюся з обробкою персональних даних та політикою конфіденційності *',
            'I agree to personal data processing and privacy policy *'
          )}
        </span>
      </label>

      {error && (
        <p className="text-sm text-error bg-error/5 p-3 rounded-lg border-l-[3px] border-error">
          {error}
        </p>
      )}

      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-primary text-on-primary rounded-lg font-bold tracking-[0.15em] uppercase hover:bg-secondary transition-all duration-300 shadow-xl shadow-primary/20 transform hover:-translate-y-0.5"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '...' : t('НАДІСЛАТИ ЗАПИТ', 'SEND INQUIRY')}
        </button>
      </div>

      <p className="text-[10px] text-on-surface-variant/70 leading-relaxed text-center uppercase tracking-[0.15em] font-medium">
        {t('Конфіденційно • Захищено • HIPAA', 'Confidential • Secure • HIPAA Compliant')}
      </p>
    </form>
  );
}
