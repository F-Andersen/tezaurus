'use client';

import { useState } from 'react';

interface GalleryImage {
  id: string;
  url: string | null;
  alt?: string;
}

interface Props {
  images: GalleryImage[];
  clinicName: string;
}

export function ClinicGallery({ images, clinicName }: Props) {
  const validImages = images.filter((img) => img.url);
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (validImages.length === 0) return null;

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="block w-full overflow-hidden rounded-xl aspect-[16/10] bg-surface-container-low cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={validImages[selected].url!}
            alt={validImages[selected].alt || clinicName}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </button>

        {/* Thumbnails */}
        {validImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {validImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelected(i)}
                className={`shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  i === selected ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url!}
                  alt={img.alt || `${clinicName} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          {validImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((s) => (s - 1 + validImages.length) % validImages.length);
                }}
              >
                <span className="material-symbols-outlined text-4xl">chevron_left</span>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected((s) => (s + 1) % validImages.length);
                }}
              >
                <span className="material-symbols-outlined text-4xl">chevron_right</span>
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={validImages[selected].url!}
            alt={validImages[selected].alt || clinicName}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {validImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {selected + 1} / {validImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
