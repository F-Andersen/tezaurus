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
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6f?w=800&q=80',
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
      published: true,
    },
  ];

  for (const c of clinics) {
    await prisma.clinic.upsert({ where: { slug: c.slug }, update: {}, create: c });
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
      categoryId: catMap['medical-tourism'],
      titleUa: 'Топ-5 клінік Туреччини у 2026 році',
      titleEn: 'Top 5 Clinics in Turkey in 2026',
      excerptUa: 'Огляд найкращих турецьких клінік для медичного туризму: від естетичної хірургії до онкології.',
      excerptEn: 'A review of the best Turkish clinics for medical tourism: from aesthetic surgery to oncology.',
      bodyUa: '<p>Туреччина залишається одним з найпопулярніших напрямків медичного туризму...</p>',
      bodyEn: '<p>Turkey remains one of the most popular medical tourism destinations...</p>',
      tags: ['turkey', 'clinics', 'review'], status: 'published' as const, publishedAt: new Date('2026-03-15'),
    },
    {
      slug: 'how-to-prepare-for-medical-trip',
      categoryId: catMap['tips'],
      titleUa: 'Як підготуватися до медичної подорожі: повний гід',
      titleEn: 'How to Prepare for a Medical Trip: Complete Guide',
      excerptUa: 'Детальний покроковий гід з підготовки до лікування за кордоном.',
      excerptEn: 'A detailed step-by-step guide to preparing for treatment abroad.',
      bodyUa: '<p>Підготовка до медичної подорожі — важливий етап...</p>',
      bodyEn: '<p>Preparing for a medical trip is an important step...</p>',
      tags: ['guide', 'preparation', 'tips'], status: 'published' as const, publishedAt: new Date('2026-02-20'),
    },
    {
      slug: 'wellness-trends-2026',
      categoryId: catMap['wellness'],
      titleUa: 'Тренди велнес-туризму у 2026 році',
      titleEn: 'Wellness Tourism Trends in 2026',
      excerptUa: 'Які оздоровчі програми та напрямки стануть найпопулярнішими цього року.',
      excerptEn: 'Which wellness programs and destinations will be most popular this year.',
      bodyUa: '<p>Велнес-туризм продовжує зростати...</p>',
      bodyEn: '<p>Wellness tourism continues to grow...</p>',
      tags: ['wellness', 'trends', '2026'], status: 'published' as const, publishedAt: new Date('2026-01-10'),
    },
    {
      slug: 'dental-tourism-guide',
      categoryId: catMap['medical-tourism'],
      titleUa: 'Стоматологічний туризм: все, що потрібно знати',
      titleEn: 'Dental Tourism: Everything You Need to Know',
      excerptUa: 'Повний гід зі стоматологічного туризму: кращі країни, ціни та очікування.',
      excerptEn: 'Complete dental tourism guide: best countries, prices, and expectations.',
      bodyUa: '<p>Стоматологічний туризм набирає обертів...</p>',
      bodyEn: '<p>Dental tourism is gaining momentum...</p>',
      tags: ['dental', 'guide', 'tourism'], status: 'published' as const, publishedAt: new Date('2026-04-01'),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({ where: { slug: post.slug }, update: {}, create: post });
  }

  // ── PAGES ──
  const pages = [
    {
      slug: 'home',
      titleUa: 'Головна', titleEn: 'Home',
      metaTitleUa: 'TEZAURUS-TOUR — Преміальний медичний туризм', metaTitleEn: 'TEZAURUS-TOUR — Premium Medical Tourism',
      metaDescriptionUa: 'Медичний туризм світового рівня. Клініки, лікування та оздоровчі програми.', metaDescriptionEn: 'World-class medical tourism. Clinics, treatment, and wellness programs.',
      published: true,
    },
    {
      slug: 'services',
      titleUa: 'Курортні Wellness-Подорожі', titleEn: 'Curated Wellness Journeys',
      metaTitleUa: 'Медичні пакети та послуги — TEZAURUS-TOUR', metaTitleEn: 'Medical Packages & Services — TEZAURUS-TOUR',
      metaDescriptionUa: 'Курортні wellness-програми та медичні пакети від TEZAURUS-TOUR.', metaDescriptionEn: 'Curated wellness journeys and medical packages by TEZAURUS-TOUR.',
      published: true,
    },
    {
      slug: 'about',
      titleUa: 'Про нас', titleEn: 'About Us',
      contentUa: 'TEZAURUS-TOUR — це команда професіоналів медичного туризму з більш ніж 10-річним досвідом.',
      contentEn: 'TEZAURUS-TOUR is a team of medical tourism professionals with over 10 years of experience.',
      metaTitleUa: 'Про нас — TEZAURUS-TOUR', metaTitleEn: 'About Us — TEZAURUS-TOUR',
      published: true,
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({ where: { slug: p.slug }, update: {}, create: p });
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
