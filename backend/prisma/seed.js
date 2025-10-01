import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const buyer = await prisma.user.upsert({
        where: { email: 'buyer@example.com' },
        update: {},
        create: {
            email: 'buyer@example.com',
            passwordHash: '$2b$14$abcdefghijklmnopqrstuvwxy0123456789abcdef',
            role: 'BUYER'
        }
    });
    const scout = await prisma.user.upsert({
        where: { email: 'scout@example.com' },
        update: {},
        create: {
            email: 'scout@example.com',
            passwordHash: '$2b$14$abcdefghijklmnopqrstuvwxy0123456789abcdef',
            role: 'SCOUT'
        }
    });
    console.log({ buyer, scout });
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map