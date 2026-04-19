import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getClinic, getClinics } from '@/lib/api';
import type { Lang } from '@/lib/api';
import { ServiceInquiryForm } from '@/components/ServiceInquiryForm';
import { ClinicGallery } from '@/components/ClinicGallery';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const clinic = await getClinic(slug, lang as Lang).catch(() => null);
  if (!clinic) return { title: 'Clinic | TEZAURUS-TOUR' };
  return {
    title: `${clinic.metaTitle || clinic.name} | TEZAURUS-TOUR`,
    description: clinic.metaDescription || clinic.description?.replace(/<[^>]*>/g, '').slice(0, 160),
  };
}

export default async function ClinicDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l = lang as Lang;
  const clinic = await getClinic(slug, l).catch(() => null);
  if (!clinic) notFound();

  const allClinics = await getClinics(l).catch(() => []);
  const related = allClinics
    .filter((c: { slug: string; country?: string }) => c.slug !== slug && c.country === clinic.country)
    .slice(0, 3);

  const t = (ua: string, en: string) => (l === 'ua' ? ua : en);

  const images = (clinic.images || []).filter((img: { url?: string | null }) => img.url);
  const heroImage = images[0]?.url || null;

  const plainDescription = clinic.description?.replace(/<[^>]*>/g, '') || '';
  const hasHtml = clinic.description && clinic.description !== plainDescription;

  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[50vh] md:h-[65vh] min-h-[380px] overflow-hidden">
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={clinic.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16 max-w-site mx-auto">
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link href={`/${l}`} className="hover:text-white transition-colors">
              {t('Головна', 'Home')}
            </Link>
            <span>/</span>
            <Link href={`/${l}/clinics`} className="hover:text-white transition-colors">
              {t('Клініки', 'Clinics')}
            </Link>
            <span>/</span>
            <span className="text-white/90">{clinic.name}</span>
          </nav>

          {clinic.country && (
            <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] text-white font-bold mb-4">
              {[clinic.city, clinic.country].filter(Boolean).join(', ')}
            </span>
          )}
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white font-light leading-tight max-w-3xl">
            {clinic.name}
          </h1>
        </div>
      </section>

      {/* Specializations Strip */}
      {clinic.specializations && clinic.specializations.length > 0 && (
        <section className="bg-surface-container-low border-b border-outline-variant/10">
          <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12 py-5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold mr-2">
                {t('Спеціалізації', 'Specializations')}:
              </span>
              {clinic.specializations.map((spec: string) => (
                <span
                  key={spec}
                  className="px-3.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          {/* Content Column */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            {images.length > 1 && (
              <div className="mb-12">
                <h2 className="font-headline text-2xl text-primary mb-6">{t('Галерея', 'Gallery')}</h2>
                <ClinicGallery images={images} clinicName={clinic.name} />
              </div>
            )}

            {/* Description */}
            <h2 className="font-headline text-3xl md:text-4xl text-primary mb-8">
              {t('Про клініку', 'About the Clinic')}
            </h2>
            {hasHtml ? (
              <div
                className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed
                  [&_h2]:font-headline [&_h2]:text-primary [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
                  [&_h3]:font-headline [&_h3]:text-primary [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: clinic.description }}
              />
            ) : (
              <p className="text-on-surface-variant text-lg leading-relaxed whitespace-pre-line">
                {plainDescription || t(
                  'Детальна інформація про клініку буде доступна найближчим часом.',
                  'Detailed information about this clinic will be available soon.'
                )}
              </p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* CTA Card */}
              <div className="bg-primary-container rounded-2xl p-8 text-white">
                <h3 className="font-headline text-2xl mb-3">
                  {t('Запис на консультацію', 'Book a Consultation')}
                </h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {t(
                    'Наші спеціалісти допоможуть вам обрати оптимальну програму лікування в цій клініці.',
                    'Our specialists will help you choose the optimal treatment program at this clinic.'
                  )}
                </p>
                <a
                  href="#inquiry-form"
                  className="block w-full py-3.5 rounded-xl bg-white text-primary text-center font-bold text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
                >
                  {t('Залишити заявку', 'Submit Inquiry')}
                </a>
                <Link
                  href={`/${l}/contacts?subject=${encodeURIComponent(clinic.name)}`}
                  className="block w-full py-3.5 rounded-xl border border-white/30 text-white text-center font-bold text-sm uppercase tracking-wider mt-3 hover:bg-white/10 transition-colors"
                >
                  {t("Зв'яжіться з нами", 'Contact Us')}
                </Link>
              </div>

              {/* Info Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-4 border border-outline-variant/10">
                <h4 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant/60">
                  {t('Інформація', 'Information')}
                </h4>
                {clinic.country && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant/60">{t('Країна', 'Country')}</span>
                    <span className="font-medium">{clinic.country}</span>
                  </div>
                )}
                {clinic.city && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant/60">{t('Місто', 'City')}</span>
                    <span className="font-medium">{clinic.city}</span>
                  </div>
                )}
                {clinic.specializations && clinic.specializations.length > 0 && (
                  <div className="text-sm">
                    <span className="text-on-surface-variant/60 block mb-2">{t('Спеціалізації', 'Specializations')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {clinic.specializations.map((s: string) => (
                        <span key={s} className="px-2.5 py-0.5 bg-surface-container-low rounded-full text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Clinics */}
      {related.length > 0 && (
        <section className="bg-surface-container-low py-16 md:py-24">
          <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase mb-3 block">
                  {t('Також у цій країні', 'Also in This Country')}
                </span>
                <h2 className="font-headline text-3xl md:text-4xl text-primary">
                  {t('Схожі клініки', 'Related Clinics')}
                </h2>
              </div>
              <Link
                href={`/${l}/clinics`}
                className="hidden md:flex items-center gap-2 text-primary font-label text-sm uppercase tracking-wider hover:underline"
              >
                {t('Усі клініки', 'All Clinics')}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {related.map((c: { id: string; slug: string; name: string; country?: string; city?: string; images?: { url?: string | null }[] }) => {
                const img = c.images?.find((i) => i.url)?.url;
                return (
                  <Link key={c.id} href={`/${l}/clinics/${c.slug}`} className="group block rounded-2xl border border-primary/10 hover:border-secondary/35 transition-colors overflow-hidden bg-white">
                    <div className="relative overflow-hidden aspect-[4/5] bg-surface-container-low">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt={c.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center">
                          <span className="material-symbols-outlined text-5xl text-white/30">local_hospital</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-headline text-xl text-primary group-hover:underline decoration-1 underline-offset-4">
                        {c.name}
                      </h3>
                      {(c.country || c.city) && (
                        <p className="text-sm text-on-surface-variant/60 mt-1">
                          {[c.city, c.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry Form Section */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <ServiceInquiryForm
            lang={l}
            serviceName={clinic.name}
            serviceSlug={clinic.slug}
            type="clinic"
          />
        </div>
      </section>
    </>
  );
}
