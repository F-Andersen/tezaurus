'use client';

import { useState, useMemo } from 'react';
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
  searchPlaceholder: { ua: 'Пошук за назвою чи напрямком…', en: 'Search by name or destination…' },
  category: { ua: 'Категорія', en: 'Category' },
  destination: { ua: 'Напрямок', en: 'Destination' },
  all: { ua: 'Усі', en: 'All' },
  showing: { ua: 'Показано', en: 'Showing' },
  of: { ua: 'з', en: 'of' },
  packages: { ua: 'ексклюзивних пакетів', en: 'bespoke packages' },
  sortBy: { ua: 'Сортування:', en: 'Sort by:' },
  newestFirst: { ua: 'За замовчуванням', en: 'Default' },
  priceAsc: { ua: 'Ціна: від дешевих', en: 'Price: Low to High' },
  priceDesc: { ua: 'Ціна: від дорогих', en: 'Price: High to Low' },
  nameSort: { ua: 'За назвою', en: 'Name A–Z' },
  investmentFrom: { ua: 'Вартість від', en: 'Investment from' },
  freeConsultation: { ua: 'Безкоштовна консультація', en: 'Free Consultation' },
  noResults: { ua: 'Послуг не знайдено за вашим запитом.', en: 'No services found matching your criteria.' },
  featured: { ua: 'Рекомендовано', en: 'Featured' },
} satisfies Record<string, Record<'ua' | 'en', string>>;

type SortType = 'default' | 'priceAsc' | 'priceDesc' | 'name';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1540555700478-4be289fbec6f?w=800&q=80';

