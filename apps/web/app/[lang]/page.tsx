import { getPage, getSettings, getServices } from '@/lib/api';
import { LeadForm } from '@/components/LeadForm';
import { CallbackForm } from '@/components/CallbackForm';
import type { Lang } from '@/lib/api';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const page = await getPage('home', l);
  return {
    title: page?.metaTitle || (l === 'ua' ? 'Головна — TEZAURUS-TOUR' : 'Home — TEZAURUS-TOUR'),
    description: page?.metaDescription || (l === 'ua' ? 'Преміальний медичний туризм та оздоровчі послуги.' : 'Premium medical tourism & wellness services.'),
  };
}

const features = [
  {
    titleUa: 'Початкова консультація',
    titleEn: 'Initial Consultation',
    descUa: 'Персональний дзвінок з медичним консьєржем для обговорення ваших цілей та потреб.',
    descEn: 'Personal medical concierge call to discuss goals and specific requirements.',
  },
  {
    titleUa: 'Підбір клініки',
    titleEn: 'Clinical Matching',
    descUa: 'Ми підберемо 3 найкращі клініки світу для вашого випадку.',
    descEn: 'We match your case with 3 of the world\'s most suitable clinicians for review.',
  },
  {
    titleUa: 'Індивідуальний маршрут',
    titleEn: 'Bespoke Itinerary',
    descUa: 'Координація подорожі, медичних прийомів та преміального розміщення.',
    descEn: 'Coordination of travel, medical appointments, and luxury accommodations.',
  },
  {
    titleUa: 'Супровід на місці',
    titleEn: 'Concierge Host',
    descUa: 'Локальна підтримка та менеджмент відновлення для повного спокою.',
    descEn: 'Local on-ground support and recovery management for complete peace of mind.',
  },
];

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

