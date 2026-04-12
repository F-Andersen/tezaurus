'use client';

import { useState } from 'react';
import { submitLead } from '@/lib/api';
import type { Lang } from '@/lib/api';

export function LeadForm({ lang, captchaSiteKey }: { lang: Lang; captchaSiteKey?: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    requestType: 'Tourism',
    country: '', message: '', consent: false,
  });

  const t = (ua: string, en: string) => lang === 'ua' ? ua : en;
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) { setError(t('Необхідно погодитися з обробкою даних', 'Please agree to data processing')); return; }
    setError('');
    setLoading(true);
    try {
      await submitLead({ type: 'request', ...form, email: form.email || undefined, country: form.country || undefined, message: form.message || undefined });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Сталася помилка', 'An error occurred'));
    } finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div style={{ padding: '2rem', background: 'rgba(45,80,22,0.06)', border: '1px solid rgba(45,80,22,0.2)', borderRadius: 2, textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✓</div>
        <p style={{ color: 'var(--forest)', fontWeight: 600, marginBottom: '0.4rem' }}>
          {t('Заявку надіслано!', 'Request sent!')}
        </p>
        <p style={{ color: 'var(--stone)', fontSize: '0.88rem' }}>
          {t('Ми зв\'яжемося з вами протягом 24 годин.', 'We will contact you within 24 hours.')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {/* Row: name + phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="form-label">{t("Ім'я", 'Name')} *</label>
          <input className="form-input" placeholder={t("Ваше ім'я", 'Your name')} value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="form-label">{t('Телефон', 'Phone')} *</label>
          <input className="form-input" type="tel" placeholder="+380 XX XXX XX XX" value={form.phone} onChange={set('phone')} required />
        </div>
      </div>

      <div>
        <label className="form-label">Email</label>
        <input className="form-input" type="email" placeholder={t('Ваш email', 'Your email')} value={form.email} onChange={set('email')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="form-label">{t('Тип запиту', 'Request type')}</label>
          <select className="form-input" value={form.requestType} onChange={set('requestType')}>
            <option value="Tourism">{t('Туризм', 'Tourism')}</option>
            <option value="Medical">{t('Медицина', 'Medical')}</option>
            <option value="Other">{t('Інше', 'Other')}</option>
          </select>
        </div>
        <div>
          <label className="form-label">{t('Країна', 'Country')}</label>
          <input className="form-input" placeholder={t('Ваша країна', 'Your country')} value={form.country} onChange={set('country')} />
        </div>
      </div>

      <div>
        <label className="form-label">{t('Повідомлення', 'Message')}</label>
        <textarea className="form-input" placeholder={t('Розкажіть про ваш запит...', 'Tell us about your request...')} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={3} style={{ resize: 'vertical' }} />
      </div>

      <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
        <input type="checkbox" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
          style={{ marginTop: '3px', accentColor: 'var(--navy)', width: 16, height: 16, flexShrink: 0 }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--stone)', lineHeight: 1.6 }}>
          {t('Я погоджуюся з обробкою персональних даних *', 'I agree to personal data processing *')}
        </span>
      </label>

      {error && (
        <p style={{ fontSize: '0.85rem', color: '#C0392B', background: 'rgba(192,57,43,0.06)', padding: '0.75rem 1rem', borderLeft: '3px solid #C0392B' }}>
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={loading}
        style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1, marginTop: '0.25rem' }}>
        {loading ? '...' : t('Надіслати заявку', 'Submit Request')}
      </button>
    </form>
  );
}
