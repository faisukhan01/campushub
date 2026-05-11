import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const EMAIL = "faisu577277@gmail.com";
const PASSWORD = "QaReLc_61y8";

async function verifyLogin() {
  console.log("🔍 Verifying Login Credentials...\n");

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error("❌ Error: Environment variables not set");
    process.exit(1);
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Get user from database
    const result = await client.execute({
      sql: `SELECT id, email, name, role, isActive, passwordHash FROM "User" WHERE email = ?`,
      args: [EMAIL],
    });

    if (result.rows.length === 0) {
      console.log("❌ User not found!");
      return;
    }

    const user = result.rows[0];
    console.log("✅ User found:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive ? '✅ Yes' : '❌ No'}`);
    console.log(`   Password Hash: ${user.passwordHash.substring(0, 20)}...\n`);

    // Test password
    console.log(`🔑 Testing password: "${PASSWORD}"`);
    const isValid = await bcrypt.compare(PASSWORD, user.passwordHash);

    if (isValid) {
      console.log("✅ Password is CORRECT!\n");
      console.log("═══════════════════════════════════════");
      console.log("Login should work with:");
      console.log(`📧 Email: ${EMAIL}`);
      console.log(`🔑 Password: ${PASSWORD}`);
      console.log("═══════════════════════════════════════\n");
    } else {
      console.log("❌ Password is INCORRECT!\n");
    }

    // Also check the other super admin
    console.log("\n🔍 Checking other super admin account...");
    const result2 = await client.execute({
      sql: `SELECT id, email, name, role, isActive, passwordHash FROM "User" WHERE email = ?`,
      args: ["superadmin@campushub.com"],
    });

    if (result2.rows.length > 0) {
      const user2 = result2.rows[0];
      console.log(`✅ Found: ${user2.email}`);
      const isValid2 = await bcrypt.compare("SuperAdmin@123", user2.passwordHash);
      console.log(`   Password "SuperAdmin@123": ${isValid2 ? '✅ CORRECT' : '❌ INCORRECT'}`);
    }

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

verifyLogin();
