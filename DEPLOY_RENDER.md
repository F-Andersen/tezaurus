# Деплой на Render.com

Короткий чекліст для репозиторію з уже налаштованим [`render.yaml`](./render.yaml).

## 1. Підключення

1. У Render: **New → Blueprint** → виберіть цей репозиторій і гілку (наприклад `DEV` або `main`).
2. Render створить **PostgreSQL** і три **Web**-сервіси (`tezaurus-api`, `tezaurus-web`, `tezaurus-admin`) з Docker.

## 2. URL після першого деплою

Після деплою Render видасть реальні URL (наприклад `https://tezaurus-api-xxxx.onrender.com`).

Оновіть у **Environment** кожного сервісу:

| Сервіс | Змінні |
|--------|--------|
| **API** | `WEB_URL` — публічний URL сайту; `ADMIN_URL` — URL адмінки (для CORS). |
| **Web** | `NEXT_PUBLIC_API_URL` — `https://<ваш-api>.onrender.com/api` (з суфіксом `/api`). |
| **Admin** | Те саме `NEXT_PUBLIC_API_URL`. |

У `render.yaml` за замовчуванням стоять приклади `tezaurus-*.onrender.com`; якщо імена сервісів інші — замініть у Blueprint або вручну в Dashboard.

## 3. Міграції

У Docker API вже виконується `npx prisma migrate deploy` перед стартом — окремо нічого не запускайте, якщо міграції в репозиторії актуальні.

## 4. Seed (один раз або після чистої БД)

У Render Shell для сервісу **API**:

```bash
npx prisma db seed
```

(або команда з `package.json` вашого API, якщо seed підключений через Prisma.)

## 5. Перевірка

- Відкрийте **Web** → `/ua` та `/en`.
- **Admin** → логін після seed (див. README).
- **API** → `https://<api>/api/docs` (Swagger).

## 6. Ліміти free tier

- Холодний старт сервісів — перший запит може бути повільним.
- База **free** має обмеження за розміром і терміном; для продакшену розгляньте платний план.

## 7. Помилка `npm ci` у Docker (API)

Якщо збірка падає з `package.json and package-lock.json are not in sync`, у каталозі `apps/api` виконайте `npm install` і закомітьте оновлений `package-lock.json`. У Docker використовується саме `npm ci`, тому lock-файл має відповідати `package.json`.
