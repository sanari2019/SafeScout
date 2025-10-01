import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { env } from '../env.js';
import { createAuthService } from '../services/authService.js';

const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  role: z.enum(['BUYER', 'SCOUT', 'ADMIN']).default('BUYER')
});

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(12)
});

export const authRoutes: FastifyPluginAsync = async (app) => {
  const authService = createAuthService(app);

  app.post('/register', async (request, reply) => {
    const payload = registerBodySchema.parse(request.body);
    const user = await authService.register(payload);
    const tokenPayload = { sub: user.id, role: user.role };

    const accessToken = await reply.jwtSign(tokenPayload, { expiresIn: '15m' });
    const refreshToken = await app.jwt.sign(tokenPayload, {
      expiresIn: '7d'
    });

    reply
      .setCookie('safescout_refresh', refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60
      })
      .status(201)
      .send({
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
  });

  app.post('/login', async (request, reply) => {
    const payload = loginBodySchema.parse(request.body);
    const user = await authService.login(payload);
    const tokenPayload = { sub: user.id, role: user.role };

    const accessToken = await reply.jwtSign(tokenPayload, { expiresIn: '15m' });
    const refreshToken = await app.jwt.sign(tokenPayload, {
      expiresIn: '7d'
    });

    reply
      .setCookie('safescout_refresh', refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60
      })
      .send({
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
  });

  app.post('/refresh', async (request, reply) => {
    const refreshToken = request.cookies?.safescout_refresh;
    if (!refreshToken) {
      throw app.httpErrors.unauthorized('Missing refresh token');
    }

    try {
      const decoded = app.jwt.verify<{ sub: string; role: string }>(refreshToken);

      const accessToken = await reply.jwtSign({ sub: decoded.sub, role: decoded.role }, {
        expiresIn: '15m'
      });

      reply.send({ token: accessToken });
    } catch (error) {
      request.log.error(error, 'failed to verify refresh token');
      throw app.httpErrors.unauthorized('Invalid refresh token');
    }
  });

  app.post('/logout', async (_request, reply) => {
    reply.clearCookie('safescout_refresh', { path: '/' });
    reply.status(204).send();
  });
};
