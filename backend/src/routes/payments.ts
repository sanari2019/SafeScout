import { FastifyPluginAsync } from 'fastify';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { stripe } from '../integrations/stripe.js';

const paymentIntentSchema = z.object({
  jobId: z.string().uuid(),
  amount: z.number().positive()
});

export const paymentRoutes: FastifyPluginAsync = async (app) => {
  app.post('/intent', { preHandler: authenticate }, async (request) => {
    const payload = paymentIntentSchema.parse(request.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(payload.amount * 100),
      currency: 'gbp',
      capture_method: 'manual',
      metadata: { jobId: payload.jobId }
    });

    await app.prisma.payment.upsert({
      where: { jobId: payload.jobId },
      update: {
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
        buyerAmount: new Prisma.Decimal(payload.amount),
        platformFee: new Prisma.Decimal(payload.amount * 0.35),
        scoutPayout: new Prisma.Decimal(payload.amount * 0.65)
      },
      create: {
        jobId: payload.jobId,
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
        buyerAmount: new Prisma.Decimal(payload.amount),
        platformFee: new Prisma.Decimal(payload.amount * 0.35),
        scoutPayout: new Prisma.Decimal(payload.amount * 0.65)
      }
    });

    return { clientSecret: paymentIntent.client_secret };
  });
};
