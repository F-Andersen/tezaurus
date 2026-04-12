'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Category {
  id: string;
  slug: string;
  nameUa?: string;
  nameEn?: string;
  _count?: { posts: number };
}

export default function BlogCategoriesPage() {
  const [list, setList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ slug: '', nameUa: '', nameEn: '' });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const loadCategories = () => {
    api.get('/admin/blog/categories')
      .then(setList)
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCategories(); }, [router]);

  const resetForm = () => {
    setEditId(null);
    setForm({ slug: '', nameUa: '', nameEn: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.patch(`/admin/blog/categories/${editId}`, form);
      } else {
        await api.post('/admin/blog/categories', form);
      }
      resetForm();
      loadCategories();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({ slug: cat.slug, nameUa: cat.nameUa ?? '', nameEn: cat.nameEn ?? '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await api.delete(`/admin/blog/categories/${id}`);
    if (editId === id) resetForm();
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/blog" className="btn-ghost !p-2">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{list.length} categor{list.length !== 1 ? 'ies' : 'y'}</p>
        </div>
      </div>

      {/* Inline form */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          {editId ? 'Edit Category' : 'Add Category'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <label className="label">Slug</label>
            <input className="input" placeholder="category-slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="label">Name UA</label>
            <input className="input" placeholder="Назва" value={form.nameUa} onChange={(e) => setForm((f) => ({ ...f, nameUa: e.target.value }))} />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="label">Name EN</label>
            <input className="input" placeholder="Name" value={form.nameEn} onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))} />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <span className="material-symbols-outlined">{editId ? 'check' : 'add'}</span>
              )}
              {editId ? 'Update' : 'Add'}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-gray-300">category</span>
            <p className="mt-2 text-sm text-gray-500">No categories yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name UA</th>
                  <th>Name EN</th>
                  <th>Slug</th>
                  <th>Posts</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium text-gray-900">{c.nameUa || '—'}</td>
                    <td>{c.nameEn || '—'}</td>
                    <td><code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{c.slug}</code></td>
                    <td>
                      <span className="badge-gray">{c._count?.posts ?? 0}</span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => handleEdit(c)} className="btn-ghost !px-2 !py-1.5 text-xs">
                          <span className="material-symbols-outlined !text-[16px]">edit</span>
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(c.id)} className="btn-ghost !px-2 !py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
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
