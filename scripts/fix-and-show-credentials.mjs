import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function fixAndShowCredentials() {
  try {
    console.log('\n' + '='.repeat(80));
    console.log('🔧 AUTHENTICATION FIX & CREDENTIALS DISPLAY');
    console.log('='.repeat(80) + '\n');

    const defaultPassword = 'Test@123';
    const defaultPasswordHash = await bcrypt.hash(defaultPassword, 12);

    // Get all users
    const allUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ['Student', 'Teacher', 'BranchAdmin', 'InstituteAdmin']
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        employeeId: true,
        rollNumber: true,
        classLevel: true,
        section: true,
        passwordHash: true,
        isActive: true,
        branchId: true,
        instituteId: true
      },
      orderBy: [
        { role: 'asc' },
        { name: 'asc' }
      ]
    });

    console.log(`📊 Found ${allUsers.length} users in database\n`);

    const fixes = [];

    // Process each user
    for (const user of allUsers) {
      const updates = {};
      let needsUpdate = false;

      // Fix missing password
      if (!user.passwordHash) {
        updates.passwordHash = defaultPasswordHash;
        needsUpdate = true;
        fixes.push(`${user.name} (${user.role}) - Added password: ${defaultPassword}`);
      }

      // Fix students
      if (user.role === 'Student') {
        if (!user.rollNumber) {
          const rollNum = user.email.match(/s\.(\w+)\./i)?.[1]?.toUpperCase() || 
                         `S${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
          updates.rollNumber = rollNum;
          needsUpdate = true;
          fixes.push(`${user.name} - Added roll number: ${rollNum}`);
        }
        if (!user.classLevel) {
          updates.classLevel = '1';
          needsUpdate = true;
          fixes.push(`${user.name} - Set class level to 1`);
        }
      }

      // Fix teachers
      if (user.role === 'Teacher') {
        if (!user.employeeId) {
          const empId = user.email.match(/t\.(\w+)\./i)?.[1]?.toUpperCase() || 
                       `T${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
          updates.employeeId = empId;
          needsUpdate = true;
          fixes.push(`${user.name} - Added employee ID: ${empId}`);
        }
      }

      // Apply updates
      if (needsUpdate) {
        await prisma.user.update({
          where: { id: user.id },
          data: updates
        });
      }
    }

    // Get updated users
    const updatedUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ['Student', 'Teacher', 'BranchAdmin', 'InstituteAdmin']
        }
      },
      select: {
        email: true,
        name: true,
        role: true,
        employeeId: true,
        rollNumber: true,
        classLevel: true,
        section: true,
        isActive: true,
        branchId: true
      },
      orderBy: [
        { role: 'asc' },
        { name: 'asc' }
      ]
    });

    // Show fixes applied
    if (fixes.length > 0) {
      console.log('✅ FIXES APPLIED:\n');
      fixes.forEach(fix => console.log(`   ✓ ${fix}`));
      console.log('\n');
    } else {
      console.log('✅ No fixes needed - all users have proper credentials\n');
    }

    // Group users by role
    const usersByRole = {
      InstituteAdmin: [],
      BranchAdmin: [],
      Teacher: [],
      Student: []
    };

    updatedUsers.forEach(user => {
      if (usersByRole[user.role]) {
        usersByRole[user.role].push(user);
      }
    });

    // Display credentials by role
    console.log('='.repeat(80));
    console.log('📋 LOGIN CREDENTIALS FOR ALL USERS');
    console.log('='.repeat(80) + '\n');

    // Institute Admins
    if (usersByRole.InstituteAdmin.length > 0) {
      console.log('🏛️  INSTITUTE ADMINS:\n');
      usersByRole.InstituteAdmin.forEach(user => {
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${defaultPassword}`);
        console.log(`   Active: ${user.isActive ? '✅' : '❌'}`);
        console.log('   ─────────────────────────────────────');
      });
      console.log('');
    }

    // Branch Admins
    if (usersByRole.BranchAdmin.length > 0) {
      console.log('🏢 BRANCH ADMINS:\n');
      usersByRole.BranchAdmin.forEach(user => {
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${defaultPassword}`);
        console.log(`   Active: ${user.isActive ? '✅' : '❌'}`);
        console.log('   ─────────────────────────────────────');
      });
      console.log('');
    }

    // Teachers
    if (usersByRole.Teacher.length > 0) {
      console.log('👨‍🏫 TEACHERS:\n');
      usersByRole.Teacher.forEach(user => {
        console.log(`   Name: ${user.name}`);
        console.log(`   Employee ID: ${user.employeeId}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${defaultPassword}`);
        console.log(`   Active: ${user.isActive ? '✅' : '❌'}`);
        console.log('');
        console.log('   📝 HOW TO SIGN IN:');
        console.log(`      1. Click "Teacher" button on sign-in page`);
        console.log(`      2. Enter Employee ID: ${user.employeeId}`);
        console.log(`      3. Enter Full Name: ${user.name}`);
        console.log(`      4. Enter Password: ${defaultPassword}`);
        console.log('   ─────────────────────────────────────');
      });
      console.log('');
    }

    // Students
    if (usersByRole.Student.length > 0) {
      console.log('👨‍🎓 STUDENTS:\n');
      usersByRole.Student.forEach(user => {
        console.log(`   Name: ${user.name}`);
        console.log(`   Roll Number: ${user.rollNumber}`);
        console.log(`   Class: ${user.classLevel || 'Not Set'}`);
        console.log(`   Section: ${user.section || 'Not Set'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${defaultPassword}`);
        console.log(`   Active: ${user.isActive ? '✅' : '❌'}`);
        console.log('');
        console.log('   📝 HOW TO SIGN IN:');
        console.log(`      1. Click "Student" button on sign-in page`);
        console.log(`      2. Enter Roll Number: ${user.rollNumber}`);
        console.log(`      3. Enter Full Name: ${user.name}`);
        console.log(`      4. Enter Password: ${defaultPassword}`);
        console.log('   ─────────────────────────────────────');
      });
      console.log('');
    }

    console.log('='.repeat(80));
    console.log('⚠️  IMPORTANT NOTES:');
    console.log('='.repeat(80));
    console.log('');
    console.log('1. For TEACHERS and STUDENTS:');
    console.log('   - You MUST enter the FULL NAME exactly as shown above');
    console.log('   - Name matching is case-insensitive but must be exact');
    console.log('   - Example: If name is "John Doe", you must enter "John Doe"');
    console.log('');
    console.log('2. For ADMINS (Institute/Branch):');
    console.log('   - Sign in with EMAIL only (no name required)');
    console.log('');
    console.log('3. Default password for ALL users: Test@123');
    console.log('');
    console.log('4. If you still cannot sign in:');
    console.log('   - Make sure you are entering the EXACT name');
    console.log('   - Check that the user is Active (✅)');
    console.log('   - Try copying and pasting the credentials');
    console.log('');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixAndShowCredentials();
