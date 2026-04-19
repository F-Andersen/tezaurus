'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

type Lang = 'ua' | 'en';

interface Settings {
  phones?: string[];
  messengers?: Record<string, string>;
  [key: string]: unknown;
}

const nav: { href: string; labelUa: string; labelEn: string }[] = [
  { href: '/', labelUa: 'Головна', labelEn: 'Home' },
  { href: '/services', labelUa: 'Пакети', labelEn: 'Packages' },
  { href: '/clinics', labelUa: 'Клініки', labelEn: 'Clinics' },
  { href: '/blog', labelUa: 'Блог', labelEn: 'Blog' },
  { href: '/about', labelUa: 'Про нас', labelEn: 'About' },
  { href: '/contacts', labelUa: 'Контакти', labelEn: 'Contact' },
];

function getLangSwitchHref(pathname: string, target: Lang) {
  const parts = pathname.split('/');
  parts[1] = target;
  return parts.join('/') || `/${target}`;
}

export function Header({ lang, settings }: { lang: Lang; settings: Settings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phone = settings.phones?.[0];

  const isActive = (href: string) => {
    if (href === '/') return pathname === `/${lang}` || pathname === `/${lang}/`;
    return pathname.startsWith(`/${lang}${href}`);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 glass-nav ${
        scrolled ? 'shadow-sm shadow-primary/5' : ''
      }`}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <Link
          href={`/${lang}`}
          className="font-headline italic text-2xl text-primary tracking-tight"
        >
          TEZAURUS·TOUR
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href === '/' ? `/${lang}` : `/${lang}${item.href}`}
              className={`text-[11px] font-label font-semibold uppercase tracking-[0.15em] pb-1 transition-all duration-200 ${
                isActive(item.href)
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-on-surface/60 hover:text-primary border-b-2 border-transparent'
              }`}
            >
              {lang === 'ua' ? item.labelUa : item.labelEn}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="hidden xl:block text-[11px] font-label font-medium tracking-wide text-on-surface/60 hover:text-primary transition-colors"
            >
              {phone}
            </a>
          )}

          <div className="hidden md:flex items-center text-[10px] tracking-[0.15em] uppercase text-on-surface-variant font-semibold">
            <Link
              href={getLangSwitchHref(pathname, 'ua')}
              className={lang === 'ua' ? 'text-primary' : 'hover:text-primary transition-colors'}
            >
              UA
            </Link>
            <span className="mx-1.5 opacity-30">/</span>
            <Link
              href={getLangSwitchHref(pathname, 'en')}
              className={lang === 'en' ? 'text-primary' : 'hover:text-primary transition-colors'}
            >
              EN
            </Link>
          </div>

          <Link
            href={`/${lang}/contacts`}
            className="hidden md:inline-flex btn-primary !py-2.5 !px-6 !text-xs"
          >
            {lang === 'ua' ? '+1 800 MEDICAL' : '+1 800 MEDICAL'}
          </Link>

          <button
            className="lg:hidden p-1 text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl px-6 pb-8 pt-4" style={{ borderTop: '1px solid rgba(32,48,51,0.08)' }}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href === '/' ? `/${lang}` : `/${lang}${item.href}`}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 font-label text-sm uppercase tracking-[0.1em] ${
                isActive(item.href) ? 'text-secondary font-bold' : 'text-on-surface/70'
              }`}
              style={{ borderBottom: '1px solid rgba(32,48,51,0.06)' }}
            >
              {lang === 'ua' ? item.labelUa : item.labelEn}
            </Link>
          ))}
          <div className="flex items-center gap-4 mt-6">
            <Link
              href={getLangSwitchHref(pathname, 'ua')}
              className={`text-sm tracking-widest uppercase ${lang === 'ua' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
              onClick={() => setMobileOpen(false)}
            >
              UA
            </Link>
            <span className="text-outline-variant">|</span>
            <Link
              href={getLangSwitchHref(pathname, 'en')}
              className={`text-sm tracking-widest uppercase ${lang === 'en' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
              onClick={() => setMobileOpen(false)}
            >
              EN
            </Link>
          </div>
          {phone && (
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="block mt-4 text-primary font-semibold text-lg">
              {phone}
            </a>
          )}
          <Link
            href={`/${lang}/contacts`}
            className="btn-primary mt-6 justify-center w-full"
            onClick={() => setMobileOpen(false)}
          >
            {lang === 'ua' ? 'Консультація' : 'Consultation'}
          </Link>
        </div>
      )}
    </header>
  );
}
