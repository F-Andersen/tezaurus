'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin } from '@/lib/api';
import { getAdminLang, setAdminLang, login as loginT, t, type AdminLang } from '@/lib/i18n';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<AdminLang>('ua');
  const router = useRouter();

  useEffect(() => { setLang(getAdminLang()); }, []);

  const switchLang = (l: AdminLang) => { setAdminLang(l); setLang(l); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiLogin(email, password);
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t(loginT, 'invalidCredentials', lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="card p-8 shadow-lg">
          {/* Language switcher */}
          <div className="flex justify-end mb-4 gap-1">
            {(['ua', 'en'] as AdminLang[]).map((l) => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  lang === l ? 'bg-accent text-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
              <span className="material-symbols-outlined text-accent !text-3xl">admin_panel_settings</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t(loginT, 'title', lang)}</h1>
            <p className="text-sm text-gray-500 mt-1">{t(loginT, 'subtitle', lang)}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <span className="material-symbols-outlined !text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">{t(loginT, 'email', lang)}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !text-[18px] pointer-events-none">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  className="input !pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">{t(loginT, 'password', lang)}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !text-[18px] pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input !pl-10 !pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined !text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t(loginT, 'signingIn', lang)}
                </>
              ) : (
                t(loginT, 'signIn', lang)
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {t(loginT, 'copyright', lang, { year: String(new Date().getFullYear()) })}
        </p>
      </div>
    </div>
  );
}
