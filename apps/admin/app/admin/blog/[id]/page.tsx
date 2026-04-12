'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

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
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'New Post' : 'Edit Post'}</h1>
          {!isNew && <p className="text-sm text-gray-500 mt-0.5">/{form.slug}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Slug</label>
              <input className="input" placeholder="post-url-slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameUa || c.slug}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Tags</label>
            <input
              className="input"
              placeholder="health, medicine, tips..."
              value={form.tags.join(', ')}
              onChange={(e) => set('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
            <p className="text-xs text-gray-400 mt-1.5">Comma-separated list</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="label">Published Date</label>
              <input className="input" type="datetime-local" value={form.publishedAt} onChange={(e) => set('publishedAt', e.target.value)} />
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
                  <input className="input" placeholder="Post title" value={form.titleUa} onChange={(e) => set('titleUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">Excerpt (UA)</label>
                  <textarea className="input" placeholder="Short excerpt..." value={form.excerptUa} onChange={(e) => set('excerptUa', e.target.value)} rows={2} />
                </div>
                <div>
                  <label className="label">Body (UA)</label>
                  <textarea className="input min-h-[240px]" placeholder="Post content..." value={form.bodyUa} onChange={(e) => set('bodyUa', e.target.value)} rows={10} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">Title (EN)</label>
                  <input className="input" placeholder="Post title" value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">Excerpt (EN)</label>
                  <textarea className="input" placeholder="Short excerpt..." value={form.excerptEn} onChange={(e) => set('excerptEn', e.target.value)} rows={2} />
                </div>
                <div>
                  <label className="label">Body (EN)</label>
                  <textarea className="input min-h-[240px]" placeholder="Post content..." value={form.bodyEn} onChange={(e) => set('bodyEn', e.target.value)} rows={10} />
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
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/blog" className="btn-outline">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Save Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
