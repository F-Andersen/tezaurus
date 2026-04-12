'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Lead {
  id: string;
  type: 'request' | 'callback';
  name?: string;
  phone: string;
  email?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
] as const;

const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'request', label: 'Request' },
  { value: 'callback', label: 'Callback' },
] as const;

const STATUS_BADGE: Record<string, string> = {
  NEW: 'badge-info',
  IN_PROGRESS: 'badge-warning',
  DONE: 'badge-success',
};

const STATUS_LABEL: Record<string, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
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
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading…' : `${leads.length} lead${leads.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button onClick={handleExport} className="btn-outline">
          <span className="material-symbols-outlined">download</span>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[160px]">
            <label className="label">Status</label>
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="label">Type</label>
            <select className="input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="label">From</label>
            <input type="date" className="input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="min-w-[160px]">
            <label className="label">To</label>
            <input type="date" className="input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          {(statusFilter || typeFilter || dateFrom || dateTo) && (
            <button
              className="btn-ghost text-sm"
              onClick={() => { setStatusFilter(''); setTypeFilter(''); setDateFrom(''); setDateTo(''); }}
            >
              <span className="material-symbols-outlined text-base">close</span>
              Clear filters
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
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
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
                      {lead.type === 'request' ? 'Request' : 'Callback'}
                    </span>
                  </td>
                  <td>
                    <span className={STATUS_BADGE[lead.status] ?? 'badge-gray'}>
                      {STATUS_LABEL[lead.status] ?? lead.status}
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
                      <option value="NEW">New</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
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
            <p className="text-lg font-medium text-gray-500">No leads found</p>
            <p className="text-sm mt-1">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
