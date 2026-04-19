'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getAdminLang, t, type AdminLang } from '@/lib/i18n';

const dict = {
  createPage: { ua: 'Створити сторінку', en: 'Create Page' },
  editPage: { ua: 'Редагувати сторінку', en: 'Edit Page' },
  general: { ua: 'Загальне', en: 'General' },
  slug: { ua: 'Slug', en: 'Slug' },
  published: { ua: 'Опубліковано', en: 'Published' },
  titleUa: { ua: 'Заголовок (UA)', en: 'Title (UA)' },
  titleEn: { ua: 'Заголовок (EN)', en: 'Title (EN)' },
  contentUa: { ua: 'Контент (UA)', en: 'Content (UA)' },
  contentEn: { ua: 'Контент (EN)', en: 'Content (EN)' },
  seoMeta: { ua: 'SEO та Meta', en: 'SEO & Meta' },
  metaTitleUa: { ua: 'Meta Title (UA)', en: 'Meta Title (UA)' },
  metaTitleEn: { ua: 'Meta Title (EN)', en: 'Meta Title (EN)' },
  metaDescUa: { ua: 'Meta Description (UA)', en: 'Meta Description (UA)' },
  metaDescEn: { ua: 'Meta Description (EN)', en: 'Meta Description (EN)' },
  ogImage: { ua: 'OG Image URL', en: 'OG Image URL' },
  canonical: { ua: 'Canonical URL', en: 'Canonical URL' },
  cancel: { ua: 'Скасувати', en: 'Cancel' },
  saving: { ua: 'Збереження...', en: 'Saving...' },
  savePage: { ua: 'Зберегти сторінку', en: 'Save Page' },
  pageTitle: { ua: 'Заголовок сторінки', en: 'Page title' },
  pageContent: { ua: 'Контент сторінки...', en: 'Page content...' },
  seoTitle: { ua: 'SEO заголовок', en: 'SEO title' },
  seoDescription: { ua: 'SEO опис', en: 'SEO description' },
} as const;

const TABS = ['UA', 'EN'] as const;
type Lang = (typeof TABS)[number];

export default function PageEdit() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';
  const router = useRouter();
  const [tab, setTab] = useState<Lang>('UA');
  const [form, setForm] = useState({
    slug: '',
    titleUa: '',
    titleEn: '',
    contentUa: '',
    contentEn: '',
    metaTitleUa: '',
    metaTitleEn: '',
    metaDescriptionUa: '',
    metaDescriptionEn: '',
    ogImage: '',
    canonical: '',
    published: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<AdminLang>('ua');
  useEffect(() => { setLang(getAdminLang()); }, []);
  useEffect(() => { const i = setInterval(() => { const l = getAdminLang(); if (l !== lang) setLang(l); }, 500); return () => clearInterval(i); });

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    api.get(`/admin/pages/${id}`)
      .then((data) => setForm({
        slug: data.slug ?? '',
        titleUa: data.titleUa ?? '',
        titleEn: data.titleEn ?? '',
        contentUa: data.contentUa ?? '',
        contentEn: data.contentEn ?? '',
        metaTitleUa: data.metaTitleUa ?? '',
        metaTitleEn: data.metaTitleEn ?? '',
        metaDescriptionUa: data.metaDescriptionUa ?? '',
        metaDescriptionEn: data.metaDescriptionEn ?? '',
        ogImage: data.ogImage ?? '',
        canonical: data.canonical ?? '',
        published: data.published ?? true,
      }))
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [id, isNew, router]);

  const set = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await api.post('/admin/pages', form);
      } else {
        await api.patch(`/admin/pages/${id}`, form);
      }
      router.push('/admin/pages');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !isNew) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/pages" className="btn-ghost !p-2">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? t(dict, 'createPage', lang) : t(dict, 'editPage', lang)}</h1>
          {!isNew && <p className="text-sm text-gray-500 mt-0.5">/{form.slug}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General fields */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t(dict, 'general', lang)}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">{t(dict, 'slug', lang)}</label>
              <input className="input" placeholder="page-url-slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => set('published', !form.published)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.published ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    form.published ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
                <span className="text-sm font-medium text-gray-700">{t(dict, 'published', lang)}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Language tabs */}
        <div className="card">
          <div className="border-b border-gray-200 px-6">
            <nav className="flex gap-6">
              {TABS.map((tb) => (
                <button
                  key={tb}
                  type="button"
                  onClick={() => setTab(tb)}
                  className={`py-3.5 text-sm font-medium border-b-2 transition-colors ${
                    tab === tb
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tb === 'UA' ? '🇺🇦 Українська' : '🇬🇧 English'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 space-y-5">
            {tab === 'UA' ? (
              <>
                <div>
                  <label className="label">{t(dict, 'titleUa', lang)}</label>
                  <input className="input" placeholder={t(dict, 'pageTitle', lang)} value={form.titleUa} onChange={(e) => set('titleUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'contentUa', lang)}</label>
                  <textarea className="input min-h-[180px]" placeholder={t(dict, 'pageContent', lang)} value={form.contentUa} onChange={(e) => set('contentUa', e.target.value)} rows={8} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">{t(dict, 'titleEn', lang)}</label>
                  <input className="input" placeholder={t(dict, 'pageTitle', lang)} value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'contentEn', lang)}</label>
                  <textarea className="input min-h-[180px]" placeholder={t(dict, 'pageContent', lang)} value={form.contentEn} onChange={(e) => set('contentEn', e.target.value)} rows={8} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* SEO */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t(dict, 'seoMeta', lang)}</h2>

          <div className="card bg-gray-50 border-gray-100 p-4">
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex gap-6">
                {TABS.map((tb) => (
                  <button
                    key={tb}
                    type="button"
                    onClick={() => setTab(tb)}
                    className={`pb-2.5 text-xs font-medium border-b-2 transition-colors ${
                      tab === tb
                        ? 'border-accent text-accent'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tb}
                  </button>
                ))}
              </nav>
            </div>

            {tab === 'UA' ? (
              <div className="space-y-4">
                <div>
                  <label className="label">{t(dict, 'metaTitleUa', lang)}</label>
                  <input className="input" placeholder={t(dict, 'seoTitle', lang)} value={form.metaTitleUa} onChange={(e) => set('metaTitleUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'metaDescUa', lang)}</label>
                  <textarea className="input" placeholder={t(dict, 'seoDescription', lang)} value={form.metaDescriptionUa} onChange={(e) => set('metaDescriptionUa', e.target.value)} rows={2} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="label">{t(dict, 'metaTitleEn', lang)}</label>
                  <input className="input" placeholder={t(dict, 'seoTitle', lang)} value={form.metaTitleEn} onChange={(e) => set('metaTitleEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'metaDescEn', lang)}</label>
                  <textarea className="input" placeholder={t(dict, 'seoDescription', lang)} value={form.metaDescriptionEn} onChange={(e) => set('metaDescriptionEn', e.target.value)} rows={2} />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">{t(dict, 'ogImage', lang)}</label>
              <input className="input" placeholder="https://..." value={form.ogImage} onChange={(e) => set('ogImage', e.target.value)} />
            </div>
            <div>
              <label className="label">{t(dict, 'canonical', lang)}</label>
              <input className="input" placeholder="https://..." value={form.canonical} onChange={(e) => set('canonical', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/pages" className="btn-outline">{t(dict, 'cancel', lang)}</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                {t(dict, 'saving', lang)}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                {t(dict, 'savePage', lang)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
