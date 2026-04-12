'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface PageItem {
  id: string;
  slug: string;
  titleUa?: string;
  published: boolean;
  updatedAt?: string;
}

export default function PagesList() {
  const [list, setList] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get('/admin/pages')
      .then(setList)
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    await api.delete(`/admin/pages/${id}`);
    setList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleTogglePublished = async (item: PageItem) => {
    const updated = { ...item, published: !item.published };
    await api.patch(`/admin/pages/${item.id}`, { published: updated.published });
    setList((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-sm text-gray-500 mt-1">{list.length} page{list.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/admin/pages/new" className="btn-primary">
          <span className="material-symbols-outlined">add</span>
          Create Page
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-gray-300">description</span>
            <p className="mt-2 text-sm text-gray-500">No pages yet. Create your first page.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Published</th>
                  <th>Updated</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium text-gray-900">{p.titleUa || '—'}</td>
                    <td><code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{p.slug}</code></td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(p)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          p.published ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          p.published ? 'translate-x-[18px]' : 'translate-x-[3px]'
                        }`} />
                      </button>
                    </td>
                    <td className="text-gray-500 text-xs">
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/pages/${p.id}`} className="btn-ghost !px-2 !py-1.5 text-xs">
                          <span className="material-symbols-outlined !text-[16px]">edit</span>
                          Edit
                        </Link>
                        <button type="button" onClick={() => handleDelete(p.id)} className="btn-ghost !px-2 !py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
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
