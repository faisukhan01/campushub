import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, '../prisma/dev.db');

const db = new DatabaseSync(dbPath);
const hash = await bcrypt.hash('QaReLc_61y8', 12);
const now = new Date().toISOString();
const id = randomUUID();

db.exec(`DELETE FROM "User" WHERE role = 'SuperAdmin'`);
db.prepare(`
  INSERT INTO "User" (id, name, email, passwordHash, role, isActive, createdAt, updatedAt)
  VALUES (?, 'Faisal Khan', 'faisu577277@gmail.com', ?, 'SuperAdmin', 1, ?, ?)
`).run(id, hash, now, now);

console.log('✅ Super admin created in local SQLite');
console.log('   Email: faisu577277@gmail.com');
db.close();
