'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api.get('/admin/settings')
      .then(setData)
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await api.patch('/admin/settings', data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const phones = (data.phones as string[]) ?? [];
  const emailReceivers = (data.email_receivers as string[]) ?? [];
  const messengers = (data.messengers as Record<string, string>) ?? {};

  const setPhones = (phones: string[]) => setData((d) => ({ ...d, phones }));
  const setEmailReceivers = (arr: string[]) => setData((d) => ({ ...d, email_receivers: arr }));
  const setMessengers = (obj: Record<string, string>) => setData((d) => ({ ...d, messengers: obj }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        {saved && (
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium animate-in fade-in">
            <span className="material-symbols-outlined !text-[18px]">check_circle</span>
            Saved successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Phones */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              <span className="material-symbols-outlined !text-[18px] mr-2 align-text-bottom text-gray-400">phone</span>
              Phone Numbers
            </h2>
            <button
              type="button"
              onClick={() => setPhones([...phones, ''])}
              className="btn-ghost !px-2 !py-1 text-xs"
            >
              <span className="material-symbols-outlined !text-[16px]">add</span>
              Add Phone
            </button>
          </div>
          {phones.length === 0 && (
            <p className="text-sm text-gray-400">No phone numbers added yet.</p>
          )}
          <div className="space-y-2">
            {phones.map((phone, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input"
                  placeholder="+380 XX XXX XX XX"
                  value={phone}
                  onChange={(e) => {
                    const next = [...phones];
                    next[i] = e.target.value;
                    setPhones(next);
                  }}
                />
                <button type="button" onClick={() => setPhones(phones.filter((_, j) => j !== i))} className="btn-ghost !p-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <span className="material-symbols-outlined !text-[18px]">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contacts */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            <span className="material-symbols-outlined !text-[18px] mr-2 align-text-bottom text-gray-400">mail</span>
            Contacts
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Email receivers</span>
            <button
              type="button"
              onClick={() => setEmailReceivers([...emailReceivers, ''])}
              className="btn-ghost !px-2 !py-1 text-xs"
            >
              <span className="material-symbols-outlined !text-[16px]">add</span>
              Add Email
            </button>
          </div>
          <div className="space-y-2">
            {emailReceivers.map((email, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => {
                    const next = [...emailReceivers];
                    next[i] = e.target.value;
                    setEmailReceivers(next);
                  }}
                />
                <button type="button" onClick={() => setEmailReceivers(emailReceivers.filter((_, j) => j !== i))} className="btn-ghost !p-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <span className="material-symbols-outlined !text-[18px]">close</span>
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4">
            <label className="label">Address</label>
            <textarea
              className="input"
              placeholder="Company address..."
              value={(data.address as string) ?? ''}
              onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
              rows={2}
            />
          </div>
        </div>

        {/* Messengers */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              <span className="material-symbols-outlined !text-[18px] mr-2 align-text-bottom text-gray-400">chat</span>
              Messengers
            </h2>
            <button
              type="button"
              onClick={() => setMessengers({ ...messengers, '': '' })}
              className="btn-ghost !px-2 !py-1 text-xs"
            >
              <span className="material-symbols-outlined !text-[16px]">add</span>
              Add Messenger
            </button>
          </div>
          {Object.keys(messengers).length === 0 && (
            <p className="text-sm text-gray-400">No messengers configured.</p>
          )}
          <div className="space-y-2">
            {Object.entries(messengers).map(([key, value], i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input flex-1"
                  placeholder="Key (e.g. telegram)"
                  value={key}
                  onChange={(e) => {
                    const entries = Object.entries(messengers);
                    entries[i] = [e.target.value, value];
                    setMessengers(Object.fromEntries(entries));
                  }}
                />
                <input
                  className="input flex-[2]"
                  placeholder="URL or handle"
                  value={value}
                  onChange={(e) => {
                    setMessengers({ ...messengers, [key]: e.target.value });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = { ...messengers };
                    delete next[key];
                    setMessengers(next);
                  }}
                  className="btn-ghost !p-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <span className="material-symbols-outlined !text-[18px]">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            <span className="material-symbols-outlined !text-[18px] mr-2 align-text-bottom text-gray-400">analytics</span>
            Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Google Analytics ID</label>
              <input className="input" placeholder="G-XXXXXXXXXX" value={(data.ga_id as string) ?? ''} onChange={(e) => setData((d) => ({ ...d, ga_id: e.target.value }))} />
            </div>
            <div>
              <label className="label">Google Tag Manager ID</label>
              <input className="input" placeholder="GTM-XXXXXXX" value={(data.gtm_id as string) ?? ''} onChange={(e) => setData((d) => ({ ...d, gtm_id: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
