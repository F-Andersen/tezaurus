import Link from 'next/link';
import { getPage, getServices } from '@/lib/api';
import { ServicesDirectory } from '@/components/ServicesDirectory';
import type { Lang } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const page = await getPage('services', l);
  return {
    title: page?.metaTitle || (l === 'ua' ? 'Медичні пакети — TEZAURUS·TOUR' : 'Medical Packages — TEZAURUS·TOUR'),
    description:
      page?.metaDescription ||
      (l === 'ua'
        ? 'Курортні wellness-програми та медичні пакети від TEZAURUS·TOUR'
        : 'Curated wellness journeys and medical packages by TEZAURUS·TOUR'),
  };
}

const t = {
  heroTitle: { ua: 'Курортні подорожі', en: 'Curated Journeys' },
  heroTitleItalic: { ua: 'відновлення', en: 'of Restoration' },
  heroSub: {
    ua: 'Відкрийте елітні медичні процедури у поєднанні з відновлювальним люксом. Наші куратори відібрали найсучасніші клініки світу, що пропонують цілісне середовище догляду.',
    en: 'Discover elite medical procedures paired with restorative luxury. Our curators have selected the world\u2019s most advanced clinics offering holistic care environments.',
  },
  breadHome: { ua: 'Головна', en: 'Home' },
  breadCurrent: { ua: 'Медичні пакети', en: 'Medical Packages' },
} satisfies Record<string, Record<Lang, string>>;

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const [page, services] = await Promise.all([getPage('services', l), getServices(l)]);

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-3 text-[10px] font-label tracking-[0.2em] text-on-surface-variant uppercase mb-12">
        <Link href={`/${l}`} className="hover:text-primary transition-colors">
          {t.breadHome[l]}
        </Link>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-primary font-bold">{t.breadCurrent[l]}</span>
      </nav>

      {/* Hero (як відступи на сторінці клінік) */}
      <div className="mb-20">
        <h1 className="font-headline text-5xl md:text-6xl text-primary mb-6 leading-tight">
          {page?.title ? (
            page.title
          ) : (
            <>
              {t.heroTitle[l]} <br />
              <span className="italic font-normal text-secondary">{t.heroTitleItalic[l]}</span>
            </>
          )}
        </h1>
        <p className="max-w-2xl text-on-surface-variant font-body text-lg font-light leading-relaxed">
          {page?.subtitle || t.heroSub[l]}
        </p>
      </div>

      <ServicesDirectory services={services} lang={l} />
    </div>
  );
}
