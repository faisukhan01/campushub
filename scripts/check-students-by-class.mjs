import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
const prisma = new PrismaClient({ adapter });

async function checkStudents() {
  try {
    console.log('📚 Checking Students in Turso Database...\n');

    const allStudents = await prisma.user.findMany({
      where: { role: 'Student' },
      select: {
        id: true,
        name: true,
        email: true,
        rollNumber: true,
        classLevel: true,
        isActive: true,
        branchId: true,
      },
      orderBy: { classLevel: 'asc' }
    });

    console.log(`Total Students: ${allStudents.length}\n`);

    if (allStudents.length === 0) {
      console.log('⚠️  No students found in database.\n');
      return;
    }

    // Group by class
    const byClass = {};
    allStudents.forEach(student => {
      const classKey = student.classLevel || 'No Class';
      if (!byClass[classKey]) {
        byClass[classKey] = [];
      }
      byClass[classKey].push(student);
    });

    console.log('Students by Class:');
    console.log('═'.repeat(80));

    Object.keys(byClass).sort().forEach(classLevel => {
      console.log(`\n📖 ${classLevel}: ${byClass[classLevel].length} student(s)`);
      byClass[classLevel].forEach(s => {
        console.log(`   - ${s.name} (Roll: ${s.rollNumber}) - Active: ${s.isActive}`);
        console.log(`     Email: ${s.email}`);
      });
    });

    console.log('\n' + '═'.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudents();
