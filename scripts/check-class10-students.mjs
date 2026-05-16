import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ 
  url: process.env.TURSO_DATABASE_URL, 
  authToken: process.env.TURSO_AUTH_TOKEN 
});
const prisma = new PrismaClient({ adapter });

async function check() {
  const students = await prisma.user.findMany({
    where: { role: 'Student', classLevel: '10' },
    select: { name: true, rollNumber: true, classLevel: true, branchId: true, isActive: true }
  });
  
  console.log('Students in class 10:', JSON.stringify(students, null, 2));
  await prisma.$disconnect();
}

check();
