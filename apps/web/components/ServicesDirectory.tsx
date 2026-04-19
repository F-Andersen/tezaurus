'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string | null;
  country: string | null;
  city: string | null;
  priceFrom: number | null;
  currency: string;
  duration: string | null;
  imageUrl: string | null;
  tags: string[];
  featured: boolean;
}

interface Props {
  services: ServiceItem[];
  lang: 'ua' | 'en';
}

const categoryLabels: Record<string, Record<'ua' | 'en', string>> = {
  diagnostics: { ua: 'Діагностика', en: 'Diagnostics' },
  treatment: { ua: 'Лікування', en: 'Treatment' },
  rehabilitation: { ua: 'Реабілітація', en: 'Rehabilitation' },
  wellness: { ua: 'Wellness', en: 'Wellness' },
  dental: { ua: 'Стоматологія', en: 'Dental' },
  cosmetic: { ua: 'Косметологія', en: 'Cosmetic' },
  medical: { ua: 'Медицина', en: 'Medical' },
};

const t = {
  treatmentType: { ua: 'Тип лікування', en: 'Treatment Type' },
  allSpecializations: { ua: 'Усі спеціалізації', en: 'All Specializations' },
  destination: { ua: 'Напрямок', en: 'Destination' },
  globalLocations: { ua: 'Усі локації', en: 'Global Locations' },
  budgetRange: { ua: 'Бюджет', en: 'Budget Range' },
  selectRange: { ua: 'Оберіть діапазон', en: 'Select Range' },
  findPackages: { ua: 'Знайти пакети', en: 'Find Packages' },
  startingFrom: { ua: 'Вартість від', en: 'Starting from' },
  details: { ua: 'Детальніше', en: 'Details' },
  showing: { ua: 'Показано', en: 'Showing' },
  ofPackages: { ua: 'пакетів', en: 'Packages' },
  of: { ua: 'з', en: 'of' },
  sortBy: { ua: 'Сортування:', en: 'Sort By:' },
  mostRelevant: { ua: 'За замовчуванням', en: 'Most Relevant' },
  priceLowHigh: { ua: 'Ціна: від дешевих', en: 'Price: Low → High' },
  priceHighLow: { ua: 'Ціна: від дорогих', en: 'Price: High → Low' },
  nameAZ: { ua: 'За назвою', en: 'Name A–Z' },
  featured: { ua: 'Рекомендовано', en: 'Featured' },
  noResults: { ua: 'Послуг не знайдено за вашим запитом.', en: 'No services found matching your criteria.' },
  conciergeQuote: {
    ua: '\u201CСправжня розкіш — це не лише місце призначення, а абсолютний спокій під час відновлення.\u201D',
    en: '\u201CTrue luxury is not just the destination, but the absolute peace of mind during recovery.\u201D',
  },
  conciergeLabel: { ua: 'Обіцянка Куратора', en: 'The Curator\u2019s Promise' },
  conciergeBody: {
    ua: 'Замовте індивідуальний маршрут у наших лікарів.',
    en: 'Request a bespoke itinerary from our clinicians.',
  },
  conciergeButton: { ua: 'Персональна консультація', en: 'Personal Consultation' },
} satisfies Record<string, Record<'ua' | 'en', string>>;

type SortType = 'default' | 'priceAsc' | 'priceDesc' | 'name';
type BudgetRange = '' | '5000-15000' | '15000-30000' | '30000+';

const ITEMS_PER_PAGE = 9;
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1540555700478-4be289fbec6f?w=800&q=80';

function getPageNumbers(current: number, total: number): (number | 'dots')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'dots')[] = [1];
  if (current > 3) pages.push('dots');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('dots');
  pages.push(total);
  return pages;
}

