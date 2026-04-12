import { notFound } from 'next/navigation';
import { getClinic } from '@/lib/api';
import type { Lang } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const clinic = await getClinic(slug, lang as Lang).catch(() => null);
  if (!clinic) return { title: 'Clinic | TEZAURUS-TOUR' };
  return {
    title: `${clinic.metaTitle || clinic.name} | TEZAURUS-TOUR`,
    description: clinic.metaDescription || clinic.description?.slice(0, 160),
  };
}

export default async function ClinicPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l = lang as Lang;
  const clinic = await getClinic(slug, l).catch(() => null);
  if (!clinic) notFound();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1>{clinic.name}</h1>
      {(clinic.country || clinic.city) && (
        <p style={{ color: '#666', marginTop: '0.5rem' }}>{[clinic.country, clinic.city].filter(Boolean).join(', ')}</p>
      )}
      {clinic.images?.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {clinic.images.map((img: { id: string; key: string; url?: string | null; alt?: string }) => (
            img.url ? <img key={img.id} src={img.url} alt={img.alt || ''} style={{ maxWidth: 200, height: 'auto', borderRadius: 8 }} /> : null
          ))}
        </div>
      )}
      {clinic.specializations?.length > 0 && (
        <p style={{ marginTop: '1rem' }}><strong>{l === 'ua' ? 'Спеціалізації:' : 'Specializations:'}</strong> {clinic.specializations.join(', ')}</p>
      )}
      <div style={{ marginTop: '1rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: clinic.description || '' }} />
    </div>
  );
}