export function ServicesDirectory({ services, lang }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [showCategoryDD, setShowCategoryDD] = useState(false);
  const [showCountryDD, setShowCountryDD] = useState(false);
  const [showSortDD, setShowSortDD] = useState(false);

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
    const q = search.toLowerCase().trim();
    let result = services.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.country?.toLowerCase().includes(q) && !s.city?.toLowerCase().includes(q) && !s.tags.some((tag) => tag.toLowerCase().includes(q))) return false;
      if (selectedCategory && s.category !== selectedCategory) return false;
      if (selectedCountry && s.country !== selectedCountry) return false;
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
  }, [services, search, selectedCategory, selectedCountry, sortBy]);

  const sortLabel = { default: t.newestFirst, priceAsc: t.priceAsc, priceDesc: t.priceDesc, name: t.nameSort }[sortBy];

  return (
    <>
      {/* Search & Filter Bar */}
      <section className="sticky top-0 z-40 mb-12 md:mb-16">
        <div className="bg-surface-container-lowest/80 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-3 md:gap-4">
          <div className="flex-1 w-full relative">
            <span className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 md:pl-14 pr-5 md:pr-6 focus:ring-1 focus:ring-primary/20 focus:outline-none text-on-surface placeholder:text-outline-variant font-body text-sm md:text-base"
              placeholder={t.searchPlaceholder[lang]}
            />
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            {/* Category dropdown */}
            <div className="relative flex-1 md:flex-initial">
              <button
                onClick={() => { setShowCategoryDD(!showCategoryDD); setShowCountryDD(false); setShowSortDD(false); }}
                className="flex items-center justify-between gap-2 md:gap-4 px-4 md:px-6 py-3.5 md:py-4 bg-surface-container-low rounded-xl md:rounded-2xl w-full md:min-w-[180px] hover:bg-surface-container-high transition-colors"
              >
                <span className="text-sm font-medium truncate">
                  {selectedCategory ? (categoryLabels[selectedCategory]?.[lang] || selectedCategory) : t.category[lang]}
                </span>
                <span className="material-symbols-outlined text-outline text-lg">expand_more</span>
              </button>
              {showCategoryDD && (
                <div className="absolute top-full left-0 mt-2 w-full md:w-64 bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-50 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedCategory(''); setShowCategoryDD(false); }}
                    className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${!selectedCategory ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                  >
                    {t.all[lang]}
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setSelectedCategory(c); setShowCategoryDD(false); }}
                      className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${selectedCategory === c ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                    >
                      {categoryLabels[c]?.[lang] || c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Country dropdown */}
            <div className="relative flex-1 md:flex-initial">
              <button
                onClick={() => { setShowCountryDD(!showCountryDD); setShowCategoryDD(false); setShowSortDD(false); }}
                className="flex items-center justify-between gap-2 md:gap-4 px-4 md:px-6 py-3.5 md:py-4 bg-surface-container-low rounded-xl md:rounded-2xl w-full md:min-w-[180px] hover:bg-surface-container-high transition-colors"
              >
                <span className="text-sm font-medium truncate">{selectedCountry || t.destination[lang]}</span>
                <span className="material-symbols-outlined text-outline text-lg">expand_more</span>
              </button>
              {showCountryDD && (
                <div className="absolute top-full left-0 mt-2 w-full md:w-64 bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-50 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedCountry(''); setShowCountryDD(false); }}
                    className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${!selectedCountry ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                  >
                    {t.all[lang]}
                  </button>
                  {countries.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setSelectedCountry(c); setShowCountryDD(false); }}
                      className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${selectedCountry === c ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Clear filters */}
            <button
              onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedCountry(''); setSortBy('default'); }}
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
            <span className="text-primary font-semibold">{filtered.length} {t.of[lang]} {services.length}</span>{' '}
            {t.packages[lang]}
          </div>
          <div className="relative flex items-center gap-3 md:gap-4">
            <span className="hidden md:inline text-xs uppercase tracking-widest text-outline">{t.sortBy[lang]}</span>
            <button
              onClick={() => { setShowSortDD(!showSortDD); setShowCategoryDD(false); setShowCountryDD(false); }}
              className="text-sm font-semibold flex items-center gap-1"
            >
              {sortLabel[lang]}
              <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
            </button>
            {showSortDD && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-50">
                {(['default', 'priceAsc', 'priceDesc', 'name'] as SortType[]).map((s) => {
                  const label = { default: t.newestFirst, priceAsc: t.priceAsc, priceDesc: t.priceDesc, name: t.nameSort }[s];
                  return (
                    <button
                      key={s}
                      onClick={() => { setSortBy(s); setShowSortDD(false); }}
                      className={`w-full text-left px-5 py-2.5 text-sm hover:bg-surface-container-low transition-colors ${sortBy === s ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}
                    >
                      {label[lang]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Service Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">search_off</span>
          <p className="text-lg text-on-surface-variant">{t.noResults[lang]}</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 lg:gap-y-20 gap-x-8 lg:gap-x-12 mb-20 lg:mb-24">
          {filtered.map((svc) => (
            <Link key={svc.id} href={`/${lang}/#request-form`} className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-xl aspect-[4/5] mb-6 lg:mb-8 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={svc.imageUrl || PLACEHOLDER_IMG}
                  alt={svc.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {svc.featured && (
                  <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-label text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                      {t.featured[lang]}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-3 lg:space-y-4">
                <div>
                  {svc.category && (
                    <p className="font-label text-[11px] uppercase tracking-[0.2em] font-bold text-secondary mb-1">
                      {categoryLabels[svc.category]?.[lang] || svc.category}
                    </p>
                  )}
                  <h3 className="font-headline text-2xl lg:text-3xl text-primary leading-tight group-hover:text-primary-container transition-colors">
                    {svc.name}
                  </h3>
                </div>
                {(svc.country || svc.city) && (
                  <div className="flex items-center text-on-surface-variant gap-2 text-sm">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    <span>{[svc.city, svc.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {svc.duration && (
                  <div className="flex items-center text-on-surface-variant gap-2 text-sm">
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    <span>{svc.duration}</span>
                  </div>
                )}
                <div className="pt-3 lg:pt-4 flex justify-between items-center border-t border-surface-container-highest">
                  {svc.priceFrom ? (
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                        {t.investmentFrom[lang]}
                      </span>
                      <span className="font-headline text-xl lg:text-2xl text-primary">
                        {svc.currency === 'EUR' ? '€' : '$'}{svc.priceFrom.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div />
                  )}
                  <span className="text-primary font-label text-xs font-bold tracking-[0.15em] uppercase border-b-2 border-transparent group-hover:border-primary transition-all pb-1">
                    {t.freeConsultation[lang]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </>
  );
}
