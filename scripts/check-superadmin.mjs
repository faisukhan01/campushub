import { createClient } from "@libsql/client";

async function checkSuperAdmin() {
  console.log("🔍 Checking Super Admin in Production Database...\n");

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error("❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
    process.exit(1);
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Check for superadmin@campushub.com
    console.log("Looking for: superadmin@campushub.com");
    const result1 = await client.execute({
      sql: `SELECT id, email, name, role, isActive, passwordHash FROM "User" WHERE email = ?`,
      args: ["superadmin@campushub.com"],
    });

    if (result1.rows.length > 0) {
      const user = result1.rows[0];
      console.log("\n✅ Found user:");
      console.log("═══════════════════════════════════════");
      console.log(`🆔 ID: ${user.id}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Name: ${user.name}`);
      console.log(`🔑 Role: ${user.role}`);
      console.log(`✓ Active: ${user.isActive}`);
      console.log(`🔒 Password Hash: ${user.passwordHash ? 'SET (length: ' + user.passwordHash.length + ')' : 'NOT SET'}`);
      console.log("═══════════════════════════════════════\n");
    } else {
      console.log("❌ User not found!\n");
    }

    // Also check for admin@campushub.pk
    console.log("Also checking for: admin@campushub.pk");
    const result2 = await client.execute({
      sql: `SELECT id, email, name, role, isActive FROM "User" WHERE email = ?`,
      args: ["admin@campushub.pk"],
    });

    if (result2.rows.length > 0) {
      const user = result2.rows[0];
      console.log("\n✅ Found user:");
      console.log("═══════════════════════════════════════");
      console.log(`🆔 ID: ${user.id}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Name: ${user.name}`);
      console.log(`🔑 Role: ${user.role}`);
      console.log(`✓ Active: ${user.isActive}`);
      console.log("═══════════════════════════════════════\n");
    } else {
      console.log("❌ User not found!\n");
    }

    // List all SuperAdmin users
    console.log("Listing ALL SuperAdmin users in database:");
    const allSuperAdmins = await client.execute({
      sql: `SELECT id, email, name, role, isActive FROM "User" WHERE role = 'SuperAdmin'`,
    });

    if (allSuperAdmins.rows.length > 0) {
      console.log(`\n✅ Found ${allSuperAdmins.rows.length} SuperAdmin user(s):\n`);
      allSuperAdmins.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} - ${user.name} (Active: ${user.isActive})`);
      });
    } else {
      console.log("\n❌ No SuperAdmin users found in database!");
    }

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkSuperAdmin();
