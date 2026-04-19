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
  phones?: string[];
}

const PER_PAGE = 12;

const t = {
  searchPlaceholder: { ua: 'Пошук за спеціальністю чи містом…', en: 'Search by specialty or city…' },
  specialty: { ua: 'Спеціалізація', en: 'Specialty' },
  region: { ua: 'Регіон', en: 'Region' },
  all: { ua: 'Усі', en: 'All' },
  primeSelection: { ua: 'Обрано експертами', en: 'Prime Selection' },
  exploreInstitution: { ua: 'Детальніше', en: 'Explore Institution' },
  patientScore: { ua: 'Оцінка пацієнтів', en: 'Patient Score' },
  topRated: { ua: 'Топ рейтинг', en: 'Top Rated' },
  viewProfile: { ua: 'Переглянути профіль', en: 'View Profile' },
  noResults: { ua: 'Клінік не знайдено за вашим запитом.', en: 'No clinics found matching your criteria.' },
  page: { ua: 'Сторінка', en: 'Page' },
  conciergeTitle: { ua: 'Не знайшли потрібну', en: "Can't find the right" },
  conciergeTitleItalic: { ua: 'установу?', en: 'institution?' },
  conciergeDesc: {
    ua: 'Наша команда консьєржів проведе персональне дослідження для складних медичних випадків, що потребують міжнародної експертизи.',
    en: 'Our concierge team provides personalized research for complex medical cases requiring specific international expertise.',
  },
  emailPlaceholder: { ua: 'Ваша email адреса', en: 'Your email address' },
  requestConcierge: { ua: 'Запит консьєржу', en: 'Request Concierge' },
  quoteText: {
    ua: '«Золотий стандарт європейської онкології та постопераційного відновлення.»',
    en: '\u201CThe gold standard in European oncology and post-operative recovery.\u201D',
  },
  quoteAuthor: { ua: '— Медична рецензійна рада', en: '— Medical Review Board' },
};

const firstImage = (c: Clinic) => c.images?.find((i) => i.url)?.url || null;

