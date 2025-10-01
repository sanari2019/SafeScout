import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string;
      role: 'BUYER' | 'SCOUT' | 'ADMIN';
    };
  }
}
