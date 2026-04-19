'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getAdminLang, t, type AdminLang } from '@/lib/i18n';
import { MediaPickerModal } from '@/components/MediaPickerModal';

const dict = {
  createService: { ua: 'Створити послугу', en: 'Create Service' },
  editService: { ua: 'Редагувати послугу', en: 'Edit Service' },
  deleteBtn: { ua: 'Видалити', en: 'Delete' },
  confirmDeleteService: { ua: 'Ви впевнені, що хочете видалити цю послугу?', en: 'Are you sure you want to delete this service?' },
  basicInfo: { ua: 'Основна інформація', en: 'Basic Info' },
  slug: { ua: 'Slug', en: 'Slug' },
  category: { ua: 'Категорія', en: 'Category' },
  selectPlaceholder: { ua: '— Оберіть —', en: '— Select —' },
  duration: { ua: 'Тривалість', en: 'Duration' },
  durationPlaceholder: { ua: 'напр. 3 дні, 1 тиждень', en: 'e.g. 3 days, 1 week' },
  country: { ua: 'Країна', en: 'Country' },
  countryPlaceholder: { ua: 'напр. Туреччина', en: 'e.g. Turkey' },
  city: { ua: 'Місто', en: 'City' },
  cityPlaceholder: { ua: 'напр. Стамбул', en: 'e.g. Istanbul' },
  priceFrom: { ua: 'Ціна від', en: 'Price From' },
  currency: { ua: 'Валюта', en: 'Currency' },
  sortOrder: { ua: 'Порядок сортування', en: 'Sort Order' },
  contentTab: { ua: 'Контент', en: 'Content' },
  uaTab: { ua: '🇺🇦 Українська', en: '🇺🇦 Українська' },
  enTab: { ua: '🇬🇧 English', en: '🇬🇧 English' },
  nameUa: { ua: 'Назва (UA)', en: 'Name (UA)' },
  nameEn: { ua: 'Назва (EN)', en: 'Name (EN)' },
  serviceNamePlaceholder: { ua: 'Назва послуги', en: 'Service name' },
  descriptionUa: { ua: 'Опис (UA)', en: 'Description (UA)' },
  descriptionEn: { ua: 'Опис (EN)', en: 'Description (EN)' },
  serviceDescPlaceholder: { ua: 'Опис послуги...', en: 'Service description...' },
  media: { ua: 'Медіа', en: 'Media' },
  imageUrl: { ua: 'URL зображення', en: 'Image URL' },
  chooseFromLibrary: { ua: 'Обрати з медіатеки', en: 'Choose from Library' },
  uploadImage: { ua: 'Завантажити зображення', en: 'Upload Image' },
  removeImage: { ua: 'Видалити зображення', en: 'Remove Image' },
  replaceImage: { ua: 'Замінити', en: 'Replace' },
  orEnterUrl: { ua: 'або введіть URL вручну', en: 'or enter URL manually' },
  uploading: { ua: 'Завантаження…', en: 'Uploading…' },
  noImage: { ua: 'Зображення не обрано', en: 'No image selected' },
  tags: { ua: 'Теги', en: 'Tags' },
  tagsPlaceholder: { ua: 'хірургія, стоматологія, преміум...', en: 'surgery, dental, premium...' },
  commaSeparated: { ua: 'Розділені комами', en: 'Comma-separated list' },
  visibility: { ua: 'Видимість', en: 'Visibility' },
  featured: { ua: 'Обране', en: 'Featured' },
  featuredHint: { ua: 'Показувати в обраних секціях', en: 'Show on featured sections' },
  published: { ua: 'Опублікований', en: 'Published' },
  publishedHint: { ua: 'Видимий на публічному сайті', en: 'Visible on the public site' },
  seoMeta: { ua: 'SEO та мета', en: 'SEO & Meta' },
  metaTitleUa: { ua: 'Мета-заголовок (UA)', en: 'Meta Title (UA)' },
  metaTitleEn: { ua: 'Мета-заголовок (EN)', en: 'Meta Title (EN)' },
  seoTitlePlaceholder: { ua: 'SEO заголовок', en: 'SEO title' },
  metaDescUa: { ua: 'Мета-опис (UA)', en: 'Meta Description (UA)' },
  metaDescEn: { ua: 'Мета-опис (EN)', en: 'Meta Description (EN)' },
  seoDescPlaceholder: { ua: 'SEO опис', en: 'SEO description' },
  cancel: { ua: 'Скасувати', en: 'Cancel' },
  saving: { ua: 'Збереження...', en: 'Saving...' },
  saveService: { ua: 'Зберегти послугу', en: 'Save Service' },
} as const;

const TABS = ['UA', 'EN'] as const;
type Lang = (typeof TABS)[number];

const CATEGORIES = [
  'diagnostics',
  'treatment',
  'rehabilitation',
  'wellness',
  'dental',
  'cosmetic',
  'medical',
  'other',
];

