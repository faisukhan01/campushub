import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTestUsers() {
  try {
    console.log('🔍 Checking test users...\n');

    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['institute@example.com', 'branch@example.com', 'teacher@example.com', 'student@example.com']
        }
      },
      select: {
        email: true,
        name: true,
        role: true,
        employeeId: true,
        rollNumber: true,
        isActive: true
      }
    });

    if (users.length === 0) {
      console.log('❌ No test users found!');
      console.log('Run: npm run create:testusers\n');
    } else {
      console.log('✅ Found test users:\n');
      users.forEach(user => {
        const identifier = user.employeeId || user.rollNumber || user.email;
        console.log(`📧 ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Identifier: ${identifier}`);
        console.log(`   Active: ${user.isActive ? '✅' : '❌'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTestUsers();
