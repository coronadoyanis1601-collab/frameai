const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@frameai.com' },
    update: {},
    create: {
      email: 'admin@frameai.com',
      password: adminPassword,
      name: 'Admin FrameAI',
      role: 'ADMIN'
    }
  });

  // Create seller user
  const sellerPassword = await bcrypt.hash('seller123', 10);
  await prisma.user.upsert({
    where: { email: 'vendeur@frameai.com' },
    update: {},
    create: {
      email: 'vendeur@frameai.com',
      password: sellerPassword,
      name: 'Jean Dupont',
      role: 'SELLER'
    }
  });

  // Seed products
  const products = [
    {
      name: 'Lincoln View Brown',
      shape: 'Pantos / ronde carrée douce',
      color: 'Écaille marron miel',
      material: 'Acétate',
      weight: 'Léger — 18 à 25 g',
      price: 115,
      score: 98,
      style: 'Élégant, naturel, masculin',
      availability: 'SITE_BOUTIQUE',
      stock: 8,
      reason: 'Structure le regard sans durcir le visage et reprend les tons chauds des cheveux.',
      recommendedShapes: 'Pantos douce, Rectangulaire arrondie',
      recommendedColors: 'Écaille claire, Marron miel'
    },
    {
      name: 'Benedict View Brown',
      shape: 'Pantos douce',
      color: 'Brun transparent',
      material: 'Acétate',
      weight: 'Très léger — 17 à 23 g',
      price: 115,
      score: 94,
      style: 'Discret, raffiné, quotidien',
      availability: 'SITE_BOUTIQUE',
      stock: 12,
      reason: 'Monture facile à porter, idéale pour un rendu naturel et chic.',
      recommendedShapes: 'Pantos douce',
      recommendedColors: 'Brun transparent, Champagne transparent'
    },
    {
      name: 'Henry View Brown',
      shape: 'Carrée arrondie',
      color: 'Brun profond',
      material: 'Acétate',
      weight: 'Moyen — 22 à 30 g',
      price: 125,
      score: 91,
      style: 'Old money, affirmé',
      availability: 'BOUTIQUE_ONLY',
      stock: 5,
      reason: 'Ajoute du caractère tout en gardant des angles doux.',
      recommendedShapes: 'Rectangulaire arrondie, Carrée arrondie',
      recommendedColors: 'Brun profond, Écaille'
    },
    {
      name: 'Baldwin View Grey',
      shape: 'Rectangulaire douce',
      color: 'Gris transparent',
      material: 'Acétate',
      weight: 'Moyen — 21 à 28 g',
      price: 135,
      score: 88,
      style: 'Moderne, structuré',
      availability: 'SITE_ONLY',
      stock: 7,
      reason: 'Donne une ligne plus mature et professionnelle sans être trop sombre.',
      recommendedShapes: 'Rectangulaire douce',
      recommendedColors: 'Gris transparent, Champagne transparent'
    },
    {
      name: 'Zeta View Gold',
      shape: 'Ronde fine métal',
      color: 'Doré clair',
      material: 'Métal',
      weight: 'Ultra léger — 12 à 18 g',
      price: 95,
      score: 85,
      style: 'Fin, lumineux, minimal',
      availability: 'SITE_BOUTIQUE',
      stock: 15,
      reason: 'Parfait pour un style discret, léger et lumineux.',
      recommendedShapes: 'Ronde métal fine',
      recommendedColors: 'Doré fin, Champagne transparent, Vert olive'
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name },
      update: product,
      create: product
    }).catch(async () => {
      // If upsert fails due to missing unique, just create
      const existing = await prisma.product.findFirst({ where: { name: product.name } });
      if (!existing) {
        await prisma.product.create({ data: product });
      }
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin: admin@frameai.com / admin123');
  console.log('👤 Vendeur: vendeur@frameai.com / seller123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
