import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getService, getServices } from '@/lib/api';
import type { Lang } from '@/lib/api';
import { ServiceInquiryForm } from '@/components/ServiceInquiryForm';
import { getPlaceholder } from '@/lib/placeholder';

const categoryLabels: Record<string, Record<'ua' | 'en', string>> = {
  diagnostics: { ua: 'Діагностика', en: 'Diagnostics' },
  treatment: { ua: 'Лікування', en: 'Treatment' },
  rehabilitation: { ua: 'Реабілітація', en: 'Rehabilitation' },
  wellness: { ua: 'Wellness', en: 'Wellness' },
  dental: { ua: 'Стоматологія', en: 'Dental' },
  cosmetic: { ua: 'Косметологія', en: 'Cosmetic' },
  medical: { ua: 'Медицина', en: 'Medical' },
};

const PLACEHOLDER_IMG = getPlaceholder('service');

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const service = await getService(slug, lang as Lang).catch(() => null);
  if (!service) return { title: 'Service | TEZAURUS-TOUR' };
  return {
    title: `${service.metaTitle || service.name} | TEZAURUS-TOUR`,
    description: service.metaDescription || service.description?.replace(/<[^>]*>/g, '').slice(0, 160),
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l = lang as Lang;
  const service = await getService(slug, l).catch(() => null);
  if (!service) notFound();

  const allServices = await getServices(l).catch(() => []);
  const related = allServices
    .filter((s: { slug: string; category: string | null }) => s.slug !== slug && s.category === service.category)
    .slice(0, 3);

  const t = (ua: string, en: string) => (l === 'ua' ? ua : en);

  const categoryLabel = service.category
    ? categoryLabels[service.category]?.[l] || service.category
    : null;

  const plainDescription = service.description?.replace(/<[^>]*>/g, '') || '';
  const hasHtml = service.description && service.description !== plainDescription;

  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[60vh] md:h-[70vh] min-h-[400px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.imageUrl || PLACEHOLDER_IMG}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16 max-w-site mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link href={`/${l}`} className="hover:text-white transition-colors">
              {t('Головна', 'Home')}
            </Link>
            <span>/</span>
            <Link href={`/${l}/services`} className="hover:text-white transition-colors">
              {t('Послуги', 'Services')}
            </Link>
            <span>/</span>
            <span className="text-white/90">{service.name}</span>
          </nav>

          {categoryLabel && (
            <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] text-white font-bold mb-4">
              {categoryLabel}
            </span>
          )}
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white font-light leading-tight max-w-3xl">
            {service.name}
          </h1>
        </div>
      </section>

      {/* Key Details Strip */}
      <section className="bg-surface-container-low border-b border-outline-variant/10">
        <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12 py-6 flex flex-wrap gap-8 md:gap-12">
          {(service.country || service.city) && (
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">{t('Напрямок', 'Destination')}</p>
                <p className="font-medium">{[service.city, service.country].filter(Boolean).join(', ')}</p>
              </div>
            </div>
          )}
          {service.duration && (
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">{t('Тривалість', 'Duration')}</p>
                <p className="font-medium">{service.duration}</p>
              </div>
            </div>
          )}
          {service.priceFrom && (
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">payments</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">{t('Вартість від', 'Starting from')}</p>
                <p className="font-headline text-xl text-primary">
                  {service.currency === 'EUR' ? '€' : '$'}{service.priceFrom.toLocaleString('en-US')}
                </p>
              </div>
            </div>
          )}
          {service.featured && (
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-secondary font-semibold text-sm">{t('Рекомендовано', 'Featured')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          {/* Description Column */}
          <div className="lg:col-span-2">
            <h2 className="font-headline text-3xl md:text-4xl text-primary mb-8">
              {t('Про послугу', 'About This Service')}
            </h2>
            {hasHtml ? (
              <div
                className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed
                  [&_h2]:font-headline [&_h2]:text-primary [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
                  [&_h3]:font-headline [&_h3]:text-primary [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            ) : (
              <p className="text-on-surface-variant text-lg leading-relaxed whitespace-pre-line">
                {plainDescription}
              </p>
            )}

            {/* Tags */}
            {service.tags && service.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-outline-variant/10">
                <h3 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4">
                  {t('Теги', 'Tags')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 bg-surface-container-low rounded-full text-sm text-on-surface-variant font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Quick CTA Card */}
              <div className="bg-primary-container rounded-2xl p-8 text-white">
                <h3 className="font-headline text-2xl mb-3">
                  {t('Зацікавило?', 'Interested?')}
                </h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {t(
                    'Отримайте безкоштовну консультацію від нашої команди медичних експертів.',
                    'Get a free consultation from our team of medical experts.'
                  )}
                </p>
                <a
                  href="#inquiry-form"
                  className="block w-full py-3.5 rounded-xl bg-white text-primary text-center font-bold text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
                >
                  {t('Залишити заявку', 'Submit Inquiry')}
                </a>
                <Link
                  href={`/${l}/contacts?subject=${encodeURIComponent(service.name)}`}
                  className="block w-full py-3.5 rounded-xl border border-white/30 text-white text-center font-bold text-sm uppercase tracking-wider mt-3 hover:bg-white/10 transition-colors"
                >
                  {t("Зв'яжіться з нами", 'Contact Us')}
                </Link>
              </div>

              {/* Info card */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-4 border border-outline-variant/10">
                <h4 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant/60">
                  {t('Деталі', 'Details')}
                </h4>
                {categoryLabel && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant/60">{t('Категорія', 'Category')}</span>
                    <span className="font-medium">{categoryLabel}</span>
                  </div>
                )}
                {(service.country || service.city) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant/60">{t('Місце', 'Location')}</span>
                    <span className="font-medium">{[service.city, service.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {service.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant/60">{t('Тривалість', 'Duration')}</span>
                    <span className="font-medium">{service.duration}</span>
                  </div>
                )}
                {service.priceFrom && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant/60">{t('Від', 'From')}</span>
                    <span className="font-headline text-primary text-lg">
                      {service.currency === 'EUR' ? '€' : '$'}{service.priceFrom.toLocaleString('en-US')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Services */}
      {related.length > 0 && (
        <section className="bg-surface-container-low py-16 md:py-24">
          <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase mb-3 block">
                  {t('Також рекомендуємо', 'You May Also Like')}
                </span>
                <h2 className="font-headline text-3xl md:text-4xl text-primary">
                  {t('Схожі послуги', 'Related Services')}
                </h2>
              </div>
              <Link
                href={`/${l}/services`}
                className="hidden md:flex items-center gap-2 text-primary font-label text-sm uppercase tracking-wider hover:underline"
              >
                {t('Усі послуги', 'All Services')}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {related.map((svc: { id: string; slug: string; name: string; imageUrl: string | null; category: string | null; country: string | null; city: string | null }) => (
                <Link key={svc.id} href={`/${l}/services/${svc.slug}`} className="group block rounded-2xl border border-primary/10 hover:border-secondary/35 transition-colors overflow-hidden bg-white">
                  <div className="relative overflow-hidden aspect-[4/5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={svc.imageUrl || PLACEHOLDER_IMG}
                      alt={svc.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    {svc.category && (
                      <p className="font-label text-[10px] uppercase tracking-[0.2em] font-bold text-secondary mb-1">
                        {categoryLabels[svc.category]?.[l] || svc.category}
                      </p>
                    )}
                    <h3 className="font-headline text-xl text-primary group-hover:underline decoration-1 underline-offset-4">
                      {svc.name}
                    </h3>
                    {(svc.country || svc.city) && (
                      <p className="text-sm text-on-surface-variant/60 mt-1">
                        {[svc.city, svc.country].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry Form Section */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <ServiceInquiryForm
            lang={l}
            serviceName={service.name}
            serviceSlug={service.slug}
            type="service"
          />
        </div>
      </section>
    </>
  );
}
