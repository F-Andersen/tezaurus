import { getClinics, getSettings } from '@/lib/api';
import { ClinicsDirectory } from '@/components/ClinicsDirectory';
import Link from 'next/link';
import type { Lang } from '@/lib/api';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  return {
    title: l === 'ua' ? 'Каталог клінік — TEZAURUS-TOUR' : 'Clinic Directory — TEZAURUS-TOUR',
    description: l === 'ua'
      ? 'Відкрийте для себе найпрестижніші клініки світу. Від швейцарських центрів довголіття до провідних азійських лабораторій.'
      : 'Discover our hand-picked selection of the world\'s most prestigious clinics. From Swiss longevity retreats to Asia\'s pioneering medical centers.',
  };
}

export default async function ClinicsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const [clinics, settings] = await Promise.all([getClinics(l), getSettings()]);
  const phones = (settings.phones as string[] | undefined) ?? [];

  return (
    <>
      {/* ── Breadcrumbs ── */}
      <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12">
        <nav className="py-6 md:py-8 flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant/60 font-medium">
          <Link href={`/${l}`} className="hover:text-primary transition-colors">
            {l === 'ua' ? 'Головна' : 'Home'}
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary">
            {l === 'ua' ? 'Каталог клінік' : 'Clinic Directory'}
          </span>
        </nav>
      </div>

      {/* ── Editorial Hero ── */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 mb-16 md:mb-20">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-normal leading-[1.1] text-primary mb-6 md:mb-8 tracking-tighter">
            {l === 'ua' ? (
              <>Обрані <span className="italic">святині</span> глобальної медицини.</>
            ) : (
              <>The Curated <span className="italic">Sanctuaries</span> of Global Medicine.</>
            )}
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed font-light max-w-2xl">
            {l === 'ua'
              ? 'Відкрийте нашу добірку найпрестижніших клінік світу. Від швейцарських центрів довголіття до передових естетичних ательє Сеулу — ми орієнтуємося в досконалості, щоб вам не довелося.'
              : 'Discover our hand-picked selection of the world\'s most prestigious clinics. From Swiss longevity retreats to Seoul\'s pioneering aesthetic ateliers, we navigate the excellence so you don\'t have to.'}
          </p>
        </div>
      </section>

      {/* ── Directory (Client) ── */}
      <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12 pb-12 md:pb-0">
        <ClinicsDirectory clinics={clinics} lang={l} />
      </div>

      {/* ── Bottom CTA Banner ── */}
      <section className="bg-primary text-on-primary py-20 md:py-28 mt-8">
        <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12 text-center">
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl italic mb-6 leading-tight">
            {l === 'ua'
              ? 'Не знайшли ідеальну клініку?'
              : 'Haven\'t found the perfect clinic?'}
          </h2>
          <p className="text-on-primary/70 max-w-lg mx-auto mb-10 leading-relaxed">
            {l === 'ua'
              ? 'Наші медичні консьєржі підберуть найкращий варіант, що відповідає саме вашим потребам та очікуванням.'
              : 'Our medical concierge team will match you with the ideal clinic tailored to your unique needs and expectations.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={`/${l}#request-form`}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-10 py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-bold hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
              {l === 'ua' ? 'Залишити заявку' : 'Request Consultation'}
            </Link>
            {phones[0] && (
              <a
                href={`tel:${phones[0].replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2 border border-white/30 px-10 py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                {phones[0]}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
