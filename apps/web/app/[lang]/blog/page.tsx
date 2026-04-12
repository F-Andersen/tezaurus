import { getBlog } from '@/lib/api';
import Link from 'next/link';
import type { Lang } from '@/lib/api';
import type { Metadata } from 'next';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  image?: string;
  category?: { slug?: string; name?: string };
  author?: { name?: string; role?: string; avatar?: string };
};

const CATEGORIES_EN = ['All Insights', 'Innovation', 'Wellness', 'Travel Tips', 'Patient Stories'];
const CATEGORIES_UA = ['Усі матеріали', 'Інновації', 'Здоров\'я', 'Поради', 'Історії пацієнтів'];
const CATEGORY_SLUGS = ['', 'innovation', 'wellness', 'travel', 'patient-stories'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isUa = lang === 'ua';
  return {
    title: isUa ? 'Журнал — TEZAURUS-TOUR' : 'The Journal — TEZAURUS-TOUR',
    description: isUa
      ? 'Статті та поради про медичний туризм, інновації, здоров\'я та подорожі.'
      : 'Insights and innovations in medical tourism, wellness, and luxury travel.',
  };
}

function formatDate(date: string, lang: Lang) {
  return new Date(date).toLocaleDateString(
    lang === 'ua' ? 'uk-UA' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { lang } = await params;
  const sp = await searchParams;
  const l = lang as Lang;
  const isUa = l === 'ua';

  const activeCategory = sp.category || '';
  const posts: BlogPost[] = await getBlog(l, activeCategory || undefined);

  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  const ITEMS_PER_PAGE = 6;
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10));
  const totalPages = Math.max(1, Math.ceil(rest.length / ITEMS_PER_PAGE));
  const paginated = rest.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const categories = isUa ? CATEGORIES_UA : CATEGORIES_EN;

  return (
    <main className="pb-24 pt-28">
      {/* ── Hero ── */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 mb-16 md:mb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-outline-variant/10 pb-12">
          <div className="max-w-2xl">
            <span className="font-label text-xs tracking-[0.2em] text-on-primary-container uppercase mb-4 block">
              {isUa ? 'Наш журнал' : 'Our Journal'}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-light tracking-tight text-primary leading-tight">
              {isUa ? (
                <>Журнал: <span className="italic">Ідеї та Інновації</span></>
              ) : (
                <>The Journal: <span className="italic">Insights & Innovations</span></>
              )}
            </h1>
          </div>
          <div className="w-full md:w-80">
            <div className="relative group">
              <input
                className="w-full bg-transparent border-b border-outline-variant/30 py-3 pr-10 focus:outline-none focus:border-primary transition-all font-body text-sm placeholder:text-outline"
                placeholder={isUa ? 'Пошук в архівах...' : 'Search the archives...'}
                type="text"
              />
              <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-outline">search</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Post ── */}
      {featured && (
        <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 mb-20 md:mb-28">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="col-span-1 lg:col-span-8 overflow-hidden rounded-xl">
              {featured.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="w-full h-[300px] sm:h-[400px] lg:h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                  src={featured.image}
                  alt={featured.title}
                />
              ) : (
                <div className="w-full h-[300px] sm:h-[400px] lg:h-[600px] bg-gradient-to-br from-primary-container to-primary" />
              )}
            </div>
            <div className="col-span-1 lg:col-span-6 lg:col-start-7 lg:-ml-20 mt-[-3rem] lg:mt-0 mx-4 lg:mx-0 bg-white p-8 sm:p-12 md:p-16 rounded-xl shadow-[0_40px_60px_-15px_rgba(27,28,27,0.06)] relative z-10">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {featured.category?.name && (
                  <span className="font-label text-xs tracking-widest text-on-tertiary-container uppercase px-3 py-1 bg-tertiary-fixed rounded-full">
                    {featured.category.name}
                  </span>
                )}
                {featured.publishedAt && (
                  <span className="text-xs text-outline font-body">
                    {formatDate(featured.publishedAt, l)}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-headline font-light text-primary leading-tight mb-6">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-8 font-body line-clamp-3">
                  {featured.excerpt}
                </p>
              )}
              <Link
                href={`/${lang}/blog/${featured.slug}`}
                className="inline-flex items-center group"
              >
                <span className="font-label font-semibold text-primary tracking-wide">
                  {isUa ? 'Читати повністю' : 'Read the Full Feature'}
                </span>
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Category Filters ── */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 mb-12 md:mb-16">
        <div className="flex flex-wrap items-center gap-3 md:gap-4 border-y border-outline-variant/10 py-6 overflow-x-auto">
          <span className="font-label text-xs font-bold tracking-widest text-on-surface-variant uppercase mr-2 md:mr-4 shrink-0">
            {isUa ? 'Фільтр:' : 'Filter by:'}
          </span>
          {categories.map((cat, i) => {
            const slug = CATEGORY_SLUGS[i];
            const isActive = activeCategory === slug;
            const href = slug
              ? `/${lang}/blog?category=${slug}`
              : `/${lang}/blog`;
            return (
              <Link
                key={slug}
                href={href}
                className={`px-5 md:px-6 py-2 rounded-full font-label text-sm tracking-wide transition-colors shrink-0 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-lg'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Article Grid ── */}
      <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 mb-20 md:mb-28">
        {paginated.length === 0 && !featured ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 block">article</span>
            <p className="font-headline text-2xl text-primary mb-2">
              {isUa ? 'Статті незабаром' : 'Articles Coming Soon'}
            </p>
            <p className="text-on-surface-variant">
              {isUa ? 'Ми працюємо над цікавим контентом для вас.' : 'We are working on exciting content for you.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-16 lg:gap-y-20">
            {paginated.map((post) => (
              <Link key={post.id} href={`/${lang}/blog/${post.slug}`} className="group block">
                <article>
                  <div className="mb-6 overflow-hidden rounded-xl bg-surface-container-low aspect-[4/5]">
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={post.image}
                        alt={post.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-outline-variant">article</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      {post.category?.name && (
                        <span className="font-label text-[10px] tracking-[0.2em] text-on-secondary-container uppercase">
                          {post.category.name}
                        </span>
                      )}
                      {post.publishedAt && (
                        <span className="text-[11px] text-outline">
                          {formatDate(post.publishedAt, l)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-headline font-light leading-snug group-hover:text-on-primary-container transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-on-surface-variant text-sm line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <section className="max-w-site mx-auto px-6 md:px-10 lg:px-12 pb-20">
          <div className="flex items-center justify-between border-t border-outline-variant/10 pt-12">
            {currentPage > 1 ? (
              <Link
                href={`/${lang}/blog?${new URLSearchParams({ ...(activeCategory ? { category: activeCategory } : {}), page: String(currentPage - 1) })}`}
                className="flex items-center gap-2 group text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="font-label text-sm uppercase tracking-widest">
                  {isUa ? 'Попередня' : 'Previous'}
                </span>
              </Link>
            ) : (
              <div />
            )}

            <div className="hidden sm:flex items-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                if (totalPages > 7 && pg > 3 && pg < totalPages - 1 && Math.abs(pg - currentPage) > 1) {
                  if (pg === 4 || pg === totalPages - 2) {
                    return <span key={pg} className="text-outline">...</span>;
                  }
                  return null;
                }
                return (
                  <Link
                    key={pg}
                    href={`/${lang}/blog?${new URLSearchParams({ ...(activeCategory ? { category: activeCategory } : {}), page: String(pg) })}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-body text-sm transition-colors ${
                      pg === currentPage
                        ? 'bg-primary text-on-primary'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    {pg}
                  </Link>
                );
              })}
            </div>

            <div className="sm:hidden text-sm text-on-surface-variant font-body">
              {currentPage} / {totalPages}
            </div>

            {currentPage < totalPages ? (
              <Link
                href={`/${lang}/blog?${new URLSearchParams({ ...(activeCategory ? { category: activeCategory } : {}), page: String(currentPage + 1) })}`}
                className="flex items-center gap-2 group text-outline hover:text-primary transition-colors"
              >
                <span className="font-label text-sm uppercase tracking-widest">
                  {isUa ? 'Наступна' : 'Next'}
                </span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}
    </main>
  );
}
