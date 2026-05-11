import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

// Super Admin credentials
const SUPER_ADMIN_NAME = "Super Administrator";
const SUPER_ADMIN_EMAIL = "superadmin@campushub.com";
const SUPER_ADMIN_PASSWORD = "SuperAdmin@123";

async function createSuperAdmin() {
  console.log("🔐 Creating Super Admin in Production Database...\n");

  // Check if Turso credentials are available
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error("❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env file");
    console.error("\nCurrent values:");
    console.error(`TURSO_DATABASE_URL: ${process.env.TURSO_DATABASE_URL || 'NOT SET'}`);
    console.error(`TURSO_AUTH_TOKEN: ${process.env.TURSO_AUTH_TOKEN ? 'SET' : 'NOT SET'}`);
    process.exit(1);
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Check if super admin already exists
    console.log("🔍 Checking if Super Admin already exists...");
    const existing = await client.execute({
      sql: `SELECT id, email, name, role FROM "User" WHERE email = ? LIMIT 1`,
      args: [SUPER_ADMIN_EMAIL],
    });

    if (existing.rows.length > 0) {
      const existingUser = existing.rows[0];
      console.log("\n⚠️  Super Admin already exists!");
      console.log("═══════════════════════════════════════");
      console.log(`📧 Email: ${existingUser.email}`);
      console.log(`👤 Name: ${existingUser.name}`);
      console.log(`🔑 Role: ${existingUser.role}`);
      console.log(`🆔 User ID: ${existingUser.id}`);
      console.log("═══════════════════════════════════════\n");
      console.log("💡 If you need to reset the password, delete this user first.");
      console.log("   You can delete by running:");
      console.log(`   DELETE FROM "User" WHERE email = '${SUPER_ADMIN_EMAIL}';`);
      return;
    }

    // Hash password
    console.log("🔒 Hashing password...");
    const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);
    const id = randomUUID();
    const now = new Date().toISOString();

    // Create Super Admin user
    console.log("👤 Creating Super Admin user...");
    await client.execute({
      sql: `INSERT INTO "User" (id, name, email, passwordHash, role, isActive, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 'SuperAdmin', 1, ?, ?)`,
      args: [id, SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, passwordHash, now, now],
    });

    console.log("\n✅ Super Admin created successfully in PRODUCTION database!\n");
    console.log("═══════════════════════════════════════");
    console.log(`📧 Email: ${SUPER_ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${SUPER_ADMIN_PASSWORD}`);
    console.log(`👤 Name: ${SUPER_ADMIN_NAME}`);
    console.log(`🆔 User ID: ${id}`);
    console.log("═══════════════════════════════════════\n");
    console.log("🌐 Access your deployed site at:");
    console.log("   https://campushub-sepia-eta.vercel.app/superadmin\n");
    console.log("⚠️  IMPORTANT: Change the password after first login!");
    console.log("⚠️  Keep these credentials secure and confidential.\n");
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error);
    process.exit(1);
  }
}

createSuperAdmin();
