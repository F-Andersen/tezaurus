'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

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
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Create Page' : 'Edit Page'}</h1>
          {!isNew && <p className="text-sm text-gray-500 mt-0.5">/{form.slug}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General fields */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">General</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Slug</label>
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
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
            </div>
          </div>
        </div>

        {/* Language tabs */}
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
                  <label className="label">Title (UA)</label>
                  <input className="input" placeholder="Page title" value={form.titleUa} onChange={(e) => set('titleUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">Content (UA)</label>
                  <textarea className="input min-h-[180px]" placeholder="Page content..." value={form.contentUa} onChange={(e) => set('contentUa', e.target.value)} rows={8} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">Title (EN)</label>
                  <input className="input" placeholder="Page title" value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">Content (EN)</label>
                  <textarea className="input min-h-[180px]" placeholder="Page content..." value={form.contentEn} onChange={(e) => set('contentEn', e.target.value)} rows={8} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* SEO */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">SEO & Meta</h2>

          <div className="card bg-gray-50 border-gray-100 p-4">
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex gap-6">
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`pb-2.5 text-xs font-medium border-b-2 transition-colors ${
                      tab === t
                        ? 'border-accent text-accent'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </nav>
            </div>

            {tab === 'UA' ? (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">OG Image URL</label>
              <input className="input" placeholder="https://..." value={form.ogImage} onChange={(e) => set('ogImage', e.target.value)} />
            </div>
            <div>
              <label className="label">Canonical URL</label>
              <input className="input" placeholder="https://..." value={form.canonical} onChange={(e) => set('canonical', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/pages" className="btn-outline">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Save Page
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
