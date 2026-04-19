export type AdminLang = 'ua' | 'en';

const STORAGE_KEY = 'admin_lang';

export function getAdminLang(): AdminLang {
  if (typeof window === 'undefined') return 'ua';
  return (localStorage.getItem(STORAGE_KEY) as AdminLang) || 'ua';
}

export function setAdminLang(lang: AdminLang) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, lang);
}

type Dict = Record<string, Record<AdminLang, string>>;

export const common: Dict = {
  save: { ua: 'Зберегти', en: 'Save' },
  cancel: { ua: 'Скасувати', en: 'Cancel' },
  delete: { ua: 'Видалити', en: 'Delete' },
  edit: { ua: 'Редагувати', en: 'Edit' },
  create: { ua: 'Створити', en: 'Create' },
  add: { ua: 'Додати', en: 'Add' },
  back: { ua: 'Назад', en: 'Back' },
  search: { ua: 'Пошук…', en: 'Search…' },
  loading: { ua: 'Завантаження…', en: 'Loading…' },
  noData: { ua: 'Дані відсутні', en: 'No data found' },
  actions: { ua: 'Дії', en: 'Actions' },
  yes: { ua: 'Так', en: 'Yes' },
  no: { ua: 'Ні', en: 'No' },
  confirmDelete: { ua: 'Ви впевнені, що хочете видалити?', en: 'Are you sure you want to delete?' },
  published: { ua: 'Опублікований', en: 'Published' },
  draft: { ua: 'Чернетка', en: 'Draft' },
  status: { ua: 'Статус', en: 'Status' },
  name: { ua: 'Назва', en: 'Name' },
  slug: { ua: 'Slug', en: 'Slug' },
  category: { ua: 'Категорія', en: 'Category' },
  date: { ua: 'Дата', en: 'Date' },
  all: { ua: 'Усі', en: 'All' },
};

export const login: Dict = {
  title: { ua: 'TEZAURUS', en: 'TEZAURUS' },
  subtitle: { ua: 'адмін-панель', en: 'admin panel' },
  email: { ua: 'Електронна пошта', en: 'Email' },
  password: { ua: 'Пароль', en: 'Password' },
  signIn: { ua: 'Увійти', en: 'Sign in' },
  signingIn: { ua: 'Входимо…', en: 'Signing in…' },
  copyright: { ua: '© {year} Tezaurus. Всі права захищені.', en: '© {year} Tezaurus. All rights reserved.' },
  invalidCredentials: { ua: 'Невірний email або пароль', en: 'Invalid credentials' },
};

export const nav: Dict = {
  dashboard: { ua: 'Дашборд', en: 'Dashboard' },
  leads: { ua: 'Заявки', en: 'Leads' },
  pages: { ua: 'Сторінки', en: 'Pages' },
  clinics: { ua: 'Клініки', en: 'Clinics' },
  services: { ua: 'Послуги', en: 'Services' },
  blog: { ua: 'Блог', en: 'Blog' },
  media: { ua: 'Медіа', en: 'Media' },
  settings: { ua: 'Налаштування', en: 'Settings' },
  users: { ua: 'Користувачі', en: 'Users' },
  redirects: { ua: 'Редіректи', en: 'Redirects' },
  overview: { ua: 'Огляд', en: 'Overview' },
  content: { ua: 'Контент', en: 'Content' },
  system: { ua: 'Система', en: 'System' },
  logout: { ua: 'Вийти', en: 'Logout' },
};

export const dashboard: Dict = {
  title: { ua: 'Дашборд', en: 'Dashboard' },
  newLeads: { ua: 'Нові заявки', en: 'New Leads' },
  totalClinics: { ua: 'Всього клінік', en: 'Total Clinics' },
  blogPosts: { ua: 'Статті блогу', en: 'Blog Posts' },
  totalUsers: { ua: 'Користувачі', en: 'Total Users' },
  recentLeads: { ua: 'Останні заявки', en: 'Recent Leads' },
  quickActions: { ua: 'Швидкі дії', en: 'Quick Actions' },
  addClinic: { ua: 'Додати клініку', en: 'Add Clinic' },
  addService: { ua: 'Додати послугу', en: 'Add Service' },
  addPost: { ua: 'Додати статтю', en: 'Add Post' },
  viewAllLeads: { ua: 'Усі заявки', en: 'View All Leads' },
  today: { ua: 'Сьогодні', en: 'Today' },
  thisWeek: { ua: 'Цей тиждень', en: 'This week' },
};

export function t(dict: Dict, key: string, lang: AdminLang, vars?: Record<string, string>): string {
  let text = dict[key]?.[lang] || dict[key]?.['en'] || key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
  }
  return text;
}
