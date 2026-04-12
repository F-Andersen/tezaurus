'use client';

import { useState } from 'react';
import { submitLead } from '@/lib/api';
import type { Lang } from '@/lib/api';

export function CallbackForm({ lang, captchaSiteKey }: { lang: Lang; captchaSiteKey?: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const t = (ua: string, en: string) => lang === 'ua' ? ua : en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await submitLead({ type: 'callback', phone, name: name || undefined, consent: true });
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
          {t('Запит надіслано!', 'Request sent!')}
        </p>
        <p style={{ color: 'var(--stone)', fontSize: '0.88rem' }}>
          {t('Ми передзвонимо вам якнайшвидше.', 'We will call you back as soon as possible.')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      <div>
        <label className="form-label">{t('Телефон', 'Phone')} *</label>
        <input className="form-input" type="tel" placeholder="+380 XX XXX XX XX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div>
        <label className="form-label">{t("Ім'я", 'Name')}</label>
        <input className="form-input" placeholder={t("Ваше ім'я (необов'язково)", 'Your name (optional)')} value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      {error && (
        <p style={{ fontSize: '0.85rem', color: '#C0392B', background: 'rgba(192,57,43,0.06)', padding: '0.75rem 1rem', borderLeft: '3px solid #C0392B' }}>
          {error}
        </p>
      )}

      <button type="submit" className="btn-outline" disabled={loading}
        style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1, marginTop: '0.25rem' }}>
        {loading ? '...' : t('Передзвоніть мені', 'Call Me Back')}
      </button>

      <p style={{ fontSize: '0.78rem', color: 'var(--stone)', lineHeight: 1.6 }}>
        {t('Натискаючи кнопку, ви погоджуєтеся з обробкою персональних даних.', 'By clicking the button, you agree to personal data processing.')}
      </p>
    </form>
  );
}
