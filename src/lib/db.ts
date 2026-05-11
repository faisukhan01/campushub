import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('[DB] Build phase — using local SQLite')
    return new PrismaClient()
  }

  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN

  const useTurso =
    process.env.NODE_ENV === 'production' &&
    !!tursoUrl &&
    !!tursoToken &&
    tursoUrl.startsWith('libsql://')

  if (useTurso) {
    console.log('[DB] Using Turso database')
    // PrismaLibSql is a factory — pass config directly, not a pre-created client
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken })
    return new PrismaClient({ adapter })
  }

  console.log('[DB] Using local SQLite database')
  return new PrismaClient()
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
