'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getCurrentUser, type CurrentUser } from '@/lib/api';
import { getAdminLang, t, type AdminLang } from '@/lib/i18n';

interface DashboardStats {
  leadsToday: number;
  leadsTotal: number;
  clinicsPublished: number;
  clinicsTotal: number;
  postsPublished: number;
  postsTotal: number;
  usersTotal: number;
  recentLeads: {
    id: string;
    name: string;
    phone: string;
    type: string;
    status: string;
    createdAt: string;
  }[];
}

const STATUS_BADGE: Record<string, string> = {
  NEW: 'badge-danger',
  IN_PROGRESS: 'badge-warning',
  DONE: 'badge-success',
};

const dict = {
  dashboard:       { ua: 'Дашборд',              en: 'Dashboard' },
  welcomeBack:     { ua: 'З поверненням,',        en: 'Welcome back,' },
  newLeads:        { ua: 'Нові заявки',           en: 'New Leads' },
  total:           { ua: 'всього',                en: 'total' },
  totalClinics:    { ua: 'Всього клінік',         en: 'Total Clinics' },
  published:       { ua: 'опубліковано',           en: 'published' },
  blogPosts:       { ua: 'Статті блогу',          en: 'Blog Posts' },
  totalUsers:      { ua: 'Користувачі',           en: 'Total Users' },
  adminUsers:      { ua: 'адмін-користувачі',     en: 'admin users' },
  quickActions:    { ua: 'Швидкі дії',            en: 'Quick Actions' },
  newBlogPost:     { ua: 'Нова стаття',           en: 'New Blog Post' },
  newClinic:       { ua: 'Нова клініка',          en: 'New Clinic' },
  viewLeads:       { ua: 'Переглянути заявки',    en: 'View Leads' },
  failedToLoad:    { ua: 'Не вдалося завантажити дані:', en: 'Failed to load dashboard data:' },
  recentLeads:     { ua: 'Останні заявки',        en: 'Recent Leads' },
  viewAll:         { ua: 'Усі заявки →',          en: 'View all →' },
  thName:          { ua: "Ім'я",                  en: 'Name' },
  thPhone:         { ua: 'Телефон',               en: 'Phone' },
  thType:          { ua: 'Тип',                   en: 'Type' },
  thStatus:        { ua: 'Статус',                en: 'Status' },
  thDate:          { ua: 'Дата',                  en: 'Date' },
  statusNew:       { ua: 'Нова',                  en: 'NEW' },
  statusInProgress:{ ua: 'В роботі',              en: 'IN PROGRESS' },
  statusDone:      { ua: 'Виконана',              en: 'DONE' },
  request:         { ua: 'Заявка',                en: 'Request' },
  callback:        { ua: 'Дзвінок',               en: 'Callback' },
};

const STATUS_KEY: Record<string, string> = {
  NEW: 'statusNew',
  IN_PROGRESS: 'statusInProgress',
  DONE: 'statusDone',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminDashboard() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lang, setLang] = useState<AdminLang>('ua');
  const router = useRouter();

  const isContentManager = user?.role === 'CONTENT_MANAGER';

  useEffect(() => {
    setLang(getAdminLang());
    const h = () => setLang(getAdminLang());
    window.addEventListener('storage', h);
    return () => window.removeEventListener('storage', h);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      const l = getAdminLang();
      if (l !== lang) setLang(l);
    }, 500);
    return () => clearInterval(i);
  });

  useEffect(() => {
    const cached = getCurrentUser();
    if (cached) setUser(cached);

    api.get('/auth/me')
      .then((me: CurrentUser) => setUser(me))
      .catch(() => router.push('/admin/login'));

    api.get('/admin/dashboard/stats')
      .then((data: DashboardStats) => setStats(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  if (!user && loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t(dict, 'dashboard', lang)}</h1>
        <p className="text-gray-500 mt-1">
          {t(dict, 'welcomeBack', lang)} <span className="font-medium text-gray-700">{user?.email}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {!isContentManager && (
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <span className="stat-label">{t(dict, 'newLeads', lang)}</span>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-xl">contact_mail</span>
              </span>
            </div>
            <span className="stat-value">{stats?.leadsToday ?? '—'}</span>
            <span className="stat-change text-gray-400">
              {stats?.leadsTotal != null ? `${stats.leadsTotal} ${t(dict, 'total', lang)}` : ''}
            </span>
          </div>
        )}

        <div className="stat-card group">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label">{t(dict, 'totalClinics', lang)}</span>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined !text-xl">local_hospital</span>
            </span>
          </div>
          <span className="stat-value">{stats?.clinicsTotal ?? '—'}</span>
          <span className="stat-change text-emerald-600">
            {stats?.clinicsPublished != null ? `${stats.clinicsPublished} ${t(dict, 'published', lang)}` : ''}
          </span>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label">{t(dict, 'blogPosts', lang)}</span>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined !text-xl">article</span>
            </span>
          </div>
          <span className="stat-value">{stats?.postsTotal ?? '—'}</span>
          <span className="stat-change text-blue-600">
            {stats?.postsPublished != null ? `${stats.postsPublished} ${t(dict, 'published', lang)}` : ''}
          </span>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between mb-3">
            <span className="stat-label">{t(dict, 'totalUsers', lang)}</span>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 text-violet-600 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined !text-xl">group</span>
            </span>
          </div>
          <span className="stat-value">{stats?.usersTotal ?? '—'}</span>
          <span className="stat-change text-gray-400">{t(dict, 'adminUsers', lang)}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{t(dict, 'quickActions', lang)}</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/blog/new" className="btn-primary">
            <span className="material-symbols-outlined !text-[18px]">edit_note</span>
            {t(dict, 'newBlogPost', lang)}
          </Link>
          <Link href="/admin/clinics/new" className="btn-primary">
            <span className="material-symbols-outlined !text-[18px]">add_business</span>
            {t(dict, 'newClinic', lang)}
          </Link>
          {!isContentManager && (
            <Link href="/admin/leads" className="btn-outline">
              <span className="material-symbols-outlined !text-[18px]">list_alt</span>
              {t(dict, 'viewLeads', lang)}
            </Link>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          <span className="material-symbols-outlined !text-[18px]">error</span>
          {t(dict, 'failedToLoad', lang)} {error}
        </div>
      )}

      {/* Recent Leads Table */}
      {!isContentManager && stats?.recentLeads && stats.recentLeads.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{t(dict, 'recentLeads', lang)}</h2>
            <Link href="/admin/leads" className="text-sm text-accent hover:text-accent-hover font-medium transition-colors">
              {t(dict, 'viewAll', lang)}
            </Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{t(dict, 'thName', lang)}</th>
                  <th>{t(dict, 'thPhone', lang)}</th>
                  <th>{t(dict, 'thType', lang)}</th>
                  <th>{t(dict, 'thStatus', lang)}</th>
                  <th>{t(dict, 'thDate', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="font-medium text-gray-900">{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td>
                      {t(dict, lead.type?.toLowerCase() === 'callback' ? 'callback' : 'request', lang)}
                    </td>
                    <td>
                      <span className={STATUS_BADGE[lead.status] ?? 'badge-gray'}>
                        {t(dict, STATUS_KEY[lead.status] ?? 'statusNew', lang)}
                      </span>
                    </td>
                    <td className="text-gray-500 whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
