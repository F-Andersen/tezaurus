'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

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
    if (!confirm('Are you sure you want to delete this service?')) return;
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
              {isNew ? 'Create Service' : 'Edit Service'}
            </h1>
            {!isNew && (
              <p className="text-sm text-gray-500 mt-0.5">{form.nameUa || form.nameEn}</p>
            )}
          </div>
        </div>
        {!isNew && (
          <button type="button" onClick={handleDelete} className="btn-danger">
            <span className="material-symbols-outlined !text-[18px]">delete</span>
            Delete
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="label">Slug</label>
              <input className="input" placeholder="service-slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">— Select —</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Duration</label>
              <input className="input" placeholder="e.g. 3 days, 1 week" value={form.duration} onChange={(e) => set('duration', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="label">Country</label>
              <input className="input" placeholder="e.g. Turkey" value={form.country} onChange={(e) => set('country', e.target.value)} />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" placeholder="e.g. Istanbul" value={form.city} onChange={(e) => set('city', e.target.value)} />
            </div>
            <div>
              <label className="label">Price From</label>
              <input className="input" type="number" min="0" placeholder="0" value={form.priceFrom} onChange={(e) => set('priceFrom', e.target.value)} />
            </div>
            <div>
              <label className="label">Currency</label>
              <input className="input" placeholder="USD" value={form.currency} onChange={(e) => set('currency', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Sort Order</label>
            <input className="input w-32" type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} />
          </div>
        </div>

        {/* Content with UA/EN tabs */}
        <div className="card">
          <div className="border-b border-gray-200 px-6">
            <nav className="flex gap-6">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`py-3.5 text-sm font-medium border-b-2 transition-colors ${
                    tab === t
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t === 'UA' ? '🇺🇦 Українська' : '🇬🇧 English'}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6 space-y-5">
            {tab === 'UA' ? (
              <>
                <div>
                  <label className="label">Name (UA)</label>
                  <input className="input" placeholder="Service name" value={form.nameUa} onChange={(e) => set('nameUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">Description (UA)</label>
                  <textarea className="input min-h-[140px]" placeholder="Service description..." value={form.descriptionUa} onChange={(e) => set('descriptionUa', e.target.value)} rows={5} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">Name (EN)</label>
                  <input className="input" placeholder="Service name" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">Description (EN)</label>
                  <textarea className="input min-h-[140px]" placeholder="Service description..." value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} rows={5} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Media</h2>
          <div>
            <label className="label">Image URL</label>
            <input className="input" placeholder="https://..." value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
          </div>
          {form.imageUrl && (
            <div className="mt-3">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="h-40 rounded-lg object-cover border border-gray-200"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Tags</h2>
          <div>
            <input
              className="input"
              placeholder="surgery, dental, premium..."
              value={form.tags.join(', ')}
              onChange={(e) => set('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
            <p className="text-xs text-gray-400 mt-1.5">Comma-separated list</p>
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
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">Visibility</h2>
          <div className="flex flex-wrap gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Featured</span>
                <p className="text-xs text-gray-400">Show on featured sections</p>
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
                <span className="text-sm font-medium text-gray-700">Published</span>
                <p className="text-xs text-gray-400">Visible on the public site</p>
              </div>
            </label>
          </div>
        </div>

        {/* SEO */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">SEO &amp; Meta</h2>
          <div className="card bg-gray-50 border-gray-100 p-4">
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex gap-6">
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSeoTab(t)}
                    className={`pb-2.5 text-xs font-medium border-b-2 transition-colors ${
                      seoTab === t
                        ? 'border-accent text-accent'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </nav>
            </div>
            {seoTab === 'UA' ? (
              <div className="space-y-4">
                <div>
                  <label className="label">Meta Title (UA)</label>
                  <input className="input" placeholder="SEO title" value={form.metaTitleUa} onChange={(e) => set('metaTitleUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">Meta Description (UA)</label>
                  <textarea className="input" placeholder="SEO description" value={form.metaDescriptionUa} onChange={(e) => set('metaDescriptionUa', e.target.value)} rows={2} />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="label">Meta Title (EN)</label>
                  <input className="input" placeholder="SEO title" value={form.metaTitleEn} onChange={(e) => set('metaTitleEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">Meta Description (EN)</label>
                  <textarea className="input" placeholder="SEO description" value={form.metaDescriptionEn} onChange={(e) => set('metaDescriptionEn', e.target.value)} rows={2} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/services" className="btn-outline">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Save Service
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
