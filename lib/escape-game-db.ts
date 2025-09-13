import { PrismaClient } from './generated/escape-game-client';

// Singleton pattern for escape game Prisma client
const globalForEscapeGamePrisma = globalThis as unknown as {
  escapeGamePrisma: PrismaClient | undefined
}

export const escapeGamePrisma = globalForEscapeGamePrisma.escapeGamePrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForEscapeGamePrisma.escapeGamePrisma = escapeGamePrisma