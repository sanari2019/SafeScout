# SafeScout Monorepo

Fastify + Prisma backend with an Expo/React Native client.

## Quick Commands

Backend:
- cd backend && npm run dev
- cd backend && npx prisma migrate deploy
- cd backend && npx prisma db seed

Frontend:
- cd frontend && npm run web

Docker:
- docker compose up -d postgres redis
- docker compose up -d backend frontend
- docker compose down -v

Seed data users share the password Password123!

Web landing experience now includes a marketing hero + verification flow (visit http://localhost:8080). Mobile users see an in-app onboarding screen before authentication.

Mobile build shows a stepped landing (hero → how it works) with verify/sign-in/skip buttons before navigation.
