import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { createJobService } from '../services/jobService.js';
import { createRiskService } from '../services/riskService.js';

const jobBodySchema = z.object({
  tier: z.enum(['LITE', 'STANDARD', 'PLUS']),
  listingUrl: z.string().url(),
  marketplace: z.enum(['FACEBOOK', 'EBAY', 'GUMTREE', 'OTHER']),
  itemTitle: z.string(),
  itemPrice: z.number().positive(),
  itemPhotos: z.array(z.string().url()).min(1),
  description: z.string().optional(),
  sellerAge: z.number().int().nonnegative(),
  photoCount: z.number().int().nonnegative()
});

const assignBodySchema = z.object({
  scoutId: z.string().uuid()
});

export const jobRoutes: FastifyPluginAsync = async (app) => {
  const jobService = createJobService(app);
  const riskService = createRiskService(app);

  app.post('/', { preHandler: authenticate }, async (request, reply) => {
    const payload = jobBodySchema.parse(request.body);
    const user = request.user as { sub: string; role: string };

    const risk = await riskService.analyzeListing({
      title: payload.itemTitle,
      price: payload.itemPrice,
      description: payload.description ?? '',
      sellerAge: payload.sellerAge,
      photoCount: payload.photoCount
    });

    const job = await jobService.createJob({
      buyerId: user.sub,
      tier: payload.tier,
      listingUrl: payload.listingUrl,
      marketplace: payload.marketplace,
      itemTitle: payload.itemTitle,
      itemPrice: payload.itemPrice,
      itemPhotos: payload.itemPhotos,
      description: payload.description
    });

    await app.prisma.job.update({
      where: { id: job.id },
      data: {
        riskScore: risk.riskScore,
        riskSignals: risk.signals,
        riskRecommendation: risk.recommendation,
        riskExplanation: risk.explanation
      }
    });

    reply.status(201).send({ jobId: job.id, risk });
  });

  app.get('/', { preHandler: authenticate }, async (request) => {
    const user = request.user as { sub: string; role: string };
    return app.prisma.job.findMany({
      where: { buyerId: user.sub },
      orderBy: { createdAt: 'desc' }
    });
  });

  app.get('/available', { preHandler: authenticate }, async (request) => {
    const user = request.user as { sub: string; role: string };
    return jobService.listJobsForScout(user.sub);
  });

  app.post('/:id/assign', { preHandler: authenticate }, async (request, reply) => {
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const body = assignBodySchema.parse(request.body);
    const updated = await jobService.assignScout(params.id, body.scoutId);
    reply.send(updated);
  });
};
