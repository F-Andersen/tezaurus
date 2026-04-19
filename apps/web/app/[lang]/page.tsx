import { getPage, getSettings, getServices } from '@/lib/api';
import { getBlog } from '@/lib/api';
import { LeadForm } from '@/components/LeadForm';
import { CallbackForm } from '@/components/CallbackForm';
import type { Lang } from '@/lib/api';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const page = await getPage('home', l);
  return {
    title: page?.metaTitle || (l === 'ua' ? 'Головна — TEZAURUS·TOUR' : 'Home — TEZAURUS·TOUR'),
    description: page?.metaDescription || (l === 'ua' ? 'Преміальний медичний туризм та оздоровчі послуги.' : 'Premium medical tourism & wellness services.'),
  };
}

interface FeaturedService {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string | null;
  country: string | null;
  city: string | null;
  priceFrom: number | null;
  currency: string;
  imageUrl: string | null;
  tags: string[];
  featured: boolean;
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const t = (ua: string, en: string) => l === 'ua' ? ua : en;

  const [page, settings, allServices, posts] = await Promise.all([
    getPage('home', l),
    getSettings(),
    getServices(l),
    getBlog(l).catch(() => []),
  ]);

  const featuredServices: FeaturedService[] = (allServices as FeaturedService[]).filter((s) => s.featured).slice(0, 3);
  const phones = (settings.phones as string[] | undefined) ?? [];
  const phone = phones[0];
  const placeholderImg = 'https://images.unsplash.com/photo-1540555700478-4be289fbec6f?w=800&q=80';

  const categoryLabels: Record<string, Record<Lang, string>> = {
    diagnostics: { ua: 'Діагностика', en: 'Diagnostics' },
    treatment: { ua: 'Лікування', en: 'Treatment' },
    rehabilitation: { ua: 'Реабілітація', en: 'Rehabilitation' },
    wellness: { ua: 'Wellness', en: 'Wellness' },
  };

  const steps = [
    { num: '01', title: t('Консультація', 'Consultation'), desc: t('Прямий діалог з нашими медичними радниками.', 'Direct dialogue with our medical advisors.') },
    { num: '02', title: t('Підбір', 'Matching'), desc: t('Підбираємо найкращих спеціалістів світу для вас.', 'Selecting the world\'s best specialists for you.') },
    { num: '03', title: t('Подорож', 'Travel'), desc: t('Бездоганна логістика та преміальне розміщення.', 'Seamless logistics and luxury accommodation.') },
    { num: '04', title: t('Процедура', 'Procedure'), desc: t('Найвищі стандарти медичної допомоги.', 'The highest standards of medical care.') },
    { num: '05', title: t('Відновлення', 'Recovery'), desc: t('Післяопераційний моніторинг та реабілітація.', 'Post-op monitoring and serene rehabilitation.') },
  ];

