import { getPage, getSettings } from '@/lib/api';
import type { Lang } from '@/lib/api';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const page = await getPage('about', l);
  return {
    title: page?.metaTitle || (l === 'ua' ? 'Про нас — TEZAURUS-TOUR' : 'About — TEZAURUS-TOUR'),
    description:
      page?.metaDescription ||
      (l === 'ua'
        ? 'Архітектори нової ери турботи про здоров\u0027я. Дізнайтеся більше про TEZAURUS-TOUR.'
        : 'Architects of a new era of care. Learn more about TEZAURUS-TOUR.'),
  };
}

const steps = [
  {
    num: '01',
    titleUa: 'Діагностика',
    titleEn: 'Diagnosis',
    descUa:
      'Комплексний аналіз із використанням найсучаснішої діагностики для розуміння вашого унікального фізіологічного профілю.',
    descEn:
      'Comprehensive analysis using state-of-the-art diagnostics to understand your unique physiological blueprint.',
  },
  {
    num: '02',
    titleUa: 'Курація',
    titleEn: 'Curation',
    descUa:
      'Підбір найвідповідніших спеціалістів та приватних клінік відповідно до ваших потреб.',
    descEn:
      'Matching your needs with the world\'s most renowned specialists and private clinics.',
  },
  {
    num: '03',
    titleUa: 'Занурення',
    titleEn: 'Immersion',
    descUa:
      'Консьєрж-супровід під час перебування: преміальна логістика, переклад та приватні санктуарії.',
    descEn:
      'Concierge-led stay management including luxury logistics, translation, and private sanctuary arrangements.',
  },
  {
    num: '04',
    titleUa: 'Безперервність',
    titleEn: 'Continuity',
    descUa:
      'Пост-терапевтичний моніторинг та інтегровані оздоровчі плани, що виходять далеко за межі вашого від\'їзду.',
    descEn:
      'Post-treatment monitoring and integrated wellness plans that extend far beyond your departure.',
  },
];

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const [page, settings] = await Promise.all([getPage('about', l), getSettings()]);
  const phones = (settings.phones as string[] | undefined) ?? [];
  const phone = phones[0];

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative max-w-site mx-auto px-6 md:px-10 lg:px-12 pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span className="font-label text-xs tracking-[0.2em] text-on-surface-variant uppercase mb-6 block">
              {l === 'ua' ? 'Наша філософія' : 'Our Philosophy'}
            </span>
            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-light text-primary leading-tight mb-8">
              {l === 'ua' ? (
                <>
                  Нова ера{' '}
                  <span className="italic font-normal text-secondary">турботи</span>
                  <br />
                  про здоров&apos;я
                </>
              ) : (
                <>
                  Crafting a New
                  <br />
                  Era of{' '}
                  <span className="italic font-normal text-secondary">Care</span>
                </>
              )}
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
              {page?.content || (l === 'ua'
                ? 'TEZAURUS-TOUR — це більше, ніж медичний консьєрж. Ми — архітектори довголіття, що поєднують медицину світового рівня з індивідуальним, артизанальним підходом до благополуччя кожного клієнта.'
                : 'TEZAURUS-TOUR is more than a medical concierge. We are architects of longevity, bridging the gap between world-class medicine and a personalized, artisanal approach to patient wellbeing.')}
            </p>
          </div>

          <div className="relative h-[400px] md:h-[550px] lg:h-[600px]">
            <div className="absolute inset-0 bg-surface-container-low rounded-xl -rotate-2" />
            <div className="relative z-10 w-full h-full rounded-xl overflow-hidden shadow-xl bg-surface-container-high flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-secondary opacity-30" />
              <span className="material-symbols-outlined text-white/40 relative z-10" style={{ fontSize: '80px' }}>
                local_hospital
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE ATELIER WAY ── */}
      <section className="bg-surface-container-low py-24 md:py-32">
        <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-headline text-4xl md:text-5xl font-light text-primary mb-6">
                {l === 'ua' ? 'Наш метод' : 'The Atelier Way'}
              </h2>
              <p className="text-on-surface-variant leading-relaxed">
                {l === 'ua'
                  ? 'Чотириетапний процес, створений для того, щоб ваша подорож була бездоганною та ефективною. Ми беремо на себе всю складність, щоб ви зосередилися на відновленні.'
                  : 'A four-stage process designed to ensure your journey is as seamless as it is effective. We handle the complexity, so you can focus on restoration.'}
              </p>
            </div>
            <div className="md:text-right text-primary-container italic text-lg border-l md:border-l-0 md:border-r border-primary/10 pl-6 md:pl-0 md:pr-6 shrink-0">
              {l === 'ua'
                ? '"Елегантність у кожному кроці."'
                : '"Elegance in every intervention."'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step) => (
              <div key={step.num} className="group">
                <div className="text-5xl font-headline text-secondary/30 mb-8 group-hover:text-secondary transition-colors duration-300">
                  {step.num}
                </div>
                <h3 className="font-headline text-xl mb-4 text-primary">
                  {l === 'ua' ? step.titleUa : step.titleEn}
                </h3>
                <p className="text-sm text-on-surface-variant leading-loose">
                  {l === 'ua' ? step.descUa : step.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase mb-4 block">
              {l === 'ua' ? 'У цифрах' : 'By the Numbers'}
            </span>
            <h2 className="font-headline text-4xl text-primary italic">
              {l === 'ua' ? 'Наш досвід' : 'Our Track Record'}
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '10+', labelUa: 'Років на ринку', labelEn: 'Years in Business' },
              { num: '500+', labelUa: 'Задоволених клієнтів', labelEn: 'Satisfied Clients' },
              { num: '30+', labelUa: 'Країн присутності', labelEn: 'Countries Covered' },
              { num: '15+', labelUa: 'Клінік-партнерів', labelEn: 'Clinic Partners' },
            ].map((stat) => (
              <div
                key={stat.num}
                className="bg-white p-8 rounded-xl border-l-4 border-gold shadow-sm text-center md:text-left"
              >
                <p className="font-headline text-4xl md:text-5xl font-light text-primary mb-3">
                  {stat.num}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {l === 'ua' ? stat.labelUa : stat.labelEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-primary text-on-primary py-24 md:py-32">
        <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12 text-center">
          <h2 className="font-headline text-3xl md:text-5xl italic mb-6 leading-tight">
            {l === 'ua' ? (
              <>Готові розпочати<br />свою подорож?</>
            ) : (
              <>Ready to Start<br />Your Journey?</>
            )}
          </h2>
          <p className="text-on-primary-container max-w-xl mx-auto mb-10 leading-relaxed">
            {l === 'ua'
              ? 'Зв\'яжіться з нашою командою спеціалістів, щоб дізнатися, як ми можемо створити індивідуальний медичний маршрут саме для вас.'
              : 'Consult with our specialist team to discover how we can tailor a medical path specifically for you.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/${l}/contacts`}
              className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 rounded-full font-label font-medium tracking-wide hover:bg-surface-container-low transition-colors shadow-lg"
            >
              {l === 'ua' ? 'Зв\'язатися з нами' : 'Contact Us'}
              <span className="material-symbols-outlined text-[20px]">east</span>
            </Link>
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-10 py-4 rounded-full font-label font-medium tracking-wide hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                {phone}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
