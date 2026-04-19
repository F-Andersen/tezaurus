import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

/**
 * Хелпер для e2e-тестів: підіймає повноцінний Nest-додаток, підключений до тестової БД,
 * та надає функцію для очистки таблиць між тестами.
 */
export interface E2eFixture {
  app: INestApplication;
  prisma: PrismaService;
  truncate: () => Promise<void>;
  close: () => Promise<void>;
}

export async function setupE2e(): Promise<E2eFixture> {
  const testDbUrl =
    process.env.TEST_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'postgresql://tezaurus:tezaurus_secret@localhost:5432/tezaurus_tour_test';
  process.env.DATABASE_URL = testDbUrl;

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.init();

  const prisma = app.get(PrismaService);

  const truncate = async () => {
    const rows = await prisma.$queryRawUnsafe<{ tablename: string }[]>(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'",
    );
    if (rows.length === 0) return;
    const tables = rows.map((r) => `"public"."${r.tablename}"`).join(', ');
    await prisma.$executeRawUnsafe(`TRUNCATE ${tables} RESTART IDENTITY CASCADE`);
  };

  const close = async () => {
    await app.close();
  };

  return { app, prisma: prisma as unknown as PrismaService, truncate, close };
}

/** Окремий prisma-клієнт — корисно для seed-ів у тестах без підйому всього Nest. */
export function makeTestPrisma(): PrismaClient {
  const testDbUrl =
    process.env.TEST_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'postgresql://tezaurus:tezaurus_secret@localhost:5432/tezaurus_tour_test';
  return new PrismaClient({ datasources: { db: { url: testDbUrl } } });
}
