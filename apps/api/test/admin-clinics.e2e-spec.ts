import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { setupE2e, E2eFixture } from './setup-e2e';

async function loginAsAdmin(fx: E2eFixture): Promise<string> {
  await fx.prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('secret123', 10),
      role: 'ADMIN',
    },
  });
  const login = await request(fx.app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'secret123' });
  return login.body.accessToken as string;
}

describe('Admin clinics (e2e)', () => {
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

  it('GET /api/admin/clinics → 401 без токена', async () => {
    await request(fx.app.getHttpServer()).get('/api/admin/clinics').expect(401);
  });

  it('POST/GET/PATCH/DELETE /api/admin/clinics повний CRUD під адміном', async () => {
    const token = await loginAsAdmin(fx);

    const created = await request(fx.app.getHttpServer())
      .post('/api/admin/clinics')
      .set('Authorization', `Bearer ${token}`)
      .send({
        slug: 'charite-berlin',
        nameUa: 'Шаріте',
        nameEn: 'Charité',
        country: 'Germany',
        city: 'Berlin',
        specializations: ['Oncology'],
      })
      .expect(201);
    expect(created.body.slug).toBe('charite-berlin');
    const id = created.body.id as string;

    const list = await request(fx.app.getHttpServer())
      .get('/api/admin/clinics')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(list.body).toHaveLength(1);

    await request(fx.app.getHttpServer())
      .patch(`/api/admin/clinics/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nameUa: 'Оновлена клініка' })
      .expect(200);

    const one = await request(fx.app.getHttpServer())
      .get(`/api/admin/clinics/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(one.body.nameUa).toBe('Оновлена клініка');

    await request(fx.app.getHttpServer())
      .delete(`/api/admin/clinics/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const after = await request(fx.app.getHttpServer())
      .get('/api/admin/clinics')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(after.body).toHaveLength(0);
  });

  it('POST /api/admin/clinics з дубльованим slug → 409', async () => {
    const token = await loginAsAdmin(fx);
    await fx.prisma.clinic.create({ data: { slug: 'dup', nameUa: 'D' } });

    await request(fx.app.getHttpServer())
      .post('/api/admin/clinics')
      .set('Authorization', `Bearer ${token}`)
      .send({ slug: 'dup', nameUa: 'New' })
      .expect(409);
  });
});
