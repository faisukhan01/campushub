import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔐 Testing Authentication Flow...\n');

    const testCases = [
      { identifier: 'institute@example.com', password: 'Test@123', name: null, role: 'InstituteAdmin' },
      { identifier: 'branch@example.com', password: 'Test@123', name: null, role: 'BranchAdmin' },
      { identifier: 'T0001', password: 'Test@123', name: 'Test Teacher', role: 'Teacher' },
      { identifier: 'S0001', password: 'Test@123', name: 'Test Student', role: 'Student' },
    ];

    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.identifier} (${testCase.role})`);
      
      // Try to find user by email first
      let user = await prisma.user.findUnique({
        where: { email: testCase.identifier },
      });

      // If not found, try rollNumber
      if (!user) {
        user = await prisma.user.findFirst({
          where: { rollNumber: testCase.identifier, isActive: true },
        });
      }

      // If still not found, try employeeId
      if (!user) {
        user = await prisma.user.findFirst({
          where: { employeeId: testCase.identifier, isActive: true },
        });
      }

      if (!user) {
        console.log(`  ❌ User not found\n`);
        continue;
      }

      console.log(`  ✅ User found: ${user.name}`);
      console.log(`     Email: ${user.email}`);
      console.log(`     Role: ${user.role}`);
      console.log(`     Active: ${user.isActive}`);

      // Check password
      const passwordValid = await bcrypt.compare(testCase.password, user.passwordHash);
      console.log(`     Password: ${passwordValid ? '✅ Valid' : '❌ Invalid'}`);

      // Check name for Teacher/Student
      if ((user.role === 'Teacher' || user.role === 'Student') && testCase.name) {
        const nameMatch = user.name.toLowerCase().trim() === testCase.name.toLowerCase().trim();
        console.log(`     Name Match: ${nameMatch ? '✅ Valid' : '❌ Invalid'} (Expected: "${testCase.name}", Got: "${user.name}")`);
      }

      console.log('');
    }

    console.log('✅ Authentication test completed!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