export default function ServiceEdit() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';
  const router = useRouter();
  const [tab, setTab] = useState<Lang>('UA');
  const [seoTab, setSeoTab] = useState<Lang>('UA');
  const [lang, setLang] = useState<AdminLang>('ua');
  useEffect(() => { setLang(getAdminLang()); }, []);
  useEffect(() => { const i = setInterval(() => { const l = getAdminLang(); if (l !== lang) setLang(l); }, 500); return () => clearInterval(i); });

  const [form, setForm] = useState({
    slug: '',
    nameUa: '',
    nameEn: '',
    category: '',
    descriptionUa: '',
    descriptionEn: '',
    country: '',
    city: '',
    priceFrom: '' as string | number,
    currency: 'USD',
    duration: '',
    imageUrl: '',
    tags: [] as string[],
    featured: false,
    published: true,
    sortOrder: 0,
    metaTitleUa: '',
    metaTitleEn: '',
    metaDescriptionUa: '',
    metaDescriptionEn: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const handleDirectUpload = useCallback(async (file: File) => {
    setImageUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const token = localStorage.getItem('accessToken');
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${base}/admin/media/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data.url) set('imageUrl', data.url);
    } finally {
      setImageUploading(false);
    }
  }, []);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    api.get(`/admin/services/${id}`)
      .then((data) => setForm({
        slug: data.slug ?? '',
        nameUa: data.nameUa ?? '',
        nameEn: data.nameEn ?? '',
        category: data.category ?? '',
        descriptionUa: data.descriptionUa ?? '',
        descriptionEn: data.descriptionEn ?? '',
        country: data.country ?? '',
        city: data.city ?? '',
        priceFrom: data.priceFrom ?? '',
        currency: data.currency ?? 'USD',
        duration: data.duration ?? '',
        imageUrl: data.imageUrl ?? '',
        tags: data.tags ?? [],
        featured: data.featured ?? false,
        published: data.published ?? true,
        sortOrder: data.sortOrder ?? 0,
        metaTitleUa: data.metaTitleUa ?? '',
        metaTitleEn: data.metaTitleEn ?? '',
        metaDescriptionUa: data.metaDescriptionUa ?? '',
        metaDescriptionEn: data.metaDescriptionEn ?? '',
      }))
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [id, isNew, router]);

  const set = (key: string, value: string | boolean | number | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      priceFrom: form.priceFrom !== '' ? Number(form.priceFrom) : null,
      sortOrder: Number(form.sortOrder),
    };
    try {
      if (isNew) {
        await api.post('/admin/services', payload);
      } else {
        await api.patch(`/admin/services/${id}`, payload);
      }
      router.push('/admin/services');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t(dict, 'confirmDeleteService', lang))) return;
    await api.delete(`/admin/services/${id}`);
    router.push('/admin/services');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/services" className="btn-ghost !p-2">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? t(dict, 'createService', lang) : t(dict, 'editService', lang)}
            </h1>
            {!isNew && (
              <p className="text-sm text-gray-500 mt-0.5">{form.nameUa || form.nameEn}</p>
            )}
          </div>
        </div>
        {!isNew && (
          <button type="button" onClick={handleDelete} className="btn-danger">
            <span className="material-symbols-outlined !text-[18px]">delete</span>
            {t(dict, 'deleteBtn', lang)}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t(dict, 'basicInfo', lang)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="label">{t(dict, 'slug', lang)}</label>
              <input className="input" placeholder="service-slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
            </div>
            <div>
              <label className="label">{t(dict, 'category', lang)}</label>
              <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">{t(dict, 'selectPlaceholder', lang)}</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">{t(dict, 'duration', lang)}</label>
              <input className="input" placeholder={t(dict, 'durationPlaceholder', lang)} value={form.duration} onChange={(e) => set('duration', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="label">{t(dict, 'country', lang)}</label>
              <input className="input" placeholder={t(dict, 'countryPlaceholder', lang)} value={form.country} onChange={(e) => set('country', e.target.value)} />
            </div>
            <div>
              <label className="label">{t(dict, 'city', lang)}</label>
              <input className="input" placeholder={t(dict, 'cityPlaceholder', lang)} value={form.city} onChange={(e) => set('city', e.target.value)} />
            </div>
            <div>
              <label className="label">{t(dict, 'priceFrom', lang)}</label>
              <input className="input" type="number" min="0" placeholder="0" value={form.priceFrom} onChange={(e) => set('priceFrom', e.target.value)} />
            </div>
            <div>
              <label className="label">{t(dict, 'currency', lang)}</label>
              <input className="input" placeholder="USD" value={form.currency} onChange={(e) => set('currency', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">{t(dict, 'sortOrder', lang)}</label>
            <input className="input w-32" type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} />
          </div>
        </div>

        {/* Content with UA/EN tabs */}
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
                  {tb === 'UA' ? t(dict, 'uaTab', lang) : t(dict, 'enTab', lang)}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6 space-y-5">
            {tab === 'UA' ? (
              <>
                <div>
                  <label className="label">{t(dict, 'nameUa', lang)}</label>
                  <input className="input" placeholder={t(dict, 'serviceNamePlaceholder', lang)} value={form.nameUa} onChange={(e) => set('nameUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'descriptionUa', lang)}</label>
                  <textarea className="input min-h-[140px]" placeholder={t(dict, 'serviceDescPlaceholder', lang)} value={form.descriptionUa} onChange={(e) => set('descriptionUa', e.target.value)} rows={5} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">{t(dict, 'nameEn', lang)}</label>
                  <input className="input" placeholder={t(dict, 'serviceNamePlaceholder', lang)} value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'descriptionEn', lang)}</label>
                  <textarea className="input min-h-[140px]" placeholder={t(dict, 'serviceDescPlaceholder', lang)} value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} rows={5} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t(dict, 'media', lang)}</h2>

          {form.imageUrl ? (
            <div className="relative group inline-block">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="h-48 w-auto max-w-full rounded-xl object-cover border border-gray-200"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholders/service.svg'; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="bg-white/90 hover:bg-white rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined !text-[16px]">swap_horiz</span>
                  {t(dict, 'replaceImage', lang)}
                </button>
                <button
                  type="button"
                  onClick={() => set('imageUrl', '')}
                  className="bg-white/90 hover:bg-white rounded-lg px-3 py-2 text-xs font-medium text-red-600 flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined !text-[16px]">delete</span>
                  {t(dict, 'removeImage', lang)}
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3">add_photo_alternate</span>
              <p className="text-sm text-gray-500 mb-4">{t(dict, 'noImage', lang)}</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="btn-outline !py-2 !px-4 !text-sm"
                >
                  <span className="material-symbols-outlined !text-[18px]">perm_media</span>
                  {t(dict, 'chooseFromLibrary', lang)}
                </button>
                <button
                  type="button"
                  onClick={() => imageFileRef.current?.click()}
                  disabled={imageUploading}
                  className="btn-primary !py-2 !px-4 !text-sm"
                >
                  <span className="material-symbols-outlined !text-[18px]">{imageUploading ? 'hourglass_top' : 'upload'}</span>
                  {imageUploading ? t(dict, 'uploading', lang) : t(dict, 'uploadImage', lang)}
                </button>
              </div>
            </div>
          )}

          <input
            ref={imageFileRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleDirectUpload(file);
              e.target.value = '';
            }}
          />

          <details className="text-sm">
            <summary className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
              {t(dict, 'orEnterUrl', lang)}
            </summary>
            <div className="mt-3">
              <input className="input" placeholder="https://..." value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
            </div>
          </details>
        </div>

        <MediaPickerModal
          open={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          onSelect={(items) => {
            if (items[0]?.url) set('imageUrl', items[0].url);
          }}
        />

        {/* Tags */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t(dict, 'tags', lang)}</h2>
          <div>
            <input
              className="input"
              placeholder={t(dict, 'tagsPlaceholder', lang)}
              value={form.tags.join(', ')}
              onChange={(e) => set('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
            <p className="text-xs text-gray-400 mt-1.5">{t(dict, 'commaSeparated', lang)}</p>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span key={tag} className="badge-info">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">{t(dict, 'visibility', lang)}</h2>
          <div className="flex flex-wrap gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">{t(dict, 'featured', lang)}</span>
                <p className="text-xs text-gray-400">{t(dict, 'featuredHint', lang)}</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set('published', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">{t(dict, 'published', lang)}</span>
                <p className="text-xs text-gray-400">{t(dict, 'publishedHint', lang)}</p>
              </div>
            </label>
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
                    onClick={() => setSeoTab(tb)}
                    className={`pb-2.5 text-xs font-medium border-b-2 transition-colors ${
                      seoTab === tb
                        ? 'border-accent text-accent'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tb}
                  </button>
                ))}
              </nav>
            </div>
            {seoTab === 'UA' ? (
              <div className="space-y-4">
                <div>
                  <label className="label">{t(dict, 'metaTitleUa', lang)}</label>
                  <input className="input" placeholder={t(dict, 'seoTitlePlaceholder', lang)} value={form.metaTitleUa} onChange={(e) => set('metaTitleUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'metaDescUa', lang)}</label>
                  <textarea className="input" placeholder={t(dict, 'seoDescPlaceholder', lang)} value={form.metaDescriptionUa} onChange={(e) => set('metaDescriptionUa', e.target.value)} rows={2} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="label">{t(dict, 'metaTitleEn', lang)}</label>
                  <input className="input" placeholder={t(dict, 'seoTitlePlaceholder', lang)} value={form.metaTitleEn} onChange={(e) => set('metaTitleEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'metaDescEn', lang)}</label>
                  <textarea className="input" placeholder={t(dict, 'seoDescPlaceholder', lang)} value={form.metaDescriptionEn} onChange={(e) => set('metaDescriptionEn', e.target.value)} rows={2} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/services" className="btn-outline">{t(dict, 'cancel', lang)}</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                {t(dict, 'saving', lang)}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                {t(dict, 'saveService', lang)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
