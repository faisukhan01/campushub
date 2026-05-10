import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log('👥 Creating test users for quick login buttons...\n');

    const password = 'Test@123';
    const passwordHash = await bcrypt.hash(password, 10);

    const users = [
      {
        email: 'institute@example.com',
        name: 'Institute Admin',
        role: 'InstituteAdmin',
        employeeId: null,
        rollNumber: null,
        icon: '🏛️',
      },
      {
        email: 'branch@example.com',
        name: 'Branch Admin',
        role: 'BranchAdmin',
        employeeId: null,
        rollNumber: null,
        icon: '🏢',
      },
      {
        email: 'teacher@example.com',
        name: 'Test Teacher',
        role: 'Teacher',
        employeeId: 'T0001',
        rollNumber: null,
        icon: '👨‍🏫',
      },
      {
        email: 'student@example.com',
        name: 'Test Student',
        role: 'Student',
        employeeId: null,
        rollNumber: 'S0001',
        icon: '🎓',
      },
    ];

    let created = 0;
    let skipped = 0;

    for (const userData of users) {
      const existing = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existing) {
        await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            role: userData.role,
            employeeId: userData.employeeId,
            rollNumber: userData.rollNumber,
            passwordHash,
            isActive: true,
          },
        });
        console.log(`✅ ${userData.icon} Created ${userData.role}: ${userData.email}`);
        created++;
      } else {
        console.log(`⚠️  ${userData.icon} User already exists: ${userData.email}`);
        skipped++;
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('📊 Summary:');
    console.log(`   ✅ Created: ${created} users`);
    console.log(`   ⚠️  Skipped: ${skipped} users (already exist)`);
    console.log('═══════════════════════════════════════\n');

    console.log('📝 Test Credentials:');
    console.log('   🔑 Password for all users: Test@123\n');
    
    console.log('📧 Email Addresses:');
    users.forEach(u => {
      const identifier = u.employeeId || u.rollNumber || u.email;
      const idType = u.employeeId ? 'Employee ID' : u.rollNumber ? 'Roll Number' : 'Email';
      console.log(`   ${u.icon} ${identifier.padEnd(30)} (${u.role} - ${idType})`);
    });

    console.log('\n🌐 Access URLs:');
    console.log('   Regular Portal: http://localhost:3000');
    console.log('   Super Admin:    http://localhost:3000/superadmin\n');

    console.log('💡 Quick Login Buttons:');
    console.log('   The sign-in page now has quick login buttons:');
    console.log('   - Institute Admin: Pre-fills "institute@example.com"');
    console.log('   - Branch Admin:    Pre-fills "branch@example.com"');
    console.log('   - Teacher:         Pre-fills "T0001" (Employee ID)');
    console.log('   - Student:         Pre-fills "S0001" (Roll Number)');
    console.log('   Just click the button and enter the password!\n');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
