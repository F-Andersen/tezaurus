import * as request from 'supertest';
import { setupE2e, E2eFixture } from './setup-e2e';

describe('Public endpoints (e2e)', () => {
  let fx: E2eFixture;

  beforeAll(async () => {
    fx = await setupE2e();
  });

  afterAll(async () => {
    await fx.close();
  });

  beforeEach(async () => {
    await fx.truncate();
  });

  it('GET /api/public/pages/:slug → 200 з локалізованим контентом', async () => {
    await fx.prisma.page.create({
      data: {
        slug: 'home',
        titleUa: 'Головна',
        titleEn: 'Home',
        contentUa: '<p>UA</p>',
        contentEn: '<p>EN</p>',
        metaTitleUa: 'Мета UA',
        metaTitleEn: 'Meta EN',
        published: true,
      },
    });

    const ua = await request(fx.app.getHttpServer()).get('/api/public/pages/home?lang=ua').expect(200);
    expect(ua.body).toMatchObject({ slug: 'home', title: 'Головна', content: '<p>UA</p>' });

    const en = await request(fx.app.getHttpServer()).get('/api/public/pages/home?lang=en').expect(200);
    expect(en.body).toMatchObject({ title: 'Home', content: '<p>EN</p>' });
  });

  it('GET /api/public/pages/:slug → 404 для невідомого slug', async () => {
    await request(fx.app.getHttpServer()).get('/api/public/pages/missing').expect(404);
  });

  it('GET /api/public/pages/:slug → 404 для неопублікованої сторінки', async () => {
    await fx.prisma.page.create({
      data: { slug: 'draft', titleUa: 'Чернетка', published: false },
    });
    await request(fx.app.getHttpServer()).get('/api/public/pages/draft').expect(404);
  });

  it('GET /api/public/clinics повертає published клініки з фільтром country', async () => {
    await fx.prisma.clinic.createMany({
      data: [
        { slug: 'a', nameUa: 'A', nameEn: 'A', country: 'Germany', city: 'Berlin', published: true },
        { slug: 'b', nameUa: 'B', nameEn: 'B', country: 'Turkey', city: 'Istanbul', published: true },
        { slug: 'c', nameUa: 'C', nameEn: 'C', country: 'Germany', city: 'Munich', published: false },
      ],
    });

    const all = await request(fx.app.getHttpServer()).get('/api/public/clinics').expect(200);
    expect(all.body).toHaveLength(2);

    const filtered = await request(fx.app.getHttpServer())
      .get('/api/public/clinics?country=Germany')
      .expect(200);
    expect(filtered.body).toHaveLength(1);
    expect(filtered.body[0].slug).toBe('a');
  });

  it('GET /api/public/services повертає published з коректною мовою', async () => {
    await fx.prisma.service.createMany({
      data: [
        { slug: 's1', nameUa: 'C1', nameEn: 'S1', published: true, sortOrder: 1, currency: 'USD' },
        { slug: 's2', nameUa: 'C2', nameEn: 'S2', published: false, sortOrder: 2, currency: 'USD' },
      ],
    });

    const ua = await request(fx.app.getHttpServer()).get('/api/public/services?lang=ua').expect(200);
    expect(ua.body).toHaveLength(1);
    expect(ua.body[0]).toMatchObject({ slug: 's1', name: 'C1' });

    const en = await request(fx.app.getHttpServer()).get('/api/public/services?lang=en').expect(200);
    expect(en.body[0].name).toBe('S1');
  });

  it('GET /api/public/blog показує лише published пости', async () => {
    await fx.prisma.blogCategory.create({
      data: { slug: 'news', nameUa: 'Новини', nameEn: 'News' },
    });
    const cat = await fx.prisma.blogCategory.findFirst({ where: { slug: 'news' } });

    await fx.prisma.blogPost.createMany({
      data: [
        {
          slug: 'p1',
          titleUa: 'П1',
          titleEn: 'P1',
          status: 'published',
          publishedAt: new Date(),
          categoryId: cat!.id,
        },
        {
          slug: 'p2',
          titleUa: 'П2',
          titleEn: 'P2',
          status: 'draft',
          categoryId: cat!.id,
        },
      ],
    });

    const res = await request(fx.app.getHttpServer()).get('/api/public/blog').expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].slug).toBe('p1');
  });

  it('GET /api/public/settings повертає публічні налаштування', async () => {
    await fx.prisma.setting.create({
      data: { key: 'phones', value: ['+380 44 123 45 67'] as never },
    });
    const res = await request(fx.app.getHttpServer()).get('/api/public/settings').expect(200);
    expect(res.body).toHaveProperty('phones');
  });
});
