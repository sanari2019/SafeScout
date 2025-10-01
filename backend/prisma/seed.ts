import bcrypt from 'bcrypt';
import { Prisma, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser(
  email: string,
  role: Role,
  passwordHash: string,
  extras: Partial<Prisma.UserCreateInput> = {}
) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role,
      rating: role === 'SCOUT' ? 4.6 : undefined,
      ...extras
    }
  });
}

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 14);

  await prisma.$transaction([
    prisma.verificationReport.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.job.deleteMany(),
    prisma.user.deleteMany()
  ]);

  const [buyerAlice, buyerBen, scoutSophie, scoutSam, admin] = await Promise.all([
    createUser('alice@example.com', 'BUYER', passwordHash, { stripeCustomerId: 'cus_test_alice' }),
    createUser('ben@example.com', 'BUYER', passwordHash, { stripeCustomerId: 'cus_test_ben' }),
    createUser('sophie.scout@example.com', 'SCOUT', passwordHash, { stripeAccountId: 'acct_test_sophie', rating: 4.9 }),
    createUser('sam.scout@example.com', 'SCOUT', passwordHash, { stripeAccountId: 'acct_test_sam', rating: 4.7 }),
    createUser('admin@example.com', 'ADMIN', passwordHash)
  ]);

  const macbookJob = await prisma.job.create({
    data: {
      buyerId: buyerAlice.id,
      scoutId: scoutSophie.id,
      status: 'VERIFIED',
      tier: 'PLUS',
      listingUrl: 'https://www.facebook.com/marketplace/item/macbook-pro-2021',
      marketplace: 'FACEBOOK',
      itemTitle: 'MacBook Pro 14" 2021',
      itemPrice: new Prisma.Decimal(1450),
      itemPhotos: [
        'https://assets.safescout.dev/macbook/photo-1.jpg',
        'https://assets.safescout.dev/macbook/photo-2.jpg'
      ],
      description: 'Gently used MacBook Pro with AppleCare until 2026.',
      riskScore: 18,
      riskSignals: ['Positive seller history', 'Detailed description'],
      riskRecommendation: 'LOW_RISK',
      riskExplanation: 'Listing price is consistent with market value and seller has a long history with positive reviews.',
      scoutFee: new Prisma.Decimal(45),
      totalFee: new Prisma.Decimal(69)
    }
  });

  await prisma.verificationReport.create({
    data: {
      jobId: macbookJob.id,
      photos: [
        'https://assets.safescout.dev/macbook/report-1.jpg',
        'https://assets.safescout.dev/macbook/report-2.jpg'
      ],
      videoUrl: 'https://assets.safescout.dev/macbook/video.mp4',
      conditionGrade: 'A',
      defects: ['Minor scuff on chassis'],
      recommendation: 'BUY',
      reportContent: 'MacBook verified in excellent condition. Battery health at 92%. Proceed with purchase.'
    }
  });

  await prisma.payment.create({
    data: {
      jobId: macbookJob.id,
      stripePaymentIntentId: 'pi_test_macbook',
      status: 'RELEASED',
      buyerAmount: new Prisma.Decimal(169),
      scoutPayout: new Prisma.Decimal(110),
      platformFee: new Prisma.Decimal(59)
    }
  });

  await prisma.job.create({
    data: {
      buyerId: buyerBen.id,
      status: 'CREATED',
      tier: 'STANDARD',
      listingUrl: 'https://www.ebay.co.uk/itm/canyon-endurace-bike',
      marketplace: 'EBAY',
      itemTitle: 'Canyon Endurace 7 Road Bike',
      itemPrice: new Prisma.Decimal(890),
      itemPhotos: ['https://assets.safescout.dev/bike/photo-1.jpg'],
      description: 'Lightly used road bike, serviced last month.',
      riskScore: 52,
      riskSignals: ['Price slightly below market average', 'Seller account created 2 months ago'],
      riskRecommendation: 'MEDIUM_RISK',
      riskExplanation: 'Listing is somewhat under market value and seller is relatively new.',
      scoutFee: new Prisma.Decimal(30),
      totalFee: new Prisma.Decimal(39)
    }
  });

  console.log('Seed complete');
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
