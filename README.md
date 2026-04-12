# TEZAURUS-TOUR MVP

Public website (UA/EN), admin panel, and API for TEZAURUS-TOUR (luxury tourism & medical services).

## Stack

- **Public site**: Next.js 14 (App Router), SSR (force-dynamic), i18n `/ua` / `/en`
- **Admin**: Next.js 14 under `/admin`  
- **API**: NestJS 10, PostgreSQL (Prisma 5), JWT auth, RBAC, Throttler
- **Deploy**: Docker Compose + Nginx

## Quick start (local development)

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally

### 1. Setup environment

```bash
cd apps/api
copy ..\..\env.example .env    # Windows
cp ../../.env.example .env     # Linux/Mac
```

Edit `apps/api/.env` and set your `DATABASE_URL`.

### 2. Install dependencies

```bash
cd apps/api   && npm install
cd apps/web   && npm install
cd apps/admin && npm install
```

### 3. Setup database

```bash
cd apps/api
npx prisma db push           # create tables
npx ts-node prisma/seed.ts   # seed admin user + email receivers
```

Seed creates: `admin@tezaurustour.com` / `admin123`

### 4. Build API

```bash
cd apps/api
npm run build
```

### 5. Run all services

**Terminal 1 — API:**
```bash
cd apps/api
node dist/src/main.js
# or for development: npm run dev
```

**Terminal 2 — Public site:**
```bash
cd apps/web
npx next dev -p 3000
```

**Terminal 3 — Admin:**
```bash
cd apps/admin
npx next dev -p 3001
```

### URLs

| Service | URL |
|---------|-----|
| Public site | http://localhost:3000/ua |
| Public site EN | http://localhost:3000/en |
| Admin panel | http://localhost:3001/admin/login |
| API | http://localhost:4000/api |
| API docs (Swagger) | http://localhost:4000/api/docs |

## Features (MVP)

### Public site
- UA/EN (`/ua/...`, `/en/...`) with language switcher (preserves current page)
- All pages SSR (Server-Side Rendered) — full SEO support
- Pages: Home, About, Services, Clinics catalog + detail, Blog, Contacts, Privacy, Cookies, Medical disclaimer
- Form "Leave a request" (name, phone, email, type, country, message, consent)
- Form "Call me back" (phone, name)
- `sitemap.xml`, `robots.txt`, dynamic metadata per page/clinic/post

### API (NestJS)
- Public read-only: `/api/public/pages`, `/api/public/clinics`, `/api/public/blog`, `/api/public/settings`
- Leads: `POST /api/public/leads` — rate limited (10/15min per IP), optional Turnstile captcha
- Admin CRUD: pages, clinics, blog categories+posts, leads, media, settings, users, redirects
- Auth: `POST /api/auth/login|refresh|logout|me` — JWT access + httpOnly refresh cookie
- RBAC roles: Admin / Content Manager / Sales

### Admin panel
- Login page → JWT stored in localStorage + refresh cookie
- Auth guard: auto-redirect to login if token missing
- Modules: Pages, Clinics, Blog (categories + posts), Leads (filters + status + CSV export), Media (upload/delete), Settings (email receivers, GA/GTM, phones, messengers), Users (Admin only), Redirects

## Docker deployment

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with production values

# Build and start
docker-compose up -d postgres
docker-compose up -d api web admin nginx
```

For HTTPS: obtain Let's Encrypt certs via certbot, place in `nginx/ssl/`, then uncomment the `server { listen 443 ssl ... }` block in `nginx/nginx.conf`.

## Bug fixes applied

1. Missing `passport-local` dependency added
2. Language switcher now preserves current page (`/ua/clinics/slug` ↔ `/en/clinics/slug`)
3. ThrottlerGuard registered globally via `APP_GUARD`
4. All API fetch functions are network-error resilient (graceful fallback)
5. `export const dynamic = 'force-dynamic'` added to `[lang]` layout for proper SSR
6. Admin `AdminLayoutClient` auto-redirects to `/admin/login` if not authenticated
7. NestJS `LeadsModule` now imports `SettingsModule` (was causing DI error)
8. `cookieParser` import changed from ESM `default` to CommonJS `* as`
9. API start path fixed to `dist/src/main.js`
10. Export endpoint sends CSV with UTF-8 BOM for correct Excel encoding
11. Docker Compose `NEXT_PUBLIC_API_URL` uses build-time arg (not runtime env)
12. `nginx.conf` structure fixed (valid nginx syntax with HTTPS block commented)
