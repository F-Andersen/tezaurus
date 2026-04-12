import { getPage } from '@/lib/api';
import type { Lang } from '@/lib/api';

export const metadata = { title: 'Privacy | TEZAURUS-TOUR', description: 'Privacy Policy' };

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const page = await getPage('privacy', l).catch(() => null);
  const title = page?.title || (l === 'ua' ? 'Політика конфіденційності' : 'Privacy Policy');
  const content = page?.content || (l === 'ua' ? 'Текст політики конфіденційності.' : 'Privacy policy text.');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1>{title}</h1>
      <div style={{ marginTop: '1rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
