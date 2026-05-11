import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const TEST_EMAIL = "superadmin@campushub.com";
const TEST_PASSWORD = "SuperAdmin@123";

async function diagnose() {
  console.log("🔍 AUTHENTICATION DIAGNOSTIC TOOL\n");
  console.log("=" .repeat(60));

  // Check environment variables
  console.log("\n1️⃣ CHECKING ENVIRONMENT VARIABLES:");
  console.log("-".repeat(60));
  
  const hasDbUrl = !!process.env.TURSO_DATABASE_URL;
  const hasAuthToken = !!process.env.TURSO_AUTH_TOKEN;
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
  
  console.log(`TURSO_DATABASE_URL: ${hasDbUrl ? '✅ SET' : '❌ NOT SET'}`);
  if (hasDbUrl) {
    console.log(`  Value: ${process.env.TURSO_DATABASE_URL}`);
  }
  
  console.log(`TURSO_AUTH_TOKEN: ${hasAuthToken ? '✅ SET' : '❌ NOT SET'}`);
  if (hasAuthToken) {
    console.log(`  Value: ${process.env.TURSO_AUTH_TOKEN.substring(0, 50)}...`);
  }
  
  console.log(`NEXTAUTH_SECRET: ${hasNextAuthSecret ? '✅ SET' : '❌ NOT SET'}`);
  
  if (!hasDbUrl || !hasAuthToken) {
    console.log("\n❌ PROBLEM FOUND: Missing environment variables!");
    console.log("   You need to set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN");
    return;
  }

  // Check database connection
  console.log("\n2️⃣ CHECKING DATABASE CONNECTION:");
  console.log("-".repeat(60));
  
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    console.log("✅ Database client created successfully");

    // Check if user exists
    console.log("\n3️⃣ CHECKING USER IN DATABASE:");
    console.log("-".repeat(60));
    
    const result = await client.execute({
      sql: `SELECT id, email, name, role, isActive, passwordHash FROM "User" WHERE email = ?`,
      args: [TEST_EMAIL],
    });

    if (result.rows.length === 0) {
      console.log(`❌ PROBLEM FOUND: User '${TEST_EMAIL}' does not exist!`);
      console.log("\n🔧 SOLUTION: Run this command:");
      console.log("   node scripts/create-superadmin-production.mjs");
      return;
    }

    const user = result.rows[0];
    console.log("✅ User found in database:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive ? '✅ Yes' : '❌ No'}`);
    console.log(`   Password Hash: ${user.passwordHash ? '✅ Set' : '❌ Not Set'}`);

    if (!user.isActive) {
      console.log("\n❌ PROBLEM FOUND: User is not active!");
      return;
    }

    if (user.role !== 'SuperAdmin') {
      console.log(`\n❌ PROBLEM FOUND: User role is '${user.role}', not 'SuperAdmin'!`);
      return;
    }

    // Test password
    console.log("\n4️⃣ TESTING PASSWORD:");
    console.log("-".repeat(60));
    
    const isValid = await bcrypt.compare(TEST_PASSWORD, user.passwordHash);
    
    if (isValid) {
      console.log(`✅ Password '${TEST_PASSWORD}' is CORRECT!`);
    } else {
      console.log(`❌ PROBLEM FOUND: Password '${TEST_PASSWORD}' is INCORRECT!`);
      console.log("\n🔧 SOLUTION: Reset the password by running:");
      console.log("   node scripts/test-password.mjs");
      return;
    }

    // All checks passed
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL CHECKS PASSED!");
    console.log("=".repeat(60));
    console.log("\n📋 CREDENTIALS:");
    console.log(`   Email: ${TEST_EMAIL}`);
    console.log(`   Password: ${TEST_PASSWORD}`);
    console.log("\n🌐 LOGIN URL:");
    console.log("   https://campushub-sepia-eta.vercel.app/superadmin");
    console.log("\n💡 If login still fails, the issue is likely:");
    console.log("   1. Vercel environment variables not set correctly");
    console.log("   2. Vercel app not redeployed after setting env vars");
    console.log("   3. Browser cache (try incognito mode)");
    console.log("   4. NextAuth session issue (check Vercel logs)");

  } catch (error) {
    console.log("❌ DATABASE CONNECTION FAILED!");
    console.error("   Error:", error.message);
    console.log("\n🔧 SOLUTION: Check your TURSO credentials are correct");
  }
}

diagnose();
