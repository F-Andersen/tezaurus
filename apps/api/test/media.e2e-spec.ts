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

describe('Media admin (e2e — basic)', () => {
  let fx: E2eFixture;

  beforeAll(async () => {
    fx = await setupE2e();
  });

  afterAll(async () => {
    await fx.close();
  });

  beforeEach(async () => {
    await fx.truncate();
    delete process.env.S3_BUCKET;
    delete process.env.S3_ACCESS_KEY;
    delete process.env.S3_SECRET_KEY;
    delete process.env.S3_PUBLIC_URL;
  });

  it('GET /api/admin/media → 401 без токена', async () => {
    await request(fx.app.getHttpServer()).get('/api/admin/media').expect(401);
  });

  it('POST /api/admin/media/upload без S3 зберігає метадані у БД та повертає локальний URL', async () => {
    const token = await loginAsAdmin(fx);
    const res = await request(fx.app.getHttpServer())
      .post('/api/admin/media/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('fake-png-bytes'), { filename: 'pic.png', contentType: 'image/png' })
      .field('altUa', 'альт UA')
      .field('altEn', 'alt EN')
      .expect(201);

    expect(res.body.id).toEqual(expect.any(String));
    expect(res.body.url).toMatch(/^\/api\/admin\/media\/file\//);

    const list = await request(fx.app.getHttpServer())
      .get('/api/admin/media')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].altUa).toBe('альт UA');
  });

  it('GET /api/admin/media/file/:id повертає збережений файл (мінімальна реалізація)', async () => {
    const token = await loginAsAdmin(fx);
    const upload = await request(fx.app.getHttpServer())
      .post('/api/admin/media/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('hello-world-bytes'), { filename: 'hi.txt', contentType: 'text/plain' })
      .expect(201);

    const id = upload.body.id as string;

    const fileRes = await request(fx.app.getHttpServer())
      .get(`/api/admin/media/file/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .buffer(true)
      .parse((res, cb) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => cb(null, Buffer.concat(chunks)));
      })
      .expect(200);
    expect(fileRes.headers['content-type']).toContain('text/plain');
    const body = fileRes.body as Buffer;
    expect(body.toString('utf8')).toContain('hello-world-bytes');
  });

  it('DELETE /api/admin/media/:id видаляє запис з БД', async () => {
    const token = await loginAsAdmin(fx);
    const upload = await request(fx.app.getHttpServer())
      .post('/api/admin/media/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('x'), { filename: 'x.bin' })
      .expect(201);

    await request(fx.app.getHttpServer())
      .delete(`/api/admin/media/${upload.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const count = await fx.prisma.mediaAsset.count();
    expect(count).toBe(0);
  });
});
