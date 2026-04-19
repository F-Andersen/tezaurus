# Детальна інструкція: локальний запуск TEZAURUS-TOUR

Цей монорепозиторій використовує **pnpm** (див. `packageManager` у кореневому `package.json`). Нижче — покроковий запуск на Windows (PowerShell) або macOS/Linux (bash).

## Що потрібно встановити

| Компонент | Версія / примітка |
|-----------|-------------------|
| **Node.js** | 18 або новіше (`node -v`) |
| **pnpm** | 9 (`corepack enable` і `corepack prepare pnpm@9.0.0 --activate`, або `npm i -g pnpm@9`) |
| **PostgreSQL** | 16+ **або** Docker Desktop (для `docker compose`) |
| **Git** | для клонування репозиторію |

Перевірка pnpm з кореня проєкту:

```powershell
cd F:\WORK\WAQ
pnpm -v
```

---

## Крок 1. Клонування (якщо ще немає коду)

```powershell
git clone https://github.com/F-Andersen/tezaurus.git
cd tezaurus
```

Якщо працюєте з іншого remote — замініть URL.

---

## Крок 2. База даних (PostgreSQL)

### Варіант A — Docker (рекомендовано)

З кореня репозиторію:

```powershell
docker compose up -d postgres
```

У `docker-compose.yml` для Postgres задано користувача `tezaurus`, пароль `tezaurus_secret`, БД `tezaurus_tour`, порт **5432**.

### Варіант B — локальний PostgreSQL

Створіть базу та користувача з тими ж параметрами або відредагуйте `DATABASE_URL` у `apps/api/.env`.

Приклад рядка підключення (як у README):

```text
postgresql://tezaurus:tezaurus_secret@localhost:5432/tezaurus_tour
```

---

## Крок 3. Файл середовища API

З кореня проєкту:

```powershell
Copy-Item .env.example apps\api\.env
```

Відкрийте `apps/api/.env` і обов’язково вкажіть:

- **`DATABASE_URL`** — рядок підключення до PostgreSQL.
- **`JWT_ACCESS_SECRET`** та **`JWT_REFRESH_SECRET`** — довгі випадкові рядки (мінімум 32 символи кожен).

Решта змінних може залишитись з прикладу для локальної розробки; для листів, S3, captcha — за потреби пізніше.

---

## Крок 4. Встановлення залежностей (один раз)

З **кореня** монорепо:

```powershell
cd F:\WORK\WAQ
pnpm install
```

Це встановить залежності для `apps/api`, `apps/web`, `apps/admin` згідно з workspace.

---

## Крок 5. Prisma: generate, міграції, seed

З кореня (через скрипти кореня):

```powershell
pnpm db:generate
pnpm db:migrate
```

На запит імені міграції можна ввести на кшталт `init` або натиснути Enter, якщо CLI запропонує за замовчуванням.

**Seed (тестові дані + користувачі):**

```powershell
cd apps\api
pnpm prisma:seed
cd ..\..
```

Або з кореня:

```powershell
pnpm --filter api run prisma:seed
```

Після seed (типові облікові записи з README):

- Адмін: `admin@tezaurustour.com` / `admin123`
- Менеджер: `manager@tezaurustour.com` / `manager123`

---

## Крок 6. Змінні для фронтенду (за бажанням)

У коді є значення за замовчуванням (`http://localhost:4000` / `.../api`). Якщо API на іншому хості/порту — створіть:

**`apps/web/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**`apps/admin/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

(Для адмінки частина шляхів додає `/api/...` у коді самостійно.)

---

## Крок 7. Запуск сервісів (три термінали)

Усі команди з кореня `F:\WORK\WAQ`:

**Термінал 1 — API (NestJS, порт 4000):**

```powershell
cd F:\WORK\WAQ
pnpm dev:api
```

**Термінал 2 — публічний сайт (Next.js, порт 3000):**

```powershell
cd F:\WORK\WAQ
pnpm dev:web
```

**Термінал 3 — адмін-панель (Next.js, порт 3001):**

```powershell
cd F:\WORK\WAQ
pnpm dev:admin
```

Чекайте, поки кожен процес напише, що сервер слухає відповідний порт.

---

## Крок 8. Відкрити в браузері

| Що | URL |
|----|-----|
| Сайт (UA) | http://localhost:3000/ua |
| Сайт (EN) | http://localhost:3000/en |
| Адмін — логін | http://localhost:3001/admin/login |
| API | http://localhost:4000/api |
| Swagger | http://localhost:4000/api/docs |

---

## Корисні додаткові команди

| Дія | Команда з кореня |
|-----|------------------|
| Prisma Studio (перегляд БД) | `pnpm db:studio` |
| Збірка всіх пакетів | `pnpm build` |
| Тести web (якщо налаштовані) | `pnpm --filter web test` |

---

## Типові проблеми

1. **`Error: Can't reach database server`** — не запущено Postgres або невірний `DATABASE_URL` у `apps/api/.env`.
2. **Порти зайняті** — змініть порт у відповідному застосунку або зупиніть процес, який займає 3000 / 3001 / 4000.
3. **`pnpm` не знайдено** — увімкніть Corepack або встановіть pnpm глобально (див. розділ «Що потрібно встановити»).
4. **Міграції не застосовуються** — переконайтесь, що ви в корені й виконуєте `pnpm db:migrate` (він викликає `prisma migrate dev` у пакеті `api`).

---

## Гілки Git (як домовлено)

- **`main`** — стабільна лінія; зміни з `DEV` зливаються сюди, коли функціонал готовий.
- **`DEV`** — щоденна розробка; нові фічі комітити й пушити спочатку сюди.

Переключення на гілку розробки:

```powershell
git checkout DEV
git pull origin DEV
```

Після злиття в `main` на віддаленому репозиторії:

```powershell
git checkout main
git pull origin main
```
