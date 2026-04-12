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

export default async function ContactsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const [page, settings] = await Promise.all([getPage('contacts', l), getSettings()]);
  const phones = (settings.phones as string[] | undefined) ?? [];
  const contacts = (settings.contacts as Record<string, string> | undefined) ?? {};
  const messengers = (settings.messengers as Record<string, string> | undefined) ?? {};

  const defaultEmail = 'info@tezaurustour.com';
  const email = contacts.email || defaultEmail;
  const address = contacts.address || '';

  return (
    <>
      {/* ── CONTACT HERO + CARD ── */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-2xl mb-16">
          <span className="font-label text-xs tracking-[0.2em] text-on-surface-variant uppercase mb-6 block">
            {l === 'ua' ? 'Зв\'яжіться' : 'Get in Touch'}
          </span>
          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-light text-primary leading-tight mb-6">
            {l === 'ua' ? (
              <>
                Розпочніть вашу{' '}
                <span className="italic font-normal text-secondary">подорож</span>
              </>
            ) : (
              <>
                Start Your{' '}
                <span className="italic font-normal text-secondary">Journey</span>
              </>
            )}
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            {page?.content || (l === 'ua'
              ? 'Проконсультуйтеся з нашою командою спеціалістів, щоб дізнатися, як ми можемо створити індивідуальний медичний маршрут саме для вас.'
              : 'Consult with our specialist team to discover how we can tailor a medical path specifically for you.')}
          </p>
        </div>

        {/* ── SPLIT CARD: FORM + DETAILS ── */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left: Lead Form */}
          <div className="p-8 md:p-12 lg:p-16 xl:p-20 lg:w-1/2">
            <h2 className="font-headline text-3xl md:text-4xl font-light text-primary mb-4">
              {l === 'ua' ? 'Залишити заявку' : 'Leave a Request'}
            </h2>
            <p className="text-on-surface-variant mb-10">
              {l === 'ua'
                ? 'Заповніть форму і ми зв\'яжемося з вами протягом 24 годин.'
                : 'Fill in the form and we will contact you within 24 hours.'}
            </p>
            <LeadForm lang={l} />
          </div>

          {/* Right: Navy contact details panel */}
          <div className="lg:w-1/2 relative bg-primary flex flex-col justify-between p-8 md:p-12 lg:p-16 xl:p-20 text-white min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/40 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <h3 className="font-headline text-2xl md:text-3xl mb-12">
                {l === 'ua' ? 'Контактна інформація' : 'Contact Details'}
              </h3>

              <div className="space-y-10">
                {/* Phone */}
                {phones.length > 0 ? (
                  <div className="flex items-start gap-6">
                    <span className="material-symbols-outlined text-secondary-container shrink-0">call</span>
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-50 mb-1">
                        {l === 'ua' ? 'Телефон' : 'Direct Line'}
                      </p>
                      {phones.map((p) => (
                        <a
                          key={p}
                          href={`tel:${p.replace(/\s/g, '')}`}
                          className="block text-lg hover:text-secondary-container transition-colors"
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-6">
                    <span className="material-symbols-outlined text-secondary-container shrink-0">call</span>
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-50 mb-1">
                        {l === 'ua' ? 'Телефон' : 'Direct Line'}
                      </p>
                      <p className="text-lg opacity-60">{l === 'ua' ? 'Незабаром' : 'Coming soon'}</p>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="flex items-start gap-6">
                  <span className="material-symbols-outlined text-secondary-container shrink-0">mail</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Email</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-lg hover:text-secondary-container transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                {address && (
                  <div className="flex items-start gap-6">
                    <span className="material-symbols-outlined text-secondary-container shrink-0">location_on</span>
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-50 mb-1">
                        {l === 'ua' ? 'Адреса' : 'Office'}
                      </p>
                      <p className="text-lg leading-relaxed">{address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social / Messenger links */}
            <div className="relative z-10 flex flex-wrap gap-6 mt-16">
              {Object.entries(messengers).length > 0
                ? Object.entries(messengers).map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm uppercase tracking-widest hover:text-secondary-container transition-colors"
                    >
                      {name}
                    </a>
                  ))
                : ['Telegram', 'WhatsApp', 'Instagram'].map((name) => (
                    <span key={name} className="text-sm uppercase tracking-widest opacity-40">
                      {name}
                    </span>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CALLBACK FORM ── */}
      <section className="bg-surface-container-low py-24 md:py-32">
        <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase mb-4 block">
                {l === 'ua' ? 'Швидкий зв\'язок' : 'Quick Connect'}
              </span>
              <h2 className="font-headline text-3xl md:text-4xl text-primary mb-6">
                {l === 'ua' ? (
                  <>
                    Ми <span className="italic">зателефонуємо</span> вам
                  </>
                ) : (
                  <>
                    We&apos;ll <span className="italic">call</span> you back
                  </>
                )}
              </h2>
              <p className="text-on-surface-variant leading-relaxed max-w-md">
                {l === 'ua'
                  ? 'Залиште свій номер і наш медичний консьєрж зв\'яжеться з вами у найкоротший термін.'
                  : 'Leave your number and our medical concierge will reach out at the earliest convenience.'}
              </p>
            </div>
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm">
              <CallbackForm lang={l} />
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP / LOCATION SECTION ── */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 pb-24 md:pb-32">
        <div className="w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden bg-surface-container-high relative border border-outline-variant/10">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-container-high" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl mx-auto mb-4">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
              </div>
              <p className="font-headline text-xl text-primary">
                {l === 'ua' ? 'Наш офіс' : 'Our Location'}
              </p>
              {address && (
                <p className="text-sm text-on-surface-variant mt-2 max-w-xs">{address}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
