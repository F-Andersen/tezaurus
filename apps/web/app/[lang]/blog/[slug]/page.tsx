import { notFound } from 'next/navigation';
import { getBlogPost, getBlog } from '@/lib/api';
import Link from 'next/link';
import type { Lang } from '@/lib/api';
import type { Metadata } from 'next';
import { getPlaceholder } from '@/lib/placeholder';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  publishedAt?: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  readTime?: number;
  category?: { slug?: string; name?: string };
  author?: { name?: string; role?: string; avatar?: string };
  tags?: string[];
  pullQuote?: string;
  tableOfContents?: { id: string; title: string }[];
  contributors?: { name: string; avatar?: string }[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post: BlogPost | null = await getBlogPost(slug, lang as Lang).catch(() => null);
  if (!post) return { title: 'Blog — TEZAURUS-TOUR' };
  return {
    title: `${post.metaTitle || post.title} — TEZAURUS-TOUR`,
    description: post.metaDescription || post.excerpt?.slice(0, 160),
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt?.slice(0, 160),
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
  };
}

function formatDate(date: string, lang: Lang) {
  return new Date(date).toLocaleDateString(
    lang === 'ua' ? 'uk-UA' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );
}

function estimateReadTime(html?: string): number {
  if (!html) return 5;
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const l = lang as Lang;
  const isUa = l === 'ua';

  const post: BlogPost | null = await getBlogPost(slug, l).catch(() => null);
  if (!post) notFound();

  const allPosts: BlogPost[] = await getBlog(l).catch(() => []);
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const readTime = post.readTime || estimateReadTime(post.body);

  const toc = post.tableOfContents ?? extractHeadingsFromHtml(post.body);

  return (
    <main className="pt-28 pb-24">
      <div className="max-w-site mx-auto px-6 md:px-10 lg:px-12">
        {/* ── Breadcrumb ── */}
        <nav className="mb-10 md:mb-12" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-on-surface-variant font-label tracking-wide uppercase">
            <li>
              <Link href={`/${lang}/blog`} className="hover:text-primary transition-colors">
                {isUa ? 'Журнал' : 'Journal'}
              </Link>
            </li>
            {post.category?.name && (
              <>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-xs mx-1.5">chevron_right</span>
                </li>
                <li>
                  <Link
                    href={`/${lang}/blog?category=${post.category.slug || ''}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.category.name}
                  </Link>
                </li>
              </>
            )}
            <li className="flex items-center">
              <span className="material-symbols-outlined text-xs mx-1.5">chevron_right</span>
            </li>
            <li className="text-primary/40 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        {/* ── Header ── */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16 md:mb-20">
          <div className="lg:col-span-8">
            {post.category?.name && (
              <span className="inline-block font-label text-xs tracking-widest text-on-surface-variant uppercase px-3 py-1 bg-surface-container-low rounded-full mb-6">
                {post.category.name}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-headline font-light leading-[1.1] text-primary mb-8 md:mb-10 tracking-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              {post.author?.name && (
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.author.avatar || getPlaceholder('user')}
                    alt={post.author.name}
                    className="w-11 h-11 rounded-full object-cover bg-surface-container"
                  />
                  <div>
                    <p className="text-sm font-bold text-primary">{post.author.name}</p>
                    {post.author.role && (
                      <p className="text-xs text-on-surface-variant">{post.author.role}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="h-8 w-px bg-outline-variant/20 hidden sm:block" />
              <div>
                {post.publishedAt && (
                  <p className="text-sm font-bold text-primary">{formatDate(post.publishedAt, l)}</p>
                )}
                <p className="text-xs text-on-surface-variant">
                  {readTime} {isUa ? 'хв читання' : 'min read'}
                </p>
              </div>
            </div>
          </div>

          {post.pullQuote && (
            <div className="lg:col-span-4 hidden lg:block pb-2">
              <p className="text-on-surface-variant text-lg leading-relaxed italic border-l-2 border-primary/10 pl-6">
                &ldquo;{post.pullQuote}&rdquo;
              </p>
            </div>
          )}
        </header>

        {/* ── Hero Image ── */}
        <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-16 md:mb-24 shadow-2xl shadow-primary/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={post.title}
            className="w-full h-full object-cover"
            src={post.image || getPlaceholder('blog')}
          />
        </div>

        {/* ── Article Body + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Article Content */}
          <article className="lg:col-span-8 min-w-0">
            {post.excerpt && !post.body && (
              <p className="text-2xl font-headline text-primary leading-snug mb-10">
                {post.excerpt}
              </p>
            )}
            <div
              className="prose-editorial"
              dangerouslySetInnerHTML={{ __html: post.body || '' }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-10">
              {/* Table of Contents */}
              {toc.length > 0 && (
                <div className="p-8 bg-surface-container-low rounded-xl">
                  <h4 className="font-headline text-xl text-primary mb-8 border-b border-outline-variant/20 pb-4">
                    {isUa ? 'У цій статті' : 'In this article'}
                  </h4>
                  <nav className="space-y-4">
                    {toc.map((item, i) => (
                      <a
                        key={item.id || i}
                        href={`#${item.id}`}
                        className="flex items-center text-on-surface-variant hover:text-primary group transition-colors text-sm"
                      >
                        <span className="w-4 h-px bg-outline-variant mr-4 transition-all group-hover:w-8 group-hover:bg-primary shrink-0" />
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* CTA Card */}
              <div className="relative p-8 md:p-10 bg-primary-container text-white rounded-xl overflow-hidden shadow-xl shadow-primary-container/20">
                <div className="relative z-10">
                  <h4 className="font-headline text-2xl md:text-3xl mb-5 leading-tight">
                    {isUa ? (
                      <>Розпочніть свою <span className="italic">трансформацію</span></>
                    ) : (
                      <>Embark on Your <span className="italic">Transformation</span></>
                    )}
                  </h4>
                  <p className="text-on-primary-container mb-8 leading-relaxed font-light text-sm md:text-base">
                    {isUa
                      ? 'Запишіться на приватну консультацію зі спеціалістами для створення індивідуальної програми.'
                      : 'Book a private consultation with our specialists to explore bespoke programs tailored to your unique needs.'}
                  </p>
                  <Link
                    href={`/${lang}/contacts`}
                    className="block w-full py-3.5 bg-white text-primary font-bold rounded-full hover:bg-surface-container-low transition-all text-center text-sm"
                  >
                    {isUa ? 'Безкоштовна консультація' : 'Free Consultation'}
                  </Link>
                </div>
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
              </div>

              {/* Expert Contributors */}
              {post.contributors && post.contributors.length > 0 && (
                <div className="p-8 border border-outline-variant/10 rounded-xl">
                  <h4 className="font-headline text-xl text-primary mb-6">
                    {isUa ? 'Автори та експерти' : 'Expert Contributors'}
                  </h4>
                  <div className="space-y-5">
                    {post.contributors.map((c, i) => (
                      <div key={i} className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.avatar || getPlaceholder('user')}
                          alt={c.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="p-8 border border-outline-variant/10 rounded-xl">
                  <h4 className="font-headline text-xl text-primary mb-6">
                    {isUa ? 'Теги' : 'Tags'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 bg-surface-container-low text-on-surface-variant text-xs font-label tracking-wide rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* ── Further Reading ── */}
        {related.length > 0 && (
          <section className="mt-28 md:mt-40 border-t border-outline-variant/10 pt-16 md:pt-24">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 md:mb-16 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-headline text-primary mb-3 tracking-tight">
                  {isUa ? 'Читайте також' : 'Further Reading'}
                </h2>
                <p className="text-on-surface-variant">
                  {isUa ? 'Добірка матеріалів від нашої редакції.' : 'Curated insights from our editorial team.'}
                </p>
              </div>
              <Link
                href={`/${lang}/blog`}
                className="hidden md:block text-sm font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-1 hover:border-primary transition-all shrink-0"
              >
                {isUa ? 'Усі статті' : 'View All Articles'}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {related.map((r) => (
                <Link key={r.id} href={`/${lang}/blog/${r.slug}`} className="group block rounded-2xl border border-primary/10 hover:border-secondary/35 transition-colors overflow-hidden bg-white">
                  <article>
                    <div className="aspect-[4/5] overflow-hidden bg-surface-container-low">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={r.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={r.image || getPlaceholder('blog')}
                      />
                    </div>
                    <div className="p-5">
                      {r.category?.name && (
                        <span className="text-xs font-bold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                          {r.category.name}
                        </span>
                      )}
                      <h3 className="text-xl lg:text-2xl font-headline text-primary group-hover:text-primary/70 transition-colors leading-snug">
                        {r.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            <div className="md:hidden mt-10 text-center">
              <Link
                href={`/${lang}/blog`}
                className="inline-block text-sm font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-1"
              >
                {isUa ? 'Усі статті' : 'View All Articles'}
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function extractHeadingsFromHtml(html?: string): { id: string; title: string }[] {
  if (!html) return [];
  const headings: { id: string; title: string }[] = [];
  const regex = /<h[23][^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const title = match[2].replace(/<[^>]*>/g, '').trim();
    if (title) {
      headings.push({
        id: match[1] || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        title,
      });
    }
  }
  return headings;
}
