'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const TABS = ['UA', 'EN'] as const;
type Lang = (typeof TABS)[number];

export default function ClinicEdit() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';
  const router = useRouter();
  const [tab, setTab] = useState<Lang>('UA');
  const [form, setForm] = useState({
    slug: '',
    nameUa: '',
    nameEn: '',
    country: '',
    city: '',
    specializations: [] as string[],
    descriptionUa: '',
    descriptionEn: '',
    metaTitleUa: '',
    metaTitleEn: '',
    metaDescriptionUa: '',
    metaDescriptionEn: '',
    published: true,
    imageIds: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    api.get(`/admin/clinics/${id}`)
      .then((data) => setForm({
        slug: data.slug ?? '',
        nameUa: data.nameUa ?? '',
        nameEn: data.nameEn ?? '',
        country: data.country ?? '',
        city: data.city ?? '',
        specializations: data.specializations ?? [],
        descriptionUa: data.descriptionUa ?? '',
        descriptionEn: data.descriptionEn ?? '',
        metaTitleUa: data.metaTitleUa ?? '',
        metaTitleEn: data.metaTitleEn ?? '',
        metaDescriptionUa: data.metaDescriptionUa ?? '',
        metaDescriptionEn: data.metaDescriptionEn ?? '',
        published: data.published ?? true,
        imageIds: (data.images ?? []).map((i: { mediaId: string }) => i.mediaId),
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
      if (isNew) {
        await api.post('/admin/clinics', form);
      } else {
        await api.patch(`/admin/clinics/${id}`, form);
      }
      router.push('/admin/clinics');
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
        <Link href="/admin/clinics" className="btn-ghost !p-2">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Add Clinic' : 'Edit Clinic'}</h1>
          {!isNew && <p className="text-sm text-gray-500 mt-0.5">{form.nameUa || form.nameEn}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="label">Slug</label>
              <input className="input" placeholder="clinic-slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input" placeholder="e.g. Ukraine" value={form.country} onChange={(e) => set('country', e.target.value)} />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" placeholder="e.g. Kyiv" value={form.city} onChange={(e) => set('city', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Specializations</label>
            <input
              className="input"
              placeholder="Cardiology, Dentistry, Orthopedics..."
              value={form.specializations.join(', ')}
              onChange={(e) => set('specializations', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
            <p className="text-xs text-gray-400 mt-1.5">Comma-separated list</p>
          </div>

          <div className="flex items-center gap-3">
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
                  <label className="label">Name (UA)</label>
                  <input className="input" placeholder="Clinic name" value={form.nameUa} onChange={(e) => set('nameUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">Description (UA)</label>
                  <textarea className="input min-h-[140px]" placeholder="Clinic description..." value={form.descriptionUa} onChange={(e) => set('descriptionUa', e.target.value)} rows={5} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">Name (EN)</label>
                  <input className="input" placeholder="Clinic name" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">Description (EN)</label>
                  <textarea className="input min-h-[140px]" placeholder="Clinic description..." value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} rows={5} />
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
          <Link href="/admin/clinics" className="btn-outline">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Save Clinic
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
