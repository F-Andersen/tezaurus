import { getBlog } from '@/lib/api';
import Link from 'next/link';
import type { Lang } from '@/lib/api';
import type { Metadata } from 'next';
import { getPlaceholder } from '@/lib/placeholder';

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

const CATEGORIES_EN = ['All Perspectives', 'Longevity', 'Medical', 'Research', 'Bio-Design', 'Case Studies'];
const CATEGORIES_UA = ['Усі матеріали', 'Довголіття', 'Медицина', 'Дослідження', 'Біо-Дизайн', 'Кейси'];
const CATEGORY_SLUGS = ['', 'longevity', 'medical', 'research', 'bio-design', 'case-studies'];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isUa = lang === 'ua';
  return {
    title: isUa ? 'Журнал — TEZAURUS·TOUR' : 'The Clinical Dispatch — TEZAURUS·TOUR',
    description: isUa
      ? 'Статті та поради про медичний туризм, інновації, здоров\'я та подорожі.'
      : 'Curated intelligence at the intersection of medical innovation and luxury wellness travel.',
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
    <main className="pt-32 pb-24">
      {/* ── 1. Editorial Header ── */}
      <header className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="label-caption text-secondary mb-4 block">
              {isUa ? 'Клінічний Дайджест' : 'The Clinical Dispatch'}
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-headline leading-tight tracking-tighter">
              {isUa ? (
                <>Інсайти для сучасного <span className="italic text-secondary">Пацієнта.</span></>
              ) : (
                <>Insights for the Modern <span className="italic text-secondary">Patient.</span></>
              )}
            </h1>
          </div>
          <div className="pb-4">
            <p className="font-body text-lg text-on-surface-variant max-w-xs leading-relaxed">
              {isUa
                ? 'Куровані матеріали на перетині медичних інновацій та оздоровчого туризму преміум-класу.'
                : 'Curated intelligence at the intersection of medical innovation and luxury wellness travel.'}
            </p>
          </div>
        </div>
      </header>

      {/* ── 2. Category Filters ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="flex flex-wrap items-center gap-4 py-6 border-y border-outline-variant/20">
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
                className={`px-6 py-2 rounded-full font-label text-sm tracking-wide transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {cat}
              </Link>
            );
          })}
          <div className="ml-auto">
            <span className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase cursor-default">
              {isUa ? 'Пошук' : 'Search'}
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. Featured Article (Asymmetric) ── */}
      {featured && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
          <div className="grid grid-cols-12 gap-0 items-center">
            {/* Text block */}
            <div className="col-span-12 lg:col-span-7 relative z-10">
              <div className="blog-card p-8 sm:p-12 lg:p-20">
                <span className="label-caption text-secondary mb-6 block">
                  {isUa ? 'Обране' : 'Featured Briefing'}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline mb-8 leading-tight">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-on-surface-variant text-lg leading-relaxed mb-10 font-body line-clamp-4">
                    {featured.excerpt}
                  </p>
                )}
                {featured.author && (
                  <div className="flex items-center gap-4 mb-10">
                    <div className="h-12 w-12 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-full h-full object-cover"
                        src={featured.author.avatar || getPlaceholder('user')}
                        alt={featured.author.name || ''}
                      />
                    </div>
                    <div>
                      {featured.author.name && (
                        <p className="text-sm font-bold text-primary">{featured.author.name}</p>
                      )}
                      {featured.author.role && (
                        <p className="label-caption text-on-surface-variant/70">{featured.author.role}</p>
                      )}
                    </div>
                  </div>
                )}
                <Link
                  href={`/${lang}/blog/${featured.slug}`}
                  className="inline-flex items-center gap-3 text-secondary font-bold tracking-widest uppercase text-xs group"
                >
                  {isUa ? 'Читати повний матеріал' : 'Read the Full Report'}
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_right_alt</span>
                </Link>
              </div>
            </div>
            {/* Image */}
            <div className="col-span-12 lg:col-span-6 lg:-ml-24 mt-8 lg:mt-0">
              <div className="aspect-[4/5] w-full rounded-xl overflow-hidden shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
                  src={featured.image || getPlaceholder('blog')}
                  alt={featured.title}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Latest Perspectives Grid ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="flex items-baseline justify-between mb-12 border-b border-outline-variant/20 pb-6">
          <h3 className="text-3xl font-headline">
            {isUa ? 'Останні публікації' : 'Latest Perspectives'}
          </h3>
          <span className="label-caption text-secondary">
            {isUa ? 'Архів' : 'Archive'}
          </span>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {paginated.map((post) => (
              <Link key={post.id} href={`/${lang}/blog/${post.slug}`} className="group block">
                <article className="blog-card flex flex-col p-6 h-full">
                  <div className="aspect-[3/2] rounded-xl overflow-hidden mb-6 bg-surface-container-low">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={post.image || getPlaceholder('blog')}
                      alt={post.title}
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    {post.category?.name && (
                      <span className="label-caption px-2 py-1 bg-secondary-container text-on-secondary-container rounded">
                        {post.category.name}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="label-caption text-on-surface-variant/60">
                        {formatDate(post.publishedAt, l)}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-headline mb-4 leading-snug group-hover:text-secondary transition-colors">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                    {post.publishedAt && (
                      <span className="label-caption text-on-surface-variant/70">
                        {formatDate(post.publishedAt, l)}
                      </span>
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
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
          <div className="flex items-center justify-between border-t border-outline-variant/20 pt-12">
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

      {/* ── 5. Newsletter Block ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-primary-container rounded-2xl p-8 sm:p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 border border-white/10">
          {/* Radial gradient accent */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary to-transparent blur-3xl" />
          </div>

          {/* Left: quote + label */}
          <div className="relative z-10 lg:w-1/2">
            <span className="text-white/70 label-caption mb-4 block">
              {isUa ? 'Тижневий дайджест' : 'The Weekly Briefing'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline text-white/[0.92] mb-6">
              {isUa ? (
                <>Експертиза, доставлена у вашу <span className="italic">приватну</span> скриньку.</>
              ) : (
                <>Expertise, delivered to your <span className="italic">private</span> inbox.</>
              )}
            </h2>
            <p className="text-white/[0.82] text-lg leading-relaxed font-body">
              {isUa
                ? 'Приєднуйтесь до 15 000+ вимогливих читачів, які щонеділі отримують наш огляд новин медичного туризму.'
                : 'Join 15,000+ discerning readers who receive our curated selection of medical travel news every Sunday.'}
            </p>
          </div>

          {/* Right: form */}
          <div className="relative z-10 lg:w-1/2 w-full">
            <form className="flex flex-col gap-4">
              <input
                className="w-full bg-white/10 border-0 border-b-2 border-white/30 text-white placeholder:text-white/50 px-0 py-4 focus:ring-0 focus:border-white transition-all text-lg font-body outline-none"
                placeholder="email@address.com"
                type="email"
              />
              <button
                type="submit"
                className="bg-secondary text-white font-bold py-5 rounded-lg label-caption hover:bg-secondary-fixed-dim hover:text-on-secondary-fixed transition-all flex items-center justify-center gap-4 group"
              >
                {isUa ? 'Підписатися' : 'Request Subscription'}
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">send</span>
              </button>
              <p className="label-caption text-white/40 mt-2 text-center lg:text-left">
                {isUa ? 'Жодного спаму. Відписка в будь-який час.' : 'Strictly no spam. Unsubscribe anytime.'}
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
