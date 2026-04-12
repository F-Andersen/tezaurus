'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface BlogPost {
  id: string;
  slug: string;
  titleUa?: string;
  titleEn?: string;
  category?: { slug: string; nameUa?: string };
  status: string;
  createdAt?: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get('/admin/blog/posts')
      .then(setPosts)
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    await api.delete(`/admin/blog/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'published': return 'badge-success';
      case 'draft': return 'badge-gray';
      default: return 'badge-warning';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/blog/categories" className="btn-outline">
            <span className="material-symbols-outlined">category</span>
            Manage Categories
          </Link>
          <Link href="/admin/blog/new" className="btn-primary">
            <span className="material-symbols-outlined">add</span>
            New Post
          </Link>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-gray-300">article</span>
            <p className="mt-2 text-sm text-gray-500">No blog posts yet. Write your first post.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium text-gray-900">{p.titleUa || p.titleEn || '—'}</td>
                    <td>
                      {p.category ? (
                        <span className="badge-info">{p.category.nameUa || p.category.slug}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td>
                      <span className={statusBadge(p.status)}>{p.status}</span>
                    </td>
                    <td className="text-gray-500 text-xs">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/blog/${p.id}`} className="btn-ghost !px-2 !py-1.5 text-xs">
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