export function ClinicsDirectory({ clinics, lang, phones }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [page, setPage] = useState(1);

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
      if (q && !c.name.toLowerCase().includes(q) && !c.specializations?.some((s) => s.toLowerCase().includes(q)) && !c.city?.toLowerCase().includes(q)) return false;
      if (selectedCountry && c.country !== selectedCountry) return false;
      if (selectedSpec && !c.specializations?.includes(selectedSpec)) return false;
      return true;
    });
    result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return result;
  }, [clinics, search, selectedCountry, selectedSpec]);

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  const totalPages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = rest.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 600, behavior: 'smooth' });
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

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

  return (
    <>
      {/* ── Search & Filter Bar ── */}
      <section className="mb-16">
        <div className="bg-white rounded-2xl p-3 flex flex-col lg:flex-row items-center gap-4 shadow-soft border border-black/5">
          <div className="relative flex-grow w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-4 text-on-surface font-label text-sm placeholder:text-outline-variant focus:ring-1 focus:ring-secondary/20 outline-none"
              placeholder={t.searchPlaceholder[lang]}
            />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-48">
              <select
                value={selectedSpec}
                onChange={(e) => { setSelectedSpec(e.target.value); setPage(1); }}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-4 text-on-surface font-label text-sm appearance-none focus:ring-1 focus:ring-secondary/20 outline-none"
              >
                <option value="">{t.specialty[lang]}</option>
                {specializations.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="relative w-full lg:w-48">
              <select
                value={selectedCountry}
                onChange={(e) => { setSelectedCountry(e.target.value); setPage(1); }}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-4 text-on-surface font-label text-sm appearance-none focus:ring-1 focus:ring-secondary/20 outline-none"
              >
                <option value="">{t.region[lang]}</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => { setSearch(''); setSelectedCountry(''); setSelectedSpec(''); setPage(1); }}
              className="bg-primary text-white p-4 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
              title={lang === 'ua' ? 'Скинути фільтри' : 'Clear filters'}
            >
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">search_off</span>
          <p className="text-lg text-on-surface-variant">{t.noResults[lang]}</p>
        </div>
      ) : (
        <>
          {/* ── Featured Clinic ── */}
          {featured && (
            <section className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 relative">
                <div className="overflow-hidden rounded-2xl h-[340px] md:h-[500px] bg-surface-container-low">
                  {firstImage(featured) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={featured.name}
                      src={firstImage(featured)!}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-7xl text-on-primary-container/30">local_hospital</span>
                    </div>
                  )}
                </div>
                {/* Floating quote card */}
                <div className="absolute -bottom-8 -right-8 bg-tertiary-container text-white p-8 rounded-xl max-w-xs shadow-xl hidden md:block">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-secondary-fixed">star_rate</span>
                    <span className="font-label font-bold tracking-[0.2em] text-[10px] uppercase opacity-90">
                      {t.primeSelection[lang]}
                    </span>
                  </div>
                  <p className="font-headline text-lg italic mb-2 opacity-95">{t.quoteText[lang]}</p>
                  <span className="text-[9px] font-label tracking-[0.25em] uppercase opacity-70">{t.quoteAuthor[lang]}</span>
                </div>
              </div>

              <div className="lg:col-span-5 pl-0 lg:pl-12">
                {(featured.city || featured.country) && (
                  <span className="text-secondary font-label tracking-[0.25em] text-[10px] font-bold uppercase mb-4 block">
                    {[featured.city, featured.country].filter(Boolean).join(', ')}
                  </span>
                )}
                <h2 className="font-headline text-3xl md:text-4xl text-primary mb-6">{featured.name}</h2>

                {featured.specializations && featured.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-8">
                    {featured.specializations.map((s) => (
                      <span key={s} className="px-3 py-1 bg-surface-container-high rounded-full text-[9px] font-label font-bold tracking-[0.2em] uppercase text-on-surface-variant">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {featured.description && (
                  <p className="text-on-surface-variant font-light mb-10 leading-relaxed">
                    {stripHtml(featured.description).slice(0, 250)}
                  </p>
                )}

                <div className="flex items-center gap-8 border-t border-outline-variant/20 pt-8">
                  {featured.rating != null && featured.rating > 0 && (
                    <div>
                      <div className="text-2xl font-headline text-primary">{featured.rating.toFixed(1)}</div>
                      <div className="text-[9px] font-label tracking-[0.2em] uppercase text-outline font-bold">
                        {t.patientScore[lang]}
                      </div>
                    </div>
                  )}
                  <Link
                    href={`/${lang}/clinics/${featured.slug}`}
                    className="ml-auto flex items-center gap-2 text-secondary font-label font-bold tracking-[0.2em] text-[10px] uppercase group"
                  >
                    {t.exploreInstitution[lang]}
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ── Directory Grid ── */}
          {paged.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {paged.map((c) => {
                const imgUrl = firstImage(c);
                return (
                  <div key={c.id} className="clinic-card p-4">
                    <Link href={`/${lang}/clinics/${c.slug}`} className="block relative overflow-hidden rounded-lg aspect-[16/11] mb-6">
                      {imgUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={c.name}
                          src={imgUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center">
                          <span className="material-symbols-outlined text-5xl text-on-primary-container/30">local_hospital</span>
                        </div>
                      )}
                      {c.rating != null && c.rating > 0 && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md shadow-sm">
                          <span className="text-[9px] font-label font-extrabold tracking-[0.25em] uppercase text-primary">
                            {t.topRated[lang]}
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="flex justify-between items-start mb-2 px-2">
                      <Link href={`/${lang}/clinics/${c.slug}`}>
                        <h3 className="font-headline text-2xl text-primary hover:underline decoration-1 underline-offset-4">{c.name}</h3>
                      </Link>
                      {c.rating != null && c.rating > 0 && (
                        <div className="flex items-center text-secondary shrink-0 ml-2">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-xs font-label font-bold ml-1">{c.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {(c.city || c.country) && (
                      <div className="px-2 mb-4">
                        <div className="text-[10px] font-label tracking-[0.2em] uppercase text-on-surface-variant flex items-center gap-2 font-bold">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          {[c.city, c.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    )}

                    {c.description && (
                      <p className="text-on-surface-variant text-sm font-light mb-6 px-2 line-clamp-2">
                        {stripHtml(c.description).slice(0, 160)}
                      </p>
                    )}

                    <div className="mt-auto px-2 pb-2">
                      {c.specializations && c.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {c.specializations.slice(0, 3).map((s) => (
                            <span key={s} className="text-[9px] font-label tracking-[0.15em] font-bold uppercase text-outline border-b border-outline-variant/30 pb-0.5">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      <Link
                        href={`/${lang}/clinics/${c.slug}`}
                        className="block w-full py-3 bg-surface-container-low hover:bg-surface-container-high text-primary font-label text-[10px] font-extrabold tracking-[0.2em] uppercase rounded-lg transition-colors text-center"
                      >
                        {t.viewProfile[lang]}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <section className="flex flex-col items-center gap-5 pb-20 border-t border-outline-variant/10 pt-12">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-outline-variant/20 flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex items-center gap-1.5">
                  {getPageNumbers().map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="mx-2 text-outline">&hellip;</span>
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
        </>
      )}

      {/* ── Concierge CTA ── */}
      <section className="mt-32">
        <div className="bg-primary text-white rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
          <div className="lg:w-1/2 p-12 lg:p-20">
            <h2 className="font-headline text-3xl md:text-4xl mb-6 text-white/95">
              {t.conciergeTitle[lang]}{' '}
              <i className="font-normal opacity-70">{t.conciergeTitleItalic[lang]}</i>
            </h2>
            <p className="text-white/80 font-light text-lg mb-10 leading-relaxed">
              {t.conciergeDesc[lang]}
            </p>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className="bg-white/10 border border-white/20 rounded-lg px-6 py-4 flex-grow font-label placeholder:text-white/40 focus:ring-1 focus:ring-white/40 outline-none text-white"
                placeholder={t.emailPlaceholder[lang]}
              />
              <button
                type="submit"
                className="bg-secondary text-white font-label font-bold tracking-[0.2em] text-[11px] uppercase px-10 py-4 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                {t.requestConcierge[lang]}
              </button>
            </form>
          </div>
          <div className="lg:w-1/2 relative h-64 lg:h-auto bg-primary-container/20">
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-8xl text-white/10">support_agent</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
