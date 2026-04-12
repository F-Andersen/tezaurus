const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export type Lang = 'ua' | 'en';

export async function getPage(slug: string, lang: Lang) {
  try {
    const res = await fetch(`${API}/public/pages/${slug}?lang=${lang}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function getClinics(lang: Lang, country?: string, city?: string) {
  try {
    const params = new URLSearchParams({ lang });
    if (country) params.set('country', country);
    if (city) params.set('city', city);
    const res = await fetch(`${API}/public/clinics?${params}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function getClinic(slug: string, lang: Lang) {
  try {
    const res = await fetch(`${API}/public/clinics/${slug}?lang=${lang}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function getBlog(lang: Lang, category?: string) {
  try {
    const params = new URLSearchParams({ lang });
    if (category) params.set('category', category);
    const res = await fetch(`${API}/public/blog?${params}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function getBlogPost(slug: string, lang: Lang) {
  try {
    const res = await fetch(`${API}/public/blog/${slug}?lang=${lang}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function getServices(lang: Lang, category?: string, country?: string) {
  try {
    const params = new URLSearchParams({ lang });
    if (category) params.set('category', category);
    if (country) params.set('country', country);
    const res = await fetch(`${API}/public/services?${params}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function getService(slug: string, lang: Lang) {
  try {
    const res = await fetch(`${API}/public/services/${slug}?lang=${lang}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function getSettings(): Promise<Record<string, unknown>> {
  try {
    const res = await fetch(`${API}/public/settings`, { next: { revalidate: 120 } });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export async function submitLead(data: {
  type: 'request' | 'callback';
  name?: string;
  phone: string;
  email?: string;
  requestType?: string;
  country?: string;
  message?: string;
  consent: boolean;
  captchaToken?: string;
}) {
  const res = await fetch(`${API}/public/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || 'Failed to submit');
  }
  return res.json();
}
