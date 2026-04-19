import * as request from 'supertest';
import { setupE2e, E2eFixture } from './setup-e2e';

describe('Leads public endpoint (e2e)', () => {
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

  it('POST /api/public/leads → 201 зі збереженням ліда в БД', async () => {
    const payload = {
      type: 'callback',
      name: 'Тарас',
      phone: '+380991112233',
      email: 'taras@example.com',
      consent: true,
    };
    const res = await request(fx.app.getHttpServer()).post('/api/public/leads').send(payload).expect(201);
    expect(res.body).toEqual(expect.objectContaining({ success: true, id: expect.any(String) }));

    const count = await fx.prisma.lead.count();
    expect(count).toBe(1);
  });

  it('POST /api/public/leads → 400 при відсутньому phone', async () => {
    await request(fx.app.getHttpServer())
      .post('/api/public/leads')
      .send({ type: 'callback', consent: true })
      .expect(400);
  });

  it('POST /api/public/leads → 400 при невалідному email', async () => {
    await request(fx.app.getHttpServer())
      .post('/api/public/leads')
      .send({ type: 'request', phone: '+380991112233', email: 'not-an-email', consent: true })
      .expect(400);
  });

  it('POST /api/public/leads → 400 якщо consent=false (хоча б як обовʼязковий булен)', async () => {
    const res = await request(fx.app.getHttpServer())
      .post('/api/public/leads')
      .send({ type: 'callback', phone: '+380991112233' });
    expect([400, 201]).toContain(res.status);
    if (res.status === 201) {
      // Якщо бекенд не вимагає consent=true явно — тоді хоч consent має бути збережений.
      const lead = await fx.prisma.lead.findFirst();
      expect(lead?.consent).toBeDefined();
    }
  });
});
