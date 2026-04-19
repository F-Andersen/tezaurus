import { getPage, getSettings } from '@/lib/api';
import type { Lang } from '@/lib/api';
import { AboutInquiryForm } from '@/components/AboutInquiryForm';

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

const pillars = [
  {
    icon: 'verified_user',
    titleUa: 'Ретельний аудит',
    titleEn: 'Rigorous Auditing',
    descUa:
      'Кожна клініка-партнер проходить 120-бальну клінічну оцінку, гарантуючи відповідність хірургічних результатів найвищим міжнародним стандартам.',
    descEn:
      'Every partner clinic undergoes a 120-point clinical assessment, ensuring that surgical outcomes meet the highest global standards.',
  },
  {
    icon: 'visibility',
    titleUa: 'Радикальна прозорість',
    titleEn: 'Radical Transparency',
    descUa:
      'Жодних прихованих комісій. Жодних прихованих даних. Ми надаємо чисті факти, щоб ви могли приймати обґрунтовані рішення.',
    descEn:
      'No hidden commissions. No obscured data. We provide the raw facts so you can make empowered decisions about your well-being.',
  },
  {
    icon: 'spa',
    titleUa: 'Холістична безперервність',
    titleEn: 'Holistic Continuity',
    descUa:
      'Зцілення не закінчується при виписці. Ми координуємо післяопераційний догляд та емоційну підтримку після вашого повернення додому.',
    descEn:
      'Healing doesn\'t stop at discharge. We coordinate post-operative care and emotional support long after you\'ve returned home.',
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
      {/* ── HERO: The Clinical Atelier ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-20 md:pt-44 mb-24 lg:mb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary-container/40 text-secondary font-bold font-label text-[10px] tracking-[0.2em] uppercase mb-8">
              {l === 'ua' ? 'Клінічний ательє' : 'The Clinical Atelier'}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline text-primary leading-[1.1] mb-8">
              {l === 'ua' ? (
                <>Курація як <span className="italic">зцілення</span>.</>
              ) : (
                <>Curation as a <span className="italic">Cure</span>.</>
              )}
            </h1>
            <p className="text-lg md:text-xl font-light leading-relaxed max-w-lg" style={{ color: 'rgba(32,48,51,0.85)' }}>
              {page?.content ||
                (l === 'ua'
                  ? 'У Клінічному Ательє ми долаємо розрив між глобальною медичною досконалістю та особистим комфортом. Ми не просто знаходимо лікування; ми курируємо подорожі відновлення.'
                  : 'At The Clinical Atelier, we bridge the gap between global medical excellence and personal sanctuary. We don\'t just find treatments; we curate journeys of restoration.')}
            </p>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl shadow-primary/10 bg-surface-container-high">
              <div className="w-full h-full bg-gradient-to-br from-primary-container to-secondary/40 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-white/30"
                  style={{ fontSize: '96px' }}
                >
                  local_hospital
                </span>
              </div>
            </div>
            {/* Concierge quote card */}
            <div className="absolute -bottom-12 -left-12 hidden xl:block w-72 p-8 bg-primary rounded-xl shadow-2xl z-20">
              <span className="material-symbols-outlined text-secondary-fixed mb-4 text-3xl">medical_services</span>
              <p className="text-sm font-light leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.82)' }}>
                {l === 'ua'
                  ? '"Індивідуальний підхід, де точна медицина зустрічається з мистецтвом гостинності."'
                  : '"A bespoke approach where precision medicine meets the art of hospitality."'}
              </p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  EST. 2016
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR FOUNDATIONAL PILLARS ── */}
      <section className="bg-surface-container-low py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-20 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-headline text-primary mb-6">
              {l === 'ua' ? 'Наші фундаментальні принципи' : 'Our Foundational Pillars'}
            </h2>
            <p className="font-light" style={{ color: 'rgba(32,48,51,0.85)' }}>
              {l === 'ua'
                ? 'Навігація в міжнародній охороні здоров\'я вимагає більше, ніж логістики; це вимагає етичного компасу та ока на якість.'
                : 'Navigating international healthcare requires more than logistics; it requires an ethical compass and an eye for quality.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.icon}
                className={`bg-surface-container-lowest p-10 rounded-xl group hover:shadow-xl transition-all duration-500 border border-surface-variant/50 ${
                  i === 1 ? 'md:translate-y-8' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary-container text-2xl">
                    {pillar.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-headline text-primary mb-4">
                  {l === 'ua' ? pillar.titleUa : pillar.titleEn}
                </h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(32,48,51,0.85)' }}>
                  {l === 'ua' ? pillar.descUa : pillar.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBAL REACH + CONTACT FORM ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left: Offices */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-4xl font-headline text-primary mb-4">
                  {l === 'ua' ? 'Глобальна присутність' : 'Global Reach'}
                </h2>
                <p className="font-light mb-12" style={{ color: 'rgba(32,48,51,0.85)' }}>
                  {l === 'ua'
                    ? 'Зв\'язуємо вас із хірургічними центрами від Цюриха до Сеула.'
                    : 'Connecting you to surgical hubs from Zurich to Seoul.'}
                </p>
              </div>

              {/* Office: London */}
              <div className="flex gap-6 group">
                <div className="w-24 h-24 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary/30 text-4xl">apartment</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary tracking-[0.08em] text-[10px] uppercase mb-2">
                    {l === 'ua' ? 'Європейський хаб' : 'European Hub'}
                  </h4>
                  <p className="font-light text-sm" style={{ color: 'rgba(32,48,51,0.85)' }}>
                    54 Curzon Street, Mayfair<br />London, W1J 5FB, UK
                  </p>
                  <p className="text-secondary text-sm mt-2 font-bold tracking-tight">+44 20 7946 0123</p>
                </div>
              </div>

              {/* Office: Zurich */}
              <div className="flex gap-6 group">
                <div className="w-24 h-24 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary/30 text-4xl">location_city</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary tracking-[0.08em] text-[10px] uppercase mb-2">
                    {l === 'ua' ? 'Центральний офіс' : 'Central Operations'}
                  </h4>
                  <p className="font-light text-sm" style={{ color: 'rgba(32,48,51,0.85)' }}>
                    Bahnhofstrasse 42<br />8001 Zurich, Switzerland
                  </p>
                  <p className="text-secondary text-sm mt-2 font-bold tracking-tight">+41 44 271 4440</p>
                </div>
              </div>

              {/* Mini map placeholder */}
              <div className="rounded-xl overflow-hidden h-64 bg-surface-container-high relative border border-surface-variant shadow-inner">
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
            </div>

            {/* Right: Lead inquiry form */}
            <div className="lg:col-span-3 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-2xl shadow-primary/5 border border-surface-variant/40">
              <div className="mb-10">
                <h3 className="text-3xl font-headline text-primary mb-2">
                  {l === 'ua' ? 'Розпочніть вашу подорож' : 'Begin Your Journey'}
                </h3>
                <p className="text-sm font-light" style={{ color: 'rgba(32,48,51,0.85)' }}>
                  {l === 'ua'
                    ? 'Наш куратор відповість на ваш запит протягом 4 робочих годин.'
                    : 'A dedicated curator will respond to your inquiry within 4 business hours.'}
                </p>
              </div>
              <AboutInquiryForm lang={l} />
            </div>
          </div>
        </div>
      </section>

      {/* ── REGULATORY & LEGAL COMPLIANCE ── */}
      <section className="bg-surface-container py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="font-headline text-xl text-primary mb-4">
                {l === 'ua' ? 'Регуляторна та юридична відповідність' : 'Regulatory & Legal Compliance'}
              </h4>
              <p className="text-xs leading-relaxed max-w-lg mb-4" style={{ color: 'rgba(32,48,51,0.85)' }}>
                {l === 'ua'
                  ? 'TEZAURUS-TOUR є зареєстрованим фасилітатором медичного туризму та консьєрж-агентством. Ми не надаємо медичних консультацій, діагнозів або лікування. Усі хірургічні рішення приймаються між пацієнтом та ліцензованим медичним провайдером. Ми рекомендуємо всім пацієнтам проконсультуватися зі своїм лікарем перед міжнародною медичною подорожжю.'
                  : 'TEZAURUS-TOUR is a registered medical tourism facilitator and concierge agency. We do not provide medical advice, diagnosis, or treatment. All surgical decisions are between the patient and the licensed medical provider. We recommend all patients consult with their local physician before engaging in international medical travel.'}
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.2em] border border-primary/20 px-3 py-1.5 rounded-full bg-white/50">
                  ISO 9001
                </span>
                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.2em] border border-primary/20 px-3 py-1.5 rounded-full bg-white/50">
                  HIPAA
                </span>
                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.2em] border border-primary/20 px-3 py-1.5 rounded-full bg-white/50">
                  IATA
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl border border-surface-variant shadow-sm">
              <h5 className="font-bold text-primary tracking-[0.08em] text-[10px] uppercase mb-4 border-b border-surface-variant pb-2">
                {l === 'ua' ? 'Реєстрація компанії' : 'Company Registration'}
              </h5>
              <ul className="space-y-3 text-xs font-light" style={{ color: 'rgba(32,48,51,0.85)' }}>
                <li className="flex justify-between">
                  <span className="font-bold text-primary/60 uppercase text-[9px] tracking-[0.2em]">
                    {l === 'ua' ? 'Назва' : 'Entity'}
                  </span>
                  <span className="text-right">TEZAURUS-TOUR International Ltd.</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-bold text-primary/60 uppercase text-[9px] tracking-[0.2em]">
                    {l === 'ua' ? 'Рег. №' : 'Reg No'}
                  </span>
                  <span className="text-right">CH-201.3.456.789-0</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-bold text-primary/60 uppercase text-[9px] tracking-[0.2em]">VAT ID</span>
                  <span className="text-right">GB 123 4567 89</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-bold text-primary/60 uppercase text-[9px] tracking-[0.2em]">
                    {l === 'ua' ? 'Офіс' : 'Office'}
                  </span>
                  <span className="text-right">Bahnhofstrasse 42, 8001 Zurich</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
