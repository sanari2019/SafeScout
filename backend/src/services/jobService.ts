import { FastifyInstance } from 'fastify';
import { Prisma } from '@prisma/client';

interface CreateJobInput {
  buyerId: string;
  tier: 'LITE' | 'STANDARD' | 'PLUS';
  listingUrl: string;
  marketplace: 'FACEBOOK' | 'EBAY' | 'GUMTREE' | 'OTHER';
  itemTitle: string;
  itemPrice: number;
  itemPhotos: string[];
  description?: string;
}

export const createJobService = (app: FastifyInstance) => {
  const createJob = async (input: CreateJobInput) => {
    const { buyerId, tier, listingUrl, marketplace, itemTitle, itemPrice, itemPhotos, description } = input;

    const pricing = calculatePricing(tier, itemPrice);

    const job = await app.prisma.job.create({
      data: {
        buyerId,
        tier,
        listingUrl,
        marketplace,
        itemTitle,
        itemPrice: new Prisma.Decimal(itemPrice),
        itemPhotos,
        description,
        scoutFee: new Prisma.Decimal(pricing.scoutFee),
        totalFee: new Prisma.Decimal(pricing.totalFee)
      }
    });

    return job;
  };

  const listJobsForScout = (scoutId: string) => {
    return app.prisma.job.findMany({
      where: {
        OR: [
          { status: 'CREATED' },
          { scoutId }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  };

  const assignScout = async (jobId: string, scoutId: string) => {
    return app.prisma.job.update({
      where: { id: jobId },
      data: {
        scoutId,
        status: 'SCOUT_ASSIGNED'
      }
    });
  };

  return { createJob, listJobsForScout, assignScout };
};

const calculatePricing = (tier: CreateJobInput['tier'], itemPrice: number) => {
  const platformFeeMultiplier = {
    LITE: 0.25,
    STANDARD: 0.35,
    PLUS: 0.4
  } as const;

  const baseFee = tier === 'LITE' ? 19 : tier === 'STANDARD' ? 39 : 69;
  const platformFee = baseFee * platformFeeMultiplier[tier];
  const scoutFee = baseFee - platformFee;
  const totalFee = baseFee;

  return {
    scoutFee,
    totalFee,
    platformFee
  };
};
