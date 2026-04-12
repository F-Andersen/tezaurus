import { getPage } from '@/lib/api';
import type { Lang } from '@/lib/api';

export const metadata = { title: 'Cookies | TEZAURUS-TOUR', description: 'Cookies' };

export default async function CookiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const page = await getPage('cookies', l).catch(() => null);
  const title = page?.title || (l === 'ua' ? 'Cookies' : 'Cookies');
  const content = page?.content || (l === 'ua' ? 'Інформація про cookies.' : 'Cookies information.');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1>{title}</h1>
      <div style={{ marginTop: '1rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
