'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getAdminLang, t, type AdminLang } from '@/lib/i18n';

const dict = {
  newPost: { ua: 'Нова стаття', en: 'New Post' },
  editPost: { ua: 'Редагувати статтю', en: 'Edit Post' },
  general: { ua: 'Загальне', en: 'General' },
  slug: { ua: 'Slug', en: 'Slug' },
  category: { ua: 'Категорія', en: 'Category' },
  noCategory: { ua: 'Без категорії', en: 'No category' },
  tags: { ua: 'Теги', en: 'Tags' },
  tagsPlaceholder: { ua: 'здоров\'я, медицина, поради...', en: 'health, medicine, tips...' },
  commaSeparated: { ua: 'Через кому', en: 'Comma-separated list' },
  status: { ua: 'Статус', en: 'Status' },
  draft: { ua: 'Чернетка', en: 'Draft' },
  published: { ua: 'Опубліковано', en: 'Published' },
  publishedDate: { ua: 'Дата публікації', en: 'Published Date' },
  titleUa: { ua: 'Заголовок (UA)', en: 'Title (UA)' },
  titleEn: { ua: 'Заголовок (EN)', en: 'Title (EN)' },
  excerptUa: { ua: 'Уривок (UA)', en: 'Excerpt (UA)' },
  excerptEn: { ua: 'Уривок (EN)', en: 'Excerpt (EN)' },
  bodyUa: { ua: 'Контент (UA)', en: 'Body (UA)' },
  bodyEn: { ua: 'Контент (EN)', en: 'Body (EN)' },
  seoMeta: { ua: 'SEO та Meta', en: 'SEO & Meta' },
  metaTitleUa: { ua: 'Meta Title (UA)', en: 'Meta Title (UA)' },
  metaTitleEn: { ua: 'Meta Title (EN)', en: 'Meta Title (EN)' },
  metaDescUa: { ua: 'Meta Description (UA)', en: 'Meta Description (UA)' },
  metaDescEn: { ua: 'Meta Description (EN)', en: 'Meta Description (EN)' },
  cancel: { ua: 'Скасувати', en: 'Cancel' },
  saving: { ua: 'Збереження...', en: 'Saving...' },
  savePost: { ua: 'Зберегти статтю', en: 'Save Post' },
  postTitle: { ua: 'Назва статті', en: 'Post title' },
  shortExcerpt: { ua: 'Короткий уривок...', en: 'Short excerpt...' },
  postContent: { ua: 'Контент статті...', en: 'Post content...' },
  coverImage: { ua: 'Обкладинка', en: 'Cover Image' },
  coverImagePlaceholder: { ua: 'URL зображення обкладинки', en: 'Cover image URL' },
  seoTitle: { ua: 'SEO заголовок', en: 'SEO title' },
  seoDescription: { ua: 'SEO опис', en: 'SEO description' },
} as const;

const TABS = ['UA', 'EN'] as const;
type Lang = (typeof TABS)[number];

