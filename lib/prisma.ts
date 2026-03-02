import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.ANALYTICS_DATABASE_URL;
  if (!connectionString) throw new Error('ANALYTICS_DATABASE_URL is not set');

  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
  return client;
}

function getAnalyticsPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  return createPrismaClient();
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return Reflect.get(getAnalyticsPrisma(), prop);
  },
});
