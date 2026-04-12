import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getSettings } from '@/lib/api';

export const dynamic = 'force-dynamic';

const LOCALES = ['ua', 'en'] as const;
type Lang = (typeof LOCALES)[number];

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Lang)) notFound();
  const settings = await getSettings();
  return (
    <>
      <Header lang={lang as Lang} settings={settings} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer lang={lang as Lang} settings={settings} />
    </>
  );
}
