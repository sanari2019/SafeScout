import { FastifyPluginAsync } from 'fastify';
import { healthRoutes } from './health.js';
import { authRoutes } from './auth.js';
import { jobRoutes } from './jobs.js';
import { scoutRoutes } from './scouts.js';
import { paymentRoutes } from './payments.js';

export const registerRoutes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes, { prefix: '/health' });
  app.register(authRoutes, { prefix: '/auth' });
  app.register(jobRoutes, { prefix: '/jobs' });
  app.register(scoutRoutes, { prefix: '/scouts' });
  app.register(paymentRoutes, { prefix: '/payments' });
};
