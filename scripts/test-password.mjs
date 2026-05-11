import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const TEST_EMAIL = "superadmin@campushub.com";
const TEST_PASSWORD = "SuperAdmin@123";

async function testPassword() {
  console.log("🔐 Testing password authentication...\n");

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
      args: [TEST_EMAIL],
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
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Password Hash: ${user.passwordHash}\n`);

    // Test password
    console.log(`🔑 Testing password: "${TEST_PASSWORD}"`);
    const isValid = await bcrypt.compare(TEST_PASSWORD, user.passwordHash);

    if (isValid) {
      console.log("✅ Password is CORRECT! Authentication should work.\n");
    } else {
      console.log("❌ Password is INCORRECT! This is the problem.\n");
      
      // Try to fix it
      console.log("🔧 Attempting to reset password...");
      const newHash = await bcrypt.hash(TEST_PASSWORD, 12);
      await client.execute({
        sql: `UPDATE "User" SET passwordHash = ?, updatedAt = ? WHERE email = ?`,
        args: [newHash, new Date().toISOString(), TEST_EMAIL],
      });
      console.log("✅ Password has been reset. Try logging in again.\n");
    }

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testPassword();
