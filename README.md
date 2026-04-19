# TEZAURUS-TOUR

Публічний сайт (UA/EN), адмін-панель та API для TEZAURUS-TOUR — преміальний медичний туризм та оздоровчі послуги.

## Технології

| Компонент | Стек |
|-----------|------|
| **Публічний сайт** | Next.js 14 (App Router), Tailwind CSS, SSR, i18n `/ua` / `/en` |
| **Адмін-панель** | Next.js 14, Tailwind CSS, JWT auth, RBAC |
| **API** | NestJS 10, PostgreSQL, Prisma 5, JWT, Swagger |
| **Деплой** | Docker Compose + Nginx / Render.com |

## Швидкий старт (локальна розробка)

### Вимоги

- Node.js 18+
- PostgreSQL 16+ (або Docker)
- npm

### 1. Запуск PostgreSQL через Docker

```bash
docker-compose up -d postgres
```

Або якщо PostgreSQL вже встановлений локально — пропустіть цей крок.

### 2. Налаштування середовища

```bash
# Скопіюйте приклад env
cp .env.example apps/api/.env

# Відредагуйте apps/api/.env — вкажіть DATABASE_URL:
# DATABASE_URL="postgresql://tezaurus:tezaurus_secret@localhost:5432/tezaurus_tour"
```

### 3. Встановлення залежностей

```bash
cd apps/api   && npm install && cd ../..
cd apps/web   && npm install && cd ../..
cd apps/admin && npm install && cd ../..
```

### 4. Налаштування бази даних

```bash
cd apps/api

# Застосувати міграції
npx prisma migrate dev

# Заповнити тестовими даними (клініки, послуги, блог, користувачі)
npx ts-node prisma/seed.ts
```

Seed створює:
- **Адмін**: `admin@tezaurustour.com` / `admin123`
- **Менеджер**: `manager@tezaurustour.com` / `manager123`
- 12 клінік, 12 послуг, 4 блог-пости, 3 сторінки

### 5. Запуск усіх сервісів

Відкрийте 3 термінали:

**Термінал 1 — API:**
```bash
cd apps/api
npm run dev
```

**Термінал 2 — Публічний сайт:**
```bash
cd apps/web
npm run dev
```

**Термінал 3 — Адмін-панель:**
```bash
cd apps/admin
npm run dev
```

### URL-адреси

| Сервіс | URL |
|--------|-----|
| Публічний сайт (UA) | http://localhost:3000/ua |
| Публічний сайт (EN) | http://localhost:3000/en |
| Адмін-панель | http://localhost:3001/admin/login |
| API | http://localhost:4000/api |
| API документація (Swagger) | http://localhost:4000/api/docs |

## Функціонал

### Публічний сайт
- Двомовність UA/EN з перемикачем мови
- Сторінки: Головна, Послуги, Клініки (каталог + деталі), Блог, Про нас, Контакти
- Інтерактивні фільтри та пошук на сторінках послуг і клінік
- Форми: "Залишити заявку" та "Передзвоніть мені"
- SSR, SEO (sitemap.xml, robots.txt, мета-теги)

### API (NestJS)
- Публічні ендпоінти: `/api/public/pages`, `/api/public/clinics`, `/api/public/services`, `/api/public/blog`, `/api/public/settings`
- Ліди: `POST /api/public/leads` — rate limiting, опціональна captcha
- Адмін CRUD: сторінки, клініки, послуги, блог, ліди, медіа, налаштування, користувачі, редіректи
- Дашборд зі статистикою: `GET /api/admin/dashboard/stats`
- Auth: JWT access token + httpOnly refresh cookie
- RBAC ролі: Admin / Content Manager / Sales

### Адмін-панель
- Авторизація з JWT
- Ролі: Admin (повний доступ + статистика), Content Manager (контент), Sales (ліди)
- Модулі: Дашборд, Сторінки, Клініки, Послуги, Блог (категорії + пости), Ліди, Медіа, Налаштування, Користувачі, Редіректи

## Docker деплой (локальний)

```bash
# Скопіюйте та налаштуйте середовище
cp .env.example .env
# Відредагуйте .env з продакшен значеннями

# Запуск всього стеку
docker-compose up -d
```

Сервіси: PostgreSQL, API (порт 4000), Web (порт 3000), Admin (порт 3001), Nginx (порт 80).

Для HTTPS: отримайте сертифікати Let's Encrypt, помістіть у `nginx/ssl/`, розкоментуйте HTTPS блок у `nginx/nginx.conf`.

## Деплой на Render.com

Проект містить `render.yaml` Blueprint для автоматичного деплою:

1. Запушити код на GitHub
2. На [dashboard.render.com](https://dashboard.render.com) створити **New → Blueprint**
3. Підключити GitHub репозиторій
4. Render створить: PostgreSQL, API, Web, Admin
5. Після деплою запустити seed через Shell API сервісу:
   ```bash
   npx ts-node prisma/seed.ts
   ```

### Render URL-адреси

| Сервіс | URL |
|--------|-----|
| Сайт | https://tezaurus-web.onrender.com |
| Адмін | https://tezaurus-admin.onrender.com/admin/login |
| API | https://tezaurus-api.onrender.com/api |

## Структура проекту

```
tezaurus-tour/
├── apps/
│   ├── api/            # NestJS API + Prisma
│   │   ├── prisma/     # Схема, міграції, seed
│   │   └── src/        # Контролери, сервіси, модулі
│   ├── web/            # Next.js публічний сайт
│   │   ├── app/        # App Router сторінки
│   │   ├── components/ # React компоненти
│   │   └── lib/        # API хелпери
│   └── admin/          # Next.js адмін-панель
│       ├── app/        # App Router сторінки
│       ├── components/ # React компоненти
│       └── lib/        # API хелпери
├── nginx/              # Nginx конфігурація
├── docker-compose.yml  # Docker стек
├── render.yaml         # Render.com Blueprint
└── .env.example        # Приклад змінних середовища
```

## Змінні середовища

Дивіться `.env.example` для повного списку. Основні:

| Змінна | Опис |
|--------|------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Секрет для access токенів (мін. 32 символи) |
| `JWT_REFRESH_SECRET` | Секрет для refresh токенів (мін. 32 символи) |
| `WEB_URL` | URL публічного сайту (для CORS) |
| `ADMIN_URL` | URL адмін-панелі (для CORS) |
| `NEXT_PUBLIC_API_URL` | URL API для фронтенду |
