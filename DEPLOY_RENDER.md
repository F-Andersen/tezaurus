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
| **API** | **`DATABASE_URL`** (обов’язково) — рядок підключення PostgreSQL. У Blueprint він підставляється з БД; якщо сервіс створювали **вручну**, додайте змінну самі (див. нижче). Також: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `NODE_ENV=production`, `API_PORT=4000` (або залиште `PORT`, який задає Render), `WEB_URL`, `ADMIN_URL`. |
| **Web** | `NEXT_PUBLIC_API_URL` — `https://<ваш-api>.onrender.com/api` (з суфіксом `/api`). |
| **Admin** | Те саме `NEXT_PUBLIC_API_URL`. |

У `render.yaml` за замовчуванням стоять приклади `tezaurus-*.onrender.com`; якщо імена сервісів інші — замініть у Blueprint або вручну в Dashboard.

### Помилка `Environment variable not found: DATABASE_URL` (P1012)

Це означає, що у **Web Service → Environment** для API **немає** змінної `DATABASE_URL`.

1. У Render створіть або відкрийте **PostgreSQL** (або використайте вже існуючу БД).
2. Скопіюйте **Internal Database URL** (краще для сервісу в тому ж регіоні) або **External**.
3. У сервісі **API** → **Environment** → **Add Environment Variable**:
   - Key: `DATABASE_URL`
   - Value: вставлений URL (формат `postgresql://user:password@host:5432/dbname`).
4. Збережіть і зробіть **Manual Deploy** → **Clear build cache & deploy** (або звичайний redeploy).

Без `DATABASE_URL` команда в контейнері `npx prisma migrate deploy` не може стартувати — збірка Docker може бути успішною, а **деплой** впаде на цьому кроці.

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

## 8. Ручний Web Service: кореневий каталог і Docker (перевірка)

У полях Render мають бути **англійські** шляхи з репозиторію (`apps`, не переклад браузера на кшталт «програми»). Без зайвих пробілів у кінці рядка.

### Варіант A — кореневий каталог **порожній** (корінь репозиторію)

Як у [`render.yaml`](./render.yaml) для Blueprint:

| Поле | API | Web | Admin |
|------|-----|-----|-------|
| **Dockerfile Path** | `apps/api/Dockerfile` | `apps/web/Dockerfile` | `apps/admin/Dockerfile` |
| **Docker Build Context** | `apps/api` | `apps/web` | `apps/admin` |

### Варіант B — **Root Directory** уже вказано на підпроєкт

Наприклад для API: **Root Directory** = `apps/api`. Тоді шляхи рахуються **від цієї папки**, не дублюйте `apps/api`:

| Поле | Значення |
|------|----------|
| **Dockerfile Path** | `Dockerfile` |
| **Docker Build Context** | `.` |

Якщо при Root Directory = `apps/api` ще раз вписати `apps/api/Dockerfile`, збірка шукатиме неіснуючий шлях `apps/api/apps/api/...` і зламається.

### Інше з ваших скрінів

- **Регіон Oregon, Free 512 MB** — нормально для тесту; для продакшену часто беруть ближчий до аудиторії регіон і платний план.
- Повний стек (сайт + адмінка + API + БД) — це **чотири** ресурси в Blueprint; один сервіс на кшталт `tezaurus` покриє лише один з компонентів — переконайтесь, що це саме той сервіс (наприклад API), і що **Web** та **Admin** теж задеплоєні окремо, якщо вони потрібні.
