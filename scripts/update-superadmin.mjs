import { createClient } from "@libsql/client"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function run() {
  // Remove any existing SuperAdmin accounts
  await client.execute({ sql: `DELETE FROM "User" WHERE role = 'SuperAdmin'`, args: [] })

  const id = randomUUID()
  const passwordHash = await bcrypt.hash("QaReLc_61y8", 12)
  const now = new Date().toISOString()

  await client.execute({
    sql: `INSERT INTO "User" (id, name, email, passwordHash, role, isActive, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, 'SuperAdmin', 1, ?, ?)`,
    args: [id, "Faisal Khan", "faisu577277@gmail.com", passwordHash, now, now],
  })

  console.log("✅ Super Admin updated successfully!")
  console.log("   Email: faisu577277@gmail.com")
  console.log("   Role:  SuperAdmin")
}

run().catch((e) => { console.error(e); process.exit(1) })
