'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export interface Clinic {
  id: string;
  slug: string;
  name: string;
  country?: string;
  city?: string;
  specializations?: string[];
  description?: string;
  rating?: number;
  images?: { id: string; key: string; url?: string | null; alt?: string }[];
}

interface Props {
  clinics: Clinic[];
  lang: 'ua' | 'en';
}

const PER_PAGE = 12;

const t = {
  searchPlaceholder: { ua: 'Пошук за назвою чи спеціальністю…', en: 'Search by name or specialty…' },
  treatments: { ua: 'Лікування', en: 'Treatments' },
  destinations: { ua: 'Напрямки', en: 'Destinations' },
  showing: { ua: 'Показано', en: 'Showing' },
  of: { ua: 'з', en: 'of' },
  accredited: { ua: 'Акредитованих клінік', en: 'Accredited Clinics' },
  sortBy: { ua: 'Сортування:', en: 'Sort by:' },
  excellence: { ua: 'За рейтингом', en: 'Excellence Rank' },
  nameSort: { ua: 'За назвою', en: 'Name A–Z' },
  requestConsultation: { ua: 'Запит на консультацію', en: 'Request Consultation' },
  page: { ua: 'Сторінка', en: 'Page' },
  noResults: { ua: 'Клінік не знайдено за вашим запитом.', en: 'No clinics found matching your criteria.' },
  callNow: { ua: 'Зателефонувати', en: 'Call Now' },
  message: { ua: 'Написати', en: 'Message' },
  all: { ua: 'Усі', en: 'All' },
};

