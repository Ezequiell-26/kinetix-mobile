import { PrismaClient } from "@prisma/client";

// Fallback DATABASE_URL -> DIRECT_URL para Vercel donde DATABASE_URL quedó vacío tras integración Supabase
// y placeholder durante build (NEXT_PHASE) para no romper el collect page data.
if (!process.env.DATABASE_URL && process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}
if (!process.env.DATABASE_URL && process.env.NEXT_PHASE === 'phase-production-build') {
  process.env.DATABASE_URL = 'postgresql://postgres.placeholder:placeholder@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
}
if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Helper para health checks
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    await prisma.user.count();
    return true;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
}

export default prisma;