export function ServicesDirectory({ services, lang }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange>('');
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCountry, selectedBudget, sortBy]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => { if (s.category) set.add(s.category); });
    return Array.from(set).sort();
  }, [services]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => { if (s.country) set.add(s.country); });
    return Array.from(set).sort();
  }, [services]);

  const filtered = useMemo(() => {
    let result = services.filter((s) => {
      if (selectedCategory && s.category !== selectedCategory) return false;
      if (selectedCountry && s.country !== selectedCountry) return false;
      if (selectedBudget) {
        const price = s.priceFrom;
        if (price === null) return false;
        if (selectedBudget === '5000-15000' && (price < 5000 || price > 15000)) return false;
        if (selectedBudget === '15000-30000' && (price < 15000 || price > 30000)) return false;
        if (selectedBudget === '30000+' && price < 30000) return false;
      }
      return true;
    });
    switch (sortBy) {
      case 'priceAsc':
        result = [...result].sort((a, b) => (a.priceFrom ?? Infinity) - (b.priceFrom ?? Infinity));
        break;
      case 'priceDesc':
        result = [...result].sort((a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0));
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  }, [services, selectedCategory, selectedCountry, selectedBudget, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const showStart = filtered.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const showEnd = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <>
      {/* ── Filter Bar ── */}
      <div className="sticky top-28 z-40 bg-white/90 backdrop-blur-md rounded-xl p-6 package-card-shadow mb-16 flex flex-wrap items-end gap-8" style={{ border: '1px solid rgba(32,48,51,0.10)' }}>
        {/* Treatment Type */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-label tracking-[0.2em] text-on-surface-variant uppercase mb-3 px-1">
            {t.treatmentType[lang]}
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-surface-container-low border-none rounded-lg px-4 py-3 text-xs font-label tracking-wider focus:ring-2 focus:ring-primary/10 focus:outline-none cursor-pointer"
            >
              <option value="">{t.allSpecializations[lang]}</option>
              {categories.map((c) => (
                <option key={c} value={c}>{categoryLabels[c]?.[lang] || c}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">expand_more</span>
          </div>
        </div>

        {/* Destination */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-label tracking-[0.2em] text-on-surface-variant uppercase mb-3 px-1">
            {t.destination[lang]}
          </label>
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full appearance-none bg-surface-container-low border-none rounded-lg px-4 py-3 text-xs font-label tracking-wider focus:ring-2 focus:ring-primary/10 focus:outline-none cursor-pointer"
            >
              <option value="">{t.globalLocations[lang]}</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">expand_more</span>
          </div>
        </div>

        {/* Budget Range */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-label tracking-[0.2em] text-on-surface-variant uppercase mb-3 px-1">
            {t.budgetRange[lang]}
          </label>
          <div className="relative">
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value as BudgetRange)}
              className="w-full appearance-none bg-surface-container-low border-none rounded-lg px-4 py-3 text-xs font-label tracking-wider focus:ring-2 focus:ring-primary/10 focus:outline-none cursor-pointer"
            >
              <option value="">{t.selectRange[lang]}</option>
              <option value="5000-15000">$5,000 – $15,000</option>
              <option value="15000-30000">$15,000 – $30,000</option>
              <option value="30000+">$30,000+</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">expand_more</span>
          </div>
        </div>

        {/* Find Packages */}
        <button
          onClick={() => setCurrentPage(1)}
          className="bg-primary text-white h-[44px] px-8 rounded-lg font-label text-[11px] tracking-[0.2em] uppercase hover:bg-secondary transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">search</span>
          {t.findPackages[lang]}
        </button>
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">search_off</span>
          <p className="text-lg text-on-surface-variant">{t.noResults[lang]}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paginated.map((svc) => (
              <Link
                key={svc.id}
                href={`/${lang}/services/${svc.slug}`}
                className="group bg-white rounded-lg p-5 package-card-shadow transition-all duration-300 hover:-translate-y-1 flex flex-col"
                style={{
                  border: '1px solid rgba(32,48,51,0.10)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(49,132,145,0.35)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(32,48,51,0.10)'; }}
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={svc.imageUrl || PLACEHOLDER_IMG}
                    alt={svc.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {svc.featured && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] font-label tracking-[0.2em] text-primary font-bold uppercase">
                      {t.featured[lang]}
                    </div>
                  )}
                  {svc.category && !svc.featured && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] font-label tracking-[0.2em] text-primary font-bold uppercase">
                      {categoryLabels[svc.category]?.[lang] || svc.category}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow">
                  {svc.country && (
                    <p className="text-[10px] font-label tracking-[0.2em] text-secondary uppercase mb-2">
                      {[svc.city, svc.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  <h3 className="font-headline text-xl text-primary leading-tight mb-4 group-hover:text-secondary transition-colors">
                    {svc.name}
                  </h3>
                  {svc.description && (
                    <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                      {svc.description}
                    </p>
                  )}

                  {/* Price + Details */}
                  <div className="flex items-center justify-between mt-auto pt-6" style={{ borderTop: '1px solid rgba(32,48,51,0.06)' }}>
                    <div>
                      {svc.priceFrom ? (
                        <>
                          <p className="text-[9px] font-label text-on-surface-variant uppercase tracking-[0.2em] mb-1">
                            {t.startingFrom[lang]}
                          </p>
                          <p className="text-xl font-headline text-primary">
                            {svc.currency === 'EUR' ? '€' : '$'}{svc.priceFrom.toLocaleString('en-US')}
                          </p>
                        </>
                      ) : (
                        <div />
                      )}
                    </div>
                    <span className="bg-surface-container-low text-primary px-5 py-3 rounded-lg font-label text-[10px] tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all">
                      {t.details[lang]}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Pagination & Sort ── */}
          {totalPages > 0 && (
            <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-8 pt-12" style={{ borderTop: '1px solid rgba(32,48,51,0.10)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-label tracking-[0.2em] text-on-surface-variant uppercase">
                  {t.showing[lang]}
                </span>
                <span className="text-sm font-label font-bold text-primary">
                  {String(showStart).padStart(2, '0')}&mdash;{String(showEnd).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-label tracking-[0.2em] text-on-surface-variant uppercase">
                  {t.of[lang]} {filtered.length} {t.ofPackages[lang]}
                </span>
              </div>

              <div className="flex items-center gap-12">
                {totalPages > 1 && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-30"
                      style={{ border: '1px solid rgba(32,48,51,0.10)' }}
                    >
                      <span className="material-symbols-outlined text-sm">west</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {pageNumbers.map((p, i) =>
                        p === 'dots' ? (
                          <span key={`dots-${i}`} className="px-2 text-outline-variant">&hellip;</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-label text-sm transition-all ${
                              currentPage === p
                                ? 'bg-primary text-white'
                                : 'text-on-surface-variant hover:bg-surface-container'
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-30"
                      style={{ border: '1px solid rgba(32,48,51,0.10)' }}
                    >
                      <span className="material-symbols-outlined text-sm">east</span>
                    </button>
                  </div>
                )}

                <div className="h-8 w-px bg-[rgba(32,48,51,0.10)] hidden md:block" />

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-label tracking-[0.2em] text-on-surface-variant uppercase">
                    {t.sortBy[lang]}
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortType)}
                      className="appearance-none bg-transparent font-label text-[10px] tracking-[0.2em] uppercase font-bold text-primary cursor-pointer pr-6 focus:outline-none"
                    >
                      <option value="default">{t.mostRelevant[lang]}</option>
                      <option value="priceAsc">{t.priceLowHigh[lang]}</option>
                      <option value="priceDesc">{t.priceHighLow[lang]}</option>
                      <option value="name">{t.nameAZ[lang]}</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-primary pointer-events-none text-xs">
                      keyboard_arrow_down
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Concierge CTA ── */}
      <div className="mt-32 bg-tertiary-container rounded-lg p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-editorial">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.03) 50%, transparent 75%)',
            backgroundSize: '250px 250px',
          }}
        />

        <div className="relative z-10 max-w-xl">
          <h2 className="font-headline text-2xl md:text-3xl text-white/[0.92] mb-6 italic leading-relaxed">
            {t.conciergeQuote[lang]}
          </h2>
          <p className="font-label text-[10px] tracking-[0.3em] text-white/70 uppercase">
            {t.conciergeLabel[lang]}
          </p>
        </div>

        <div className="relative z-10 text-center md:text-right">
          <p className="font-body text-white/[0.82] mb-8 text-lg">
            {t.conciergeBody[lang]}
          </p>
          <Link
            href={`/${lang}/contacts`}
            className="inline-block bg-secondary-container text-primary px-10 py-4 rounded-lg font-label text-[11px] tracking-[0.2em] uppercase hover:opacity-95 transition-all shadow-xl shadow-black/10"
          >
            {t.conciergeButton[lang]}
          </Link>
        </div>
      </div>
    </>
  );
}