export function ClinicsDirectory({ clinics, lang }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'name'>('rank');
  const [page, setPage] = useState(1);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showSpecDropdown, setShowSpecDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const countries = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach((c) => { if (c.country) set.add(c.country); });
    return Array.from(set).sort();
  }, [clinics]);

  const specializations = useMemo(() => {
    const set = new Set<string>();
    clinics.forEach((c) => c.specializations?.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [clinics]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = clinics.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) && !c.specializations?.some((s) => s.toLowerCase().includes(q))) return false;
      if (selectedCountry && c.country !== selectedCountry) return false;
      if (selectedSpec && !c.specializations?.includes(selectedSpec)) return false;
      return true;
    });
    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    return result;
  }, [clinics, search, selectedCountry, selectedSpec, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const firstImage = (c: Clinic) => c.images?.find((img) => img.url)?.url ?? null;

  return (
    <>
      {/* ── Sticky Search & Filter Bar ── */}
      <section className="sticky top-0 z-40 mb-12 md:mb-16">
        <div className="bg-surface-container-lowest/80 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-3 md:gap-4">
          {/* Search */}
          <div className="flex-1 w-full relative">
            <span className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-surface-container-low border-none rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-5 md:pr-6 focus:ring-1 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-outline-variant font-body text-sm md:text-base"
              placeholder={t.searchPlaceholder[lang]}
            />
          </div>
          {/* Filter buttons */}
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            {/* Treatments dropdown */}
            <div className="relative flex-1 md:flex-initial">
              <button
                onClick={() => { setShowSpecDropdown(!showSpecDropdown); setShowCountryDropdown(false); }}
                className="flex items-center justify-between gap-2 md:gap-4 px-4 md:px-6 py-3.5 md:py-4 bg-surface-container-low rounded-xl md:rounded-2xl w-full md:min-w-[180px] hover:bg-surface-container-high transition-colors"
              >
                <span className="text-sm font-medium truncate">{selectedSpec || t.treatments[lang]}</span>
                <span className="material-symbols-outlined text-outline text-lg">expand_more</span>
              </button>
              {showSpecDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full md:w-64 bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-50 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedSpec(''); setShowSpecDropdown(false); setPage(1); }}
                    className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${!selectedSpec ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                  >
                    {t.all[lang]}
                  </button>
                  {specializations.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSpec(s); setShowSpecDropdown(false); setPage(1); }}
                      className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${selectedSpec === s ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Destinations dropdown */}
            <div className="relative flex-1 md:flex-initial">
              <button
                onClick={() => { setShowCountryDropdown(!showCountryDropdown); setShowSpecDropdown(false); }}
                className="flex items-center justify-between gap-2 md:gap-4 px-4 md:px-6 py-3.5 md:py-4 bg-surface-container-low rounded-xl md:rounded-2xl w-full md:min-w-[180px] hover:bg-surface-container-high transition-colors"
              >
                <span className="text-sm font-medium truncate">{selectedCountry || t.destinations[lang]}</span>
                <span className="material-symbols-outlined text-outline text-lg">expand_more</span>
              </button>
              {showCountryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full md:w-64 bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-50 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedCountry(''); setShowCountryDropdown(false); setPage(1); }}
                    className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${!selectedCountry ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                  >
                    {t.all[lang]}
                  </button>
                  {countries.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setSelectedCountry(c); setShowCountryDropdown(false); setPage(1); }}
                      className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${selectedCountry === c ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Filter toggle (clear all) */}
            <button
              onClick={() => { setSearch(''); setSelectedCountry(''); setSelectedSpec(''); setPage(1); }}
              className="flex items-center justify-center p-3.5 md:p-4 bg-primary text-on-primary rounded-xl md:rounded-2xl hover:opacity-90 transition-opacity shrink-0"
              title={lang === 'ua' ? 'Скинути фільтри' : 'Clear filters'}
            >
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>

        {/* Count + Sort */}
        <div className="flex justify-between items-center mt-5 md:mt-6 px-2 md:px-4">
          <div className="text-sm text-on-surface-variant font-medium">
            {t.showing[lang]}{' '}
            <span className="text-primary font-semibold">{paged.length} {t.of[lang]} {filtered.length}</span>{' '}
            {t.accredited[lang]}
          </div>
          <div className="relative flex items-center gap-3 md:gap-4">
            <span className="hidden md:inline text-xs uppercase tracking-widest text-outline">{t.sortBy[lang]}</span>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="text-sm font-semibold flex items-center gap-1"
            >
              {sortBy === 'rank' ? t.excellence[lang] : t.nameSort[lang]}
              <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
            </button>
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-50">
                <button
                  onClick={() => { setSortBy('rank'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${sortBy === 'rank' ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                >
                  {t.excellence[lang]}
                </button>
                <button
                  onClick={() => { setSortBy('name'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${sortBy === 'name' ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                >
                  {t.nameSort[lang]}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Clinic Cards Grid ── */}
      {paged.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">search_off</span>
          <p className="text-lg text-on-surface-variant">{t.noResults[lang]}</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16 mb-20 md:mb-24">
          {paged.map((c) => {
            const imgUrl = firstImage(c);
            return (
              <div key={c.id} className="group">
                {/* Image */}
                <Link href={`/${lang}/clinics/${c.slug}`} className="block relative mb-5 md:mb-6 overflow-hidden rounded-xl aspect-[4/5] bg-surface-container-low">
                  {imgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={c.name}
                      src={imgUrl}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-on-primary-container/30">local_hospital</span>
                    </div>
                  )}
                  {c.country && (
                    <div className="absolute top-5 left-5 md:top-6 md:left-6">
                      <span className="bg-white/90 backdrop-blur-md px-3.5 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-primary">
                        {c.country}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Name + Rating */}
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <Link href={`/${lang}/clinics/${c.slug}`}>
                    <h3 className="text-xl md:text-2xl font-headline tracking-tight text-primary hover:underline decoration-1 underline-offset-4">
                      {c.name}
                    </h3>
                  </Link>
                  {c.rating != null && c.rating > 0 && (
                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      <span className="material-symbols-outlined text-base text-gold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold tracking-tighter">{c.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* City */}
                {c.city && (
                  <p className="text-xs text-on-surface-variant/60 uppercase tracking-widest mb-3">{c.city}</p>
                )}

                {/* Description */}
                {c.description && (
                  <p className="text-sm text-on-surface-variant mb-5 md:mb-6 leading-relaxed line-clamp-2">
                    {c.description.replace(/<[^>]*>/g, '').slice(0, 200)}
                  </p>
                )}

                {/* Specialty tags */}
                {c.specializations && c.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                    {c.specializations.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] uppercase tracking-wider px-3 py-1 bg-surface-container-low rounded-full text-on-surface-variant font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA button */}
                <Link
                  href={`/${lang}/clinics/${c.slug}`}
                  className="block w-full py-3.5 md:py-4 rounded-xl border border-outline-variant/30 text-center text-xs uppercase tracking-[0.2em] font-bold hover:bg-primary hover:text-white transition-all duration-300"
                >
                  {t.requestConsultation[lang]}
                </Link>
              </div>
            );
          })}
        </section>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <section className="flex flex-col items-center gap-5 md:gap-6 pb-20 md:pb-24 border-t border-outline-variant/10 pt-12 md:pt-16">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-outline-variant/20 flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-1.5 md:gap-2">
              {getPageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="mx-1 md:mx-2 text-outline">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p as number)}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentPage === p
                        ? 'bg-primary text-on-primary font-bold'
                        : 'hover:bg-surface-container-high cursor-pointer'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-outline-variant/20 flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <p className="text-xs uppercase tracking-widest text-outline">
            {t.page[lang]} {currentPage} / {totalPages}
          </p>
        </section>
      )}

      {/* ── Mobile Bottom Nav ── */}
      <div className="md:hidden bg-primary-container fixed bottom-0 left-0 right-0 z-50 rounded-t-[24px] shadow-[0_-4px_40px_rgba(27,28,27,0.08)] h-20 px-6 pb-safe flex justify-around items-center">
        <a href="tel:" className="flex flex-col items-center justify-center text-white gap-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
          <span className="text-[10px] uppercase tracking-widest">{t.callNow[lang]}</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-white/70 gap-1">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="text-[10px] uppercase tracking-widest">{t.message[lang]}</span>
        </a>
      </div>
    </>
  );
}
