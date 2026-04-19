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

  const quickLinks = [
    { href: '/services', labelUa: 'Каталог послуг', labelEn: 'Procedure Index' },
    { href: '/clinics', labelUa: 'Партнерські клініки', labelEn: 'Partner Clinics' },
    { href: '/about', labelUa: 'Про нас', labelEn: 'About Us' },
    { href: '/contacts', labelUa: 'Підтримка', labelEn: 'Contact Support' },
  ];

  const legalLinks = [
    { href: '/privacy', labelUa: 'Конфіденційність', labelEn: 'Privacy Policy' },
    { href: '/cookies', labelUa: 'Умови використання', labelEn: 'Terms of Service' },
    { href: '/medical-disclaimer', labelUa: 'Медичний дисклеймер', labelEn: 'Medical Disclaimer' },
    { href: '/contacts', labelUa: 'Контактна підтримка', labelEn: 'Contact Support' },
  ];

  return (
    <footer className="bg-primary w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="font-headline italic text-xl text-white block mb-4">
              TEZAURUS·TOUR
            </span>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {lang === 'ua'
                ? 'Преміальний медичний туризм та оздоровчі подорожі через глобальну мережу експертів.'
                : 'Elevating medical travel to a bespoke art form through global expertise and restorative luxury.'}
            </p>
            {phones.length > 0 && (
              <a
                href={`tel:${phones[0].replace(/\s/g, '')}`}
                className="block mt-4 text-sm font-medium"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {phones[0]}
              </a>
            )}
            {contacts.email && (
              <a
                href={`mailto:${contacts.email}`}
                className="block mt-1 text-sm footer-link"
              >
                {contacts.email}
              </a>
            )}
          </div>

          <div>
            <h4 className="label-uppercase text-white/50 mb-5">
              {lang === 'ua' ? 'Навігація' : 'Quick Links'}
            </h4>
            <div className="flex flex-col space-y-3">
              {quickLinks.map((l) => (
                <Link
                  key={l.href}
                  href={`/${lang}${l.href}`}
                  className="text-sm transition-colors footer-link"
                >
                  {lang === 'ua' ? l.labelUa : l.labelEn}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="label-uppercase text-white/50 mb-5">
              {lang === 'ua' ? 'Правова інформація' : 'Legal'}
            </h4>
            <div className="flex flex-col space-y-3">
              {legalLinks.map((l, i) => (
                <Link
                  key={i}
                  href={`/${lang}${l.href}`}
                  className="text-sm transition-colors footer-link"
                >
                  {lang === 'ua' ? l.labelUa : l.labelEn}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="label-uppercase text-white/50 mb-5">
              {lang === 'ua' ? 'Розсилка' : 'Newsletter'}
            </h4>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {lang === 'ua'
                ? 'Підпишіться на найсвіжіші новини та інновації в медичній сфері.'
                : 'Join our curated list for the latest breakthroughs in global medicine.'}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder={lang === 'ua' ? 'email адреса' : 'email address'}
                className="flex-1 py-2.5 px-0 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.20)' }}
              />
              <button className="text-white/60 hover:text-white transition-colors p-1">
                <span className="material-symbols-outlined text-lg">east</span>
              </button>
            </div>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
        >
          <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} TEZAURUS-TOUR. {lang === 'ua' ? 'Всі права захищено.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-6">
            {['Instagram', 'LinkedIn', 'Twitter'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[10px] uppercase tracking-[0.15em] transition-colors footer-social"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
