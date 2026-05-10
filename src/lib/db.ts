import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // During build time, use a dummy client that won't actually connect
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('[DB] Build phase detected, using local SQLite');
    return new PrismaClient()
  }

  // Check if we're using Turso (production) or local SQLite (development)
  const useTurso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN

  if (useTurso) {
    console.log('[DB] Using Turso database');
    
    try {
      const libsql = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      })
      const adapter = new PrismaLibSql(libsql)
      return new PrismaClient({ adapter })
    } catch (error) {
      console.error('[DB] Failed to create Turso client, using fallback');
      return new PrismaClient()
    }
  } else {
    // Use local SQLite for development
    console.log('[DB] Using local SQLite database');
    return new PrismaClient()
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
