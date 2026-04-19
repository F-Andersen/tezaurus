import { getPage, getSettings } from '@/lib/api';
import { LeadForm } from '@/components/LeadForm';
import { CallbackForm } from '@/components/CallbackForm';
import type { Lang } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const page = await getPage('contacts', l);
  return {
    title: page?.metaTitle || (l === 'ua' ? 'Контакти — TEZAURUS-TOUR' : 'Contacts — TEZAURUS-TOUR'),
    description:
      page?.metaDescription ||
      (l === 'ua'
        ? 'Зв\'яжіться з TEZAURUS-TOUR — ваша подорож починається тут.'
        : 'Get in touch with TEZAURUS-TOUR — your journey starts here.'),
  };
}

export default async function ContactsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ subject?: string }>;
}) {
  const { lang } = await params;
  const { subject } = await searchParams;
  const l = lang as Lang;
  const [page, settings] = await Promise.all([getPage('contacts', l), getSettings()]);
  const phones = (settings.phones as string[] | undefined) ?? [];
  const contacts = (settings.contacts as Record<string, string> | undefined) ?? {};
  const messengers = (settings.messengers as Record<string, string> | undefined) ?? {};

  const defaultEmail = 'info@tezaurustour.com';
  const email = contacts.email || defaultEmail;

  return (
    <>
      {/* ── EDITORIAL HERO ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-12 md:pt-44 md:pb-16">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary-container/40 text-secondary font-bold font-label text-[10px] tracking-[0.2em] uppercase mb-8">
            {l === 'ua' ? 'Зв\'яжіться з нами' : 'Get in Touch'}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline text-primary leading-[1.1] mb-8">
            {l === 'ua' ? (
              <>Розпочніть вашу <span className="italic">подорож</span>.</>
            ) : (
              <>Begin Your <span className="italic">Journey</span>.</>
            )}
          </h1>
          <p className="text-lg md:text-xl font-light leading-relaxed max-w-2xl" style={{ color: 'rgba(32,48,51,0.85)' }}>
            {page?.content ||
              (l === 'ua'
                ? 'Проконсультуйтеся з нашою командою спеціалістів, щоб дізнатися, як ми можемо створити індивідуальний медичний маршрут саме для вас.'
                : 'Consult with our specialist team to discover how we can tailor a medical path specifically for you.')}
          </p>
        </div>
      </section>

      {/* ── CONTACT FORM + SIDEBAR ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <div className="grid lg:grid-cols-5 gap-16">
          {/* Left: Lead form (3 cols) */}
          <div className="lg:col-span-3 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-2xl shadow-primary/5 border border-surface-variant/40">
            <div className="mb-10">
              <h2 className="text-3xl font-headline text-primary mb-2">
                {l === 'ua' ? 'Залишити заявку' : 'Leave a Request'}
              </h2>
              <p className="text-sm font-light" style={{ color: 'rgba(32,48,51,0.85)' }}>
                {l === 'ua'
                  ? 'Наш куратор відповість на ваш запит протягом 4 робочих годин.'
                  : 'A dedicated curator will respond to your inquiry within 4 business hours.'}
              </p>
            </div>

            {subject && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">info</span>
                <p className="text-sm text-primary font-medium">
                  {l === 'ua' ? 'Запит щодо:' : 'Inquiry about:'}{' '}
                  <span className="font-bold">{subject}</span>
                </p>
              </div>
            )}

            <LeadForm lang={l} subject={subject} />
          </div>

          {/* Right: Contact sidebar (2 cols) */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h3 className="text-2xl font-headline text-primary mb-2">
                {l === 'ua' ? 'Контактна інформація' : 'Contact Details'}
              </h3>
              <p className="text-sm font-light" style={{ color: 'rgba(32,48,51,0.85)' }}>
                {l === 'ua'
                  ? 'Зв\'яжіться з нами будь-яким зручним способом.'
                  : 'Reach out through any of the channels below.'}
              </p>
            </div>

            {/* Office: London */}
            <div className="flex gap-6 group">
              <div className="w-14 h-14 flex-shrink-0 bg-primary-container rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-on-primary-container text-xl">apartment</span>
              </div>
              <div>
                <h4 className="font-bold text-primary tracking-[0.08em] text-[10px] uppercase mb-2">
                  {l === 'ua' ? 'Європейський хаб' : 'European Hub'}
                </h4>
                <p className="font-light text-sm" style={{ color: 'rgba(32,48,51,0.85)' }}>
                  54 Curzon Street, Mayfair<br />London, W1J 5FB, UK
                </p>
                <a href="tel:+442079460123" className="text-secondary text-sm mt-2 font-bold tracking-tight block hover:underline">
                  +44 20 7946 0123
                </a>
              </div>
            </div>

            {/* Office: Zurich */}
            <div className="flex gap-6 group">
              <div className="w-14 h-14 flex-shrink-0 bg-primary-container rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-on-primary-container text-xl">location_city</span>
              </div>
              <div>
                <h4 className="font-bold text-primary tracking-[0.08em] text-[10px] uppercase mb-2">
                  {l === 'ua' ? 'Центральний офіс' : 'Central Operations'}
                </h4>
                <p className="font-light text-sm" style={{ color: 'rgba(32,48,51,0.85)' }}>
                  Bahnhofstrasse 42<br />8001 Zurich, Switzerland
                </p>
                <a href="tel:+41442714440" className="text-secondary text-sm mt-2 font-bold tracking-tight block hover:underline">
                  +41 44 271 4440
                </a>
              </div>
            </div>

            {/* Phone from settings */}
            {phones.length > 0 && (
              <div className="flex gap-6 group">
                <div className="w-14 h-14 flex-shrink-0 bg-primary-container rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary-container text-xl">call</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary tracking-[0.08em] text-[10px] uppercase mb-2">
                    {l === 'ua' ? 'Телефон' : 'Direct Line'}
                  </h4>
                  {phones.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p.replace(/\s/g, '')}`}
                      className="block text-sm text-secondary font-bold tracking-tight hover:underline"
                    >
                      {p}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex gap-6 group">
              <div className="w-14 h-14 flex-shrink-0 bg-primary-container rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-on-primary-container text-xl">mail</span>
              </div>
              <div>
                <h4 className="font-bold text-primary tracking-[0.08em] text-[10px] uppercase mb-2">Email</h4>
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-secondary font-bold tracking-tight hover:underline"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Messengers */}
            {Object.entries(messengers).length > 0 && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-surface-variant">
                {Object.entries(messengers).map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] border border-primary/20 px-3 py-1.5 rounded-full bg-white/50 hover:border-secondary hover:text-secondary transition-colors"
                  >
                    {name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CALLBACK FORM ── */}
      <section className="bg-surface-container-low py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-secondary-container/40 text-secondary font-bold font-label text-[10px] tracking-[0.2em] uppercase mb-6">
                {l === 'ua' ? 'Швидкий зв\'язок' : 'Quick Connect'}
              </span>
              <h2 className="text-3xl md:text-4xl font-headline text-primary mb-6">
                {l === 'ua' ? (
                  <>Ми <span className="italic">зателефонуємо</span> вам</>
                ) : (
                  <>We&apos;ll <span className="italic">call</span> you back</>
                )}
              </h2>
              <p className="font-light leading-relaxed max-w-md" style={{ color: 'rgba(32,48,51,0.85)' }}>
                {l === 'ua'
                  ? 'Залиште свій номер і наш медичний консьєрж зв\'яжеться з вами у найкоротший термін.'
                  : 'Leave your number and our medical concierge will reach out at the earliest convenience.'}
              </p>
            </div>
            <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-2xl shadow-primary/5 border border-surface-variant/40">
              <CallbackForm lang={l} />
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP / LOCATION ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Map placeholder */}
          <div className="rounded-xl overflow-hidden h-80 md:h-full bg-surface-container-high relative border border-surface-variant shadow-inner min-h-[320px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="material-symbols-outlined" style={{ fontSize: '128px' }}>map</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
            <div className="absolute bottom-4 left-4 flex space-x-2 items-center bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-surface-variant">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">
                {l === 'ua' ? 'Присутність: 14 країн' : 'Live Presence: 14 Countries'}
              </span>
            </div>
          </div>

          {/* Location cards */}
          <div className="space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-surface-variant/40 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    location_on
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-primary tracking-[0.08em] text-[10px] uppercase mb-2">
                    {l === 'ua' ? 'Лондон' : 'London'}
                  </h4>
                  <p className="text-sm font-light" style={{ color: 'rgba(32,48,51,0.85)' }}>
                    54 Curzon Street, Mayfair<br />London, W1J 5FB, United Kingdom
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl border border-surface-variant/40 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    location_on
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-primary tracking-[0.08em] text-[10px] uppercase mb-2">
                    {l === 'ua' ? 'Цюрих' : 'Zurich'}
                  </h4>
                  <p className="text-sm font-light" style={{ color: 'rgba(32,48,51,0.85)' }}>
                    Bahnhofstrasse 42<br />8001 Zurich, Switzerland
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-on-surface-variant/70 leading-relaxed text-center uppercase tracking-[0.15em] font-medium pt-4">
              {l === 'ua'
                ? 'Конфіденційно • Захищено • HIPAA'
                : 'Confidential • Secure • HIPAA Compliant'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
