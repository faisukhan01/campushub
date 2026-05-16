import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';

// Force Turso connection
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error('❌ Turso credentials not found in .env');
  process.exit(1);
}

const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
const prisma = new PrismaClient({ adapter });

async function checkTursoData() {
  try {
    console.log('🔍 Checking Turso Database...\n');
    console.log('📡 Connected to:', tursoUrl);
    console.log('');

    // Check SuperAdmin
    const superAdmin = await prisma.user.findUnique({
      where: { email: 'faisu577277@gmail.com' }
    });

    if (superAdmin) {
      console.log('✅ SuperAdmin found in Turso!');
      console.log('   Email:', superAdmin.email);
      console.log('   Name:', superAdmin.name);
      console.log('   Role:', superAdmin.role);
      console.log('   Active:', superAdmin.isActive);
    } else {
      console.log('⚠️  SuperAdmin NOT found in Turso database');
      console.log('   Creating SuperAdmin...\n');
      
      const passwordHash = await bcrypt.hash('QaReLc_61y8', 10);
      await prisma.user.create({
        data: {
          email: 'faisu577277@gmail.com',
          passwordHash,
          name: 'Super Administrator',
          role: 'SuperAdmin',
          isActive: true,
        },
      });
      
      console.log('✅ SuperAdmin created in Turso!');
    }

    console.log('');
    console.log('📊 Database Summary:');
    console.log('═══════════════════════════════════════');
    
    const totalUsers = await prisma.user.count();
    const students = await prisma.user.count({ where: { role: 'Student' } });
    const teachers = await prisma.user.count({ where: { role: 'Teacher' } });
    const branchAdmins = await prisma.user.count({ where: { role: 'BranchAdmin' } });
    const instituteAdmins = await prisma.user.count({ where: { role: 'InstituteAdmin' } });
    const superAdmins = await prisma.user.count({ where: { role: 'SuperAdmin' } });
    
    const institutes = await prisma.institute.count();
    const branches = await prisma.branch.count();
    const courses = await prisma.course.count();
    const enrollments = await prisma.enrollment.count();
    
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   - SuperAdmins: ${superAdmins}`);
    console.log(`   - Institute Admins: ${instituteAdmins}`);
    console.log(`   - Branch Admins: ${branchAdmins}`);
    console.log(`   - Teachers: ${teachers}`);
    console.log(`   - Students: ${students}`);
    console.log('');
    console.log(`   Institutes: ${institutes}`);
    console.log(`   Branches: ${branches}`);
    console.log(`   Courses: ${courses}`);
    console.log(`   Enrollments: ${enrollments}`);
    console.log('═══════════════════════════════════════\n');

    if (totalUsers === 0) {
      console.log('⚠️  Database is empty! This is a fresh Turso database.');
      console.log('   You can now add your data through the application.\n');
    }

    console.log('✅ All data is now stored in Turso database');
    console.log('✅ Ready for Vercel deployment\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkTursoData();
