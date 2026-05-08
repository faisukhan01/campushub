import { createClient } from "@libsql/client"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// ── CHANGE THESE BEFORE RUNNING ──────────────────────────────
const SUPER_ADMIN_NAME = "Faisal Khan"
const SUPER_ADMIN_EMAIL = "admin@campushub.pk"
const SUPER_ADMIN_PASSWORD = "Admin@123456"
// ─────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding Super Admin...")

  // Check if already exists
  const existing = await client.execute({
    sql: `SELECT id FROM "User" WHERE email = ? LIMIT 1`,
    args: [SUPER_ADMIN_EMAIL],
  })

  if (existing.rows.length > 0) {
    console.log(`✓ Super Admin already exists: ${SUPER_ADMIN_EMAIL}`)
    console.log("  Delete and re-run if you want to reset the password.")
    return
  }

  const id = randomUUID()
  const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12)
  const now = new Date().toISOString()

  await client.execute({
    sql: `INSERT INTO "User" (id, name, email, passwordHash, role, isActive, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, 'SuperAdmin', 1, ?, ?)`,
    args: [id, SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, passwordHash, now, now],
  })

  console.log("\n✅ Super Admin created successfully!")
  console.log("─────────────────────────────────")
  console.log(`  Email   : ${SUPER_ADMIN_EMAIL}`)
  console.log(`  Password: ${SUPER_ADMIN_PASSWORD}`)
  console.log("─────────────────────────────────")
  console.log("⚠  Change your password after first login!")
}

seed().catch((e) => { console.error(e); process.exit(1) })
