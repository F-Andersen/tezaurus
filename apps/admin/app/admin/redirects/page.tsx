'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getAdminLang, t, type AdminLang } from '@/lib/i18n';

const dict = {
  title: { ua: 'Редіректи', en: 'Redirects' },
  redirectsCount: { ua: '{count} редіректів', en: '{count} redirects' },
  redirectCount: { ua: '{count} редірект', en: '{count} redirect' },
  addRedirect: { ua: 'Додати редірект', en: 'Add Redirect' },
  editRedirect: { ua: 'Редагувати редірект', en: 'Edit Redirect' },
  newRedirect: { ua: 'Новий редірект', en: 'New Redirect' },
  fromPath: { ua: 'Шлях з', en: 'From Path' },
  toPath: { ua: 'Шлях на', en: 'To Path' },
  code: { ua: 'Код', en: 'Code' },
  permanent: { ua: 'Постійний', en: 'Permanent' },
  temporary: { ua: 'Тимчасовий', en: 'Temporary' },
  update: { ua: 'Оновити', en: 'Update' },
  add: { ua: 'Додати', en: 'Add' },
  cancel: { ua: 'Скасувати', en: 'Cancel' },
  actions: { ua: 'Дії', en: 'Actions' },
  edit: { ua: 'Редагувати', en: 'Edit' },
  noRedirects: { ua: 'Редіректи не налаштовані.', en: 'No redirects configured.' },
  confirmDelete: { ua: 'Видалити цей редірект?', en: 'Delete this redirect?' },
} as const;

interface Redirect {
  id: string;
  fromPath: string;
  toPath: string;
  code: number;
}

export default function RedirectsList() {
  const [list, setList] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fromPath: '', toPath: '', code: 301 });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [lang, setLang] = useState<AdminLang>('ua');
  useEffect(() => { setLang(getAdminLang()); }, []);
  useEffect(() => { const i = setInterval(() => { const l = getAdminLang(); if (l !== lang) setLang(l); }, 500); return () => clearInterval(i); });

  const loadRedirects = () => {
    api.get('/admin/redirects')
      .then(setList)
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRedirects(); }, [router]);

  const resetForm = () => {
    setEditId(null);
    setShowForm(false);
    setForm({ fromPath: '', toPath: '', code: 301 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.patch(`/admin/redirects/${editId}`, form);
      } else {
        await api.post('/admin/redirects', form);
      }
      resetForm();
      loadRedirects();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (r: Redirect) => {
    setEditId(r.id);
    setShowForm(true);
    setForm({ fromPath: r.fromPath, toPath: r.toPath, code: r.code });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t(dict, 'confirmDelete', lang))) return;
    await api.delete(`/admin/redirects/${id}`);
    if (editId === id) resetForm();
    loadRedirects();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(dict, 'title', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {list.length !== 1
              ? t(dict, 'redirectsCount', lang, { count: String(list.length) })
              : t(dict, 'redirectCount', lang, { count: String(list.length) })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn-primary"
        >
          <span className="material-symbols-outlined">add</span>
          {t(dict, 'addRedirect', lang)}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
            {editId ? t(dict, 'editRedirect', lang) : t(dict, 'newRedirect', lang)}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
            <div className="flex-[2] min-w-[200px]">
              <label className="label">{t(dict, 'fromPath', lang)}</label>
              <input className="input" placeholder="/old-page" value={form.fromPath} onChange={(e) => setForm((f) => ({ ...f, fromPath: e.target.value }))} required />
            </div>
            <div className="flex-[2] min-w-[200px]">
              <label className="label">{t(dict, 'toPath', lang)}</label>
              <input className="input" placeholder="/new-page" value={form.toPath} onChange={(e) => setForm((f) => ({ ...f, toPath: e.target.value }))} required />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="label">{t(dict, 'code', lang)}</label>
              <select className="input" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: Number(e.target.value) }))}>
                <option value={301}>301 ({t(dict, 'permanent', lang)})</option>
                <option value={302}>302 ({t(dict, 'temporary', lang)})</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <span className="material-symbols-outlined">{editId ? 'check' : 'add'}</span>
                )}
                {editId ? t(dict, 'update', lang) : t(dict, 'add', lang)}
              </button>
              <button type="button" onClick={resetForm} className="btn-ghost">{t(dict, 'cancel', lang)}</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-gray-300">alt_route</span>
            <p className="mt-2 text-sm text-gray-500">{t(dict, 'noRedirects', lang)}</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{t(dict, 'fromPath', lang)}</th>
                  <th>{t(dict, 'toPath', lang)}</th>
                  <th>{t(dict, 'code', lang)}</th>
                  <th className="text-right">{t(dict, 'actions', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{r.fromPath}</code>
                    </td>
                    <td>
                      <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{r.toPath}</code>
                    </td>
                    <td>
                      <span className={r.code === 301 ? 'badge-info' : 'badge-warning'}>{r.code}</span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => handleEdit(r)} className="btn-ghost !px-2 !py-1.5 text-xs">
                          <span className="material-symbols-outlined !text-[16px]">edit</span>
                          {t(dict, 'edit', lang)}
                        </button>
                        <button type="button" onClick={() => handleDelete(r.id)} className="btn-ghost !px-2 !py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
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
