import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const EMAIL = "faisu577277@gmail.com";
const NEW_PASSWORD = "QaReLc_61y8";

async function updatePassword() {
  console.log("🔐 Updating Super Admin Password...\n");

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error("❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
    process.exit(1);
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Check if user exists
    console.log(`🔍 Looking for user: ${EMAIL}`);
    const result = await client.execute({
      sql: `SELECT id, email, name, role FROM "User" WHERE email = ?`,
      args: [EMAIL],
    });

    if (result.rows.length === 0) {
      console.log(`❌ User '${EMAIL}' not found!`);
      return;
    }

    const user = result.rows[0];
    console.log(`✅ User found: ${user.name} (${user.role})\n`);

    // Hash new password
    console.log("🔒 Hashing new password...");
    const passwordHash = await bcrypt.hash(NEW_PASSWORD, 12);

    // Update password
    console.log("💾 Updating password in database...");
    await client.execute({
      sql: `UPDATE "User" SET passwordHash = ?, updatedAt = ? WHERE email = ?`,
      args: [passwordHash, new Date().toISOString(), EMAIL],
    });

    console.log("\n✅ Password updated successfully!\n");
    console.log("═══════════════════════════════════════");
    console.log(`📧 Email: ${EMAIL}`);
    console.log(`🔑 New Password: ${NEW_PASSWORD}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log("═══════════════════════════════════════\n");
    console.log("🌐 Login at: https://campushub-sepia-eta.vercel.app/superadmin\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

updatePassword();
