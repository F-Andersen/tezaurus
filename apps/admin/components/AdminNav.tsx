'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout, getCurrentUser, type UserRole } from '@/lib/api';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles: UserRole[];
  group: string;
}

const items: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard', roles: ['ADMIN', 'CONTENT_MANAGER', 'SALES'], group: 'main' },
  { href: '/admin/leads', label: 'Leads', icon: 'contact_mail', roles: ['ADMIN', 'SALES'], group: 'main' },

  { href: '/admin/pages', label: 'Pages', icon: 'article', roles: ['ADMIN', 'CONTENT_MANAGER'], group: 'content' },
  { href: '/admin/clinics', label: 'Clinics', icon: 'local_hospital', roles: ['ADMIN', 'CONTENT_MANAGER'], group: 'content' },
  { href: '/admin/services', label: 'Services', icon: 'medical_services', roles: ['ADMIN', 'CONTENT_MANAGER'], group: 'content' },
  { href: '/admin/blog', label: 'Blog', icon: 'edit_note', roles: ['ADMIN', 'CONTENT_MANAGER'], group: 'content' },
  { href: '/admin/media', label: 'Media', icon: 'perm_media', roles: ['ADMIN', 'CONTENT_MANAGER'], group: 'content' },

  { href: '/admin/settings', label: 'Settings', icon: 'settings', roles: ['ADMIN'], group: 'system' },
  { href: '/admin/users', label: 'Users', icon: 'group', roles: ['ADMIN'], group: 'system' },
  { href: '/admin/redirects', label: 'Redirects', icon: 'alt_route', roles: ['ADMIN'], group: 'system' },
];

const groupLabels: Record<string, string> = {
  main: 'Overview',
  content: 'Content',
  system: 'System',
};

export function AdminNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();
  const role = user?.role || 'CONTENT_MANAGER';

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const visibleItems = items.filter((item) => item.roles.includes(role));
  const groups = [...new Set(visibleItems.map((i) => i.group))];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-sidebar text-white flex flex-col z-40 transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-white/10 flex-shrink-0">
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">
            <span className="text-blue-400">TEZAURUS</span>
            <span className="text-gray-400 ml-0.5 text-sm font-normal">admin</span>
          </span>
        )}
        {collapsed && <span className="text-blue-400 font-bold text-lg mx-auto">T</span>}
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold uppercase">
              {user.email[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-gray-400 capitalize">{role.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {groups.map((group) => (
          <div key={group}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 px-2 mb-2">
                {groupLabels[group]}
              </p>
            )}
            <div className="space-y-0.5">
              {visibleItems
                .filter((item) => item.group === group)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-sidebar-active text-white'
                        : 'text-gray-400 hover:text-white hover:bg-sidebar-hover'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="material-symbols-outlined !text-[20px]">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                    {item.label === 'Leads' && !collapsed && (
                      <span className="ml-auto bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded-full font-medium" id="leads-badge" />
                    )}
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-sidebar-hover w-full transition-colors"
        >
          <span className="material-symbols-outlined !text-[20px]">logout</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
