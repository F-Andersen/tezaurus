'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import { getAdminLang, t, type AdminLang } from '@/lib/i18n';
import { getPlaceholder, onImgError } from '@/lib/placeholder';

const dict = {
  title: { ua: 'Медіатека', en: 'Media Library' },
  upload: { ua: 'Завантажити', en: 'Upload' },
  uploading: { ua: 'Завантаження…', en: 'Uploading…' },
  select: { ua: 'Обрати', en: 'Select' },
  cancel: { ua: 'Скасувати', en: 'Cancel' },
  noMedia: { ua: 'Медіафайлів немає. Завантажте перший.', en: 'No media files. Upload your first.' },
  selected: { ua: 'обрано', en: 'selected' },
  dragOrClick: { ua: 'Перетягніть або натисніть', en: 'Drag & drop or click' },
} as const;

interface MediaItem {
  id: string;
  key: string;
  url?: string;
  mimeType: string;
  size?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (items: MediaItem[]) => void;
  multiple?: boolean;
}

export function MediaPickerModal({ open, onClose, onSelect, multiple = false }: Props) {
  const [list, setList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);
  const [lang, setLang] = useState<AdminLang>('ua');

  useEffect(() => {
    setLang(getAdminLang());
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setSelected(new Set());
    api
      .get('/admin/media')
      .then(setList)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      const form = new FormData();
      form.append('file', file);
      try {
        const token = localStorage.getItem('accessToken');
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const res = await fetch(`${base}/admin/media/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form,
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        setList((prev) => [data, ...prev]);
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (multiple) {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      } else {
        if (next.has(id)) next.clear();
        else {
          next.clear();
          next.add(id);
        }
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const items = list.filter((m) => selected.has(m.id));
    onSelect(items);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{t(dict, 'title', lang)}</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-outline !py-2 !px-4 !text-sm"
            >
              <span className="material-symbols-outlined !text-[18px]">upload</span>
              {uploading ? t(dict, 'uploading', lang) : t(dict, 'upload', lang)}
            </button>
            <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
            <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-gray-500">close</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-gray-300 block mb-3">perm_media</span>
              <p className="text-gray-500">{t(dict, 'noMedia', lang)}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {list
                .filter((m) => m.mimeType.startsWith('image/'))
                .map((m) => {
                  const isSelected = selected.has(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleSelect(m.id)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                        isSelected
                          ? 'border-accent ring-2 ring-accent/30'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      {m.url ? (
                        <img
                          src={m.url}
                          alt={m.key}
                          onError={(e) => onImgError(e, 'gallery')}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <img src={getPlaceholder('gallery')} alt="" className="w-1/2 h-1/2 object-contain opacity-60" />
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg">
                            check_circle
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
          <span className="text-sm text-gray-500">
            {selected.size > 0 && `${selected.size} ${t(dict, 'selected', lang)}`}
          </span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="btn-outline !py-2 !px-4 !text-sm">
              {t(dict, 'cancel', lang)}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="btn-primary !py-2 !px-4 !text-sm disabled:opacity-40"
            >
              {t(dict, 'select', lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