export default function BlogPostEdit() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';
  const router = useRouter();
  const [tab, setTab] = useState<Lang>('UA');
  const [categories, setCategories] = useState<{ id: string; slug: string; nameUa?: string }[]>([]);
  const [form, setForm] = useState({
    slug: '',
    categoryId: '',
    titleUa: '',
    titleEn: '',
    excerptUa: '',
    excerptEn: '',
    bodyUa: '',
    bodyEn: '',
    coverImage: '',
    metaTitleUa: '',
    metaTitleEn: '',
    metaDescriptionUa: '',
    metaDescriptionEn: '',
    tags: [] as string[],
    status: 'draft',
    publishedAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<AdminLang>('ua');
  useEffect(() => { setLang(getAdminLang()); }, []);
  useEffect(() => { const i = setInterval(() => { const l = getAdminLang(); if (l !== lang) setLang(l); }, 500); return () => clearInterval(i); });

  useEffect(() => {
    api.get('/admin/blog/categories').then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    api.get(`/admin/blog/posts/${id}`)
      .then((data) => setForm({
        slug: data.slug ?? '',
        categoryId: data.categoryId ?? '',
        titleUa: data.titleUa ?? '',
        titleEn: data.titleEn ?? '',
        excerptUa: data.excerptUa ?? '',
        excerptEn: data.excerptEn ?? '',
        bodyUa: data.bodyUa ?? '',
        bodyEn: data.bodyEn ?? '',
        coverImage: data.coverImage ?? '',
        metaTitleUa: data.metaTitleUa ?? '',
        metaTitleEn: data.metaTitleEn ?? '',
        metaDescriptionUa: data.metaDescriptionUa ?? '',
        metaDescriptionEn: data.metaDescriptionEn ?? '',
        tags: data.tags ?? [],
        status: data.status ?? 'draft',
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : '',
      }))
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [id, isNew, router]);

  const set = (key: string, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId || undefined,
        publishedAt: form.publishedAt ? new Date(form.publishedAt) : undefined,
      };
      if (isNew) {
        await api.post('/admin/blog/posts', payload);
      } else {
        await api.patch(`/admin/blog/posts/${id}`, payload);
      }
      router.push('/admin/blog');
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
        <Link href="/admin/blog" className="btn-ghost !p-2">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? t(dict, 'newPost', lang) : t(dict, 'editPost', lang)}</h1>
          {!isNew && <p className="text-sm text-gray-500 mt-0.5">/{form.slug}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t(dict, 'general', lang)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">{t(dict, 'slug', lang)}</label>
              <input className="input" placeholder="post-url-slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
            </div>
            <div>
              <label className="label">{t(dict, 'category', lang)}</label>
              <select className="input" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                <option value="">{t(dict, 'noCategory', lang)}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameUa || c.slug}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">{t(dict, 'tags', lang)}</label>
            <input
              className="input"
              placeholder={t(dict, 'tagsPlaceholder', lang)}
              value={form.tags.join(', ')}
              onChange={(e) => set('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
            <p className="text-xs text-gray-400 mt-1.5">{t(dict, 'commaSeparated', lang)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">{t(dict, 'status', lang)}</label>
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">{t(dict, 'draft', lang)}</option>
                <option value="published">{t(dict, 'published', lang)}</option>
              </select>
            </div>
            <div>
              <label className="label">{t(dict, 'publishedDate', lang)}</label>
              <input className="input" type="datetime-local" value={form.publishedAt} onChange={(e) => set('publishedAt', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t(dict, 'coverImage', lang)}</h2>
          {form.coverImage && (
            <div className="relative rounded-lg overflow-hidden bg-gray-100 max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.coverImage}
                alt="Cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholders/blog.svg'; }}
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={() => set('coverImage', '')}
                className="absolute top-2 right-2 bg-white/90 rounded-full p-1 hover:bg-white shadow"
              >
                <span className="material-symbols-outlined text-sm text-red-500">close</span>
              </button>
            </div>
          )}
          <input
            className="input"
            placeholder={t(dict, 'coverImagePlaceholder', lang)}
            value={form.coverImage}
            onChange={(e) => set('coverImage', e.target.value)}
          />
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
                  <input className="input" placeholder={t(dict, 'postTitle', lang)} value={form.titleUa} onChange={(e) => set('titleUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'excerptUa', lang)}</label>
                  <textarea className="input" placeholder={t(dict, 'shortExcerpt', lang)} value={form.excerptUa} onChange={(e) => set('excerptUa', e.target.value)} rows={2} />
                </div>
                <div>
                  <label className="label">{t(dict, 'bodyUa', lang)}</label>
                  <textarea className="input min-h-[240px]" placeholder={t(dict, 'postContent', lang)} value={form.bodyUa} onChange={(e) => set('bodyUa', e.target.value)} rows={10} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">{t(dict, 'titleEn', lang)}</label>
                  <input className="input" placeholder={t(dict, 'postTitle', lang)} value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'excerptEn', lang)}</label>
                  <textarea className="input" placeholder={t(dict, 'shortExcerpt', lang)} value={form.excerptEn} onChange={(e) => set('excerptEn', e.target.value)} rows={2} />
                </div>
                <div>
                  <label className="label">{t(dict, 'bodyEn', lang)}</label>
                  <textarea className="input min-h-[240px]" placeholder={t(dict, 'postContent', lang)} value={form.bodyEn} onChange={(e) => set('bodyEn', e.target.value)} rows={10} />
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
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/blog" className="btn-outline">{t(dict, 'cancel', lang)}</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                {t(dict, 'saving', lang)}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                {t(dict, 'savePost', lang)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
