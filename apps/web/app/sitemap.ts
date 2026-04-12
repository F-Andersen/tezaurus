import { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://tezaurustour.com';

async function getPaths(): Promise<{ pages: string[]; clinics: string[]; blog: string[] }> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const [pages, clinics, blog] = await Promise.all([
      fetch(`${api}/public/pages`).then((r) => r.ok ? r.json() : []).catch(() => []),
      fetch(`${api}/public/clinics?lang=ua`).then((r) => r.ok ? r.json() : []).catch(() => []),
      fetch(`${api}/public/blog?lang=ua`).then((r) => r.ok ? r.json() : []).catch(() => []),
    ]);
    const pageSlugs = Array.isArray(pages) ? pages : [];
    const clinicSlugs = Array.isArray(clinics) ? clinics.map((c: { slug: string }) => c.slug) : [];
    const blogSlugs = Array.isArray(blog) ? blog.map((p: { slug: string }) => p.slug) : [];
    return { pages: pageSlugs, clinics: clinicSlugs, blog: blogSlugs };
  } catch {
    return { pages: [], clinics: [], blog: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await getPaths();
  const staticPaths = ['', '/about', '/services', '/clinics', '/blog', '/contacts', '/privacy', '/cookies', '/medical-disclaimer'];
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of ['ua', 'en']) {
    for (const p of staticPaths) {
      entries.push({ url: `${BASE}/${lang}${p}`, lastModified: new Date(), changeFrequency: 'weekly', priority: p ? 0.8 : 1 });
    }
    for (const slug of paths.pages) {
      const path = `/${slug}`;
      if (!staticPaths.includes(path)) entries.push({ url: `${BASE}/${lang}${path}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 });
    }
    for (const slug of paths.clinics) {
      entries.push({ url: `${BASE}/${lang}/clinics/${slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 });
    }
    for (const slug of paths.blog) {
      entries.push({ url: `${BASE}/${lang}/blog/${slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 });
    }
  }

  return entries;
}
