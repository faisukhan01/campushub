import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error('❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
  process.exit(1);
}

const db = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

async function secureSuper Admin() {
  try {
    console.log('🔒 Securing Super Admin Account...\n');

    const email = 'faisu577277@gmail.com';
    const password = 'QaReLc_61y8';
    const name = 'Faisal Khan';

    // Hash the password with high cost factor for extra security
    console.log('🔐 Hashing password with bcrypt (cost factor: 12)...');
    const passwordHash = await bcrypt.hash(password, 12);

    // Check if user exists
    const existingUser = await db.execute({
      sql: 'SELECT * FROM User WHERE email = ?',
      args: [email],
    });

    if (existingUser.rows.length > 0) {
      // Update existing user
      console.log('✏️  Updating existing SuperAdmin account...');
      await db.execute({
        sql: `UPDATE User 
              SET passwordHash = ?, 
                  name = ?, 
                  role = 'SuperAdmin', 
                  isActive = 1,
                  instituteId = NULL,
                  branchId = NULL,
                  updatedAt = CURRENT_TIMESTAMP
              WHERE email = ?`,
        args: [passwordHash, name, email],
      });
      console.log('✅ SuperAdmin account updated successfully!');
    } else {
      // Create new user
      console.log('➕ Creating new SuperAdmin account...');
      await db.execute({
        sql: `INSERT INTO User (id, email, passwordHash, name, role, isActive, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, 'SuperAdmin', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        args: [`superadmin_${Date.now()}`, email, passwordHash, name],
      });
      console.log('✅ SuperAdmin account created successfully!');
    }

    // Remove any other SuperAdmin accounts for security
    console.log('\n🧹 Removing other SuperAdmin accounts...');
    const result = await db.execute({
      sql: `DELETE FROM User WHERE role = 'SuperAdmin' AND email != ?`,
      args: [email],
    });
    
    if (result.rowsAffected > 0) {
      console.log(`✅ Removed ${result.rowsAffected} unauthorized SuperAdmin account(s)`);
    } else {
      console.log('✅ No unauthorized SuperAdmin accounts found');
    }

    // Verify the account
    console.log('\n🔍 Verifying SuperAdmin account...');
    const verification = await db.execute({
      sql: 'SELECT id, email, name, role, isActive FROM User WHERE email = ?',
      args: [email],
    });

    if (verification.rows.length > 0) {
      const user = verification.rows[0];
      console.log('\n✅ SuperAdmin Account Verified:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Name: ${user.name}`);
      console.log(`🔑 Role: ${user.role}`);
      console.log(`✓ Status: ${user.isActive ? 'Active' : 'Inactive'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🔒 Security Measures Applied:');
      console.log('  ✓ Password hashed with bcrypt (cost: 12)');
      console.log('  ✓ Only one SuperAdmin account exists');
      console.log('  ✓ Account is active and verified');
      console.log('  ✓ No institute/branch association (global access)');
      console.log('\n⚠️  IMPORTANT: Keep these credentials secure!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
    }

  } catch (error) {
    console.error('❌ Error securing SuperAdmin:', error);
    process.exit(1);
  }
}

secureSuperAdmin();
