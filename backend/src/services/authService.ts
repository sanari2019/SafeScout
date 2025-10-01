import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface RegisterInput {
  email: string;
  password: string;
  role: 'BUYER' | 'SCOUT' | 'ADMIN';
}

interface LoginInput {
  email: string;
  password: string;
}

const SALT_ROUNDS = 14;

export const createAuthService = (app: FastifyInstance) => {
  const register = async ({ email, password, role }: RegisterInput) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      const user = await app.prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role
        }
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw app.httpErrors.conflict('Email already in use');
      }
      throw error;
    }
  };

  const login = async ({ email, password }: LoginInput) => {
    const user = await app.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw app.httpErrors.unauthorized('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw app.httpErrors.unauthorized('Invalid credentials');
    }

    return user;
  };

  return { register, login };
};
