'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminNav } from './AdminNav';
import { refreshToken, getCurrentUser } from '@/lib/api';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      refreshToken()
        .then(() => setReady(true))
        .catch(() => router.push('/admin/login'));
    } else {
      setReady(true);
    }
  }, [isLogin, router]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav collapsed={collapsed} />
      <div className={`transition-all duration-200 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <span className="material-symbols-outlined">
              {collapsed ? 'menu_open' : 'menu'}
            </span>
          </button>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-500">
                {user.email} · <span className="capitalize font-medium text-gray-700">{user.role.replace('_', ' ').toLowerCase()}</span>
              </span>
            )}
          </div>
        </header>
        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
