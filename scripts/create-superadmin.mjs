import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    const email = process.env.SUPERADMIN_EMAIL || 'superadmin@campushub.com';
    const password = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@123';
    const name = process.env.SUPERADMIN_NAME || 'Super Administrator';

    console.log('🔐 Creating Super Admin user...\n');

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log('⚠️  Super Admin user already exists!');
      console.log('📧 Email:', email);
      console.log('👤 Name:', existing.name);
      console.log('🔑 Role:', existing.role);
      console.log('\nTo update the password, delete this user first or use a different email.');
      return;
    }

    // Hash password
    console.log('🔒 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create Super Admin user
    console.log('👤 Creating user in database...');
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'SuperAdmin',
        isActive: true,
      },
    });

    console.log('\n✅ Super Admin user created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Name:', name);
    console.log('🆔 User ID:', user.id);
    console.log('═══════════════════════════════════════\n');
    console.log('🌐 Access URL: http://localhost:3000/superadmin\n');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    console.log('⚠️  Keep these credentials secure and confidential.\n');
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
