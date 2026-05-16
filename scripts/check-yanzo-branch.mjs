import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ 
  url: process.env.TURSO_DATABASE_URL, 
  authToken: process.env.TURSO_AUTH_TOKEN 
});
const prisma = new PrismaClient({ adapter });

async function check() {
  const user = await prisma.user.findUnique({
    where: { email: 'jkhudei99@gmail.com' },
    select: { name: true, email: true, role: true, branchId: true }
  });
  
  console.log('User yanzo:', JSON.stringify(user, null, 2));
  
  if (user?.branchId) {
    const branch = await prisma.branch.findUnique({
      where: { id: user.branchId },
      select: { name: true, code: true }
    });
    console.log('Branch:', JSON.stringify(branch, null, 2));
    
    const studentsInBranch = await prisma.user.count({
      where: { role: 'Student', branchId: user.branchId, classLevel: '10' }
    });
    console.log(`Students in class 10 in this branch: ${studentsInBranch}`);
  }
  
  await prisma.$disconnect();
}

check();
