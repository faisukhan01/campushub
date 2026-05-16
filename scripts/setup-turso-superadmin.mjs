/**
 * Sets up the SuperAdmin account directly in Turso via @libsql/client.
 * Run with: node scripts/setup-turso-superadmin.mjs
 */
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';

// Parse .env manually (no dotenv dependency needed)
function loadEnv() {
  try {
    const raw = readFileSync('.env', 'utf-8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env not found, rely on environment variables already set
  }
}

loadEnv();

const TURSO_URL   = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('ERROR: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env');
  process.exit(1);
}

const SUPER_ADMIN_EMAIL    = 'faisu577277@gmail.com';
const SUPER_ADMIN_PASSWORD = 'QaReLc_61y8';
const SUPER_ADMIN_NAME     = 'Super Administrator';

const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

function cuid() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  SuperAdmin Setup for Turso DB');
  console.log('='.repeat(60));
  console.log('Connecting to:', TURSO_URL, '\n');

  const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

  // Check existing
  const existing = await client.execute({
    sql: 'SELECT id, email, name, role, isActive FROM "User" WHERE email = ?',
    args: [SUPER_ADMIN_EMAIL],
  });

  if (existing.rows.length > 0) {
    const row = existing.rows[0];
    console.log('Found existing user:');
    console.log('  ID:     ', row.id);
    console.log('  Email:  ', row.email);
    console.log('  Role:   ', row.role);
    console.log('  Active: ', row.isActive);

    const now = new Date().toISOString();
    await client.execute({
      sql: 'UPDATE "User" SET passwordHash = ?, role = ?, isActive = 1, name = ?, updatedAt = ? WHERE email = ?',
      args: [passwordHash, 'SuperAdmin', SUPER_ADMIN_NAME, now, SUPER_ADMIN_EMAIL],
    });
    console.log('\nUpdated: password, role=SuperAdmin, isActive=true');
  } else {
    console.log('SuperAdmin not found in Turso — creating now...');
    const id  = cuid();
    const now = new Date().toISOString();

    await client.execute({
      sql: `INSERT INTO "User" (id, email, passwordHash, name, role, isActive, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 'SuperAdmin', 1, ?, ?)`,
      args: [id, SUPER_ADMIN_EMAIL, passwordHash, SUPER_ADMIN_NAME, now, now],
    });
    console.log('Created SuperAdmin with ID:', id);
  }

  // Verify
  const verify = await client.execute({
    sql: 'SELECT id, email, name, role, isActive FROM "User" WHERE email = ?',
    args: [SUPER_ADMIN_EMAIL],
  });

  const u = verify.rows[0];
  console.log('\n' + '='.repeat(60));
  console.log('  Verification — SuperAdmin in Turso DB:');
  console.log('='.repeat(60));
  console.log('  ID:      ', u.id);
  console.log('  Email:   ', u.email);
  console.log('  Name:    ', u.name);
  console.log('  Role:    ', u.role);
  console.log('  Active:  ', u.isActive === 1 ? 'YES' : u.isActive);
  console.log('\n  Login credentials:');
  console.log('  Email:   ', SUPER_ADMIN_EMAIL);
  console.log('  Password:', SUPER_ADMIN_PASSWORD);
  console.log('='.repeat(60) + '\n');

  // Count all users in Turso for info
  const countRes = await client.execute('SELECT COUNT(*) as total FROM "User"');
  console.log('Total users in Turso DB:', countRes.rows[0].total);
}

main()
  .catch((err) => { console.error('ERROR:', err); process.exit(1); })
  .finally(() => client.close());
