'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api, getCurrentUser, type UserRole } from '@/lib/api';
import { getAdminLang, t, type AdminLang } from '@/lib/i18n';

const dict = {
  title: { ua: 'Користувачі', en: 'Users' },
  loading: { ua: 'Завантаження…', en: 'Loading…' },
  usersCount: { ua: '{count} користувачів', en: '{count} users' },
  userCount: { ua: '{count} користувач', en: '{count} user' },
  createUser: { ua: 'Створити користувача', en: 'Create User' },
  email: { ua: 'Email', en: 'Email' },
  role: { ua: 'Роль', en: 'Role' },
  created: { ua: 'Створено', en: 'Created' },
  actions: { ua: 'Дії', en: 'Actions' },
  noUsers: { ua: 'Користувачів не знайдено', en: 'No users found' },
  editUserRole: { ua: 'Редагувати роль', en: 'Edit User Role' },
  password: { ua: 'Пароль', en: 'Password' },
  minChars: { ua: 'Мінімум 6 символів', en: 'Minimum 6 characters' },
  cancel: { ua: 'Скасувати', en: 'Cancel' },
  saveChanges: { ua: 'Зберегти зміни', en: 'Save Changes' },
  deleteUser: { ua: 'Видалити користувача', en: 'Delete User' },
  deleteConfirm: { ua: 'Ви впевнені, що хочете видалити', en: 'Are you sure you want to delete' },
  cannotUndo: { ua: '? Цю дію неможливо скасувати.', en: '? This action cannot be undone.' },
  delete: { ua: 'Видалити', en: 'Delete' },
  somethingWrong: { ua: 'Щось пішло не так', en: 'Something went wrong' },
  editRole: { ua: 'Редагувати роль', en: 'Edit role' },
  deleteUserTitle: { ua: 'Видалити користувача', en: 'Delete user' },
} as const;

const ROLE_LABEL_I18N: Record<UserRole, Record<AdminLang, string>> = {
  ADMIN: { ua: 'Адмін', en: 'Admin' },
  CONTENT_MANAGER: { ua: 'Контент-менеджер', en: 'Content Manager' },
  SALES: { ua: 'Продажі', en: 'Sales' },
};

interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

const ROLES: UserRole[] = ['ADMIN', 'CONTENT_MANAGER', 'SALES'];

const ROLE_BADGE: Record<UserRole, string> = {
  ADMIN: 'badge-danger',
  CONTENT_MANAGER: 'badge-info',
  SALES: 'badge-success',
};

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ─── Create / Edit Modal ─── */
function UserModal({
  open,
  editUser,
  onClose,
  onSaved,
  lang,
}: {
  open: boolean;
  editUser: User | null;
  onClose: () => void;
  onSaved: () => void;
  lang: AdminLang;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('SALES');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setError('');
      setSaving(false);
      if (editUser) {
        setEmail(editUser.email);
        setPassword('');
        setRole(editUser.role);
      } else {
        setEmail('');
        setPassword('');
        setRole('SALES');
      }
      setTimeout(() => emailRef.current?.focus(), 100);
    }
  }, [open, editUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editUser) {
        await api.patch(`/admin/users/${editUser.id}`, { role });
      } else {
        await api.post('/admin/users', { email, password, role });
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t(dict, 'somethingWrong', lang));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative z-10 w-full max-w-md p-6 mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {editUser ? t(dict, 'editUserRole', lang) : t(dict, 'createUser', lang)}
          </h2>
          <button onClick={onClose} className="btn-ghost !p-1.5 !rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">{t(dict, 'email', lang)}</label>
            <input
              ref={emailRef}
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!!editUser}
              placeholder="user@example.com"
            />
          </div>

          {!editUser && (
            <div>
              <label className="label">{t(dict, 'password', lang)}</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder={t(dict, 'minChars', lang)}
              />
            </div>
          )}

          <div>
            <label className="label">{t(dict, 'role', lang)}</label>
            <select className="input" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABEL_I18N[r][lang]}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline">{t(dict, 'cancel', lang)}</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
              {editUser ? t(dict, 'saveChanges', lang) : t(dict, 'createUser', lang)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirmation ─── */
function DeleteConfirm({
  user,
  onClose,
  onDeleted,
  lang,
}: {
  user: User | null;
  onClose: () => void;
  onDeleted: () => void;
  lang: AdminLang;
}) {
  const [deleting, setDeleting] = useState(false);

  if (!user) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${user.id}`);
      onDeleted();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative z-10 w-full max-w-sm p-6 mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{t(dict, 'deleteUser', lang)}</h3>
          <p className="text-sm text-gray-500 mb-5">
            {t(dict, 'deleteConfirm', lang)} <strong className="text-gray-700">{user.email}</strong>{t(dict, 'cannotUndo', lang)}
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="btn-outline flex-1">{t(dict, 'cancel', lang)}</button>
            <button onClick={handleDelete} className="btn-danger flex-1" disabled={deleting}>
              {deleting && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
              {t(dict, 'delete', lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Users Page ─── */
export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [lang, setLang] = useState<AdminLang>('ua');
  useEffect(() => { setLang(getAdminLang()); }, []);
  useEffect(() => { const i = setInterval(() => { const l = getAdminLang(); if (l !== lang) setLang(l); }, 500); return () => clearInterval(i); });

  const currentUser = getCurrentUser();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/users');
      setUsers(data);
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => { setEditUser(null); setModalOpen(true); };
  const openEdit = (u: User) => { setEditUser(u); setModalOpen(true); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(dict, 'title', lang)}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading
              ? t(dict, 'loading', lang)
              : users.length !== 1
                ? t(dict, 'usersCount', lang, { count: String(users.length) })
                : t(dict, 'userCount', lang, { count: String(users.length) })}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <span className="material-symbols-outlined">person_add</span>
          {t(dict, 'createUser', lang)}
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t(dict, 'email', lang)}</th>
                <th>{t(dict, 'role', lang)}</th>
                <th>{t(dict, 'created', lang)}</th>
                <th className="text-right">{t(dict, 'actions', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '60%' }} />
                    </td>
                  ))}
                </tr>
              ))}

              {!loading && users.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium text-gray-900">{u.email}</td>
                  <td>
                    <span className={ROLE_BADGE[u.role] ?? 'badge-gray'}>
                      {ROLE_LABEL_I18N[u.role]?.[lang] ?? u.role}
                    </span>
                  </td>
                  <td className="text-gray-500 text-xs whitespace-nowrap">{formatDate(u.createdAt)}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="btn-ghost !p-1.5" title={t(dict, 'editRole', lang)}>
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="btn-ghost !p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title={t(dict, 'deleteUserTitle', lang)}
                        disabled={u.id === currentUser?.id}
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="material-symbols-outlined text-5xl mb-3">group_off</span>
            <p className="text-lg font-medium text-gray-500">{t(dict, 'noUsers', lang)}</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserModal open={modalOpen} editUser={editUser} onClose={() => setModalOpen(false)} onSaved={fetchUsers} lang={lang} />
      <DeleteConfirm user={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={fetchUsers} lang={lang} />
    </div>
  );
}