  const destinations = [
    { name: t('Туреччина', 'Turkey'), sub: t('Естетика та зір', 'Aesthetics & Vision'), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyvF0trS-VfEXOZKYO5OJrrC5PuqzKpBUt49x-_HxmYBuquav0afUaOUOj1P7-s9bFvbVxhhzCj3v8e3SIy7TvFbwgwZuO_5TpGSB4lpXnJyzVDSfiYedlPoSAYkkTQWfmKfrcU1WlgDLfIrlqTgzalloCH5g34-GHHZmq2wkEi_jSU4K2ropo8p16ur6PXTQw_CNaisWtcdG2TZQvfdOqtjJc4tDRcIXI0aRgeWSDhY1dv_CSqStWInztnjswpL6mBw5V9PU9MDy0' },
    { name: t('Німеччина', 'Germany'), sub: t('Онкологія та кардіологія', 'Oncology & Cardio'), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAssG6vPufUOkQSNyYP-ZyEoG40qZQv4wCwJuK0fJrRrmj9KIjZUHOaNzz9AbOwkVYml3Vn09-j2szX8cvpMmUgehOUUGzdGGypvqMgjVRXNBaj2WHxSZJrC2WNG69NHXAgcVTVdNg0wEJMym-4AuWQZB47nf5eOM46B3x0OCgh4XBJR1cAmijYroemDOnPjko_7ovp123zLulZaJdh5Xvv9fWBm3eWT5QQmMTKJU4TZxtaudgJByPpbAjQDaUk3bT0r_8UAPabxor_' },
    { name: t('Пд. Корея', 'S. Korea'), sub: t('Дерматологія та довголіття', 'Dermatology & Longevity'), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNSIOYSBefJOxOvC8YMdC-L2FJoNGDTLHlAXhgTChbDOFraSzszkR11DI2810l44wvdtlzOAxWHDA7QOuBGMMl2tuGnaHTprmgq_I06-ssMf15-xYLBb2iKh3_U_SUVrZYxspb0Fu29ata1gs8mVyFdl3GrjAkkmrkkAXyq5FXrq-FuSdeRTYOAbJgqMtbexR3bExqRNWKW8OR_NOQk-WHWo2iFI-01n-OiVro3hVjYKtYfWqhG2cpvgR55Rme5GIr5LPfDY6PyZpz' },
    { name: t('Мексика', 'Mexico'), sub: t('Стоматологія та баріатрія', 'Dental & Bariatric'), img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA69rF1XIcp1OZrnrHWYuitTy7JCCxbMz4Ay05h98zJTjcpDj4sEWd5goLZE5nm36LY1TRx8ZuWiXWOr1DoixY8BH79OrsM9fsqh1wtSiz7BJtDWxByI7gBx978uz_fA0_zyJSWJar9-u5HmP5OJXqkvrCZJ7IOtmeTtg0UQlUAQeBqcxFQlWB7e1tb7cWRs1kG8kpo3z09RVLXqQhZVF--a-kDBkQ83Nz6YHo-xzrVpcyRo5zAAjdA3DJvBFP89NZwEnxKzF1EJpyr' },
  ];

  const blogPosts = (Array.isArray(posts) ? posts : []).slice(0, 4);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={t('Медичний центр світового рівня', 'World-class medical interior')}
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNl7pdoMgpEyAR3E6MKe_4vxazReYQcTry8e41u-Qomuc2JawruZxTFsB67SqRjD6im4vKQo_3MqswzkDVhhoCduBdB9wNBJJu4l9fRgzZirZqt2q9bZeDCUW9QKfmLMPR6CAIKZkCUndopHwQ6ynXsmKCpXzEVWdQ-2hW3e48xctZjupE5Y83qj4okyQNk0aM1N04YlP_xnY3c2ghRDdnQZa7JbPTtK5BY6vsSHFkG9JSEeUXiNNFM2TB9JDK7DUGY4_zVmvQdKpN"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary label-uppercase">
              {t('Медичний Ательє', 'The Medical Atelier')}
            </span>
            <h1 className="text-6xl md:text-8xl font-headline text-primary leading-tight">
              {t('Курована', 'Curated')} <br />
              <span className="italic text-secondary">{t('Медична', 'Medical')}</span> <br />
              {t('Досконалість.', 'Excellence.')}
            </h1>
            <p className="text-lg max-w-md leading-relaxed" style={{ color: 'rgba(32, 48, 51, 0.85)' }}>
              {page?.content || t(
                'Ми поєднуємо медичні процедури світового рівня з розкішшю індивідуальних подорожей. Ваш шлях до здоров\'я, ретельно організований експертами.',
                'We bridge the gap between world-class medical procedures and the luxury of bespoke travel. Your health journey, meticulously curated by experts.'
              )}
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-sm">verified</span>
                </div>
                <span className="text-sm font-bold text-primary label-uppercase">
                  {t('Акредитовані глобальні мережі', 'Accredited Global Networks')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-sm">concierge</span>
                </div>
                <span className="text-sm font-bold text-primary label-uppercase">
                  {t('Персональний медичний консьєрж 24/7', '24/7 Personal Health Concierge')}
                </span>
              </div>
            </div>
            <div className="pt-6">
              <Link
                href={`/${l}/contacts`}
                className="btn-primary px-10 py-5 rounded-lg text-sm font-bold label-uppercase shadow-xl"
                style={{ boxShadow: '0 10px 30px -5px rgba(32, 48, 51, 0.20)' }}
              >
                {t('Розпочати консультацію', 'Begin Your Consultation')}
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="absolute -top-12 -left-12 w-64 h-80 rounded-xl overflow-hidden shadow-2xl z-20 transition-transform hover:rotate-0 duration-500" style={{ transform: 'rotate(3deg)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={t('Медичний спеціаліст', 'Medical specialist')}
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl8cuxpCV9jet6DMpnRvETVh3NkWViZA1WN6VqIdRL5aRLhHEDEqdsADIjXx2dw5YmvA1OrmU06Zk8TzkHhWPa60-NsiZfsu6mokIVoB9UVGgz33xx6trloEUVfNyZmCjGsiC6KUX92zubQFibbNCGOQ9rrYJ_-oXvcNCiHLkylrhEl2CHCzl9Gs6mVoS-pb_uqdajcOL-5NsTFwyE-1_GzLFFGCM-RFudwdRVm-NEOnPLaBf7I9MGGMrO30E2fgkQc_MKn-cck3oD"
              />
            </div>
            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative z-10" style={{ border: '1px solid rgba(255,255,255,0.5)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={t('Розкішний оздоровчий центр', 'Luxury wellness retreat')}
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAch0DLqfKL8j30vwa7rFMCWzm-jEfPzJCufw97vDti8z5tk80sz0zibLDVws8-e19QW93gtlXClUms09KKq0sDASJjAbb7rS4pMQOVeMa8zIGgCy7FpXsdvY_VNFfS6m1Y5w2y1kFpPJxByc9NXOI1Oj7wKfCOZLEEsuLQ3kmIvWM_k2u3m-McNWyxI7x5gCXtOXMjXPTYh0MwBunto5mRVC3q9Yrn2jizK1MsonNB-TP4i8bE5-iXbFzT4AXfYoISsW1QTrW0vCaF"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── EXCEPTIONAL PACKAGES ── */}
      <section className="py-20 md:py-32 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-headline text-primary mb-2">
                {t('Виняткові програми', 'Exceptional Packages')}
              </h2>
              <p className="label-uppercase" style={{ color: 'rgba(32, 48, 51, 0.85)' }}>
                {t('Куровані маршрути здоров\'я та відновлення', 'Curated health & recovery journeys')}
              </p>
            </div>
            <Link
              href={`/${l}/services`}
              className="text-secondary font-bold label-uppercase pb-1 hover:opacity-80 transition-opacity"
              style={{ borderBottom: '2px solid rgba(49, 132, 145, 0.30)' }}
            >
              {t('Всі програми', 'View All Offers')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((svc, i) => (
              <Link
                key={svc.id}
                href={`/${l}/services/${svc.slug}`}
                className={`custom-card group block${i === 1 ? ' lg:translate-y-12' : ''}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-[15px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={svc.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={svc.imageUrl || placeholderImg}
                  />
                  {svc.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                      <span className="label-uppercase text-[9px] text-primary">
                        {categoryLabels[svc.category]?.[l] || svc.category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-2xl font-headline text-primary mb-3">{svc.name}</h3>
                  <p className="text-sm mb-auto leading-relaxed line-clamp-2" style={{ color: 'rgba(32, 48, 51, 0.85)' }}>
                    {svc.description}
                  </p>
                  <div className="flex justify-between items-center pt-8">
                    {svc.priceFrom ? (
                      <span className="text-lg font-bold text-primary">
                        {svc.currency === 'EUR' ? '€' : '$'}{svc.priceFrom.toLocaleString('en-US')}{' '}
                        <span className="text-[10px] font-normal italic label-uppercase" style={{ color: 'rgba(32, 48, 51, 0.85)' }}>
                          {t('Від', 'Starting')}
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-primary label-uppercase">
                        {t('Детальніше', 'Learn More')}
                      </span>
                    )}
                    <span className="material-symbols-outlined text-secondary">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE CURATED PROCESS ── */}
      <section className="py-20 md:py-32 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-headline text-primary mb-4">
              {t('Курований процес', 'The Curated Process')}
            </h2>
            <p className="max-w-lg mx-auto leading-relaxed" style={{ color: 'rgba(32, 48, 51, 0.85)' }}>
              {t(
                'Від першого запиту до повернення додому — ваша подорож супроводжується з клінічною точністю та консьєрж-сервісом.',
                'From initial inquiry to home recovery, your journey is handled with clinical precision and concierge grace.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative space-y-6 text-center group">
                <div className="w-16 h-16 mx-auto bg-surface-container-low rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500" style={{ border: '1px solid rgba(32, 48, 51, 0.10)' }}>
                  <span className="text-xl font-headline">{step.num}</span>
                </div>
                {i < 4 && (
                  <div className="h-px w-full absolute top-8 left-1/2 -z-10 hidden md:block" style={{ background: 'rgba(32, 48, 51, 0.10)' }} />
                )}
                <div>
                  <h4 className="font-bold text-primary mb-2 label-uppercase">{step.title}</h4>
                  <p className="text-[11px] leading-relaxed px-4" style={{ color: 'rgba(32, 48, 51, 0.85)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEDICAL INSIGHTS ── */}
      {blogPosts.length > 0 && (
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                  <span className="text-secondary label-uppercase mb-4 block">
                    {t('Журнал', 'The Ledger')}
                  </span>
                  <h2 className="text-5xl font-headline text-primary leading-tight mb-8">
                    {l === 'ua' ? <>Медичні <br /> інсайти та <br /> дайджест</> : <>Medical <br /> Insights &amp; <br /> Dispatch</>}
                  </h2>
                  <p className="max-w-xs mb-12 leading-relaxed" style={{ color: 'rgba(32, 48, 51, 0.85)' }}>
                    {t(
                      'Досліджуємо майбутнє глобальної охорони здоров\'я, довголіття та медичних інновацій.',
                      'Exploring the future of global healthcare, longevity research, and medical innovation.'
                    )}
                  </p>
                  <Link
                    href={`/${l}/blog`}
                    className="btn-outline px-8 py-4 rounded-lg text-xs font-bold label-uppercase"
                  >
                    {t('Читати журнал', 'Explore the Journal')}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                {blogPosts.map((post: { slug: string; title: string; coverUrl?: string; image?: string; category?: string | { slug: string; name: string }; createdAt?: string; excerpt?: string }, idx: number) => (
                  <Link
                    key={post.slug}
                    href={`/${l}/blog/${post.slug}`}
                    className={`space-y-6 group block${idx % 2 === 1 ? ' md:translate-y-12' : ''}`}
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden" style={{ border: '1px solid rgba(32, 48, 51, 0.10)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={post.image || post.coverUrl || placeholderImg}
                      />
                    </div>
                    {post.category && (
                      <span className="label-uppercase" style={{ color: 'rgba(32, 48, 51, 0.85)' }}>
                        {typeof post.category === 'string' ? post.category : post.category.name}
                      </span>
                    )}
                    <h3 className="text-2xl font-headline text-primary leading-snug group-hover:text-secondary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'rgba(32, 48, 51, 0.85)' }}>
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── WORLD-CLASS HUBS ── */}
      <section className="py-20 md:py-32 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-5xl font-headline text-primary mb-16 text-center">
            {t('Центри світового рівня', 'World-Class Hubs')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d, i) => (
              <div
                key={d.name}
                className={`relative group h-[500px] rounded-xl overflow-hidden${i % 2 === 1 ? ' lg:mt-12' : ''}`}
                style={{ border: '1px solid rgba(32, 48, 51, 0.10)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={d.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  src={d.img}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h4 className="font-headline text-3xl text-white">{d.name}</h4>
                  <p className="label-uppercase mt-2" style={{ color: 'rgba(255,255,255,0.70)' }}>{d.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL & TRUST ── */}
      <section className="py-20 md:py-32 bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="flex items-center space-x-2 text-secondary">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="text-3xl md:text-5xl font-headline italic leading-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
                {t(
                  '"Рівень координації перевершив усе, що я бачив у традиційній медицині. Я відчував себе гостем, але отримав догляд як VIP-пацієнт."',
                  '"The level of coordination was beyond anything I\'ve experienced in traditional healthcare. I felt like a guest, but received care like a VIP patient."'
                )}
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden" style={{ border: '2px solid rgba(49, 132, 145, 0.50)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={t('Відгук клієнта', 'Client testimonial')}
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvH51hdaVOYPR2B_u4Ro_suONrECjoj9sfbQ5GloX5aniy9EdTYPdINDXlp3QOrirQRVpqPhooYsOpekEAmajqmJVxMsIG4gqNaQXZPlcyYdMeGITKOat5MyFQkHiHKSwoMjsSCK_Q6MTSz66QZcOXd5EpkX25iK1lfCp7HDMbhBVjdEfgAvKv_keka7qJ2RL5NwZyD_scFBk-7zpxXESntY1r3-6lB1bdJq3WXPHM1flCU86oCfkBXck5jiPmWg2PdZUhwT6Gki2H"
                  />
                </div>
                <div>
                  <h5 className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.92)' }}>
                    {t('Артур В.', 'Arthur Vance')}
                  </h5>
                  <p className="label-uppercase" style={{ color: 'rgba(255,255,255,0.70)' }}>
                    {t('Кардіологічне відновлення', 'CEO, Vance Global • Cardiac Recovery')}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-12 space-y-8" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <h3 className="text-2xl font-headline" style={{ color: 'rgba(255,255,255,0.92)' }}>
                {t('Довіра та акредитація', 'Trust & Credentials')}
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h6 className="text-secondary label-uppercase font-bold">{t('Акредитація', 'Accreditation')}</h6>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    {t('Всі клініки-партнери мають міжнародну акредитацію JCI.', 'All partner clinics are JCI accredited and internationally vetted.')}
                  </p>
                </div>
                <div className="space-y-2">
                  <h6 className="text-secondary label-uppercase font-bold">{t('Рейтинг безпеки', 'Safety Score')}</h6>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    {t('99.8% задоволеності та успішності процедур.', '99.8% satisfaction and procedure success rate.')}
                  </p>
                </div>
                <div className="space-y-2">
                  <h6 className="text-secondary label-uppercase font-bold">{t('Конфіденційність', 'Confidentiality')}</h6>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    {t('Захист даних відповідно до HIPAA та абсолютна приватність.', 'HIPAA compliant data protection and absolute privacy.')}
                  </p>
                </div>
                <div className="space-y-2">
                  <h6 className="text-secondary label-uppercase font-bold">{t('Глобальна присутність', 'Global Presence')}</h6>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.82)' }}>
                    {t('Офіси в Лондоні, Цюриху та Сеулі для локальної підтримки.', 'Offices in London, Zurich, and Seoul for localized support.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REQUEST FORMS ── */}
      <section id="request-form" className="py-20 md:py-32 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-xl mb-16">
            <span className="label-uppercase text-secondary mb-4 block">
              {t('Зв\'язок', 'Contact')}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-primary italic mb-4">
              {t('Зв\'яжіться з нами', 'Get in Touch')}
            </h2>
            <p className="leading-relaxed" style={{ color: 'rgba(32, 48, 51, 0.85)' }}>
              {t(
                'Залиште заявку і ми зв\'яжемося з вами протягом 24 годин.',
                'Leave a request and we will contact you within 24 hours.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-editorial" style={{ border: '1px solid rgba(32, 48, 51, 0.10)' }}>
              <h3 className="font-headline text-2xl text-primary mb-8 pb-4" style={{ borderBottom: '1px solid rgba(32, 48, 51, 0.10)' }}>
                {t('Залишити заявку', 'Leave a Request')}
              </h3>
              <LeadForm lang={l} />
            </div>
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-editorial" style={{ border: '1px solid rgba(32, 48, 51, 0.10)' }}>
              <h3 className="font-headline text-2xl text-primary mb-8 pb-4" style={{ borderBottom: '1px solid rgba(32, 48, 51, 0.10)' }}>
                {t('Передзвоніть мені', 'Call Me Back')}
              </h3>
              <CallbackForm lang={l} />
              {phone && (
                <div className="mt-8 p-6 bg-surface-container-low rounded-xl" style={{ borderLeft: '4px solid #318491' }}>
                  <p className="label-uppercase mb-2" style={{ color: 'rgba(32, 48, 51, 0.65)' }}>
                    {t('Телефон', 'Phone')}
                  </p>
                  {phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block text-lg font-semibold text-primary">
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
