import { FastifyReply, FastifyRequest } from 'fastify';

export const authenticate = async (request: FastifyRequest, _reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (_error) {
    throw request.server.httpErrors.unauthorized('Unauthorized');
  }
};
