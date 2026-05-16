import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ 
  url: process.env.TURSO_DATABASE_URL, 
  authToken: process.env.TURSO_AUTH_TOKEN 
});
const prisma = new PrismaClient({ adapter });

async function check() {
  const branchId = 'cmp1cg1ow0003js048jaeh9w3'; // UNT branch
  
  const students = await prisma.user.findMany({
    where: { role: 'Student', branchId, classLevel: '10' },
    select: { name: true, rollNumber: true, classLevel: true, email: true }
  });
  
  console.log('Students in UNT branch, Class 10:');
  console.log(JSON.stringify(students, null, 2));
  
  await prisma.$disconnect();
}

check();
