import { FastifyPluginAsync } from 'fastify';
import { authenticate } from '../middleware/auth.js';

export const scoutRoutes: FastifyPluginAsync = async (app) => {
  app.get('/me/jobs', { preHandler: authenticate }, async (request) => {
    const user = request.user as { sub: string };
    return app.prisma.job.findMany({
      where: { scoutId: user.sub },
      orderBy: { createdAt: 'desc' }
    });
  });
};
