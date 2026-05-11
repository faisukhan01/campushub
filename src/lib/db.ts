import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

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

  // Only use Turso in production — local dev always uses SQLite to avoid
  // libsql adapter URL resolution issues during Turbopack compilation.
  const useTurso =
    process.env.NODE_ENV === 'production' &&
    !!tursoUrl &&
    !!tursoToken &&
    tursoUrl.startsWith('libsql://')

  if (useTurso) {
    console.log('[DB] Using Turso database')
    const libsql = createClient({ url: tursoUrl!, authToken: tursoToken! })
    const adapter = new PrismaLibSql(libsql)
    return new PrismaClient({ adapter })
  }

  console.log('[DB] Using local SQLite database')
  return new PrismaClient()
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
