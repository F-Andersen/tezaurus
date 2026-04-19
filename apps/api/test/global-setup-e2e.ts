import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

function loadDotEnv(envPath: string): void {
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
    if (!m) continue;
    const key = m[1];
    let value = m[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

/**
 * Запускається один раз перед усіма e2e-тестами.
 *
 * 1) Підхоплюємо TEST_DATABASE_URL з apps/api/.env (fallback на стандартний локальний URL).
 * 2) Встановлюємо DATABASE_URL = TEST_DATABASE_URL (тестовий конект для Prisma).
 * 3) Накатуємо міграції на тестову БД (`prisma migrate deploy`).
 * 4) Чистимо всі таблиці, щоб тести починали з порожньої БД.
 */
export default async function globalSetup(): Promise<void> {
  const envPath = path.resolve(__dirname, '..', '.env');
  loadDotEnv(envPath);

  const testDbUrl =
    process.env.TEST_DATABASE_URL ||
    'postgresql://tezaurus:tezaurus_secret@localhost:5432/tezaurus_tour_test';

  process.env.DATABASE_URL = testDbUrl;
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET || 'test-access-secret-min-32-chars-for-e2e-testing';
  process.env.JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-min-32-chars-for-e2e-testing';

  try {
    execSync('npx prisma migrate deploy', {
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, DATABASE_URL: testDbUrl },
      stdio: 'inherit',
    });
  } catch (err) {
    console.error('[e2e] prisma migrate deploy failed:', err);
    throw err;
  }

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient({ datasources: { db: { url: testDbUrl } } });
  try {
    await truncateAll(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

async function truncateAll(prisma: import('@prisma/client').PrismaClient): Promise<void> {
  const rows = await prisma.$queryRawUnsafe<{ tablename: string }[]>(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'",
  );
  if (rows.length === 0) return;
  const tables = rows.map((r) => `"public"."${r.tablename}"`).join(', ');
  await prisma.$executeRawUnsafe(`TRUNCATE ${tables} RESTART IDENTITY CASCADE`);
}
