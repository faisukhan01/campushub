import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // ALWAYS use Turso database for all environments (development, production, build)
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN

  // Check if Turso credentials are available
  if (tursoUrl && tursoToken && (tursoUrl.startsWith('libsql://') || tursoUrl.startsWith('https://'))) {
    console.log('[DB] ✅ Using Turso database (Production)')
    console.log('[DB] URL:', tursoUrl)
    // Use https:// to avoid WebSocket connection timeouts between requests
    const httpUrl = tursoUrl.startsWith('libsql://') ? tursoUrl.replace('libsql://', 'https://') : tursoUrl
    const adapter = new PrismaLibSql({ url: httpUrl, authToken: tursoToken })
    return new PrismaClient({ adapter })
  }

  // Fallback error if Turso credentials are missing
  console.error('[DB] ❌ ERROR: Turso credentials not found!')
  console.error('[DB] Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env')
  throw new Error('Turso database credentials are required. Please check your .env file.')
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
