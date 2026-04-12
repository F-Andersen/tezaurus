import Link from 'next/link';

type Lang = 'ua' | 'en';

interface Settings {
  phones?: string[];
  contacts?: Record<string, string>;
  messengers?: Record<string, string>;
  [key: string]: unknown;
}

export function Footer({ lang, settings }: { lang: Lang; settings: Settings }) {
  const phones = (settings.phones as string[] | undefined) ?? [];
  const contacts = (settings.contacts as Record<string, string> | undefined) ?? {};
  const messengers = (settings.messengers as Record<string, string> | undefined) ?? {};

  const serviceLinks = [
    { href: '/services', labelUa: 'Послуги', labelEn: 'Services' },
    { href: '/clinics', labelUa: 'Клініки', labelEn: 'Clinics' },
    { href: '/blog', labelUa: 'Блог', labelEn: 'Blog' },
    { href: '/about', labelUa: 'Про нас', labelEn: 'About' },
    { href: '/contacts', labelUa: 'Контакти', labelEn: 'Contacts' },
  ];

  const legalLinks = [
    { href: '/privacy', labelUa: 'Конфіденційність', labelEn: 'Privacy Policy' },
    { href: '/cookies', labelUa: 'Cookies', labelEn: 'Cookies' },
    { href: '/medical-disclaimer', labelUa: 'Медичний дисклеймер', labelEn: 'Medical Disclaimer' },
  ];

  return (
    <footer className="bg-surface-container-low w-full pt-20 pb-10">
      <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-headline text-xl italic text-primary block mb-4">
              TEZAURUS·TOUR
            </span>
            <p className="text-sm leading-relaxed text-on-surface/50 max-w-xs">
              {lang === 'ua'
                ? 'Преміальний медичний туризм та оздоровчі подорожі найвищого рівня.'
                : 'Premium medical tourism and wellness journeys of the highest caliber.'}
            </p>
            {Object.entries(messengers).length > 0 && (
              <div className="flex gap-4 mt-6">
                {Object.entries(messengers).map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-on-surface/40 text-sm hover:text-primary transition-colors"
                  >
                    {name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Explore */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-3">
              {lang === 'ua' ? 'Навігація' : 'Explore'}
            </h4>
            {serviceLinks.map((l) => (
              <Link
                key={l.href}
                href={`/${lang}${l.href}`}
                className="text-sm text-on-surface/50 hover:text-primary transition-colors"
              >
                {lang === 'ua' ? l.labelUa : l.labelEn}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-3">
              {lang === 'ua' ? 'Правова інформація' : 'Legal'}
            </h4>
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={`/${lang}${l.href}`}
                className="text-sm text-on-surface/50 hover:text-primary transition-colors"
              >
                {lang === 'ua' ? l.labelUa : l.labelEn}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-3">
              {lang === 'ua' ? 'Контакти' : 'Contact'}
            </h4>
            {phones.map((p) => (
              <a
                key={p}
                href={`tel:${p.replace(/\s/g, '')}`}
                className="text-lg font-medium text-primary"
              >
                {p}
              </a>
            ))}
            {contacts.email && (
              <a href={`mailto:${contacts.email}`} className="text-sm text-on-surface/50 hover:text-primary transition-colors">
                {contacts.email}
              </a>
            )}
            {contacts.address && (
              <p className="text-sm text-on-surface/40 leading-relaxed mt-2">
                {contacts.address}
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline-variant/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-on-surface/40">
            © {new Date().getFullYear()} TEZAURUS-TOUR. {lang === 'ua' ? 'Всі права захищено.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-2 text-xs tracking-widest uppercase">
            <Link href="/ua" className={`${lang === 'ua' ? 'text-primary font-bold' : 'text-on-surface/40'} transition-colors`}>
              UA
            </Link>
            <span className="text-outline-variant/40">·</span>
            <Link href="/en" className={`${lang === 'en' ? 'text-primary font-bold' : 'text-on-surface/40'} transition-colors`}>
              EN
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
