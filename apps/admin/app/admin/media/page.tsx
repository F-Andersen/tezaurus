'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getAdminLang, t, type AdminLang } from '@/lib/i18n';

const dict = {
  title: { ua: 'Медіатека', en: 'Media Library' },
  filesCount: { ua: '{count} файлів', en: '{count} files' },
  fileCount: { ua: '{count} файл', en: '{count} file' },
  uploading: { ua: 'Завантаження...', en: 'Uploading...' },
  uploadFile: { ua: 'Завантажити файл', en: 'Upload File' },
  dropHere: { ua: 'Перетягніть файл сюди...', en: 'Drop file here...' },
  dragOrClick: { ua: 'Перетягніть файл сюди або натисніть для вибору', en: 'Drag & drop a file here, or click to browse' },
  supportedFormats: { ua: 'Підтримуються зображення, PDF та документи', en: 'Supports images, PDFs, and documents' },
  noMedia: { ua: 'Медіафайлів ще немає.', en: 'No media files yet.' },
  confirmDelete: { ua: 'Видалити цей файл?', en: 'Delete this file?' },
  copyUrl: { ua: 'Копіювати URL', en: 'Copy URL' },
  delete: { ua: 'Видалити', en: 'Delete' },
} as const;

interface MediaItem {
  id: string;
  key: string;
  url?: string;
  altUa?: string;
  altEn?: string;
  mimeType: string;
  size?: number;
}

function formatSize(bytes?: number) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function MediaList() {
  const [list, setList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [lang, setLang] = useState<AdminLang>('ua');
  useEffect(() => { setLang(getAdminLang()); }, []);
  useEffect(() => { const i = setInterval(() => { const l = getAdminLang(); if (l !== lang) setLang(l); }, 500); return () => clearInterval(i); });

  useEffect(() => {
    api.get('/admin/media')
      .then(setList)
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/media/upload`,
        {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form,
          credentials: 'include',
        },
      );
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setList((prev) => [data, ...prev]);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t(dict, 'confirmDelete', lang))) return;
    await api.delete(`/admin/media/${id}`);
    setList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(dict, 'title', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {list.length !== 1
              ? t(dict, 'filesCount', lang, { count: String(list.length) })
              : t(dict, 'fileCount', lang, { count: String(list.length) })}
          </p>
        </div>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary">
          <span className="material-symbols-outlined">{uploading ? 'hourglass_top' : 'upload'}</span>
          {uploading ? t(dict, 'uploading', lang) : t(dict, 'uploadFile', lang)}
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`card border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
          dragActive
            ? 'border-accent bg-accent/5'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <span className={`material-symbols-outlined text-4xl ${dragActive ? 'text-accent' : 'text-gray-300'}`}>
          cloud_upload
        </span>
        <p className="mt-2 text-sm text-gray-600">
          {dragActive ? t(dict, 'dropHere', lang) : t(dict, 'dragOrClick', lang)}
        </p>
        <p className="text-xs text-gray-400 mt-1">{t(dict, 'supportedFormats', lang)}</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
        </div>
      ) : list.length === 0 ? (
        <div className="card text-center py-12">
          <span className="material-symbols-outlined text-4xl text-gray-300">perm_media</span>
          <p className="mt-2 text-sm text-gray-500">{t(dict, 'noMedia', lang)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {list.map((m) => (
            <div key={m.id} className="card group overflow-hidden">
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                {m.mimeType.startsWith('image/') && m.url ? (
                  <img
                    src={m.url}
                    alt={m.altUa || m.key}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholders/gallery.svg'; }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="material-symbols-outlined text-3xl text-gray-300">insert_drive_file</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {m.url && (
                    <button type="button" onClick={() => handleCopyUrl(m.url!)} className="bg-white/90 hover:bg-white rounded-lg p-2 transition-colors" title={t(dict, 'copyUrl', lang)}>
                      <span className="material-symbols-outlined !text-[18px] text-gray-700">content_copy</span>
                    </button>
                  )}
                  <button type="button" onClick={() => handleDelete(m.id)} className="bg-white/90 hover:bg-white rounded-lg p-2 transition-colors" title={t(dict, 'delete', lang)}>
                    <span className="material-symbols-outlined !text-[18px] text-red-600">delete</span>
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-gray-700 truncate" title={m.key}>{m.key}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{formatSize(m.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
