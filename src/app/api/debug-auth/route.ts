import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'

export async function GET() {
  const results: Record<string, unknown> = {}

  results.NODE_ENV = process.env.NODE_ENV
  results.TURSO_URL_SET = !!process.env.TURSO_DATABASE_URL
  results.TURSO_TOKEN_SET = !!process.env.TURSO_AUTH_TOKEN
  results.NEXTAUTH_URL = process.env.NEXTAUTH_URL
  results.TURSO_URL_PREFIX = process.env.TURSO_DATABASE_URL?.slice(0, 30) + '...'

  // Test 1: direct libsql connection
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
    const res = await client.execute({
      sql: `SELECT email, role, isActive, LENGTH(passwordHash) as hashLen FROM User WHERE email = ?`,
      args: ['faisu577277@gmail.com'],
    })
    const user = res.rows[0]
    results.libsql_user_found = !!user
    results.libsql_role = user?.role
    results.libsql_active = user?.isActive
    results.libsql_hash_length = user?.hashLen

    if (user?.passwordHash) {
      results.bcrypt_match = await bcrypt.compare('QaReLc_61y8', user.passwordHash as string)
    }
  } catch (e: unknown) {
    results.libsql_error = (e as Error).message
  }

  // Test 2: Prisma connection
  try {
    const { db } = await import('@/lib/db')
    const user = await db.user.findUnique({
      where: { email: 'faisu577277@gmail.com' },
      select: { email: true, role: true, isActive: true },
    })
    results.prisma_user_found = !!user
    results.prisma_role = user?.role
    results.prisma_active = user?.isActive
  } catch (e: unknown) {
    results.prisma_error = (e as Error).message
  }

  return NextResponse.json(results)
}
