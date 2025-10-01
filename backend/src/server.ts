import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifySensible from '@fastify/sensible';
import multipart from '@fastify/multipart';
import { env } from './env.js';
import { registerRoutes } from './routes/index.js';
import { prismaPlugin } from './plugins/prisma.js';
import { redisPlugin } from './plugins/redis.js';

const buildServer = () => {
  const app = fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'warn' : 'debug'
    }
  });

  app.register(fastifyCors, { origin: true, credentials: true });
  app.register(fastifyCookie, { secret: env.JWT_SECRET });
  app.register(fastifySensible);
  app.register(helmet, { global: true });
  app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'safescout-token',
      signed: false
    },
    sign: { expiresIn: '15m' }
  });

  app.addHook('onRequest', async (request) => {
    request.log.info({ url: request.raw.url, method: request.raw.method }, 'incoming request');
  });

  app.register(prismaPlugin);
  app.register(redisPlugin);
  app.register(registerRoutes, { prefix: '/api' });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error, 'request error');
    const statusCode = error.statusCode ?? 500;
    reply.status(statusCode).send({
      statusCode,
      error: error.name,
      message: error.message
    });
  });

  return app;
};

const start = async () => {
  const server = buildServer();
  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    server.log.info({ port: env.PORT }, 'SafeScout API running');
  } catch (error) {
    server.log.error(error, 'failed to start server');
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { buildServer };
