import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { setupE2e, E2eFixture } from './setup-e2e';

describe('Auth (e2e)', () => {
  let fx: E2eFixture;

  beforeAll(async () => {
    fx = await setupE2e();
  });

  afterAll(async () => {
    await fx.close();
  });

  beforeEach(async () => {
    await fx.truncate();
    await fx.prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: await bcrypt.hash('secret123', 10),
        role: 'ADMIN',
      },
    });
  });

  it('POST /api/auth/login → 201 з accessToken та refresh cookie', async () => {
    const res = await request(fx.app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'secret123' })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        user: expect.objectContaining({ email: 'admin@example.com', role: 'ADMIN' }),
      }),
    );
    const cookies = Array.isArray(res.headers['set-cookie']) ? res.headers['set-cookie'] : [res.headers['set-cookie']];
    expect(cookies.some((c: string) => c && c.includes('refreshToken='))).toBe(true);
  });

  it('POST /api/auth/login → 401 з невалідним паролем', async () => {
    await request(fx.app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'wrong' })
      .expect(401);
  });

  it('GET /api/auth/me → 401 без токена', async () => {
    await request(fx.app.getHttpServer()).get('/api/auth/me').expect(401);
  });

  it('GET /api/auth/me → 200 з валідним access token', async () => {
    const login = await request(fx.app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'secret123' })
      .expect(201);
    const token: string = login.body.accessToken;

    const me = await request(fx.app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(me.body).toEqual(expect.objectContaining({ email: 'admin@example.com' }));
  });

  it('POST /api/auth/refresh → 201 з новим токеном по refresh-cookie', async () => {
    const login = await request(fx.app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'secret123' })
      .expect(201);
    const setCookie = login.headers['set-cookie'] as unknown as string | string[] | undefined;
    const cookies = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
    const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
    expect(refreshCookie).toBeDefined();

    const refresh = await request(fx.app.getHttpServer())
      .post('/api/auth/refresh')
      .set('Cookie', refreshCookie!.split(';')[0])
      .expect(201);

    expect(refresh.body.accessToken).toBeTruthy();
    expect(refresh.body.user).toEqual(expect.objectContaining({ email: 'admin@example.com' }));
    // access token формується з iat у секундах — не завжди відрізняється у межах 1с;
    // перевіряємо лише валідність нового токена через /me.
    await request(fx.app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${refresh.body.accessToken}`)
      .expect(200);
  });
});