const destinations = [
  { ua: 'Швейцарія', en: 'Switzerland', sub: 'Regenerative & Longevity', imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrU_8AgE3nvajmaTQ4c6p17AE03mQAehe2y4nUeQIwEDXzRIAjSTf9Qj6_EHjyoaTjSuos4SiQE3A7w579OSk3yjBLn2ujVn70QV-RT4eTzmY6lo1b-K8WHdIKpsMbuSI-ub5u1cMmV6CwmxKfrwceA5DkNR-hfaLp3SII-dOpx3PK5glE3JtUdMxXj2az9QW2Y2e7UuI8__QbjtGi-kyJFOVoN786U1ehP2DH_-1NVoSnhIbj6C0ihMVcpw4p8WUds-VQ4JHghkov' },
  { ua: 'Південна Корея', en: 'South Korea', sub: 'Technological Precision', imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLKFjcSy_rEJxLXiBAKxjGjuRT30I0fX3loWzKaI5Zj2ZJ38-c5twY0TDpvV-WgwQFFn-eHQ5NLZUGuJlVjVdW8AgwaFVyBbhmzP2h6TX_JEOKqTjlb5kimFsKKDUoYDzZSXY9hQDqysLXN3Ap-Rbc39HefagKyQUgIcb-rbvA8D0a5-fXHiHsMyLEZtjp8bdZx3UVbrn25VJtiLLx15gjw__-kQsKAgL4kuCCrqqCR0quz90A9bQA6Esd7wJ_usteuDUUSo8lNz7b' },
  { ua: 'Туреччина', en: 'Turkey', sub: 'Aesthetic Artisans', imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX5TIH_BWj5hgJLCXrCunRI-Ysxh_8N8QHEKL9lviG8IAnL6W3vnXifkldtSTkHv7k-Kf-pGc6dhu6nBCCh5TCiin9L3cljFli4-QtKWBM7vd8TM-Fmff9OjtDGNlxF8r32xMCnpZnrywmN5jd8YUkbG6dWkFCAOC02FxbBWfHG5IvzQtb5KrU44UzfPA9oQ4muwsj7kCAlk_nACD4a7Nm-kWM0JMPhS5REnVy6bp_sbzZGRq7WguB5FkYlgRsMUxhwMy9UV7KG0fe' },
];

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const [page, settings, allServices] = await Promise.all([getPage('home', l), getSettings(), getServices(l)]);
  const featuredServices: FeaturedService[] = (allServices as FeaturedService[]).filter((s) => s.featured).slice(0, 3);
  const placeholderImg = 'https://images.unsplash.com/photo-1540555700478-4be289fbec6f?w=800&q=80';

  const categoryLabels: Record<string, Record<Lang, string>> = {
    diagnostics: { ua: 'Діагностика', en: 'Diagnostics' },
    treatment: { ua: 'Лікування', en: 'Treatment' },
    rehabilitation: { ua: 'Реабілітація', en: 'Rehabilitation' },
    wellness: { ua: 'Wellness', en: 'Wellness' },
  };
  const phones = (settings.phones as string[] | undefined) ?? [];
  const phone = phones[0];

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-10 lg:px-12 max-w-site mx-auto overflow-hidden pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          <div className="lg:col-span-6 z-10">
            <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase mb-6 block">
              {l === 'ua' ? 'Нова ера медичного туризму' : 'A New Era of Medical Travel'}
            </span>
            <h1 className="font-headline text-5xl md:text-7xl leading-[1.1] text-primary mb-8">
              {l === 'ua' ? (
                <>Точна медицина<br /><span className="italic font-normal">зустрічає</span><br />Курортну розкіш.</>
              ) : (
                <>Precision Medicine<br /><span className="italic font-normal">meets</span><br />Curated Serenity.</>
              )}
            </h1>
            <p className="text-on-surface-variant text-lg max-w-md leading-relaxed mb-10">
              {page?.content || (l === 'ua'
                ? 'Медичний сервіс світового рівня в найкращих оздоровчих локаціях. Ми поєднуємо клінічну досконалість з індивідуальною розкішшю.'
                : 'Experience world-class healthcare within the world\'s most breathtaking retreats. We bridge the gap between clinical excellence and bespoke luxury.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${l}/clinics`} className="btn-primary bg-gradient-to-r from-primary to-primary-container px-10 py-4 rounded-xl shadow-lg hover:shadow-xl">
                {l === 'ua' ? 'Переглянути клініки' : 'Explore Destinations'}
              </Link>
              <Link href={`/${l}/services`} className="btn-outline px-10 py-4">
                {l === 'ua' ? 'Наші послуги' : 'The Concierge Service'}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 relative h-[400px] md:h-[600px] lg:h-[700px]">
            <div className="absolute inset-0 bg-surface-container-low rounded-xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Luxury wellness clinic"
                className="w-full h-full object-cover"
                src={destinations[0].imgSrc}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -left-8 hidden xl:block bg-white p-8 rounded-xl shadow-xl max-w-xs border border-outline-variant/10">
              <p className="font-headline italic text-xl text-primary mb-3">
                {l === 'ua' ? '"Здоров\'я — це найвища розкіш."' : '"Health is the ultimate luxury."'}
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {l === 'ua'
                  ? 'Наші клінічні партнери ретельно відібрані за 50-бальним протоколом.'
                  : 'Our clinical partners are hand-selected based on a rigorous 50-point protocol.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CURATED PACKAGES ── */}
      <section className="section-y px-6 md:px-10 lg:px-12 max-w-site mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase mb-4 block">
              {l === 'ua' ? 'Добірка' : 'Selection'}
            </span>
            <h2 className="font-headline text-4xl text-primary italic">
              {l === 'ua' ? 'Курортні програми' : 'Curated Packages'}
            </h2>
          </div>
          <Link href={`/${l}/services`} className="font-label text-sm tracking-widest uppercase border-b border-primary pb-1 hover:opacity-70 transition-opacity">
            {l === 'ua' ? 'Всі програми' : 'View All Procedures'}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuredServices.map((svc) => (
            <Link key={svc.id} href={`/${l}/services`} className="group cursor-pointer block">
              <div className="aspect-[4/5] overflow-hidden rounded-xl mb-6 bg-surface-container-high relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={svc.imageUrl || placeholderImg} />
                {svc.category && (
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1 rounded-full">
                    <span className="font-label text-[10px] tracking-widest uppercase">{categoryLabels[svc.category]?.[l] || svc.category}</span>
                  </div>
                )}
              </div>
              <h3 className="font-headline text-2xl text-primary mb-2">{svc.name}</h3>
              <p className="text-on-surface-variant text-sm mb-4 leading-relaxed line-clamp-2">{svc.description}</p>
              <div className="flex justify-between items-center">
                {svc.priceFrom ? (
                  <span className="font-label text-sm text-primary">{svc.currency === 'EUR' ? '€' : '$'}{svc.priceFrom.toLocaleString()}</span>
                ) : (
                  <span className="font-label text-sm tracking-tighter text-primary">{l === 'ua' ? 'Детальніше' : 'Learn More'}</span>
                )}
                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">east</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="bg-surface-container-low py-32 overflow-hidden">
        <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12">
          <div className="max-w-xl mb-20">
            <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase mb-4 block">
              {l === 'ua' ? 'Світовий рівень' : 'World Class Care'}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-primary mb-6 leading-tight">
              {l === 'ua' ? (
                <>Елітні напрямки.<br /><span className="italic">Глобальна експертиза.</span></>
              ) : (
                <>Elite Destinations.<br /><span className="italic">Global Expertise.</span></>
              )}
            </h2>
            <p className="text-on-surface-variant">
              {l === 'ua'
                ? 'Ми співпрацюємо лише з клініками найвищих стандартів міжнародної акредитації.'
                : 'We only partner with clinics in regions that hold the highest standards of international accreditation.'}
            </p>
          </div>
          <div className="flex space-x-8 overflow-x-auto pb-12 hide-scrollbar">
            {destinations.map((d, i) => (
              <div key={i} className="flex-shrink-0 w-[350px] md:w-[450px]">
                <div className="rounded-xl overflow-hidden h-[400px] md:h-[550px] mb-6 relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={d.en} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src={d.imgSrc} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <h4 className="font-headline text-3xl text-white mb-2">{l === 'ua' ? d.ua : d.en}</h4>
                    <p className="text-white/80 font-label text-xs tracking-widest uppercase">{d.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-y px-6 md:px-10 lg:px-12 max-w-site mx-auto">
        <div className="text-center mb-20">
          <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase mb-4 block">
            {l === 'ua' ? 'Процес' : 'The Journey'}
          </span>
          <h2 className="font-headline text-4xl md:text-5xl text-primary italic">
            {l === 'ua' ? 'Бездоганний досвід' : 'A Seamless Experience'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-xl border border-outline-variant/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-8 font-headline italic">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h4 className="font-headline text-xl mb-4">{l === 'ua' ? f.titleUa : f.titleEn}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">{l === 'ua' ? f.descUa : f.descEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="bg-primary text-on-primary py-32 overflow-hidden">
        <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <h2 className="font-headline text-4xl md:text-5xl leading-tight italic mb-12">
              {l === 'ua' ? <>Голоси<br />відновлення.</> : <>Voices of<br />Restoration.</>}
            </h2>
            <div className="border-l border-on-primary-container pl-8">
              <p className="font-headline text-xl md:text-2xl italic mb-6 leading-relaxed">
                {l === 'ua'
                  ? '"Команда TEZAURUS-TOUR зробила моє лікування за кордоном абсолютно безстресовим. Від першого контакту до виписки — все було ідеально."'
                  : '"The level of clinical precision was only matched by the warmth of the hospitality. I felt seen, not just processed."'}
              </p>
              <p className="font-label text-sm tracking-wide">
                {l === 'ua' ? 'Ольга М.' : 'Helena R.'}
              </p>
              <p className="font-label text-[10px] tracking-widest uppercase opacity-60">
                {l === 'ua' ? 'Київ' : 'Geneva Recovery Experience'}
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 h-[300px] md:h-[500px] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Sanctuary"
              className="w-full h-full object-cover rounded-xl"
              src={destinations[0].imgSrc}
            />
          </div>
        </div>
      </section>

      {/* ── REQUEST FORMS ── */}
      <section id="request-form" className="section-y bg-surface-container-low">
        <div className="container-site">
          <div className="max-w-xl mb-16">
            <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase mb-4 block">
              {l === 'ua' ? 'Зв\'язок' : 'Contact'}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-primary italic mb-4">
              {l === 'ua' ? 'Зв\'яжіться з нами' : 'Get in Touch'}
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              {l === 'ua'
                ? 'Залиште заявку і ми зв\'яжемося з вами протягом 24 годин.'
                : 'Leave a request and we will contact you within 24 hours.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm">
              <h3 className="font-headline text-2xl text-primary mb-8 border-b border-outline-variant/20 pb-4">
                {l === 'ua' ? 'Залишити заявку' : 'Leave a Request'}
              </h3>
              <LeadForm lang={l} />
            </div>
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm">
              <h3 className="font-headline text-2xl text-primary mb-8 border-b border-outline-variant/20 pb-4">
                {l === 'ua' ? 'Передзвоніть мені' : 'Call Me Back'}
              </h3>
              <CallbackForm lang={l} />
              {phone && (
                <div className="mt-8 p-6 bg-surface-container-low rounded-xl border-l-4 border-gold">
                  <p className="text-xs tracking-[0.1em] uppercase text-on-surface-variant mb-2">
                    {l === 'ua' ? 'Телефон' : 'Phone'}
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
