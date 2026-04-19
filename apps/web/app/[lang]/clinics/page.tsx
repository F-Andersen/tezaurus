import { getClinics, getSettings } from '@/lib/api';
import { ClinicsDirectory } from '@/components/ClinicsDirectory';
import Link from 'next/link';
import type { Lang } from '@/lib/api';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  return {
    title: l === 'ua' ? 'Каталог клінік — TEZAURUS·TOUR' : 'Clinic Directory — TEZAURUS·TOUR',
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
      {/* ── Hero Header ── */}
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <span className="text-secondary font-label tracking-[0.3em] text-[10px] font-bold uppercase mb-4 block">
              {l === 'ua' ? 'Клінічне Ательє' : 'The Clinical Atelier'}
            </span>
            <h1 className="font-headline text-5xl md:text-7xl text-primary leading-tight mb-6">
              {l === 'ua' ? (
                <>Обрана <br /><i className="font-normal">медична досконалість</i></>
              ) : (
                <>Curated <br /><i className="font-normal">Medical Excellence</i></>
              )}
            </h1>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed max-w-xl">
              {l === 'ua'
                ? 'Перевірена добірка найвишуканіших клінічних установ світу, що поєднують хірургічну точність із холістичною гармонією.'
                : 'A peer-vetted selection of the world\'s most sophisticated clinical institutions, balanced between surgical precision and holistic sanctuary.'}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border border-outline-variant/30 flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-primary-container/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              <span className="material-symbols-outlined text-4xl text-primary z-10">verified_user</span>
              <div className="absolute -bottom-2 text-[9px] font-label tracking-[0.25em] uppercase font-bold text-on-surface-variant">
                {l === 'ua' ? 'Перевірено' : 'Vetted'} 2025
              </div>
            </div>
          </div>
        </header>

        {/* ── Directory (Client) ── */}
        <ClinicsDirectory clinics={clinics} lang={l} phones={phones} />
      </main>
    </>
  );
}
