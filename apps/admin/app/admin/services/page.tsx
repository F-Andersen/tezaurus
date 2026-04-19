'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getAdminLang, t, common, type AdminLang } from '@/lib/i18n';

const dict = {
  title: { ua: 'Послуги та пакети', en: 'Services & Packages' },
  addService: { ua: 'Додати послугу', en: 'Add Service' },
  totalSuffix: { ua: 'всього', en: 'total' },
  service: { ua: 'послуга', en: 'service' },
  services: { ua: 'послуг', en: 'services' },
  noServices: { ua: 'Послуг ще немає. Додайте першу послугу або пакет.', en: 'No services yet. Add your first service or package.' },
  image: { ua: 'Зображення', en: 'Image' },
  name: { ua: 'Назва', en: 'Name' },
  category: { ua: 'Категорія', en: 'Category' },
  location: { ua: 'Локація', en: 'Location' },
  price: { ua: 'Ціна', en: 'Price' },
  featured: { ua: 'Обране', en: 'Featured' },
  published: { ua: 'Опублікований', en: 'Published' },
  sort: { ua: 'Порядок', en: 'Sort' },
  actions: { ua: 'Дії', en: 'Actions' },
  edit: { ua: 'Редагувати', en: 'Edit' },
  removeFeatured: { ua: 'Прибрати з обраних', en: 'Remove from featured' },
  markFeatured: { ua: 'Позначити як обране', en: 'Mark as featured' },
  confirmDeleteService: { ua: 'Ви впевнені, що хочете видалити цю послугу?', en: 'Are you sure you want to delete this service?' },
} as const;

interface Service {
  id: string;
  slug: string;
  nameUa?: string;
  nameEn?: string;
  category?: string;
  country?: string;
  city?: string;
  priceFrom?: number;
  currency?: string;
  imageUrl?: string;
  featured: boolean;
  published: boolean;
  sortOrder?: number;
}

export default function ServicesList() {
  const [list, setList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [lang, setLang] = useState<AdminLang>('ua');
  useEffect(() => { setLang(getAdminLang()); }, []);
  useEffect(() => { const i = setInterval(() => { const l = getAdminLang(); if (l !== lang) setLang(l); }, 500); return () => clearInterval(i); });

  useEffect(() => {
    api.get('/admin/services')
      .then(setList)
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm(t(dict, 'confirmDeleteService', lang))) return;
    await api.delete(`/admin/services/${id}`);
    setList((prev) => prev.filter((s) => s.id !== id));
  };

  const handleTogglePublished = async (item: Service) => {
    const updated = { ...item, published: !item.published };
    await api.patch(`/admin/services/${item.id}`, { published: updated.published });
    setList((prev) => prev.map((s) => (s.id === item.id ? updated : s)));
  };

  const handleToggleFeatured = async (item: Service) => {
    const updated = { ...item, featured: !item.featured };
    await api.patch(`/admin/services/${item.id}`, { featured: updated.featured });
    setList((prev) => prev.map((s) => (s.id === item.id ? updated : s)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(dict, 'title', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">{list.length} {list.length !== 1 ? t(dict, 'services', lang) : t(dict, 'service', lang)} {t(dict, 'totalSuffix', lang)}</p>
        </div>
        <Link href="/admin/services/new" className="btn-primary">
          <span className="material-symbols-outlined">add</span>
          {t(dict, 'addService', lang)}
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/5" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-gray-300">medical_services</span>
            <p className="mt-2 text-sm text-gray-500">{t(dict, 'noServices', lang)}</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{t(dict, 'image', lang)}</th>
                  <th>{t(dict, 'name', lang)}</th>
                  <th>{t(dict, 'category', lang)}</th>
                  <th>{t(dict, 'location', lang)}</th>
                  <th>{t(dict, 'price', lang)}</th>
                  <th className="text-center">{t(dict, 'featured', lang)}</th>
                  <th className="text-center">{t(dict, 'published', lang)}</th>
                  <th className="text-center">{t(dict, 'sort', lang)}</th>
                  <th className="text-right">{t(dict, 'actions', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id}>
                    <td>
                      {s.imageUrl ? (
                        <img
                          src={s.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-300 !text-[18px]">image</span>
                        </div>
                      )}
                    </td>
                    <td className="font-medium text-gray-900">
                      {s.nameUa || s.nameEn || '—'}
                    </td>
                    <td>
                      {s.category ? (
                        <span className="badge-info">{s.category}</span>
                      ) : '—'}
                    </td>
                    <td className="text-sm text-gray-600">
                      {[s.country, s.city].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="text-sm">
                      {s.priceFrom != null ? (
                        <span className="font-medium">
                          {s.priceFrom.toLocaleString()} {s.currency || 'USD'}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(s)}
                        className="inline-flex items-center justify-center"
                        title={s.featured ? t(dict, 'removeFeatured', lang) : t(dict, 'markFeatured', lang)}
                      >
                        <span className={`material-symbols-outlined !text-[20px] ${
                          s.featured
                            ? 'text-amber-500'
                            : 'text-gray-300 hover:text-gray-400'
                        }`} style={s.featured ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                          star
                        </span>
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(s)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          s.published ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          s.published ? 'translate-x-[18px]' : 'translate-x-[3px]'
                        }`} />
                      </button>
                    </td>
                    <td className="text-center text-sm text-gray-500">
                      {s.sortOrder ?? '—'}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/services/${s.id}`} className="btn-ghost !px-2 !py-1.5 text-xs">
                          <span className="material-symbols-outlined !text-[16px]">edit</span>
                          {t(dict, 'edit', lang)}
                        </Link>
                        <button type="button" onClick={() => handleDelete(s.id)} className="btn-ghost !px-2 !py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                          <span className="material-symbols-outlined !text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
