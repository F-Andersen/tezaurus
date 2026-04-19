'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getAdminLang, t, type AdminLang } from '@/lib/i18n';

interface Lead {
  id: string;
  type: 'request' | 'callback';
  name?: string;
  phone: string;
  email?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
}

const STATUS_BADGE: Record<string, string> = {
  NEW: 'badge-info',
  IN_PROGRESS: 'badge-warning',
  DONE: 'badge-success',
};

const dict = {
  leads:           { ua: 'Заявки',                en: 'Leads' },
  loading:         { ua: 'Завантаження…',          en: 'Loading…' },
  leadsFound:      { ua: 'заявок знайдено',        en: 'leads found' },
  leadFound:       { ua: 'заявку знайдено',        en: 'lead found' },
  exportCsv:       { ua: 'Експорт CSV',            en: 'Export CSV' },
  allStatuses:     { ua: 'Усі статуси',            en: 'All statuses' },
  statusNew:       { ua: 'Нова',                   en: 'New' },
  statusInProgress:{ ua: 'В роботі',               en: 'In Progress' },
  statusDone:      { ua: 'Виконана',               en: 'Done' },
  allTypes:        { ua: 'Усі типи',               en: 'All types' },
  request:         { ua: 'Заявка',                 en: 'Request' },
  callback:        { ua: 'Дзвінок',                en: 'Callback' },
  filterStatus:    { ua: 'Статус',                 en: 'Status' },
  filterType:      { ua: 'Тип',                    en: 'Type' },
  filterFrom:      { ua: 'Від',                    en: 'From' },
  filterTo:        { ua: 'До',                     en: 'To' },
  clearFilters:    { ua: 'Очистити фільтри',       en: 'Clear filters' },
  thName:          { ua: "Ім'я",                   en: 'Name' },
  thPhone:         { ua: 'Телефон',                en: 'Phone' },
  thEmail:         { ua: 'Email',                  en: 'Email' },
  thType:          { ua: 'Тип',                    en: 'Type' },
  thStatus:        { ua: 'Статус',                 en: 'Status' },
  thDate:          { ua: 'Дата',                   en: 'Date' },
  thActions:       { ua: 'Дії',                    en: 'Actions' },
  noLeadsFound:    { ua: 'Заявок не знайдено',     en: 'No leads found' },
  tryAdjusting:    { ua: 'Спробуйте змінити фільтри або поверніться пізніше.', en: 'Try adjusting your filters or check back later.' },
};

const STATUS_KEY: Record<string, string> = {
  NEW: 'statusNew',
  IN_PROGRESS: 'statusInProgress',
  DONE: 'statusDone',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 8 }).map((_, j) => (
            <td key={j}>
              <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: j === 0 ? 30 : '70%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [lang, setLang] = useState<AdminLang>('ua');

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

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (typeFilter) params.set('type', typeFilter);
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  }, [statusFilter, typeFilter, dateFrom, dateTo]);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get(`/admin/leads${buildQuery()}`);
      setLeads(data);
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [buildQuery, router]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/leads/${id}`, { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: status as Lead['status'] } : l)));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = async () => {
    const blob = await api.getBlob(`/admin/leads/export${buildQuery()}&format=csv`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isEmpty = !loading && leads.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(dict, 'leads', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading
              ? t(dict, 'loading', lang)
              : `${leads.length} ${t(dict, leads.length === 1 ? 'leadFound' : 'leadsFound', lang)}`}
          </p>
        </div>
        <button onClick={handleExport} className="btn-outline">
          <span className="material-symbols-outlined">download</span>
          {t(dict, 'exportCsv', lang)}
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[160px]">
            <label className="label">{t(dict, 'filterStatus', lang)}</label>
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">{t(dict, 'allStatuses', lang)}</option>
              <option value="NEW">{t(dict, 'statusNew', lang)}</option>
              <option value="IN_PROGRESS">{t(dict, 'statusInProgress', lang)}</option>
              <option value="DONE">{t(dict, 'statusDone', lang)}</option>
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="label">{t(dict, 'filterType', lang)}</label>
            <select className="input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">{t(dict, 'allTypes', lang)}</option>
              <option value="request">{t(dict, 'request', lang)}</option>
              <option value="callback">{t(dict, 'callback', lang)}</option>
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="label">{t(dict, 'filterFrom', lang)}</label>
            <input type="date" className="input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="min-w-[160px]">
            <label className="label">{t(dict, 'filterTo', lang)}</label>
            <input type="date" className="input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          {(statusFilter || typeFilter || dateFrom || dateTo) && (
            <button
              className="btn-ghost text-sm"
              onClick={() => { setStatusFilter(''); setTypeFilter(''); setDateFrom(''); setDateTo(''); }}
            >
              <span className="material-symbols-outlined text-base">close</span>
              {t(dict, 'clearFilters', lang)}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>{t(dict, 'thName', lang)}</th>
                <th>{t(dict, 'thPhone', lang)}</th>
                <th>{t(dict, 'thEmail', lang)}</th>
                <th>{t(dict, 'thType', lang)}</th>
                <th>{t(dict, 'thStatus', lang)}</th>
                <th>{t(dict, 'thDate', lang)}</th>
                <th>{t(dict, 'thActions', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonRows />}

              {!loading && leads.map((lead, idx) => (
                <tr key={lead.id}>
                  <td className="text-gray-400 font-mono text-xs">{idx + 1}</td>
                  <td className="font-medium text-gray-900">{lead.name || '—'}</td>
                  <td>
                    <a href={`tel:${lead.phone}`} className="text-accent hover:underline">{lead.phone}</a>
                  </td>
                  <td>
                    {lead.email
                      ? <a href={`mailto:${lead.email}`} className="text-accent hover:underline">{lead.email}</a>
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td>
                    <span className={lead.type === 'request' ? 'badge-info' : 'badge-gray'}>
                      {t(dict, lead.type === 'request' ? 'request' : 'callback', lang)}
                    </span>
                  </td>
                  <td>
                    <span className={STATUS_BADGE[lead.status] ?? 'badge-gray'}>
                      {t(dict, STATUS_KEY[lead.status] ?? 'statusNew', lang)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-gray-500 text-xs">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td>
                    <select
                      className="input !py-1.5 !px-2 !text-xs !w-auto"
                      value={lead.status}
                      disabled={updatingId === lead.id}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                    >
                      <option value="NEW">{t(dict, 'statusNew', lang)}</option>
                      <option value="IN_PROGRESS">{t(dict, 'statusInProgress', lang)}</option>
                      <option value="DONE">{t(dict, 'statusDone', lang)}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="material-symbols-outlined text-5xl mb-3">inbox</span>
            <p className="text-lg font-medium text-gray-500">{t(dict, 'noLeadsFound', lang)}</p>
            <p className="text-sm mt-1">{t(dict, 'tryAdjusting', lang)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
