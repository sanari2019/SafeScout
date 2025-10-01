import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/safescout'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required').default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long').default('insecure-development-secret-must-change'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters long')
    .default('insecure-development-refresh-secret-change'),
  STRIPE_API_KEY: z.string().min(1, 'STRIPE_API_KEY is required').default('sk_test_placeholder'),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required').default('sk-openai-placeholder'),
  ANTHROPIC_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional()
});

export const env = envSchema.parse(process.env);
