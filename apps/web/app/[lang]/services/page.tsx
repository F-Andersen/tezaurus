import Link from 'next/link';
import { getPage, getServices } from '@/lib/api';
import { ServicesDirectory } from '@/components/ServicesDirectory';
import type { Lang } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const page = await getPage('services', l);
  return {
    title: page?.metaTitle || (l === 'ua' ? 'Медичні пакети — TEZAURUS-TOUR' : 'Medical Packages — TEZAURUS-TOUR'),
    description:
      page?.metaDescription ||
      (l === 'ua'
        ? 'Курортні wellness-програми та медичні пакети від TEZAURUS-TOUR'
        : 'Curated wellness journeys and medical packages by TEZAURUS-TOUR'),
  };
}

const t = {
  heroTitle: { ua: 'Курортні\nWellness-Подорожі', en: 'Curated\nWellness Journeys' },
  heroSub: {
    ua: 'Відчуйте вершину медичної допомоги у поєднанні з найкращими оздоровчими напрямками світу. Кожен пакет — персональне запрошення відновити вашу енергію в абсолютному спокої.',
    en: 'Experience the pinnacle of medical care combined with the world\u2019s most restorative destinations. Every package is a bespoke invitation to renew your vitality in absolute tranquility.',
  },
  ctaTitle: { ua: 'Ваш Персональний\nМедичний Стратег', en: 'Your Personal\nHealth Strategist' },
  ctaBody: {
    ua: 'Не знайшли ідеальний варіант? Наша команда медичного консʼєржу створить повністю індивідуальний маршрут, адаптований до ваших клінічних потреб та естетичних уподобань.',
    en: 'Not seeing the perfect fit? Our medical concierge team crafts completely bespoke itineraries tailored to your specific clinical requirements and aesthetic preferences.',
  },
  ctaButton: { ua: 'Надіслати запит', en: 'Inquire Privately' },
  breadHome: { ua: 'Головна', en: 'Home' },
  breadServices: { ua: 'Послуги', en: 'Concierge' },
  breadCurrent: { ua: 'Медичні пакети', en: 'Medical Packages' },
} satisfies Record<string, Record<Lang, string>>;

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const [page, services] = await Promise.all([getPage('services', l), getServices(l)]);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12 pt-8">
        <nav className="flex items-center gap-3 text-sm font-label tracking-widest uppercase text-on-surface-variant/60">
          <Link href={`/${l}`} className="hover:text-primary transition-colors">
            {t.breadHome[l]}
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href={`/${l}/services`} className="hover:text-primary transition-colors">
            {t.breadServices[l]}
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-semibold">{t.breadCurrent[l]}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="max-w-4xl">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-primary tracking-tighter italic whitespace-pre-line">
            {page?.title || t.heroTitle[l]}
          </h1>
          <p className="mt-6 lg:mt-8 font-body text-lg lg:text-xl text-on-surface-variant leading-relaxed max-w-xl">
            {page?.subtitle || t.heroSub[l]}
          </p>
        </div>
      </section>

      {/* Interactive Directory */}
      <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12">
        <ServicesDirectory services={services} lang={l} />
      </div>

      {/* CTA Banner */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 mb-20 lg:mb-32">
        <div className="relative h-[420px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/50 to-transparent flex items-center px-8 md:px-12 lg:px-16">
            <div className="max-w-xl lg:max-w-2xl text-white">
              <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl mb-6 lg:mb-8 leading-tight italic whitespace-pre-line">
                {t.ctaTitle[l]}
              </h2>
              <p className="font-body text-base lg:text-lg mb-8 lg:mb-12 opacity-80 leading-relaxed">
                {t.ctaBody[l]}
              </p>
              <Link
                href={`/${l}/#request-form`}
                className="inline-block bg-white text-primary px-8 lg:px-10 py-3.5 lg:py-4 rounded-full font-label font-bold tracking-[0.2em] uppercase text-sm hover:scale-105 transition-transform"
              >
                {t.ctaButton[l]}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
