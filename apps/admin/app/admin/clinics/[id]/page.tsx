'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getAdminLang, t, type AdminLang } from '@/lib/i18n';
import { MediaPickerModal } from '@/components/MediaPickerModal';

const dict = {
  addClinic: { ua: 'Додати клініку', en: 'Add Clinic' },
  editClinic: { ua: 'Редагувати клініку', en: 'Edit Clinic' },
  deleteBtn: { ua: 'Видалити', en: 'Delete' },
  confirmDelete: { ua: 'Ви впевнені, що хочете видалити цю клініку?', en: 'Are you sure you want to delete this clinic?' },
  general: { ua: 'Загальне', en: 'General' },
  slug: { ua: 'Slug', en: 'Slug' },
  country: { ua: 'Країна', en: 'Country' },
  countryPlaceholder: { ua: 'напр. Україна', en: 'e.g. Ukraine' },
  city: { ua: 'Місто', en: 'City' },
  cityPlaceholder: { ua: 'напр. Київ', en: 'e.g. Kyiv' },
  specializations: { ua: 'Спеціалізації', en: 'Specializations' },
  specPlaceholder: { ua: 'Кардіологія, Стоматологія, Ортопедія...', en: 'Cardiology, Dentistry, Orthopedics...' },
  commaSeparated: { ua: 'Розділені комами', en: 'Comma-separated list' },
  published: { ua: 'Опублікований', en: 'Published' },
  uaTab: { ua: '🇺🇦 Українська', en: '🇺🇦 Українська' },
  enTab: { ua: '🇬🇧 English', en: '🇬🇧 English' },
  nameUa: { ua: 'Назва (UA)', en: 'Name (UA)' },
  nameEn: { ua: 'Назва (EN)', en: 'Name (EN)' },
  clinicNamePlaceholder: { ua: 'Назва клініки', en: 'Clinic name' },
  descriptionUa: { ua: 'Опис (UA)', en: 'Description (UA)' },
  descriptionEn: { ua: 'Опис (EN)', en: 'Description (EN)' },
  clinicDescPlaceholder: { ua: 'Опис клініки...', en: 'Clinic description...' },
  seoMeta: { ua: 'SEO та мета', en: 'SEO & Meta' },
  metaTitleUa: { ua: 'Мета-заголовок (UA)', en: 'Meta Title (UA)' },
  metaTitleEn: { ua: 'Мета-заголовок (EN)', en: 'Meta Title (EN)' },
  seoTitlePlaceholder: { ua: 'SEO заголовок', en: 'SEO title' },
  metaDescUa: { ua: 'Мета-опис (UA)', en: 'Meta Description (UA)' },
  metaDescEn: { ua: 'Мета-опис (EN)', en: 'Meta Description (EN)' },
  seoDescPlaceholder: { ua: 'SEO опис', en: 'SEO description' },
  cancel: { ua: 'Скасувати', en: 'Cancel' },
  saving: { ua: 'Збереження...', en: 'Saving...' },
  saveClinic: { ua: 'Зберегти клініку', en: 'Save Clinic' },
  images: { ua: 'Зображення', en: 'Images' },
  addFromLibrary: { ua: 'З медіатеки', en: 'From Library' },
  uploadImage: { ua: 'Завантажити', en: 'Upload' },
  uploading: { ua: 'Завантаження…', en: 'Uploading…' },
  noImages: { ua: 'Зображень немає. Додайте перше.', en: 'No images. Add your first.' },
  dragToReorder: { ua: 'Перетягніть для зміни порядку', en: 'Drag to reorder' },
  imagesCount: { ua: 'зображень', en: 'images' },
} as const;

const TABS = ['UA', 'EN'] as const;
type Lang = (typeof TABS)[number];

interface ClinicImageData {
  mediaId: string;
  url?: string;
  key?: string;
}

