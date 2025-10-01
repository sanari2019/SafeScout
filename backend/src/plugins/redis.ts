import fp from 'fastify-plugin';
import IORedis from 'ioredis';
import { env } from '../env.js';

const createRedisInstance = () => {
  const RedisConstructor = IORedis as unknown as { new (...args: any[]): any };
  return new RedisConstructor(env.REDIS_URL, { lazyConnect: true });
};

type RedisClient = ReturnType<typeof createRedisInstance>;

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClient;
  }
}

export const redisPlugin = fp(async (app) => {
  const redis = createRedisInstance();

  if (typeof redis.connect === "function") {
    await redis.connect();
  }
  app.log.info('Redis connected');

  app.decorate('redis', redis);

  app.addHook('onClose', async () => {
    if (typeof redis.quit === "function") {
      await redis.quit();
    }
  });
});
