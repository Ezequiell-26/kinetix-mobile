import { PrismaClient } from "@prisma/client";

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
