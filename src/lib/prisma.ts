import { PrismaClient } from '@prisma/client';

// Check if database is configured
export const isDatabaseConfigured = (): boolean => {
  return !!(process.env.DATABASE_URL && process.env.DIRECT_URL);
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only create Prisma client if database is configured
let prismaClient: PrismaClient | null = null;

if (isDatabaseConfigured()) {
  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
}

// Export a proxy that will throw helpful error if database is not configured
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!isDatabaseConfigured()) {
      throw new Error(
        'Database is not configured. Please set DATABASE_URL and DIRECT_URL environment variables. ' +
        'See .env.example for reference.'
      );
    }
    if (prismaClient) {
      return prismaClient[prop as keyof PrismaClient];
    }
    throw new Error('Prisma client is not initialized');
  },
});

export default prisma;