export default function ClinicEdit() {
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
  const [clinicImages, setClinicImages] = useState<ClinicImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    api.get(`/admin/clinics/${id}`)
      .then((data) => {
        const imgs: ClinicImageData[] = (data.images ?? []).map((i: { mediaId: string; media?: { id: string; key: string } }) => ({
          mediaId: i.mediaId,
          key: i.media?.key,
        }));
        setForm({
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
          imageIds: imgs.map((i) => i.mediaId),
        });
        setClinicImages(imgs);
        loadImageUrls(imgs);
      })
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [id, isNew, router]);

  const loadImageUrls = async (imgs: ClinicImageData[]) => {
    try {
      const allMedia = await api.get('/admin/media');
      const urlMap = new Map<string, string>();
      for (const m of allMedia) {
        if (m.url) urlMap.set(m.id, m.url);
      }
      setClinicImages(imgs.map((i) => ({ ...i, url: urlMap.get(i.mediaId) })));
    } catch {
      // ignore
    }
  };

  const set = (key: string, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

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
      const newImg: ClinicImageData = { mediaId: data.id, url: data.url, key: data.key };
      setClinicImages((prev) => [...prev, newImg]);
      setForm((f) => ({ ...f, imageIds: [...f.imageIds, data.id] }));
    } finally {
      setImageUploading(false);
    }
  }, []);

  const removeImage = (mediaId: string) => {
    setClinicImages((prev) => prev.filter((i) => i.mediaId !== mediaId));
    setForm((f) => ({ ...f, imageIds: f.imageIds.filter((id) => id !== mediaId) }));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= clinicImages.length) return;
    const newImages = [...clinicImages];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setClinicImages(newImages);
    setForm((f) => {
      const newIds = [...f.imageIds];
      [newIds[index], newIds[newIndex]] = [newIds[newIndex], newIds[index]];
      return { ...f, imageIds: newIds };
    });
  };

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

  const handleDelete = async () => {
    if (!confirm(t(dict, 'confirmDelete', lang))) return;
    await api.delete(`/admin/clinics/${id}`);
    router.push('/admin/clinics');
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
          <Link href="/admin/clinics" className="btn-ghost !p-2">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isNew ? t(dict, 'addClinic', lang) : t(dict, 'editClinic', lang)}</h1>
            {!isNew && <p className="text-sm text-gray-500 mt-0.5">{form.nameUa || form.nameEn}</p>}
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
        {/* General */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t(dict, 'general', lang)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="label">{t(dict, 'slug', lang)}</label>
              <input className="input" placeholder="clinic-slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
            </div>
            <div>
              <label className="label">{t(dict, 'country', lang)}</label>
              <input className="input" placeholder={t(dict, 'countryPlaceholder', lang)} value={form.country} onChange={(e) => set('country', e.target.value)} />
            </div>
            <div>
              <label className="label">{t(dict, 'city', lang)}</label>
              <input className="input" placeholder={t(dict, 'cityPlaceholder', lang)} value={form.city} onChange={(e) => set('city', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">{t(dict, 'specializations', lang)}</label>
            <input
              className="input"
              placeholder={t(dict, 'specPlaceholder', lang)}
              value={form.specializations.join(', ')}
              onChange={(e) => set('specializations', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            />
            <p className="text-xs text-gray-400 mt-1.5">{t(dict, 'commaSeparated', lang)}</p>
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
            <span className="text-sm font-medium text-gray-700">{t(dict, 'published', lang)}</span>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t(dict, 'images', lang)}</h2>
              {clinicImages.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">{clinicImages.length} {t(dict, 'imagesCount', lang)}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="btn-outline !py-2 !px-3 !text-xs"
              >
                <span className="material-symbols-outlined !text-[16px]">perm_media</span>
                {t(dict, 'addFromLibrary', lang)}
              </button>
              <button
                type="button"
                onClick={() => imageFileRef.current?.click()}
                disabled={imageUploading}
                className="btn-primary !py-2 !px-3 !text-xs"
              >
                <span className="material-symbols-outlined !text-[16px]">{imageUploading ? 'hourglass_top' : 'upload'}</span>
                {imageUploading ? t(dict, 'uploading', lang) : t(dict, 'uploadImage', lang)}
              </button>
            </div>
          </div>

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

          {clinicImages.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3">collections</span>
              <p className="text-sm text-gray-500">{t(dict, 'noImages', lang)}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {clinicImages.map((img, index) => (
                <div key={img.mediaId} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <div className="aspect-square">
                    {img.url ? (
                      <img src={img.url} alt={img.key || ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-gray-300">image</span>
                      </div>
                    )}
                  </div>

                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        className="bg-white/90 hover:bg-white rounded-lg p-1.5 transition-colors disabled:opacity-30"
                        title="Move left"
                      >
                        <span className="material-symbols-outlined !text-[16px]">chevron_left</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === clinicImages.length - 1}
                        className="bg-white/90 hover:bg-white rounded-lg p-1.5 transition-colors disabled:opacity-30"
                        title="Move right"
                      >
                        <span className="material-symbols-outlined !text-[16px]">chevron_right</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(img.mediaId)}
                      className="bg-white/90 hover:bg-white rounded-lg p-1.5 transition-colors"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined !text-[16px] text-red-600">delete</span>
                    </button>
                  </div>

                  {/* Index badge */}
                  {index === 0 && (
                    <div className="absolute top-1.5 left-1.5 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      COVER
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <MediaPickerModal
          open={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          multiple
          onSelect={(items) => {
            const newImages: ClinicImageData[] = items
              .filter((m) => !form.imageIds.includes(m.id))
              .map((m) => ({ mediaId: m.id, url: m.url, key: m.key }));
            if (newImages.length > 0) {
              setClinicImages((prev) => [...prev, ...newImages]);
              setForm((f) => ({ ...f, imageIds: [...f.imageIds, ...newImages.map((i) => i.mediaId)] }));
            }
          }}
        />

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
                  <input className="input" placeholder={t(dict, 'clinicNamePlaceholder', lang)} value={form.nameUa} onChange={(e) => set('nameUa', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'descriptionUa', lang)}</label>
                  <textarea className="input min-h-[140px]" placeholder={t(dict, 'clinicDescPlaceholder', lang)} value={form.descriptionUa} onChange={(e) => set('descriptionUa', e.target.value)} rows={5} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">{t(dict, 'nameEn', lang)}</label>
                  <input className="input" placeholder={t(dict, 'clinicNamePlaceholder', lang)} value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t(dict, 'descriptionEn', lang)}</label>
                  <textarea className="input min-h-[140px]" placeholder={t(dict, 'clinicDescPlaceholder', lang)} value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} rows={5} />
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
          <Link href="/admin/clinics" className="btn-outline">{t(dict, 'cancel', lang)}</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                {t(dict, 'saving', lang)}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                {t(dict, 'saveClinic', lang)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
