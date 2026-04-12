const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export type UserRole = 'ADMIN' | 'CONTENT_MANAGER' | 'SALES';

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
}

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function getUser(): CurrentUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('currentUser');
  return raw ? JSON.parse(raw) : null;
}

function setUser(user: CurrentUser | null) {
  if (typeof window === 'undefined') return;
  if (user) localStorage.setItem('currentUser', JSON.stringify(user));
  else localStorage.removeItem('currentUser');
}

export function getCurrentUser(): CurrentUser | null {
  return getUser();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || 'Invalid credentials');
  }
  const data = await res.json();
  if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
  if (data.user) setUser(data.user as CurrentUser);
  return data;
}

export async function logout() {
  await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
  localStorage.removeItem('accessToken');
  localStorage.removeItem('currentUser');
}

export async function refreshToken() {
  const res = await fetch(`${API}/auth/refresh`, { method: 'POST', credentials: 'include' });
  if (!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
  return data;
}

async function fetchMe(): Promise<CurrentUser> {
  const token = getToken();
  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  const user = await res.json();
  setUser(user);
  return user;
}

async function authFetch(url: string, init?: RequestInit) {
  let token = getToken();
  if (!token) {
    await refreshToken();
    token = getToken();
  }
  const res = await fetch(url, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  if (res.status === 401) {
    await refreshToken();
    const newToken = getToken();
    const retry = await fetch(url, {
      ...init,
      headers: { ...init?.headers, Authorization: `Bearer ${newToken}` },
      credentials: 'include',
    });
    if (!retry.ok) throw new Error('Unauthorized');
    return retry;
  }
  return res;
}

export const api = {
  get: (path: string) => authFetch(`${API}${path}`).then((r) => r.json()),
  post: (path: string, body: unknown) =>
    authFetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  patch: (path: string, body: unknown) =>
    authFetch(`${API}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  delete: (path: string) => authFetch(`${API}${path}`, { method: 'DELETE' }).then((r) => r.json()),
  upload: async (path: string, formData: FormData) => {
    const token = getToken();
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
  getBlob: async (path: string) => {
    const res = await authFetch(`${API}${path}`);
    return res.blob();
  },
};
