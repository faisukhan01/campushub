/**
 * Restores/verifies the SuperAdmin account in Turso DB.
 * Uses @libsql/client directly so it always targets Turso, never local SQLite.
 * Run with: node scripts/restore-superadmin.mjs
 */
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';

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
  } catch {}
}

loadEnv();

const TURSO_URL   = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('ERROR: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env');
  process.exit(1);
}

const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

const email    = 'faisu577277@gmail.com';
const password = 'QaReLc_61y8';
const name     = 'Super Administrator';

function cuid() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

async function restoreSuperAdmin() {
  try {
    console.log('Checking Turso DB for SuperAdmin...\n');

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const existing = await client.execute({
      sql: 'SELECT id, email, name, role FROM "User" WHERE email = ?',
      args: [email],
    });

    if (existing.rows.length > 0) {
      const row = existing.rows[0];
      console.log('SuperAdmin found in Turso DB!');
      console.log('  Email:', row.email);
      console.log('  Name: ', row.name);
      console.log('  Role: ', row.role);

      console.log('\nUpdating password and ensuring role/active status...');
      await client.execute({
        sql: 'UPDATE "User" SET passwordHash = ?, role = ?, isActive = 1, updatedAt = ? WHERE email = ?',
        args: [passwordHash, 'SuperAdmin', now, email],
      });
      console.log('Password updated successfully!\n');
    } else {
      console.log('SuperAdmin not found. Creating new one...\n');
      const id = cuid();

      await client.execute({
        sql: `INSERT INTO "User" (id, email, passwordHash, name, role, isActive, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, 'SuperAdmin', 1, ?, ?)`,
        args: [id, email, passwordHash, name, now, now],
      });
      console.log('SuperAdmin created successfully!\n');
    }

    console.log('═'.repeat(43));
    console.log('  Email:   ', email);
    console.log('  Password:', password);
    console.log('═'.repeat(43) + '\n');

    const counts = await client.execute('SELECT COUNT(*) as total FROM "User"');
    console.log('Total users in Turso DB:', counts.rows[0].total);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

restoreSuperAdmin();
