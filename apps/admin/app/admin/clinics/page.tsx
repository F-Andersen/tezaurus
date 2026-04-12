'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Clinic {
  id: string;
  slug: string;
  nameUa?: string;
  nameEn?: string;
  country?: string;
  city?: string;
  specializations?: string[];
  published: boolean;
}

export default function ClinicsList() {
  const [list, setList] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get('/admin/clinics')
      .then(setList)
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this clinic?')) return;
    await api.delete(`/admin/clinics/${id}`);
    setList((prev) => prev.filter((c) => c.id !== id));
  };

  const handleTogglePublished = async (item: Clinic) => {
    const updated = { ...item, published: !item.published };
    await api.patch(`/admin/clinics/${item.id}`, { published: updated.published });
    setList((prev) => prev.map((c) => (c.id === item.id ? updated : c)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinics</h1>
          <p className="text-sm text-gray-500 mt-1">{list.length} clinic{list.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/admin/clinics/new" className="btn-primary">
          <span className="material-symbols-outlined">add</span>
          Add Clinic
        </Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-gray-300">local_hospital</span>
            <p className="mt-2 text-sm text-gray-500">No clinics yet. Add your first clinic.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Country</th>
                  <th>City</th>
                  <th>Specializations</th>
                  <th>Published</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium text-gray-900">{c.nameUa || c.nameEn || '—'}</td>
                    <td>{c.country || '—'}</td>
                    <td>{c.city || '—'}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(c.specializations ?? []).slice(0, 3).map((s) => (
                          <span key={s} className="badge-info">{s}</span>
                        ))}
                        {(c.specializations ?? []).length > 3 && (
                          <span className="badge-gray">+{(c.specializations!.length - 3)}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(c)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          c.published ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          c.published ? 'translate-x-[18px]' : 'translate-x-[3px]'
                        }`} />
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/clinics/${c.id}`} className="btn-ghost !px-2 !py-1.5 text-xs">
                          <span className="material-symbols-outlined !text-[16px]">edit</span>
                          Edit
                        </Link>
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
