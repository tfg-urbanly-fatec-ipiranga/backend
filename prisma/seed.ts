import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Users ---
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@urbanly.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "Urbanly",
      username: "admin",
      email: "admin@urbanly.com",
      password: adminPassword,
      role: Role.ADMIN,
      birthDate: new Date("1990-01-01"),
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "joao@email.com" },
    update: {},
    create: {
      firstName: "João",
      lastName: "Silva",
      username: "joaosilva",
      email: "joao@email.com",
      password: userPassword,
      role: Role.USER,
      birthDate: new Date("1995-06-15"),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "maria@email.com" },
    update: {},
    create: {
      firstName: "Maria",
      lastName: "Santos",
      username: "mariasantos",
      email: "maria@email.com",
      password: userPassword,
      role: Role.USER,
      birthDate: new Date("1998-03-22"),
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "pedro@email.com" },
    update: {},
    create: {
      firstName: "Pedro",
      lastName: "Oliveira",
      username: "pedrooliveira",
      email: "pedro@email.com",
      password: userPassword,
      role: Role.USER,
      birthDate: new Date("2000-11-08"),
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: "evilly@admin.com" },
    update: {},
    create: {
      firstName: "Evilly",
      lastName: "Costa",
      username: "evicosta",
      email: "evilly@admin.com",
      password: userPassword,
      role: Role.ADMIN,
      birthDate: new Date("2000-11-08"),
    },
  });

  console.log("✅ Users created");

  // --- Categories ---
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Cafeteria" },
      update: {},
      create: { name: "Cafeteria", iconColor: "#6F4E37", description: "Cafés e casas de chá" },
    }),
    prisma.category.upsert({
      where: { name: "Restaurante" },
      update: {},
      create: { name: "Restaurante", iconColor: "#E74C3C", description: "Restaurantes e lanchonetes" },
    }),
    prisma.category.upsert({
      where: { name: "Bar" },
      update: {},
      create: { name: "Bar", iconColor: "#F39C12", description: "Bares e pubs" },
    }),
    prisma.category.upsert({
      where: { name: "Padaria" },
      update: {},
      create: { name: "Padaria", iconColor: "#E67E22", description: "Padarias e confeitarias" },
    }),
    prisma.category.upsert({
      where: { name: "Parque" },
      update: {},
      create: { name: "Parque", iconColor: "#27AE60", description: "Parques e áreas verdes" },
    }),
  ]);

  const [cafeteria, restaurante, bar, padaria, parque] = categories;
  console.log("✅ Categories created");

  // --- Tags ---
  const tagNames = [
    "vegano", "pet-friendly", "wifi", "aconchegante", "rooftop",
    "música ao vivo", "saudável", "artesanal", "brunch", "delivery",
    "estacionamento", "acessível", "ao ar livre", "romântico", "família",
  ];

  const tags: Record<string, { id: string }> = {};
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags[name] = tag;
  }
  console.log("✅ Tags created");

  // --- Places ---
  const places = await Promise.all([
    prisma.place.create({
      data: {
        name: "Café Floresta",
        description: "Cafeteria aconchegante com grãos especiais torrados na hora. Ambiente perfeito para trabalhar ou relaxar.",
        address: "Rua Augusta, 1200",
        city: "São Paulo",
        openingTime: "07:00",
        closingTime: "20:00",
        workingDays: "Seg - Sex",
        latitude: -23.5535,
        longitude: -46.6544,
        categoryId: cafeteria.id,
      },
    }),
    prisma.place.create({
      data: {
        name: "Boteco do Zé",
        description: "Bar tradicional com petiscos caseiros e chopp gelado. Música ao vivo aos fins de semana.",
        address: "Rua da Consolação, 800",
        city: "São Paulo",
        openingTime: "17:00",
        closingTime: "02:00",
        workingDays: "Seg - Sex",
        latitude: -23.5489,
        longitude: -46.6528,
        categoryId: bar.id,
      },
    }),
    prisma.place.create({
      data: {
        name: "Restaurante Sabor Natural",
        description: "Comida saudável e orgânica com opções veganas e vegetarianas. Buffet por quilo no almoço.",
        address: "Av. Paulista, 1578",
        city: "São Paulo",
        openingTime: "11:00",
        closingTime: "15:00",
        workingDays: "Seg - Sex",
        latitude: -23.5613,
        longitude: -46.6558,
        categoryId: restaurante.id,
      },
    }),
    prisma.place.create({
      data: {
        name: "Padaria Pão Quente",
        description: "Padaria artesanal com pães frescos todos os dias. Café da manhã completo e bolos caseiros.",
        address: "Rua Oscar Freire, 450",
        city: "São Paulo",
        openingTime: "06:00",
        closingTime: "21:00",
        workingDays: "Seg - Sex",
        latitude: -23.5622,
        longitude: -46.6720,
        categoryId: padaria.id,
      },
    }),
    prisma.place.create({
      data: {
        name: "Parque Ibirapuera",
        description: "Principal parque urbano de São Paulo com trilhas, museus e áreas para piquenique.",
        address: "Av. Pedro Álvares Cabral",
        city: "São Paulo",
        openingTime: "05:00",
        closingTime: "00:00",
        workingDays: "Seg - Sex",
        latitude: -23.5874,
        longitude: -46.6576,
        categoryId: parque.id,
      },
    }),
    prisma.place.create({
      data: {
        name: "Rooftop Sky Lounge",
        description: "Bar no terraço com vista panorâmica da cidade. Drinks autorais e petiscos sofisticados.",
        address: "Rua Haddock Lobo, 1626",
        city: "São Paulo",
        openingTime: "18:00",
        closingTime: "01:00",
        workingDays: "Seg - Sex",
        latitude: -23.5567,
        longitude: -46.6690,
        categoryId: bar.id,
      },
    }),
    prisma.place.create({
      data: {
        name: "Empório Café & Brunch",
        description: "Brunch completo com opções doces e salgadas. Ambiente instagramável e pet-friendly.",
        address: "Rua dos Pinheiros, 320",
        city: "São Paulo",
        openingTime: "08:00",
        closingTime: "17:00",
        workingDays: "Seg - Sex",
        latitude: -23.5670,
        longitude: -46.6910,
        categoryId: cafeteria.id,
      },
    }),
    prisma.place.create({
      data: {
        name: "Trattoria Bella Napoli",
        description: "Restaurante italiano com massas artesanais e pizzas no forno a lenha.",
        address: "Rua Bela Cintra, 1551",
        city: "São Paulo",
        openingTime: "12:00",
        closingTime: "23:00",
        workingDays: "Seg - Sex",
        latitude: -23.5560,
        longitude: -46.6630,
        categoryId: restaurante.id,
      },
    }),
  ]);

  console.log("✅ Places created");

  // --- PlaceTags ---
  const placeTagAssociations = [
    { place: places[0], tags: ["wifi", "aconchegante", "artesanal"] },
    { place: places[1], tags: ["música ao vivo", "pet-friendly"] },
    { place: places[2], tags: ["vegano", "saudável", "delivery"] },
    { place: places[3], tags: ["artesanal", "família", "aconchegante"] },
    { place: places[4], tags: ["ao ar livre", "pet-friendly", "família", "acessível"] },
    { place: places[5], tags: ["rooftop", "romântico"] },
    { place: places[6], tags: ["brunch", "pet-friendly", "aconchegante", "wifi"] },
    { place: places[7], tags: ["romântico", "família", "delivery"] },
  ];

  for (const assoc of placeTagAssociations) {
    for (const tagName of assoc.tags) {
      await prisma.placeTag.create({
        data: { placeId: assoc.place.id, tagId: tags[tagName].id },
      });
    }
  }
  console.log("✅ PlaceTags created");

  // --- Reviews ---
  const reviews = [
    { userId: user1.id, placeId: places[0].id, rating: 5, comment: "Melhor café da região! Ambiente incrível para trabalhar." },
    { userId: user2.id, placeId: places[0].id, rating: 4, comment: "Café ótimo, mas um pouco caro." },
    { userId: user3.id, placeId: places[1].id, rating: 5, comment: "Chopp gelado e petiscos sensacionais!" },
    { userId: user1.id, placeId: places[2].id, rating: 4, comment: "Comida saudável e saborosa. Recomendo o buffet." },
    { userId: user2.id, placeId: places[2].id, rating: 5, comment: "Opções veganas maravilhosas. Voltarei com certeza!" },
    { userId: user3.id, placeId: places[3].id, rating: 4, comment: "Pão fresquinho e café da manhã completo." },
    { userId: user1.id, placeId: places[4].id, rating: 5, comment: "Lugar perfeito para passear com a família no fim de semana." },
    { userId: user2.id, placeId: places[5].id, rating: 5, comment: "Vista incrível! Drinks muito bons." },
    { userId: user3.id, placeId: places[6].id, rating: 4, comment: "Brunch delicioso e ambiente super instagramável." },
    { userId: user1.id, placeId: places[7].id, rating: 5, comment: "Melhor massa artesanal que já comi em SP." },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }
  console.log("✅ Reviews created");

  // --- Favorites ---
  const favorites = [
    { userId: user1.id, placeId: places[0].id },
    { userId: user1.id, placeId: places[4].id },
    { userId: user1.id, placeId: places[7].id },
    { userId: user2.id, placeId: places[2].id },
    { userId: user2.id, placeId: places[5].id },
    { userId: user3.id, placeId: places[1].id },
    { userId: user3.id, placeId: places[6].id },
  ];

  for (const fav of favorites) {
    await prisma.favorite.create({ data: fav });
  }
  console.log("✅ Favorites created");

  // --- PlacePhotos ---
  const photoData = [
    { placeId: places[0].id, url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800", caption: "Interior do café", isPrimary: true },
    { placeId: places[0].id, url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", caption: "Cappuccino artesanal" },
    { placeId: places[1].id, url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800", caption: "Ambiente do bar", isPrimary: true },
    { placeId: places[2].id, url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800", caption: "Prato saudável", isPrimary: true },
    { placeId: places[3].id, url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800", caption: "Pães artesanais", isPrimary: true },
    { placeId: places[4].id, url: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=800", caption: "Vista do parque", isPrimary: true },
    { placeId: places[5].id, url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800", caption: "Vista do rooftop", isPrimary: true },
    { placeId: places[6].id, url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800", caption: "Mesa de brunch", isPrimary: true },
    { placeId: places[7].id, url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", caption: "Interior do restaurante", isPrimary: true },
  ];

  for (const photo of photoData) {
    await prisma.placePhoto.create({ data: photo });
  }
  console.log("✅ PlacePhotos created");

  console.log("\n🎉 Seed completed successfully!");
  console.log("📋 Summary:");
  console.log(`   - ${4} users (1 admin + 3 users)`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${tagNames.length} tags`);
  console.log(`   - ${places.length} places`);
  console.log(`   - ${reviews.length} reviews`);
  console.log(`   - ${favorites.length} favorites`);
  console.log(`   - ${photoData.length} photos`);
  console.log("\n🔑 Login credentials:");
  console.log("   Admin: admin@urbanly.com / admin123");
  console.log("   User:  joao@email.com / user123");
  console.log("   User:  maria@email.com / user123");
  console.log("   User:  pedro@email.com / user123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
