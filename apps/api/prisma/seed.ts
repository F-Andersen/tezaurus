import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@tezaurustour.com' },
    update: {},
    create: { email: 'admin@tezaurustour.com', passwordHash: hash, role: 'ADMIN' },
  });
  const contentHash = await bcrypt.hash('manager123', 10);
  await prisma.user.upsert({
    where: { email: 'manager@tezaurustour.com' },
    update: {},
    create: { email: 'manager@tezaurustour.com', passwordHash: contentHash, role: 'CONTENT_MANAGER' },
  });

  await prisma.setting.upsert({
    where: { key: 'email_receivers' },
    update: {},
    create: { key: 'email_receivers', value: ['tesaurus@ukr.net', 's.vovk@tezaurustour.com'] },
  });
  await prisma.setting.upsert({
    where: { key: 'phones' },
    update: {},
    create: { key: 'phones', value: ['+380 44 123 45 67', '+380 67 890 12 34'] },
  });
  await prisma.setting.upsert({
    where: { key: 'contacts.email' },
    update: {},
    create: { key: 'contacts.email', value: 'info@tezaurustour.com' },
  });
  await prisma.setting.upsert({
    where: { key: 'contacts.address' },
    update: {},
    create: { key: 'contacts.address', value: 'Kyiv, Ukraine' },
  });
  await prisma.setting.upsert({
    where: { key: 'messengers' },
    update: {},
    create: {
      key: 'messengers',
      value: {
        Telegram: 'https://t.me/tezaurustour',
        WhatsApp: 'https://wa.me/380441234567',
        Instagram: 'https://instagram.com/tezaurustour',
      },
    },
  });

  // ── SERVICES ──
  const services = [
    {
      slug: 'cardiology-checkup-germany',
      nameUa: 'Кардіологічний чекап у Німеччині',
      nameEn: 'Cardiology Check-up in Germany',
      category: 'diagnostics',
      descriptionUa: 'Повне кардіологічне обстеження у провідних клініках Мюнхена та Берліна. Включає ЕКГ, ехокардіографію, стрес-тести та консультацію кардіолога.',
      descriptionEn: 'Complete cardiac examination at leading clinics in Munich and Berlin. Includes ECG, echocardiography, stress tests, and cardiologist consultation.',
      country: 'Germany', city: 'Munich', priceFrom: 3500, currency: 'EUR', duration: '3-5 днів',
      imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
      tags: ['cardiology', 'diagnostics', 'checkup'], featured: true, published: true, sortOrder: 1,
    },
    {
      slug: 'oncology-screening-turkey',
      nameUa: 'Онкологічний скринінг у Туреччині',
      nameEn: 'Oncology Screening in Turkey',
      category: 'diagnostics',
      descriptionUa: 'Комплексний онкологічний скринінг у провідних клініках Стамбула. Включає ПЕТ-КТ, аналізи крові на онкомаркери та консультацію онколога.',
      descriptionEn: 'Comprehensive oncology screening at top Istanbul clinics. Includes PET-CT, tumor marker blood tests, and oncologist consultation.',
      country: 'Turkey', city: 'Istanbul', priceFrom: 2200, currency: 'USD', duration: '2-4 дні',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
      tags: ['oncology', 'screening', 'diagnostics'], featured: true, published: true, sortOrder: 2,
    },
    {
      slug: 'dental-implants-turkey',
      nameUa: 'Дентальна імплантація у Туреччині',
      nameEn: 'Dental Implants in Turkey',
      category: 'treatment',
      descriptionUa: 'Встановлення зубних імплантів преміум-класу в провідних стоматологічних клініках Анталії.',
      descriptionEn: 'Premium dental implant placement at top dental clinics in Antalya.',
      country: 'Turkey', city: 'Antalya', priceFrom: 800, currency: 'EUR', duration: '5-10 днів',
      imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
      tags: ['dental', 'implants', 'treatment'], featured: true, published: true, sortOrder: 3,
    },
    {
      slug: 'rehabilitation-israel',
      nameUa: 'Реабілітація в Ізраїлі',
      nameEn: 'Rehabilitation in Israel',
      category: 'rehabilitation',
      descriptionUa: 'Індивідуальна програма реабілітації після операцій та травм у провідних реабілітаційних центрах Тель-Авіва.',
      descriptionEn: 'Individualized rehabilitation program after surgery and injuries at leading rehab centers in Tel Aviv.',
      country: 'Israel', city: 'Tel Aviv', priceFrom: 5000, currency: 'USD', duration: '7-21 день',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
      tags: ['rehabilitation', 'recovery'], featured: false, published: true, sortOrder: 4,
    },
    {
      slug: 'ivf-czech-republic',
      nameUa: 'ЕКЗ / IVF у Чехії',
      nameEn: 'IVF in Czech Republic',
      category: 'treatment',
      descriptionUa: 'Програми екстракорпорального запліднення у провідних репродуктивних клініках Праги з високим відсотком успішності.',
      descriptionEn: 'In vitro fertilization programs at leading reproductive clinics in Prague with high success rates.',
      country: 'Czech Republic', city: 'Prague', priceFrom: 3000, currency: 'EUR', duration: '14-21 день',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      tags: ['ivf', 'reproductive', 'treatment'], featured: true, published: true, sortOrder: 5,
    },
    {
      slug: 'spa-wellness-austria',
      nameUa: 'СПА та велнес в Австрії',
      nameEn: 'Spa & Wellness in Austria',
      category: 'wellness',
      descriptionUa: 'Оздоровчі програми у термальних курортах Бадена та Зальцбурга. Термальні процедури, масажі та детокс-програми.',
      descriptionEn: 'Health programs at thermal resorts in Baden and Salzburg. Thermal treatments, massages, and detox programs.',
      country: 'Austria', city: 'Baden', priceFrom: 1500, currency: 'EUR', duration: '5-14 днів',
      // Same-origin asset: avoids ERR_BLOCKED_BY_CLIENT on images.unsplash.com in strict blockers
      imageUrl: '/placeholders/service.svg',
      tags: ['spa', 'wellness', 'thermal'], featured: false, published: true, sortOrder: 6,
    },
    {
      slug: 'eye-surgery-south-korea',
      nameUa: 'Лазерна корекція зору у Південній Кореї',
      nameEn: 'Laser Eye Surgery in South Korea',
      category: 'treatment',
      descriptionUa: 'Лазерна корекція зору LASIK/SMILE у провідних офтальмологічних центрах Сеула з найсучаснішим обладнанням.',
      descriptionEn: 'LASIK/SMILE laser vision correction at leading ophthalmology centers in Seoul with state-of-the-art equipment.',
      country: 'South Korea', city: 'Seoul', priceFrom: 2500, currency: 'USD', duration: '3-5 днів',
      imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80',
      tags: ['ophthalmology', 'lasik', 'treatment'], featured: true, published: true, sortOrder: 7,
    },
    {
      slug: 'aesthetic-surgery-switzerland',
      nameUa: 'Естетична хірургія у Швейцарії',
      nameEn: 'Aesthetic Surgery in Switzerland',
      category: 'cosmetic',
      descriptionUa: 'Преміальна естетична хірургія у клініках Цюріха та Женеви. Ринопластика, ліпосакція, підтяжка обличчя від провідних хірургів Європи.',
      descriptionEn: 'Premium aesthetic surgery at Zurich and Geneva clinics. Rhinoplasty, liposuction, facelift from Europe\'s leading surgeons.',
      country: 'Switzerland', city: 'Zurich', priceFrom: 12000, currency: 'EUR', duration: '7-14 днів',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      tags: ['aesthetic', 'surgery', 'cosmetic'], featured: true, published: true, sortOrder: 8,
    },
    {
      slug: 'orthopedic-germany',
      nameUa: 'Ортопедія та ендопротезування у Німеччині',
      nameEn: 'Orthopedics & Joint Replacement in Germany',
      category: 'treatment',
      descriptionUa: 'Ендопротезування кульшових та колінних суглобів у провідних ортопедичних клініках Берліна та Гамбурга.',
      descriptionEn: 'Hip and knee joint replacement at leading orthopedic clinics in Berlin and Hamburg.',
      country: 'Germany', city: 'Berlin', priceFrom: 8000, currency: 'EUR', duration: '10-21 день',
      imageUrl: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&q=80',
      tags: ['orthopedics', 'joint', 'treatment'], featured: false, published: true, sortOrder: 9,
    },
    {
      slug: 'longevity-program-italy',
      nameUa: 'Програма довголіття на озері Комо',
      nameEn: 'Longevity Program at Lake Como',
      category: 'wellness',
      descriptionUa: 'Інтегративна програма довголіття з генетичним аналізом, детокс-терапією та персоналізованим харчуванням на берегах озера Комо.',
      descriptionEn: 'Integrative longevity program with genetic analysis, detox therapy, and personalized nutrition on the shores of Lake Como.',
      country: 'Italy', city: 'Lake Como', priceFrom: 15000, currency: 'EUR', duration: '7-14 днів',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      tags: ['longevity', 'wellness', 'detox'], featured: true, published: true, sortOrder: 10,
    },
    {
      slug: 'hair-transplant-turkey',
      nameUa: 'Пересадка волосся у Туреччині',
      nameEn: 'Hair Transplant in Turkey',
      category: 'cosmetic',
      descriptionUa: 'Пересадка волосся методами FUE та DHI у провідних клініках Стамбула. Включає проживання та трансфери.',
      descriptionEn: 'FUE and DHI hair transplant at leading Istanbul clinics. Includes accommodation and transfers.',
      country: 'Turkey', city: 'Istanbul', priceFrom: 1500, currency: 'EUR', duration: '3-5 днів',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      tags: ['hair', 'transplant', 'cosmetic'], featured: false, published: true, sortOrder: 11,
    },
    {
      slug: 'weight-loss-surgery-turkey',
      nameUa: 'Баріатрична хірургія у Туреччині',
      nameEn: 'Weight Loss Surgery in Turkey',
      category: 'treatment',
      descriptionUa: 'Баріатричні операції (рукавна гастректомія, шунтування шлунка) у провідних клініках Анталії та Стамбула.',
      descriptionEn: 'Bariatric surgery (sleeve gastrectomy, gastric bypass) at top clinics in Antalya and Istanbul.',
      country: 'Turkey', city: 'Istanbul', priceFrom: 3500, currency: 'EUR', duration: '7-10 днів',
      imageUrl: 'https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=800&q=80',
      tags: ['bariatric', 'weight-loss', 'surgery'], featured: false, published: true, sortOrder: 12,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: { imageUrl: s.imageUrl }, create: s });
  }

  // ── CLINICS ──
  const clinics = [
    {
      slug: 'charite-berlin',
      nameUa: 'Клініка Шаріте',
      nameEn: 'Charité University Hospital',
      country: 'Germany', city: 'Berlin',
      specializations: ['Oncology', 'Cardiology', 'Neurosurgery', 'Orthopedics'],
      descriptionUa: 'Одна з найбільших університетських клінік Європи. Шаріте — це понад 300 років досвіду, передові технології та міжнародна репутація у лікуванні складних випадків.',
      descriptionEn: 'One of the largest university hospitals in Europe. Charité has over 300 years of experience, advanced technology, and international reputation for complex case treatment.',
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
      published: true,
    },
    {
      slug: 'hirslanden-zurich',
      nameUa: 'Клініка Гірсланден',
      nameEn: 'Hirslanden Clinic',
      country: 'Switzerland', city: 'Zurich',
      specializations: ['Aesthetic Surgery', 'Cardiology', 'Longevity', 'Orthopedics'],
      descriptionUa: 'Найбільша приватна клінічна група Швейцарії. Гірсланден пропонує персоналізований підхід, преміальний сервіс та найвищі стандарти якості.',
      descriptionEn: 'Switzerland\'s largest private clinic group. Hirslanden offers personalized approach, premium service, and highest quality standards.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      published: true,
    },
    {
      slug: 'memorial-istanbul',
      nameUa: 'Меморіал Шишлі',
      nameEn: 'Memorial Şişli Hospital',
      country: 'Turkey', city: 'Istanbul',
      specializations: ['Oncology', 'Transplantation', 'Cardiology', 'IVF'],
      descriptionUa: 'Провідна багатопрофільна клініка Туреччини з акредитацією JCI. Відома своїми успіхами в трансплантології та онкології.',
      descriptionEn: 'Turkey\'s leading multi-specialty hospital with JCI accreditation. Known for outstanding transplantation and oncology results.',
      imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
      published: true,
    },
    {
      slug: 'acibadem-istanbul',
      nameUa: 'Аджибадем Маслак',
      nameEn: 'Acıbadem Maslak Hospital',
      country: 'Turkey', city: 'Istanbul',
      specializations: ['Dental', 'Aesthetic Surgery', 'Ophthalmology', 'Bariatric Surgery'],
      descriptionUa: 'Мережа клінік Аджибадем — один з найбільших медичних брендів Туреччини. Клініка Маслак спеціалізується на естетичній та реконструктивній хірургії.',
      descriptionEn: 'Acıbadem network is one of Turkey\'s largest medical brands. Maslak hospital specializes in aesthetic and reconstructive surgery.',
      imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&q=80',
      published: true,
    },
    {
      slug: 'hadassah-jerusalem',
      nameUa: 'Клініка Хадасса',
      nameEn: 'Hadassah Medical Center',
      country: 'Israel', city: 'Jerusalem',
      specializations: ['Oncology', 'Hematology', 'Rehabilitation', 'Pediatrics'],
      descriptionUa: 'Провідний медичний центр Ізраїлю з міжнародною репутацією. Хадасса — піонер у лікуванні онкогематологічних захворювань та реабілітації.',
      descriptionEn: 'Israel\'s leading medical center with international reputation. Hadassah is a pioneer in oncohematological treatment and rehabilitation.',
      imageUrl: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&q=80',
      published: true,
    },
    {
      slug: 'ichilov-tel-aviv',
      nameUa: 'Медичний центр Іхілов (Сураскі)',
      nameEn: 'Ichilov (Sourasky) Medical Center',
      country: 'Israel', city: 'Tel Aviv',
      specializations: ['Neurosurgery', 'Cardiology', 'Orthopedics', 'IVF'],
      descriptionUa: 'Один з найбільших державних госпіталів Ізраїлю, розташований у центрі Тель-Авіва. Відомий інноваційними методами лікування.',
      descriptionEn: 'One of Israel\'s largest public hospitals, located in the heart of Tel Aviv. Known for innovative treatment methods.',
      imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80',
      published: true,
    },
    {
      slug: 'samsung-medical-seoul',
      nameUa: 'Медичний центр Самсунг',
      nameEn: 'Samsung Medical Center',
      country: 'South Korea', city: 'Seoul',
      specializations: ['Oncology', 'Ophthalmology', 'Cardiology', 'Diagnostics'],
      descriptionUa: 'Провідний медичний центр Південної Кореї, заснований корпорацією Samsung. Поєднує найновіші технології з індивідуальним підходом.',
      descriptionEn: 'South Korea\'s leading medical center, founded by Samsung Corporation. Combines cutting-edge technology with personalized care.',
      imageUrl: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&q=80',
      published: true,
    },
    {
      slug: 'severance-seoul',
      nameUa: 'Госпіталь Северанс Йонсей',
      nameEn: 'Severance Yonsei Hospital',
      country: 'South Korea', city: 'Seoul',
      specializations: ['Robotic Surgery', 'Transplantation', 'Neurology', 'Rehabilitation'],
      descriptionUa: 'Один з найстаріших і найпрестижніших медичних закладів Кореї. Госпіталь Северанс — лідер у роботизованій хірургії.',
      descriptionEn: 'One of Korea\'s oldest and most prestigious medical institutions. Severance Hospital is a leader in robotic surgery.',
      imageUrl: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80',
      published: true,
    },
    {
      slug: 'rudolfinerhaus-vienna',
      nameUa: 'Рудольфінерхаус Відень',
      nameEn: 'Rudolfinerhaus Vienna',
      country: 'Austria', city: 'Vienna',
      specializations: ['Orthopedics', 'Rehabilitation', 'Wellness', 'Diagnostics'],
      descriptionUa: 'Елітна приватна клініка у Відні з понад 130-річною історією. Відома своєю ортопедичною школою та реабілітаційними програмами.',
      descriptionEn: 'Elite private clinic in Vienna with over 130 years of history. Known for its orthopedic school and rehabilitation programs.',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      published: true,
    },
    {
      slug: 'motol-prague',
      nameUa: 'Університетська лікарня Мотол',
      nameEn: 'Motol University Hospital',
      country: 'Czech Republic', city: 'Prague',
      specializations: ['IVF', 'Pediatrics', 'Neurosurgery', 'Cardiology'],
      descriptionUa: 'Найбільший медичний заклад Чеської Республіки. Мотол відомий своїми успіхами у репродуктивній медицині та педіатрії.',
      descriptionEn: 'The largest medical facility in the Czech Republic. Motol is known for its success in reproductive medicine and pediatrics.',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
      published: true,
    },
    {
      slug: 'humanitas-milan',
      nameUa: 'Клініка Гуманітас',
      nameEn: 'Humanitas Research Hospital',
      country: 'Italy', city: 'Milan',
      specializations: ['Oncology', 'Cardiology', 'Orthopedics', 'Robotic Surgery'],
      descriptionUa: 'Провідна дослідницька клініка Італії у Мілані. Гуманітас поєднує клінічну практику з науковими дослідженнями світового рівня.',
      descriptionEn: 'Italy\'s leading research hospital in Milan. Humanitas combines clinical practice with world-class scientific research.',
      imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
      published: true,
    },
    {
      slug: 'medipol-istanbul',
      nameUa: 'Медіпол Мега',
      nameEn: 'Medipol Mega Hospital',
      country: 'Turkey', city: 'Istanbul',
      specializations: ['Dental', 'Hair Transplant', 'Bariatric Surgery', 'Aesthetic Surgery'],
      descriptionUa: 'Один з найбільших приватних госпіталів Туреччини. Медіпол Мега пропонує широкий спектр естетичних та хірургічних послуг.',
      descriptionEn: 'One of the largest private hospitals in Turkey. Medipol Mega offers a wide range of aesthetic and surgical services.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      published: true,
    },
  ];

  for (const c of clinics) {
    await prisma.clinic.upsert({ where: { slug: c.slug }, update: { imageUrl: c.imageUrl }, create: c });
  }

  // ── BLOG CATEGORIES ──
  const blogCategories = [
    { slug: 'medical-tourism', nameUa: 'Медичний туризм', nameEn: 'Medical Tourism' },
    { slug: 'wellness', nameUa: 'Здоров\'я та велнес', nameEn: 'Health & Wellness' },
    { slug: 'tips', nameUa: 'Поради', nameEn: 'Tips & Guides' },
  ];

  for (const cat of blogCategories) {
    await prisma.blogCategory.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  // ── BLOG POSTS ──
  const categories = await prisma.blogCategory.findMany();
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const blogPosts = [
    {
      slug: 'top-5-clinics-turkey-2026',
      coverImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&q=80',
      categoryId: catMap['medical-tourism'],
      titleUa: 'Топ-5 клінік Туреччини у 2026 році',
      titleEn: 'Top 5 Clinics in Turkey in 2026',
      excerptUa: 'Огляд найкращих турецьких клінік для медичного туризму: від естетичної хірургії до онкології.',
      excerptEn: 'A review of the best Turkish clinics for medical tourism: from aesthetic surgery to oncology.',
      metaTitleUa: 'Топ-5 клінік Туреччини 2026 — TEZAURUS-TOUR',
      metaTitleEn: 'Top 5 Clinics in Turkey 2026 — TEZAURUS-TOUR',
      metaDescriptionUa: 'Рейтинг найкращих турецьких клінік для медичного туризму у 2026 році. Естетична хірургія, онкологія, стоматологія.',
      metaDescriptionEn: 'Ranking of the best Turkish clinics for medical tourism in 2026. Aesthetic surgery, oncology, dentistry.',
      bodyUa: `<h2>Чому Туреччина — лідер медичного туризму</h2>
<p>Туреччина залишається одним з найпопулярніших напрямків медичного туризму у світі. Щороку понад 1,5 мільйона пацієнтів з різних країн обирають турецькі клініки завдяки поєднанню високої якості медичних послуг та доступних цін. Акредитація JCI, якою володіють десятки турецьких лікарень, підтверджує відповідність міжнародним стандартам безпеки та якості.</p>
<p>Окрім медичної складової, Туреччина приваблює пацієнтів комфортним кліматом, розвиненою туристичною інфраструктурою та відсутністю мовного бар\'єру — більшість клінік мають штат перекладачів українською та російською мовами.</p>

<h2>1. Memorial Şişli Hospital — Стамбул</h2>
<p>Клініка Memorial Şişli вважається флагманом мережі Memorial Healthcare Group. Тут працюють понад 300 лікарів, серед яких — провідні онкологи, кардіохірурги та трансплантологи Туреччини. Клініка оснащена найсучаснішим обладнанням, включаючи роботизовану систему Da Vinci для малоінвазивних операцій.</p>

<h2>2. Acıbadem Maslak Hospital — Стамбул</h2>
<p>Мережа Acıbadem — один з найбільших медичних брендів країни з понад 20 лікарнями. Клініка Maslak спеціалізується на естетичній хірургії, стоматології та офтальмології. Пацієнти цінують індивідуальний підхід та преміальний рівень сервісу.</p>

<h2>3. Medipol Mega Hospital — Стамбул</h2>
<p>Medipol Mega — один з найбільших приватних медичних комплексів Туреччини. Госпіталь пропонує повний спектр послуг: від діагностики до складних хірургічних втручань. Особливо відомий відділенням пересадки волосся та баріатричної хірургії.</p>

<h2>4. Medical Park Antalya — Анталія</h2>
<p>Для пацієнтів, які хочуть поєднати лікування з відпочинком на узбережжі, Medical Park Antalya — ідеальний вибір. Клініка відома своїми програмами стоматологічного туризму та реабілітації після операцій. Комфортне розташування та теплий клімат сприяють швидкому відновленню.</p>

<h2>5. Liv Hospital — Стамбул</h2>
<p>Liv Hospital позиціонується як клініка нового покоління. Сучасна архітектура, цифровізація всіх процесів та фокус на пацієнтоцентричному підході відрізняють її від конкурентів. Основні спеціалізації — кардіологія, нейрохірургія та ортопедія.</p>

<h2>На що звертати увагу при виборі</h2>
<ul>
<li>Перевіряйте наявність міжнародної акредитації JCI</li>
<li>Читайте відгуки реальних пацієнтів на незалежних платформах</li>
<li>Уточнюйте, чи є в клініці україномовний координатор</li>
<li>Порівнюйте повну вартість пакету, включаючи проживання та трансфери</li>
<li>Запитуйте про гарантії та політику у разі ускладнень</li>
</ul>`,
      bodyEn: `<h2>Why Turkey Leads in Medical Tourism</h2>
<p>Turkey remains one of the world's most popular medical tourism destinations. Every year, over 1.5 million patients from various countries choose Turkish clinics for their combination of high-quality medical services and affordable prices. JCI accreditation, held by dozens of Turkish hospitals, confirms compliance with international safety and quality standards.</p>
<p>Beyond the medical component, Turkey attracts patients with its comfortable climate, developed tourism infrastructure, and lack of language barriers — most clinics have translators on staff for multiple languages.</p>

<h2>1. Memorial Şişli Hospital — Istanbul</h2>
<p>Memorial Şişli is considered the flagship of the Memorial Healthcare Group. Over 300 doctors work here, including Turkey's leading oncologists, cardiac surgeons, and transplant specialists. The clinic is equipped with state-of-the-art technology, including the Da Vinci robotic system for minimally invasive surgery.</p>

<h2>2. Acıbadem Maslak Hospital — Istanbul</h2>
<p>The Acıbadem network is one of the country's largest medical brands with over 20 hospitals. The Maslak clinic specializes in aesthetic surgery, dentistry, and ophthalmology. Patients value the personalized approach and premium level of service.</p>

<h2>3. Medipol Mega Hospital — Istanbul</h2>
<p>Medipol Mega is one of Turkey's largest private medical complexes. The hospital offers a full range of services: from diagnostics to complex surgical interventions. It is particularly known for its hair transplant and bariatric surgery departments.</p>

<h2>4. Medical Park Antalya — Antalya</h2>
<p>For patients who want to combine treatment with a seaside vacation, Medical Park Antalya is an ideal choice. The clinic is known for its dental tourism programs and post-operative rehabilitation. The comfortable location and warm climate promote rapid recovery.</p>

<h2>5. Liv Hospital — Istanbul</h2>
<p>Liv Hospital positions itself as a next-generation clinic. Modern architecture, digitalization of all processes, and a focus on patient-centered care set it apart from competitors. Main specializations include cardiology, neurosurgery, and orthopedics.</p>

<h2>What to Look For When Choosing</h2>
<ul>
<li>Check for international JCI accreditation</li>
<li>Read real patient reviews on independent platforms</li>
<li>Ask whether the clinic has a coordinator who speaks your language</li>
<li>Compare the full package cost, including accommodation and transfers</li>
<li>Inquire about guarantees and complication policies</li>
</ul>`,
      tags: ['turkey', 'clinics', 'review'], status: 'published' as const, publishedAt: new Date('2026-03-15'),
    },
    {
      slug: 'how-to-prepare-for-medical-trip',
      coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=1200&q=80',
      categoryId: catMap['tips'],
      titleUa: 'Як підготуватися до медичної подорожі: повний гід',
      titleEn: 'How to Prepare for a Medical Trip: Complete Guide',
      excerptUa: 'Детальний покроковий гід з підготовки до лікування за кордоном.',
      excerptEn: 'A detailed step-by-step guide to preparing for treatment abroad.',
      metaTitleUa: 'Як підготуватися до медичної подорожі — TEZAURUS-TOUR',
      metaTitleEn: 'How to Prepare for a Medical Trip — TEZAURUS-TOUR',
      metaDescriptionUa: 'Покроковий гід з підготовки до лікування за кордоном: документи, аналізи, організація подорожі.',
      metaDescriptionEn: 'Step-by-step guide to preparing for treatment abroad: documents, tests, travel organization.',
      bodyUa: `<h2>Перший крок: збір медичної документації</h2>
<p>Підготовка до медичної подорожі починається задовго до вильоту. Найважливіший етап — збір повної медичної документації. Це включає виписки з історії хвороби, результати попередніх обстежень, знімки МРТ або КТ, а також перелік медикаментів, які ви приймаєте на постійній основі.</p>
<p>Рекомендуємо перекласти всі документи англійською мовою та завірити переклад у нотаріуса. Більшість закордонних клінік приймають документи в електронному вигляді — скануйте все заздалегідь та збережіть копії у хмарному сховищі.</p>

<h2>Консультація з клінікою до поїздки</h2>
<p>Перед бронюванням подорожі обов\'язково пройдіть попередню онлайн-консультацію з обраною клінікою. Це дозволить лікарю оцінити ваш стан, уточнити план лікування та надати точний кошторис. Багато клінік пропонують безкоштовну першу консультацію.</p>
<p>Під час консультації задайте всі питання, що вас турбують: тривалість лікування, очікуваний результат, можливі ризики та період відновлення. Запишіть відповіді або попросіть надіслати їх письмово.</p>

<h2>Організація подорожі: чек-лист</h2>
<p>Після підтвердження плану лікування настає час організувати саму поїздку. Ось перелік ключових пунктів, про які не можна забувати:</p>
<ol>
<li>Перевірте термін дії паспорта — він має бути дійсним щонайменше 6 місяців після запланованої дати повернення</li>
<li>Оформіть медичну страховку, що покриває лікування за кордоном</li>
<li>Заброньюйте авіаквитки з урахуванням періоду відновлення після процедури</li>
<li>Організуйте проживання поблизу клініки — багато лікарень мають партнерські готелі</li>
<li>Підготуйте зручний одяг та необхідні речі для перебування в лікарні</li>
<li>Повідомте ваш банк про подорож, щоб уникнути блокування картки</li>
</ol>

<h2>Що взяти з собою</h2>
<p>Окрім стандартного набору речей для подорожі, рекомендуємо взяти з собою усі медичні документи у друкованому вигляді, запас необхідних ліків на весь період поїздки та зручне взуття для прогулянок під час відновлення. Також не забудьте адаптер для зарядних пристроїв, якщо їдете в країну з іншим стандартом розеток.</p>

<h2>Фінансове планування</h2>
<p>Складіть детальний бюджет поїздки. Окрім вартості лікування, врахуйте витрати на переліт, проживання, харчування, місцевий транспорт та непередбачені витрати. Рекомендуємо мати фінансовий запас у розмірі 15–20% від загального бюджету на випадок додаткових процедур або подовження перебування.</p>`,
      bodyEn: `<h2>First Step: Gathering Medical Documentation</h2>
<p>Preparing for a medical trip begins well before your flight. The most important stage is collecting complete medical documentation. This includes medical history extracts, previous examination results, MRI or CT scans, and a list of medications you take regularly.</p>
<p>We recommend translating all documents into English and having the translation notarized. Most foreign clinics accept documents electronically — scan everything in advance and save copies in cloud storage.</p>

<h2>Pre-Trip Consultation with the Clinic</h2>
<p>Before booking your trip, be sure to have a preliminary online consultation with your chosen clinic. This allows the doctor to assess your condition, clarify the treatment plan, and provide an accurate cost estimate. Many clinics offer a free initial consultation.</p>
<p>During the consultation, ask all the questions that concern you: treatment duration, expected results, possible risks, and recovery period. Write down the answers or ask to receive them in writing.</p>

<h2>Travel Organization: Checklist</h2>
<p>After confirming the treatment plan, it's time to organize the trip itself. Here is a checklist of key items you shouldn't forget:</p>
<ol>
<li>Check your passport validity — it must be valid for at least 6 months after your planned return date</li>
<li>Arrange medical insurance that covers treatment abroad</li>
<li>Book flights allowing for post-procedure recovery time</li>
<li>Organize accommodation near the clinic — many hospitals have partner hotels</li>
<li>Prepare comfortable clothing and essentials for your hospital stay</li>
<li>Notify your bank about the trip to avoid card blocking</li>
</ol>

<h2>What to Bring</h2>
<p>In addition to the standard travel essentials, we recommend bringing all medical documents in printed form, a supply of necessary medications for the entire trip, and comfortable shoes for walks during recovery. Also don't forget a power adapter if you're traveling to a country with different outlet standards.</p>

<h2>Financial Planning</h2>
<p>Create a detailed trip budget. Beyond the cost of treatment, account for flights, accommodation, meals, local transportation, and unexpected expenses. We recommend having a financial reserve of 15–20% of the total budget in case of additional procedures or extended stays.</p>`,
      tags: ['guide', 'preparation', 'tips'], status: 'published' as const, publishedAt: new Date('2026-02-20'),
    },
    {
      slug: 'wellness-trends-2026',
      coverImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80',
      categoryId: catMap['wellness'],
      titleUa: 'Тренди велнес-туризму у 2026 році',
      titleEn: 'Wellness Tourism Trends in 2026',
      excerptUa: 'Які оздоровчі програми та напрямки стануть найпопулярнішими цього року.',
      excerptEn: 'Which wellness programs and destinations will be most popular this year.',
      metaTitleUa: 'Тренди велнес-туризму 2026 — TEZAURUS-TOUR',
      metaTitleEn: 'Wellness Tourism Trends 2026 — TEZAURUS-TOUR',
      metaDescriptionUa: 'Огляд головних трендів оздоровчого туризму у 2026 році: лонгевіті, біохакінг, термальні курорти.',
      metaDescriptionEn: 'Overview of the top wellness tourism trends in 2026: longevity, biohacking, thermal resorts.',
      bodyUa: `<h2>Велнес-туризм: новий рівень</h2>
<p>Велнес-туризм у 2026 році виходить на новий рівень, перетворюючись з простого відпочинку на курортах у цілеспрямовані програми підтримки здоров\'я та довголіття. За даними Global Wellness Institute, ринок оздоровчого туризму зріс до $1,2 трильйона, і Європа залишається ключовим регіоном для цього сегменту.</p>
<p>Пацієнти все частіше обирають не просто спа-процедури, а комплексні програми, що включають генетичне тестування, персоналізоване харчування та передові методики відновлення організму.</p>

<h2>Тренд №1: Програми довголіття (Longevity)</h2>
<p>Лонгевіті-програми — безумовний лідер 2026 року. Клініки Швейцарії, Італії та Австрії пропонують комплексні 7–14 денні програми, що включають повний генетичний аналіз, дослідження біомаркерів старіння, IV-терапію та персоналізовані рекомендації щодо способу життя.</p>
<p>Вартість таких програм починається від €10 000, але попит на них зростає щороку на 35%. Основна аудиторія — успішні професіонали 40–60 років, які інвестують у своє здоров\'я превентивно.</p>

<h2>Тренд №2: Термальні курорти з медичним супроводом</h2>
<p>Традиційні термальні курорти Австрії, Угорщини та Чехії трансформуються, додаючи медичний компонент. Тепер поряд з класичними термальними ваннами пацієнтам пропонують консультації лікарів, фізіотерапію та програми детоксикації під медичним наглядом.</p>
<ul>
<li>Баден (Австрія) — термальні сірчані джерела + ортопедична реабілітація</li>
<li>Хевіз (Угорщина) — природне термальне озеро + ревматологічне лікування</li>
<li>Карлові Вари (Чехія) — мінеральні джерела + гастроентерологічні програми</li>
</ul>

<h2>Тренд №3: Digital Detox та ментальне здоров\'я</h2>
<p>Після пандемії та ери віддаленої роботи все більше людей шукають програми повного цифрового відключення. Спеціалізовані ретрити пропонують 5–10 днів без гаджетів у поєднанні з медитацією, психотерапією та природотерапією.</p>
<p>Особливо популярними стали програми у гірських регіонах Австрії та на узбережжі Хорватії, де природне середовище посилює терапевтичний ефект.</p>

<h2>Тренд №4: Біохакінг та превентивна діагностика</h2>
<p>Біохакінг-тури — новий формат медичного туризму, що поєднує повне обстеження організму з передовими методиками оптимізації здоров\'я. Програми включають аналіз мікробіому, тестування харчових непереносимостей, кріотерапію та гіпербаричну оксигенацію.</p>`,
      bodyEn: `<h2>Wellness Tourism: A New Level</h2>
<p>Wellness tourism in 2026 is reaching a new level, transforming from simple resort vacations into targeted health maintenance and longevity programs. According to the Global Wellness Institute, the wellness tourism market has grown to $1.2 trillion, with Europe remaining the key region for this segment.</p>
<p>Patients increasingly choose not just spa treatments but comprehensive programs that include genetic testing, personalized nutrition, and advanced body recovery techniques.</p>

<h2>Trend #1: Longevity Programs</h2>
<p>Longevity programs are the undisputed leader of 2026. Clinics in Switzerland, Italy, and Austria offer comprehensive 7–14 day programs that include full genetic analysis, aging biomarker research, IV therapy, and personalized lifestyle recommendations.</p>
<p>These programs start at €10,000, but demand grows by 35% annually. The primary audience is successful professionals aged 40–60 who invest in their health preventively.</p>

<h2>Trend #2: Thermal Resorts with Medical Support</h2>
<p>Traditional thermal resorts in Austria, Hungary, and the Czech Republic are transforming by adding a medical component. Alongside classic thermal baths, patients are now offered doctor consultations, physiotherapy, and detoxification programs under medical supervision.</p>
<ul>
<li>Baden (Austria) — thermal sulfur springs + orthopedic rehabilitation</li>
<li>Hévíz (Hungary) — natural thermal lake + rheumatological treatment</li>
<li>Karlovy Vary (Czech Republic) — mineral springs + gastroenterology programs</li>
</ul>

<h2>Trend #3: Digital Detox & Mental Health</h2>
<p>After the pandemic and the era of remote work, more people are seeking complete digital disconnection programs. Specialized retreats offer 5–10 days without gadgets combined with meditation, psychotherapy, and nature therapy.</p>
<p>Programs in Austria's mountain regions and on Croatia's coastline have become especially popular, where the natural environment enhances the therapeutic effect.</p>

<h2>Trend #4: Biohacking & Preventive Diagnostics</h2>
<p>Biohacking tours are a new format of medical tourism combining full body examination with advanced health optimization techniques. Programs include microbiome analysis, food intolerance testing, cryotherapy, and hyperbaric oxygenation.</p>`,
      tags: ['wellness', 'trends', '2026'], status: 'published' as const, publishedAt: new Date('2026-01-10'),
    },
    {
      slug: 'dental-tourism-guide',
      coverImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&q=80',
      categoryId: catMap['medical-tourism'],
      titleUa: 'Стоматологічний туризм: все, що потрібно знати',
      titleEn: 'Dental Tourism: Everything You Need to Know',
      excerptUa: 'Повний гід зі стоматологічного туризму: кращі країни, ціни та очікування.',
      excerptEn: 'Complete dental tourism guide: best countries, prices, and expectations.',
      metaTitleUa: 'Стоматологічний туризм — повний гід — TEZAURUS-TOUR',
      metaTitleEn: 'Dental Tourism — Complete Guide — TEZAURUS-TOUR',
      metaDescriptionUa: 'Все про стоматологічний туризм: найкращі країни, вартість імплантів та вінірів, як обрати клініку.',
      metaDescriptionEn: 'Everything about dental tourism: best countries, implant and veneer costs, how to choose a clinic.',
      bodyUa: `<h2>Чому стоматологічний туризм набирає обертів</h2>
<p>Стоматологічний туризм — один з найбільш динамічних сегментів медичного туризму. Причина проста: вартість стоматологічних процедур у Західній Європі та США може бути в 3–5 разів вищою, ніж у Туреччині, Угорщині чи Польщі, при порівнянній якості. Сучасні стоматологічні клініки за кордоном використовують ті ж матеріали та технології, що й їхні західні колеги.</p>
<p>За статистикою, найпопулярнішими процедурами є встановлення зубних імплантів, виготовлення вінірів та повна реставрація зубного ряду. Середня економія для пацієнта складає від €2 000 до €15 000 залежно від обсягу робіт.</p>

<h2>Найкращі країни для стоматологічного туризму</h2>
<p>Кожна країна має свої переваги та спеціалізацію. Ось наш рейтинг найкращих напрямків для стоматологічного лікування:</p>
<ul>
<li><strong>Туреччина (Анталія, Стамбул)</strong> — лідер за кількістю стоматологічних туристів. Найкраще співвідношення ціна/якість для імплантів та вінірів. Вартість імпланту від €400.</li>
<li><strong>Угорщина (Будапешт)</strong> — «стоматологічна столиця Європи». Особливо популярна серед пацієнтів з Великобританії та Німеччини. Високий рівень сервісу та зручне розташування.</li>
<li><strong>Польща (Краків, Вроцлав)</strong> — зручний варіант для українських пацієнтів завдяки географічній близькості. Конкурентні ціни та сучасне обладнання.</li>
<li><strong>Чехія (Прага)</strong> — поєднання якісної стоматології з можливістю культурного відпочинку. Особливо сильна у протезуванні.</li>
</ul>

<h2>Скільки коштують основні процедури</h2>
<p>Орієнтовна вартість популярних стоматологічних процедур за кордоном:</p>
<ol>
<li>Зубний імплант (включаючи коронку) — від €400 до €1 200</li>
<li>Вінір (за одиницю) — від €150 до €400</li>
<li>Комплект «Hollywood Smile» (20 вінірів) — від €3 000 до €6 000</li>
<li>Відбілювання зубів — від €150 до €300</li>
<li>Повна реставрація «All-on-4» — від €4 000 до €8 000</li>
</ol>

<h2>Як обрати стоматологічну клініку за кордоном</h2>
<p>При виборі клініки зверніть увагу на досвід роботи з іноземними пацієнтами, наявність сертифікатів ISO та відгуки на міжнародних платформах. Попросіть надати портфоліо робіт — фото «до» та «після». Якісна клініка завжди готова провести безкоштовну онлайн-консультацію та надати детальний план лікування з фіксованою ціною.</p>
<p>TEZAURUS-TOUR співпрацює лише з перевіреними стоматологічними клініками та допомагає організувати весь процес: від первинної консультації до трансферу з аеропорту.</p>`,
      bodyEn: `<h2>Why Dental Tourism Is Booming</h2>
<p>Dental tourism is one of the most dynamic segments of medical tourism. The reason is simple: dental procedure costs in Western Europe and the US can be 3–5 times higher than in Turkey, Hungary, or Poland, with comparable quality. Modern dental clinics abroad use the same materials and technologies as their Western counterparts.</p>
<p>According to statistics, the most popular procedures are dental implant placement, veneer fabrication, and full dental row restoration. Average patient savings range from €2,000 to €15,000 depending on the scope of work.</p>

<h2>Best Countries for Dental Tourism</h2>
<p>Each country has its own advantages and specialization. Here is our ranking of the best destinations for dental treatment:</p>
<ul>
<li><strong>Turkey (Antalya, Istanbul)</strong> — the leader in dental tourist numbers. Best price-to-quality ratio for implants and veneers. Implant cost from €400.</li>
<li><strong>Hungary (Budapest)</strong> — the "dental capital of Europe." Especially popular among patients from the UK and Germany. High service level and convenient location.</li>
<li><strong>Poland (Krakow, Wroclaw)</strong> — a convenient option for Ukrainian patients due to geographical proximity. Competitive prices and modern equipment.</li>
<li><strong>Czech Republic (Prague)</strong> — combining quality dentistry with cultural vacation opportunities. Particularly strong in prosthetics.</li>
</ul>

<h2>How Much Do Key Procedures Cost</h2>
<p>Approximate costs of popular dental procedures abroad:</p>
<ol>
<li>Dental implant (including crown) — from €400 to €1,200</li>
<li>Veneer (per unit) — from €150 to €400</li>
<li>"Hollywood Smile" set (20 veneers) — from €3,000 to €6,000</li>
<li>Teeth whitening — from €150 to €300</li>
<li>Full "All-on-4" restoration — from €4,000 to €8,000</li>
</ol>

<h2>How to Choose a Dental Clinic Abroad</h2>
<p>When choosing a clinic, pay attention to experience with international patients, ISO certifications, and reviews on international platforms. Ask for a portfolio of work — before and after photos. A quality clinic is always ready to provide a free online consultation and a detailed treatment plan with a fixed price.</p>
<p>TEZAURUS-TOUR partners only with verified dental clinics and helps organize the entire process: from initial consultation to airport transfers.</p>`,
      tags: ['dental', 'guide', 'tourism'], status: 'published' as const, publishedAt: new Date('2026-04-01'),
    },
    {
      slug: 'medical-tourism-insurance-guide',
      coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848e968838?w=1200&q=80',
      categoryId: catMap['tips'],
      titleUa: 'Страхування при медичному туризмі: повний гід',
      titleEn: 'Medical Tourism Insurance Guide',
      excerptUa: 'Все про страхування під час лікування за кордоном: види полісів, що покривається та як обрати.',
      excerptEn: 'Everything about insurance during treatment abroad: policy types, coverage, and how to choose.',
      metaTitleUa: 'Страхування при медичному туризмі — TEZAURUS-TOUR',
      metaTitleEn: 'Medical Tourism Insurance Guide — TEZAURUS-TOUR',
      metaDescriptionUa: 'Як обрати страховку для лікування за кордоном. Види полісів, покриття ускладнень, поради від експертів.',
      metaDescriptionEn: 'How to choose insurance for treatment abroad. Policy types, complication coverage, expert advice.',
      bodyUa: `<h2>Чому страхування — обов\'язковий елемент медичної подорожі</h2>
<p>Страхування при медичному туризмі — це не просто формальність, а важливий інструмент захисту вашого здоров\'я та фінансів. Навіть при найретельнішому плануванні можуть виникнути непередбачені ситуації: ускладнення після процедури, потреба у додатковому лікуванні або затримка повернення додому через медичні причини.</p>
<p>Стандартна туристична страховка зазвичай НЕ покриває планове лікування за кордоном. Тому вам потрібен спеціалізований поліс для медичного туризму або розширене покриття від клініки.</p>

<h2>Види страхових полісів</h2>
<p>Існує кілька типів страхування, релевантних для медичних туристів:</p>
<ul>
<li><strong>Страхування подорожі (Travel Insurance)</strong> — базове покриття, що включає екстрену медичну допомогу, евакуацію та репатріацію. Не покриває планові процедури.</li>
<li><strong>Страхування медичного туризму</strong> — спеціалізований продукт, що покриває ускладнення після планових процедур, додаткове лікування та подовжене перебування.</li>
<li><strong>Гарантія клініки</strong> — багато сертифікованих клінік пропонують власне покриття на випадок ускладнень, включаючи безкоштовне повторне лікування.</li>
<li><strong>Комплексний пакет</strong> — поєднання страхування подорожі та медичного покриття в одному полісі.</li>
</ul>

<h2>Що має покривати ваш поліс</h2>
<p>При виборі страховки переконайтеся, що вона включає наступні пункти:</p>
<ol>
<li>Ускладнення після запланованої процедури (мінімум 30 днів після операції)</li>
<li>Екстрену госпіталізацію та інтенсивну терапію</li>
<li>Медичну евакуацію до країни проживання</li>
<li>Подовження перебування через медичні причини (готель, харчування)</li>
<li>Повторну операцію у разі необхідності</li>
<li>Відповідальність за скасування поїздки через медичні причини</li>
</ol>

<h2>Скільки коштує страхування</h2>
<p>Вартість спеціалізованого полісу для медичного туризму зазвичай складає 3–7% від вартості запланованого лікування. Наприклад, для процедури вартістю €5 000 страховка обійдеться в €150–350. Це розумна інвестиція, враховуючи потенційні витрати на лікування ускладнень без покриття.</p>

<h2>Поради від TEZAURUS-TOUR</h2>
<p>Наша команда завжди допомагає клієнтам обрати оптимальне страхове покриття. Ми рекомендуємо оформлювати поліс не пізніше ніж за 14 днів до поїздки та зберігати всі медичні документи для можливого страхового випадку. Зверніться до нашого менеджера для безкоштовної консультації щодо страхування.</p>`,
      bodyEn: `<h2>Why Insurance Is Essential for Medical Travel</h2>
<p>Insurance for medical tourism is not just a formality but an important tool for protecting your health and finances. Even with the most careful planning, unforeseen situations can arise: post-procedure complications, the need for additional treatment, or delayed return home due to medical reasons.</p>
<p>Standard travel insurance usually does NOT cover elective treatment abroad. Therefore, you need a specialized medical tourism policy or extended coverage from the clinic.</p>

<h2>Types of Insurance Policies</h2>
<p>There are several types of insurance relevant to medical tourists:</p>
<ul>
<li><strong>Travel Insurance</strong> — basic coverage that includes emergency medical care, evacuation, and repatriation. Does not cover elective procedures.</li>
<li><strong>Medical Tourism Insurance</strong> — a specialized product covering complications from elective procedures, additional treatment, and extended stays.</li>
<li><strong>Clinic Guarantee</strong> — many certified clinics offer their own coverage for complications, including free re-treatment.</li>
<li><strong>Comprehensive Package</strong> — combining travel insurance and medical coverage in one policy.</li>
</ul>

<h2>What Your Policy Should Cover</h2>
<p>When choosing insurance, make sure it includes the following items:</p>
<ol>
<li>Complications from the planned procedure (minimum 30 days post-surgery)</li>
<li>Emergency hospitalization and intensive care</li>
<li>Medical evacuation to your country of residence</li>
<li>Extended stay due to medical reasons (hotel, meals)</li>
<li>Repeat surgery if necessary</li>
<li>Trip cancellation liability due to medical reasons</li>
</ol>

<h2>How Much Does Insurance Cost</h2>
<p>The cost of a specialized medical tourism policy is typically 3–7% of the planned treatment cost. For example, for a €5,000 procedure, insurance would cost €150–350. This is a reasonable investment considering the potential cost of treating complications without coverage.</p>

<h2>Tips from TEZAURUS-TOUR</h2>
<p>Our team always helps clients choose optimal insurance coverage. We recommend purchasing a policy no later than 14 days before the trip and keeping all medical documents for potential insurance claims. Contact our manager for a free insurance consultation.</p>`,
      tags: ['insurance', 'guide', 'tips'], status: 'published' as const, publishedAt: new Date('2026-03-01'),
    },
    {
      slug: 'best-countries-dental-tourism',
      coverImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80',
      categoryId: catMap['medical-tourism'],
      titleUa: 'Найкращі країни для стоматологічного туризму у 2026 році',
      titleEn: 'Best Countries for Dental Tourism in 2026',
      excerptUa: 'Детальне порівняння найкращих країн для стоматологічного лікування за кордоном.',
      excerptEn: 'Detailed comparison of the best countries for dental treatment abroad.',
      metaTitleUa: 'Найкращі країни для стоматологічного туризму — TEZAURUS-TOUR',
      metaTitleEn: 'Best Countries for Dental Tourism — TEZAURUS-TOUR',
      metaDescriptionUa: 'Порівняння Туреччини, Угорщини, Польщі та Чехії для стоматологічного туризму. Ціни, якість, логістика.',
      metaDescriptionEn: 'Comparing Turkey, Hungary, Poland, and Czech Republic for dental tourism. Prices, quality, logistics.',
      bodyUa: `<h2>Стоматологічний туризм: як обрати країну</h2>
<p>Вибір країни для стоматологічного лікування залежить від багатьох факторів: типу процедури, бюджету, географічної зручності та особистих вподобань. У цій статті ми детально порівняємо чотири найпопулярніші напрямки стоматологічного туризму, щоб допомогти вам зробити усвідомлений вибір.</p>

<h2>Туреччина — абсолютний лідер</h2>
<p>Туреччина впевнено утримує першість у стоматологічному туризмі завдяки агресивній ціновій політиці та високій якості послуг. Анталія та Стамбул пропонують сотні стоматологічних клінік, спеціально орієнтованих на іноземних пацієнтів.</p>
<p>Середня вартість зубного імпланту в Туреччині — €400–600, що в 4–5 разів дешевше, ніж у Німеччині. При цьому клініки використовують імпланти преміальних марок: Straumann, Nobel Biocare, Osstem. Додаткова перевага — можливість поєднати лікування з відпочинком на Середземному морі.</p>

<h2>Угорщина — європейська якість</h2>
<p>Будапешт заслужено носить титул «стоматологічної столиці Європи». Угорські стоматологи мають репутацію найвищої кваліфікації, а клініки пропонують преміальний рівень сервісу. Ціни на 50–70% нижчі за середньоєвропейські.</p>
<p>Угорщина особливо сильна у складному протезуванні та імплантації. Багато клінік мають власні зуботехнічні лабораторії, що дозволяє виготовити коронки та протези за кілька днів без додаткових візитів.</p>

<h2>Польща — зручність для українців</h2>
<p>Для українських пацієнтів Польща — найзручніший варіант з точки зору логістики. Кілька годин на автобусі або потягу — і ви у сучасній стоматологічній клініці Кракова чи Вроцлава. Мовний бар\'єр мінімальний, а ціни на 40–60% нижчі за західноєвропейські.</p>
<p>Польські клініки активно інвестують у цифрову стоматологію: 3D-сканери, CAD/CAM-системи та навігаційну імплантацію. Це забезпечує високу точність та передбачуваний результат.</p>

<h2>Чехія — поєднання лікування та культури</h2>
<p>Прага приваблює пацієнтів поєднанням якісної стоматології та багатого культурного середовища. Чеські стоматологи відомі своєю педантичністю та увагою до деталей. Країна особливо сильна у протезуванні та естетичній стоматології.</p>

<h2>Порівняльна таблиця цін (€)</h2>
<ul>
<li><strong>Імплант + коронка:</strong> Туреччина 400–800 | Угорщина 700–1200 | Польща 600–1000 | Чехія 700–1100</li>
<li><strong>Вінір:</strong> Туреччина 150–300 | Угорщина 300–500 | Польща 250–450 | Чехія 300–500</li>
<li><strong>All-on-4:</strong> Туреччина 4000–6000 | Угорщина 6000–9000 | Польща 5000–8000 | Чехія 6000–9000</li>
</ul>`,
      bodyEn: `<h2>Dental Tourism: How to Choose a Country</h2>
<p>Choosing a country for dental treatment depends on many factors: procedure type, budget, geographical convenience, and personal preferences. In this article, we compare the four most popular dental tourism destinations in detail to help you make an informed choice.</p>

<h2>Turkey — The Absolute Leader</h2>
<p>Turkey confidently holds the lead in dental tourism thanks to aggressive pricing and high-quality services. Antalya and Istanbul offer hundreds of dental clinics specifically oriented toward international patients.</p>
<p>The average cost of a dental implant in Turkey is €400–600, which is 4–5 times cheaper than in Germany. Clinics use premium implant brands: Straumann, Nobel Biocare, Osstem. An additional advantage is the opportunity to combine treatment with a Mediterranean vacation.</p>

<h2>Hungary — European Quality</h2>
<p>Budapest deservedly holds the title of "dental capital of Europe." Hungarian dentists have a reputation for the highest qualifications, and clinics offer a premium level of service. Prices are 50–70% lower than the European average.</p>
<p>Hungary is particularly strong in complex prosthetics and implantation. Many clinics have their own dental laboratories, allowing crowns and prostheses to be fabricated in a few days without additional visits.</p>

<h2>Poland — Convenience for Ukrainian Patients</h2>
<p>For Ukrainian patients, Poland is the most convenient option from a logistics standpoint. A few hours by bus or train — and you're at a modern dental clinic in Krakow or Wroclaw. The language barrier is minimal, and prices are 40–60% lower than Western European rates.</p>
<p>Polish clinics actively invest in digital dentistry: 3D scanners, CAD/CAM systems, and navigated implantation. This ensures high precision and predictable results.</p>

<h2>Czech Republic — Combining Treatment and Culture</h2>
<p>Prague attracts patients with a combination of quality dentistry and a rich cultural environment. Czech dentists are known for their meticulousness and attention to detail. The country is particularly strong in prosthetics and aesthetic dentistry.</p>

<h2>Price Comparison (€)</h2>
<ul>
<li><strong>Implant + crown:</strong> Turkey 400–800 | Hungary 700–1,200 | Poland 600–1,000 | Czech Republic 700–1,100</li>
<li><strong>Veneer:</strong> Turkey 150–300 | Hungary 300–500 | Poland 250–450 | Czech Republic 300–500</li>
<li><strong>All-on-4:</strong> Turkey 4,000–6,000 | Hungary 6,000–9,000 | Poland 5,000–8,000 | Czech Republic 6,000–9,000</li>
</ul>`,
      tags: ['dental', 'countries', 'comparison'], status: 'published' as const, publishedAt: new Date('2026-03-20'),
    },
    {
      slug: 'recovery-after-surgery-abroad',
      coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
      categoryId: catMap['tips'],
      titleUa: 'Відновлення після операції за кордоном: що потрібно знати',
      titleEn: 'Recovery After Surgery Abroad: What You Need to Know',
      excerptUa: 'Практичний гід з відновлення після хірургічного втручання за кордоном: етапи, поради та чого уникати.',
      excerptEn: 'A practical guide to recovery after surgical intervention abroad: stages, tips, and what to avoid.',
      metaTitleUa: 'Відновлення після операції за кордоном — TEZAURUS-TOUR',
      metaTitleEn: 'Recovery After Surgery Abroad — TEZAURUS-TOUR',
      metaDescriptionUa: 'Як правильно відновлюватися після операції за кордоном. Поради лікарів, етапи реабілітації, повернення додому.',
      metaDescriptionEn: 'How to properly recover after surgery abroad. Doctor advice, rehabilitation stages, returning home.',
      bodyUa: `<h2>Перші дні після операції</h2>
<p>Перші 48–72 години після хірургічного втручання — найважливіший період відновлення. У цей час ви, як правило, знаходитесь у клініці під наглядом медичного персоналу. Лікарі контролюють ваш стан, проводять необхідні перев\'язки та коригують знеболювальну терапію.</p>
<p>Важливо дотримуватися всіх рекомендацій медичного персоналу: режим харчування, обмеження рухливості, прийом медикаментів. Не соромтеся задавати питання — ваш лікар має пояснити кожен аспект процесу відновлення.</p>

<h2>Перебування в готелі після виписки</h2>
<p>Після виписки з клініки більшість пацієнтів проводять ще кілька днів у готелі поблизу лікарні. Це необхідно для контрольних оглядів та оперативного реагування у разі будь-яких ускладнень. Рекомендуємо обирати готель у пішій доступності від клініки або з організованим трансфером.</p>
<p>У цей період важливо мати супроводжуючу особу — родича або друга, який зможе допомогти з побутовими питаннями та підтримати морально. Багато клінік пропонують послуги медичного координатора, який залишається на зв\'язку 24/7.</p>

<h2>Загальні рекомендації щодо відновлення</h2>
<p>Незалежно від типу операції, є універсальні правила відновлення:</p>
<ul>
<li>Дотримуйтеся призначеного лікарем режиму прийому медикаментів — не пропускайте дози та не змінюйте препарати самостійно</li>
<li>Пийте достатньо рідини — мінімум 2 літри води на день для швидшого відновлення</li>
<li>Обмежте фізичне навантаження відповідно до рекомендацій хірурга</li>
<li>Носіть компресійну білизну, якщо це рекомендовано (особливо після естетичних операцій)</li>
<li>Уникайте прямого сонячного випромінювання на ділянку операції</li>
<li>Не вживайте алкоголь та не паліть мінімум 2–4 тижні після операції</li>
</ul>

<h2>Переліт додому: коли безпечно летіти</h2>
<p>Один з найважливіших питань — коли можна безпечно летіти додому після операції. Термін залежить від типу втручання. Після стоматологічних процедур можна летіти через 24–48 годин. Після естетичної хірургії — через 5–7 днів. Після складних операцій — не раніше ніж через 10–14 днів.</p>
<p>Перед перельотом обов\'язково отримайте дозвіл лікаря та довідку про стан здоров\'я (fit-to-fly certificate). Під час перельоту використовуйте компресійні панчохи для профілактики тромбозу, пийте багато води та уникайте алкоголю.</p>

<h2>Продовження лікування вдома</h2>
<p>Після повернення додому важливо продовжити лікування під наглядом місцевого лікаря. Попросіть у закордонній клініці повну медичну виписку англійською мовою з описом проведеної операції, призначених медикаментів та рекомендацій щодо подальшого спостереження. Більшість клінік-партнерів TEZAURUS-TOUR пропонують безкоштовні онлайн-консультації протягом 3–6 місяців після операції.</p>`,
      bodyEn: `<h2>The First Days After Surgery</h2>
<p>The first 48–72 hours after a surgical intervention are the most important recovery period. During this time, you will typically remain at the clinic under the supervision of medical staff. Doctors monitor your condition, perform necessary dressing changes, and adjust pain management therapy.</p>
<p>It's important to follow all medical staff recommendations: dietary regimen, mobility restrictions, medication intake. Don't hesitate to ask questions — your doctor should explain every aspect of the recovery process.</p>

<h2>Hotel Stay After Discharge</h2>
<p>After discharge from the clinic, most patients spend a few more days at a hotel near the hospital. This is necessary for follow-up examinations and prompt response in case of any complications. We recommend choosing a hotel within walking distance of the clinic or with organized transfers.</p>
<p>During this period, it's important to have a companion — a relative or friend who can help with daily tasks and provide moral support. Many clinics offer medical coordinator services available 24/7.</p>

<h2>General Recovery Recommendations</h2>
<p>Regardless of the surgery type, there are universal recovery rules:</p>
<ul>
<li>Follow the doctor-prescribed medication regimen — don't skip doses or change medications on your own</li>
<li>Drink enough fluids — at least 2 liters of water daily for faster recovery</li>
<li>Limit physical activity according to the surgeon's recommendations</li>
<li>Wear compression garments if recommended (especially after aesthetic surgery)</li>
<li>Avoid direct sunlight on the surgical area</li>
<li>Avoid alcohol and smoking for at least 2–4 weeks after surgery</li>
</ul>

<h2>Flying Home: When It's Safe to Fly</h2>
<p>One of the most important questions is when it's safe to fly home after surgery. The timing depends on the type of intervention. After dental procedures, you can fly within 24–48 hours. After aesthetic surgery — in 5–7 days. After complex operations — no earlier than 10–14 days.</p>
<p>Before flying, be sure to obtain your doctor's permission and a fit-to-fly certificate. During the flight, use compression stockings to prevent thrombosis, drink plenty of water, and avoid alcohol.</p>

<h2>Continuing Treatment at Home</h2>
<p>After returning home, it's important to continue treatment under the supervision of a local doctor. Ask the foreign clinic for a complete medical discharge summary in English describing the surgery performed, prescribed medications, and recommendations for further follow-up. Most TEZAURUS-TOUR partner clinics offer free online consultations for 3–6 months after surgery.</p>`,
      tags: ['recovery', 'surgery', 'tips'], status: 'published' as const, publishedAt: new Date('2026-04-05'),
    },
    {
      slug: 'how-to-choose-the-right-clinic',
      coverImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80',
      categoryId: catMap['medical-tourism'],
      titleUa: 'Як обрати правильну клініку для лікування за кордоном',
      titleEn: 'How to Choose the Right Clinic for Treatment Abroad',
      excerptUa: 'Покроковий гід з вибору закордонної клініки: акредитації, відгуки, ціни та на що звертати увагу.',
      excerptEn: 'Step-by-step guide to choosing a foreign clinic: accreditations, reviews, prices, and what to look for.',
      metaTitleUa: 'Як обрати клініку за кордоном — TEZAURUS-TOUR',
      metaTitleEn: 'How to Choose a Clinic Abroad — TEZAURUS-TOUR',
      metaDescriptionUa: 'Детальний гід з вибору клініки для лікування за кордоном. Акредитації, критерії якості, поради від експертів.',
      metaDescriptionEn: 'Detailed guide to choosing a clinic for treatment abroad. Accreditations, quality criteria, expert advice.',
      bodyUa: `<h2>Крок 1: Визначте свої потреби</h2>
<p>Перш ніж починати пошук клініки, чітко сформулюйте свої потреби. Визначте тип процедури, бажану країну, бюджет та часові рамки. Це допоможе звузити коло пошуку та зосередитися на найбільш релевантних варіантах.</p>
<p>Проконсультуйтеся зі своїм лікарем удома, щоб отримати професійну оцінку вашого стану та рекомендації щодо типу лікування. Це також дозволить вам краще розуміти, які питання задавати закордонним спеціалістам.</p>

<h2>Крок 2: Перевірте акредитації та сертифікати</h2>
<p>Міжнародні акредитації — головний індикатор якості та безпеки клініки. Зверніть увагу на наступні сертифікати:</p>
<ul>
<li><strong>JCI (Joint Commission International)</strong> — найпрестижніша міжнародна акредитація, яка підтверджує відповідність клініки найвищим стандартам безпеки та якості</li>
<li><strong>ISO 9001</strong> — сертифікат системи управління якістю</li>
<li><strong>TEMOS</strong> — спеціалізована сертифікація для клінік, що приймають міжнародних пацієнтів</li>
<li><strong>Національні акредитації</strong> — відповідність стандартам охорони здоров\'я країни розташування</li>
</ul>
<p>Наявність акредитації JCI автоматично означає, що клініка дотримується протоколів інфекційного контролю, безпеки пацієнтів та управління ліками міжнародного рівня.</p>

<h2>Крок 3: Вивчіть досвід лікарів</h2>
<p>Кваліфікація та досвід конкретного лікаря, який буде виконувати процедуру, не менш важливі, ніж репутація клініки. Зверніть увагу на освіту лікаря, кількість виконаних аналогічних процедур, членство у міжнародних медичних асоціаціях та наукові публікації.</p>
<p>Не соромтеся запитувати CV лікаря та статистику успішності операцій. Серйозна клініка завжди готова надати цю інформацію. Також корисно дізнатися, чи проходив лікар стажування або навчання за кордоном.</p>

<h2>Крок 4: Аналізуйте відгуки пацієнтів</h2>
<p>Відгуки реальних пацієнтів — безцінне джерело інформації. Шукайте відгуки на незалежних платформах, а не лише на сайті клініки. Зверніть увагу на детальні відгуки, що описують весь процес — від першого контакту до результату лікування.</p>
<p>Будьте обережні з надто ідеальними відгуками — вони можуть бути замовними. Натомість цінуйте збалансовані відгуки, де пацієнт описує як позитивні, так і негативні моменти.</p>

<h2>Крок 5: Порівняйте пакетні пропозиції</h2>
<p>Сучасні клініки для медичних туристів пропонують комплексні пакети, що включають:</p>
<ol>
<li>Власне медичну процедуру з усіма необхідними матеріалами</li>
<li>Перебування в клініці (палата, харчування, медичний догляд)</li>
<li>Трансфери аеропорт–готель–клініка</li>
<li>Проживання в партнерському готелі</li>
<li>Послуги перекладача та медичного координатора</li>
<li>Контрольні огляди та консультації після процедури</li>
</ol>
<p>Порівнюйте саме повну вартість пакету, а не лише ціну процедури. Іноді клініка з вищою ціною за операцію пропонує більш вигідний загальний пакет.</p>

<h2>Довіртеся професіоналам</h2>
<p>Вибір клініки за кордоном — відповідальне рішення, яке впливає на ваше здоров\'я. TEZAURUS-TOUR вже понад 10 років допомагає пацієнтам обирати найкращі клініки з перевіреною репутацією. Ми особисто відвідуємо кожну клініку-партнера та контролюємо якість на всіх етапах.</p>`,
      bodyEn: `<h2>Step 1: Define Your Needs</h2>
<p>Before starting your clinic search, clearly define your needs. Determine the procedure type, preferred country, budget, and timeframe. This will help narrow your search and focus on the most relevant options.</p>
<p>Consult with your doctor at home to get a professional assessment of your condition and treatment recommendations. This will also help you better understand what questions to ask foreign specialists.</p>

<h2>Step 2: Check Accreditations and Certificates</h2>
<p>International accreditations are the primary indicator of clinic quality and safety. Pay attention to the following certifications:</p>
<ul>
<li><strong>JCI (Joint Commission International)</strong> — the most prestigious international accreditation confirming the clinic meets the highest safety and quality standards</li>
<li><strong>ISO 9001</strong> — quality management system certificate</li>
<li><strong>TEMOS</strong> — specialized certification for clinics serving international patients</li>
<li><strong>National accreditations</strong> — compliance with healthcare standards of the host country</li>
</ul>
<p>JCI accreditation automatically means the clinic follows international-level protocols for infection control, patient safety, and medication management.</p>

<h2>Step 3: Research Doctor Experience</h2>
<p>The qualifications and experience of the specific doctor who will perform your procedure are no less important than the clinic's reputation. Pay attention to the doctor's education, number of similar procedures performed, membership in international medical associations, and scientific publications.</p>
<p>Don't hesitate to ask for the doctor's CV and surgery success statistics. A reputable clinic is always ready to provide this information. It's also useful to find out whether the doctor has trained or studied abroad.</p>

<h2>Step 4: Analyze Patient Reviews</h2>
<p>Real patient reviews are an invaluable source of information. Look for reviews on independent platforms, not just the clinic's website. Pay attention to detailed reviews that describe the entire process — from first contact to treatment results.</p>
<p>Be cautious with overly perfect reviews — they may be commissioned. Instead, value balanced reviews where patients describe both positive and negative aspects.</p>

<h2>Step 5: Compare Package Offers</h2>
<p>Modern clinics for medical tourists offer comprehensive packages that include:</p>
<ol>
<li>The medical procedure itself with all necessary materials</li>
<li>Clinic stay (room, meals, medical care)</li>
<li>Airport–hotel–clinic transfers</li>
<li>Accommodation at a partner hotel</li>
<li>Translator and medical coordinator services</li>
<li>Follow-up examinations and post-procedure consultations</li>
</ol>
<p>Compare the full package cost, not just the procedure price. Sometimes a clinic with a higher surgery price offers a more advantageous overall package.</p>

<h2>Trust the Professionals</h2>
<p>Choosing a clinic abroad is a responsible decision that affects your health. TEZAURUS-TOUR has been helping patients choose the best clinics with proven reputations for over 10 years. We personally visit each partner clinic and monitor quality at every stage.</p>`,
      tags: ['clinic', 'guide', 'medical-tourism'], status: 'published' as const, publishedAt: new Date('2026-04-10'),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({ where: { slug: post.slug }, update: { coverImage: post.coverImage }, create: post });
  }

  // ── PAGES ──
  const pages = [
    {
      slug: 'home',
      titleUa: 'Головна', titleEn: 'Home',
      contentUa: `<h2>Преміальний медичний туризм і wellness-подорожі</h2>
<p>TEZAURUS-TOUR — це українське агентство медичного туризму, яке супроводжує пацієнтів на шляху від першої консультації до повного відновлення. Ми працюємо з провідними клініками Німеччини, Швейцарії, Ізраїлю, Туреччини, Чехії, Італії, Південної Кореї та Австрії, ретельно відбираючи заклади з міжнародною акредитацією JCI та підтвердженою репутацією у складних випадках.</p>
<p>Наша команда супроводжує клієнта персонально: лікарі-кординатори відкривають медичну справу, перекладачі готують документацію двома мовами, менеджери бронюють переліт, трансфери та проживання поруч із клінікою. Ми пояснюємо структуру кошторису без прихованих платежів та фіксуємо гарантії у прозорому договорі.</p>
<p>Обирайте з понад 12 медичних пакетів: діагностика серця, онкологічний скринінг, естетична і реконструктивна хірургія, IVF, стоматологічна імплантація, ортопедія, реабілітація та програми довголіття. Після процедур — відновлення у санаторіях Європи з індивідуально складеною wellness-програмою.</p>`,
      contentEn: `<h2>Premium medical tourism and wellness journeys</h2>
<p>TEZAURUS-TOUR is a Ukrainian medical tourism agency that accompanies patients from the initial consultation all the way through complete recovery. We work with leading clinics in Germany, Switzerland, Israel, Turkey, the Czech Republic, Italy, South Korea and Austria — carefully selecting facilities with JCI accreditation and a proven track record in complex cases.</p>
<p>Our team provides personal guidance: medical coordinators open the case, translators prepare the documentation in both languages, and managers book flights, transfers and accommodation next to the clinic. We explain the cost breakdown with no hidden fees and document all guarantees in a transparent contract.</p>
<p>Choose from more than 12 medical packages: cardiac diagnostics, oncology screening, aesthetic and reconstructive surgery, IVF, dental implants, orthopedics, rehabilitation and longevity programs. After treatment — recovery at European spa resorts with a tailored wellness itinerary.</p>`,
      metaTitleUa: 'TEZAURUS-TOUR — Преміальний медичний туризм', metaTitleEn: 'TEZAURUS-TOUR — Premium Medical Tourism',
      metaDescriptionUa: 'Медичний туризм світового рівня. Клініки, лікування та оздоровчі програми від TEZAURUS-TOUR.', metaDescriptionEn: 'World-class medical tourism. Clinics, treatments and wellness programs by TEZAURUS-TOUR.',
      published: true,
    },
    {
      slug: 'services',
      titleUa: 'Курортні Wellness-Подорожі', titleEn: 'Curated Wellness Journeys',
      contentUa: `<h2>Медичні пакети та оздоровчі подорожі TEZAURUS-TOUR</h2>
<p>У нашому каталозі — перевірені медичні послуги з фіксованим кошторисом: від повного кардіологічного чекапу в Мюнхені до стоматологічної імплантації в Анталії та IVF-програм у Празі. Кожен пакет включає консультацію профільного лікаря, необхідну діагностику, саму процедуру, базове відновлення та переклад медичних документів українською або англійською мовою.</p>
<p>Ми комплектуємо подорож під ваш розклад: якщо важливо повернутися додому за тиждень — добираємо клініки з короткими протоколами; якщо потрібне довге відновлення — бронюємо санаторій або курорт поруч із містом клініки. Для сімейних поїздок окремо продумуємо дозвілля для супроводу.</p>
<p>Категорії у каталозі: діагностика, лікування, естетична хірургія, реабілітація, стоматологія, офтальмологія, репродуктивна медицина, баріатрія, пересадка волосся та довголіття. Усі ціни — у валюті країни клініки; курсова різниця фіксується на момент підписання договору.</p>`,
      contentEn: `<h2>Medical packages and curated wellness journeys</h2>
<p>Our catalogue lists medical services with a fixed, up-front price — from a full cardiology check-up in Munich to dental implant placement in Antalya and IVF programs in Prague. Every package includes a specialist consultation, the required diagnostics, the procedure itself, basic recovery and a translation of the medical documents into Ukrainian or English.</p>
<p>We build the trip around your schedule: if you need to be home within a week we select clinics with short protocols; if a longer recovery is required we book a sanatorium or resort near the clinic city. For family trips we plan separate activities for accompanying relatives.</p>
<p>Catalogue categories: diagnostics, treatment, aesthetic surgery, rehabilitation, dentistry, ophthalmology, reproductive medicine, bariatric surgery, hair transplant and longevity. Prices are quoted in the clinic country's currency; the exchange rate is fixed on the date the contract is signed.</p>`,
      metaTitleUa: 'Медичні пакети та послуги — TEZAURUS-TOUR', metaTitleEn: 'Medical Packages & Services — TEZAURUS-TOUR',
      metaDescriptionUa: 'Курортні wellness-програми та медичні пакети від TEZAURUS-TOUR: діагностика, лікування, реабілітація.', metaDescriptionEn: 'Curated wellness journeys and medical packages by TEZAURUS-TOUR: diagnostics, treatment, rehabilitation.',
      published: true,
    },
    {
      slug: 'about',
      titleUa: 'Про нас', titleEn: 'About Us',
      contentUa: `<h2>Про TEZAURUS-TOUR</h2>
<p>TEZAURUS-TOUR — це команда професіоналів медичного туризму з понад 10-річним досвідом організації лікування за кордоном. Ми працюємо з українськими пацієнтами та їхніми родинами, щоби забезпечити повний цикл супроводу: від попередньої онлайн-консультації до повернення додому та пост-операційного контролю.</p>
<p>Наш підхід побудований на чотирьох принципах: ретельний відбір клінік-партнерів з акредитацією JCI та іншими міжнародними стандартами; особистий куратор для кожного пацієнта; прозорий кошторис без прихованих платежів; та повноцінна логістика — переліт, трансфер, проживання, переклад медичної документації.</p>
<p>За роки роботи ми допомогли тисячам пацієнтів знайти найкраще лікування: онкологічне, кардіологічне, ортопедичне, репродуктивне, естетичне та стоматологічне. Більшість пацієнтів повертаються до нас повторно або рекомендують знайомим — і це найкращий показник якості нашого сервісу.</p>`,
      contentEn: `<h2>About TEZAURUS-TOUR</h2>
<p>TEZAURUS-TOUR is a team of medical tourism professionals with more than 10 years of experience arranging treatment abroad. We work with Ukrainian patients and their families to provide a full-cycle service: from an initial online consultation to returning home and post-operative follow-up.</p>
<p>Our approach rests on four principles: careful selection of partner clinics with JCI accreditation and other international standards; a personal case manager for every patient; a transparent cost estimate with no hidden fees; and full-scale logistics — flights, transfers, accommodation and medical document translation.</p>
<p>Over the years we have helped thousands of patients find the best treatment — oncological, cardiological, orthopedic, reproductive, aesthetic and dental. Most of our patients return for additional care or refer friends and family, which is the clearest measure of our service quality.</p>`,
      metaTitleUa: 'Про нас — TEZAURUS-TOUR', metaTitleEn: 'About Us — TEZAURUS-TOUR',
      metaDescriptionUa: 'TEZAURUS-TOUR — команда з 10+ років досвіду в медичному туризмі, що організовує лікування в провідних клініках світу.',
      metaDescriptionEn: 'TEZAURUS-TOUR — a team with over 10 years of experience in medical tourism, arranging treatment at leading clinics worldwide.',
      published: true,
    },
    {
      slug: 'contacts',
      titleUa: 'Контакти', titleEn: 'Contacts',
      contentUa: `<h2>Зв\'яжіться з нами</h2>
<p>Наша команда готова проконсультувати вас українською, англійською, німецькою або турецькою мовами. Залиште заявку на сайті — лікар-координатор зателефонує протягом робочого дня та допоможе скласти попередній план лікування без зобовʼязань.</p>
<p>Офіс TEZAURUS-TOUR розташований у Києві; додаткові координатори працюють у Стамбулі, Мюнхені та Тель-Авіві, щоби супроводжувати пацієнтів безпосередньо у країні лікування. Для оформлення термінових випадків у нас передбачена цілодобова гаряча лінія.</p>
<p>Усі консультації — безкоштовні та конфіденційні. Ми підписуємо угоду про нерозголошення та гарантуємо безпеку ваших медичних документів. Якщо вам зручніше спілкуватися через месенджер — напишіть у Telegram, WhatsApp або Instagram, посилання внизу сторінки.</p>`,
      contentEn: `<h2>Get in touch</h2>
<p>Our team is ready to consult you in Ukrainian, English, German or Turkish. Submit a request through the website — a medical coordinator will call you during business hours and help outline a preliminary treatment plan with no commitment.</p>
<p>The TEZAURUS-TOUR head office is located in Kyiv; additional coordinators work in Istanbul, Munich and Tel Aviv to accompany patients directly in the country of treatment. A 24/7 hotline is available for urgent cases.</p>
<p>All consultations are free and confidential. We sign a non-disclosure agreement and guarantee the security of your medical documents. If you prefer a messenger — write to us on Telegram, WhatsApp or Instagram; links are in the footer.</p>`,
      metaTitleUa: 'Контакти — TEZAURUS-TOUR', metaTitleEn: 'Contacts — TEZAURUS-TOUR',
      metaDescriptionUa: 'Звʼяжіться з TEZAURUS-TOUR для безкоштовної консультації щодо медичного туризму та курортних програм.',
      metaDescriptionEn: 'Contact TEZAURUS-TOUR for a free medical tourism and wellness consultation.',
      published: true,
    },
    {
      slug: 'blog',
      titleUa: 'Блог', titleEn: 'Blog',
      contentUa: `<h2>Блог TEZAURUS-TOUR</h2>
<p>У нашому блозі ми збираємо все корисне для пацієнтів, які планують лікування за кордоном: покрокові гіди з підготовки, огляди топових клінік Туреччини, Німеччини та Ізраїлю, розбір страхових продуктів для медичних подорожей, а також тренди 2026 року у wellness та відновлювальній медицині.</p>
<p>Ми пишемо статті разом з лікарями та практиками з медичного туризму, тож кожен матеріал проходить фактчекінг і містить посилання на джерела. Ви знайдете тут поради щодо вибору клініки, організації поїздки, підготовки документів та періоду відновлення.</p>
<p>Підпишіться на розсилку, щоби отримувати нові матеріали першими, і не забудьте поділитися корисною статтею з близькими, які також планують лікування або оздоровчу подорож.</p>`,
      contentEn: `<h2>TEZAURUS-TOUR Blog</h2>
<p>Our blog gathers everything useful for patients planning treatment abroad: step-by-step preparation guides, reviews of the top clinics in Turkey, Germany and Israel, overviews of travel medical insurance, and 2026 trends in wellness and rehabilitation medicine.</p>
<p>We write articles together with doctors and medical tourism practitioners, so every piece is fact-checked and references its sources. You will find advice on choosing a clinic, organising the trip, preparing documents and the recovery period.</p>
<p>Subscribe to the newsletter to be the first to read new materials, and do not forget to share a useful article with friends or family who are also planning treatment or a wellness journey.</p>`,
      metaTitleUa: 'Блог — TEZAURUS-TOUR', metaTitleEn: 'Blog — TEZAURUS-TOUR',
      metaDescriptionUa: 'Блог TEZAURUS-TOUR: поради, тренди та гіди з медичного туризму.',
      metaDescriptionEn: 'TEZAURUS-TOUR blog: tips, trends, and medical tourism guides.',
      published: true,
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {
        titleUa: p.titleUa, titleEn: p.titleEn,
        contentUa: p.contentUa, contentEn: p.contentEn,
        metaTitleUa: p.metaTitleUa, metaTitleEn: p.metaTitleEn,
        metaDescriptionUa: p.metaDescriptionUa, metaDescriptionEn: p.metaDescriptionEn,
        published: p.published,
      },
      create: p,
    });
  }

  // ── CLINIC IMAGES (галерея: 3-5 фото на клініку) ──
  const galleryPool = [
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80',
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&q=80',
    'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=1200&q=80',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=80',
    'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80',
    'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&q=80',
  ];

  const seededClinics = await prisma.clinic.findMany({ select: { id: true, slug: true, imageUrl: true } });
  for (const clinic of seededClinics) {
    // Ідемпотентно: спочатку чистимо звʼязки, потім створюємо знову.
    await prisma.clinicImage.deleteMany({ where: { clinicId: clinic.id } });

    const urls = [clinic.imageUrl, ...galleryPool]
      .filter((u): u is string => !!u)
      .filter((u, idx, arr) => arr.indexOf(u) === idx)
      .slice(0, 4);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const asset = await prisma.mediaAsset.upsert({
        where: { key: url },
        update: {},
        create: {
          key: url,
          mimeType: 'image/jpeg',
          size: 0,
          altUa: `Фото клініки ${clinic.slug}`,
          altEn: `Photo of clinic ${clinic.slug}`,
        },
      });
      await prisma.clinicImage.create({
        data: { clinicId: clinic.id, mediaId: asset.id, sortOrder: i },
      });
    }
  }

  console.log('Seed done');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
