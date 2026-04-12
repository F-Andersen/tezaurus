import { getSettings } from '@/lib/api';
import type { Lang } from '@/lib/api';

export const metadata = { title: 'Medical disclaimer | TEZAURUS-TOUR', description: 'Medical disclaimer' };

export default async function MedicalDisclaimerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const settings = await getSettings();
  const content = (l === 'ua' ? settings.disclaimer_ua : settings.disclaimer_en) as string | undefined;
  const title = l === 'ua' ? 'Медичний дисклеймер' : 'Medical disclaimer';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1>{title}</h1>
      <div style={{ marginTop: '1rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: content || (l === 'ua' ? 'Медичний дисклеймер.' : 'Medical disclaimer.') }} />
    </div>
  );
}
