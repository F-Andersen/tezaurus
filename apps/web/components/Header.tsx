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
  { href: '/services', labelUa: 'Послуги', labelEn: 'Services' },
  { href: '/clinics', labelUa: 'Клініки', labelEn: 'Clinics' },
  { href: '/blog', labelUa: 'Блог', labelEn: 'Blog' },
  { href: '/about', labelUa: 'Про нас', labelEn: 'About' },
  { href: '/contacts', labelUa: 'Контакти', labelEn: 'Contacts' },
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

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]'
          : 'bg-background/80 backdrop-blur-xl'
      }`}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-10 lg:px-12 py-5 max-w-site mx-auto">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="font-headline italic text-2xl text-primary tracking-tight"
        >
          TEZAURUS·TOUR
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-10">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={`/${lang}${item.href}`}
              className={`font-headline text-lg tracking-tight transition-colors duration-300 ${
                pathname.startsWith(`/${lang}${item.href}`)
                  ? 'text-primary border-b border-primary/20 pb-1'
                  : 'text-on-surface/60 hover:text-primary'
              }`}
            >
              {lang === 'ua' ? item.labelUa : item.labelEn}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-6">
          {/* Lang switch */}
          <div className="hidden lg:flex items-center text-xs tracking-[0.15em] uppercase text-on-surface-variant font-medium">
            <Link
              href={getLangSwitchHref(pathname, 'ua')}
              className={lang === 'ua' ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}
            >
              UA
            </Link>
            <span className="mx-1.5 opacity-40">/</span>
            <Link
              href={getLangSwitchHref(pathname, 'en')}
              className={lang === 'en' ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}
            >
              EN
            </Link>
          </div>

          {/* CTA button */}
          <Link
            href={`/${lang}/#request-form`}
            className="hidden md:inline-flex btn-primary rounded-full shadow-lg shadow-primary/10"
          >
            {lang === 'ua' ? 'Консультація' : 'Consultation'}
          </Link>

          {/* Mobile burger */}
          <button
            className="md:hidden p-1"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant/10 px-6 pb-8 pt-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={`/${lang}${item.href}`}
              onClick={() => setMobileOpen(false)}
              className="block py-3 border-b border-surface-container-high font-headline text-lg text-on-surface-variant"
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
            href={`/${lang}/#request-form`}
            className="btn-primary rounded-full mt-6 justify-center w-full"
            onClick={() => setMobileOpen(false)}
          >
            {lang === 'ua' ? 'Консультація' : 'Consultation'}
          </Link>
        </div>
      )}
    </header>
  );
}
