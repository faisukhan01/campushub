// Quick seed script for Turso database
// Run with: node prisma/seed-quick.mjs

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { readFileSync } from 'fs';

// Load env manually
const envFile = readFileSync('.env', 'utf-8');
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) {
    const val = vals.join('=').trim().replace(/^"|"$/g, '');
    process.env[key.trim()] = val;
  }
});

const { createClient } = await import('@libsql/client');
const { PrismaLibSql } = await import('@prisma/adapter-libsql');
const { PrismaClient } = await import('@prisma/client');
const bcryptjs = await import('bcryptjs');
const bcrypt = bcryptjs.default;

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const adapter = new PrismaLibSql(libsql);
const db = new PrismaClient({ adapter });

async function hash(pw) { return bcrypt.hash(pw, 10); }

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ── SuperAdmin ──────────────────────────────────────────────────────
  let superAdmin = await db.user.findUnique({ where: { email: 'admin@campushub.pk' } });
  if (!superAdmin) {
    superAdmin = await db.user.create({
      data: {
        name: 'Super Administrator',
        email: 'admin@campushub.pk',
        passwordHash: await hash('Admin@1234'),
        plainPassword: 'Admin@1234',
        role: 'SuperAdmin',
        isActive: true,
      },
    });
    console.log('✅ SuperAdmin created: admin@campushub.pk / Admin@1234');
  } else {
    console.log('ℹ️  SuperAdmin already exists:', superAdmin.email);
  }

  // ── Institute 1: Beacon House ────────────────────────────────────────
  let inst1 = await db.institute.findUnique({ where: { code: 'BHS' } });
  if (!inst1) {
    inst1 = await db.institute.create({
      data: {
        name: 'Beacon House School System',
        code: 'BHS',
        email: 'admin@beaconhouse.edu.pk',
        phone: '+92-42-111-234-567',
        address: '15 Gulberg III, Lahore, Pakistan',
        website: 'https://beaconhouse.edu.pk',
      },
    });
    console.log('✅ Institute 1 created: Beacon House School System');
  }

  // Institute 1 Admin
  let inst1Admin = await db.user.findUnique({ where: { email: 'tariq.bashir@gmail.com' } });
  if (!inst1Admin) {
    inst1Admin = await db.user.create({
      data: {
        name: 'Dr. Tariq Bashir',
        email: 'tariq.bashir@gmail.com',
        passwordHash: await hash('Tariq@1234'),
        plainPassword: 'Tariq@1234',
        role: 'InstituteAdmin',
        instituteId: inst1.id,
        isActive: true,
      },
    });
    console.log('   ✅ InstituteAdmin: tariq.bashir@gmail.com / Tariq@1234');
  }

  // Institute 1 — Branch 1: Main Campus Lahore
  let branch1 = await db.branch.findFirst({ where: { code: 'BHS-LHR', instituteId: inst1.id } });
  if (!branch1) {
    branch1 = await db.branch.create({
      data: {
        name: 'Main Campus — Lahore',
        code: 'BHS-LHR',
        address: '15 Gulberg III, Lahore',
        phone: '+92-42-111-234-568',
        email: 'lahore@beaconhouse.edu.pk',
        instituteId: inst1.id,
      },
    });
    console.log('   ✅ Branch 1: Main Campus Lahore');
  }

  let branch1Admin = await db.user.findUnique({ where: { email: 'zara.qureshi@gmail.com' } });
  if (!branch1Admin) {
    branch1Admin = await db.user.create({
      data: {
        name: 'Zara Qureshi',
        email: 'zara.qureshi@gmail.com',
        passwordHash: await hash('Zara@1234'),
        plainPassword: 'Zara@1234',
        role: 'BranchAdmin',
        instituteId: inst1.id,
        branchId: branch1.id,
        isActive: true,
      },
    });
    console.log('   ✅ BranchAdmin: zara.qureshi@gmail.com / Zara@1234');
  }

  // Institute 1 — Branch 2: Defence Campus Lahore
  let branch2 = await db.branch.findFirst({ where: { code: 'BHS-DHA', instituteId: inst1.id } });
  if (!branch2) {
    branch2 = await db.branch.create({
      data: {
        name: 'Defence Campus — Lahore',
        code: 'BHS-DHA',
        address: 'DHA Phase 5, Lahore',
        phone: '+92-42-111-234-569',
        email: 'dha@beaconhouse.edu.pk',
        instituteId: inst1.id,
      },
    });
    console.log('   ✅ Branch 2: Defence Campus Lahore');
  }

  let branch2Admin = await db.user.findUnique({ where: { email: 'ali.raza.admin@gmail.com' } });
  if (!branch2Admin) {
    branch2Admin = await db.user.create({
      data: {
        name: 'Ali Raza',
        email: 'ali.raza.admin@gmail.com',
        passwordHash: await hash('Ali@1234'),
        plainPassword: 'Ali@1234',
        role: 'BranchAdmin',
        instituteId: inst1.id,
        branchId: branch2.id,
        isActive: true,
      },
    });
    console.log('   ✅ BranchAdmin: ali.raza.admin@gmail.com / Ali@1234');
  }

  // ── Institute 2: City Grammar School ───────────────────────────────
  let inst2 = await db.institute.findUnique({ where: { code: 'CGS' } });
  if (!inst2) {
    inst2 = await db.institute.create({
      data: {
        name: 'City Grammar School',
        code: 'CGS',
        email: 'admin@cgs.edu.pk',
        phone: '+92-21-111-345-678',
        address: 'Clifton, Karachi, Pakistan',
        website: 'https://cgs.edu.pk',
      },
    });
    console.log('\n✅ Institute 2 created: City Grammar School');
  }

  let inst2Admin = await db.user.findUnique({ where: { email: 'sarah.khan@gmail.com' } });
  if (!inst2Admin) {
    inst2Admin = await db.user.create({
      data: {
        name: 'Sarah Khan',
        email: 'sarah.khan@gmail.com',
        passwordHash: await hash('Sarah@1234'),
        plainPassword: 'Sarah@1234',
        role: 'InstituteAdmin',
        instituteId: inst2.id,
        isActive: true,
      },
    });
    console.log('   ✅ InstituteAdmin: sarah.khan@gmail.com / Sarah@1234');
  }

  let branch3 = await db.branch.findFirst({ where: { code: 'CGS-CLF', instituteId: inst2.id } });
  if (!branch3) {
    branch3 = await db.branch.create({
      data: {
        name: 'Clifton Campus',
        code: 'CGS-CLF',
        address: 'Block 5, Clifton, Karachi',
        phone: '+92-21-111-345-679',
        email: 'clifton@cgs.edu.pk',
        instituteId: inst2.id,
      },
    });
    console.log('   ✅ Branch 3: Clifton Campus');
  }

  let branch3Admin = await db.user.findUnique({ where: { email: 'omar.sheikh@gmail.com' } });
  if (!branch3Admin) {
    branch3Admin = await db.user.create({
      data: {
        name: 'Omar Sheikh',
        email: 'omar.sheikh@gmail.com',
        passwordHash: await hash('Omar@1234'),
        plainPassword: 'Omar@1234',
        role: 'BranchAdmin',
        instituteId: inst2.id,
        branchId: branch3.id,
        isActive: true,
      },
    });
    console.log('   ✅ BranchAdmin: omar.sheikh@gmail.com / Omar@1234');
  }

  // ── Teachers for Branch 1 ─────────────────────────────────────────
  const teacherData = [
    { name: 'Ahmed Khan', empId: 'EMP001', classLevel: '9' },
    { name: 'Fatima Malik', empId: 'EMP002', classLevel: '10' },
    { name: 'Bilal Hassan', empId: 'EMP003', classLevel: '8' },
    { name: 'Ayesha Siddiqui', empId: 'EMP004', classLevel: '7' },
    { name: 'Usman Tariq', empId: 'EMP005', classLevel: '6' },
  ];

  for (const t of teacherData) {
    const email = `t.${t.empId.toLowerCase()}.${branch1.id.slice(-6)}@sys.campushub.internal`;
    const exists = await db.user.findFirst({ where: { employeeId: t.empId, branchId: branch1.id } });
    if (!exists) {
      await db.user.create({
        data: {
          name: t.name,
          email,
          passwordHash: await hash('Teacher@1234'),
          plainPassword: 'Teacher@1234',
          role: 'Teacher',
          employeeId: t.empId,
          instituteId: inst1.id,
          branchId: branch1.id,
          isActive: true,
        },
      });
    }
  }
  console.log('\n✅ 5 teachers created for Branch 1');

  // ── Courses for Branch 1 (Classes 6-10) ───────────────────────────
  const courseData = [
    { title: 'Mathematics', code: 'MATH', classLevel: '9', subjectType: 'Core' },
    { title: 'English Language', code: 'ENG', classLevel: '9', subjectType: 'Core' },
    { title: 'Physics', code: 'PHY', classLevel: '10', subjectType: 'Core' },
    { title: 'Chemistry', code: 'CHEM', classLevel: '10', subjectType: 'Core' },
    { title: 'Biology', code: 'BIO', classLevel: '10', subjectType: 'Core' },
    { title: 'Urdu', code: 'URD', classLevel: '8', subjectType: 'Core' },
    { title: 'Islamic Studies', code: 'ISL', classLevel: '8', subjectType: 'Core' },
    { title: 'Computer Science', code: 'CS', classLevel: '9', subjectType: 'Elective' },
    { title: 'Pakistan Studies', code: 'PAK', classLevel: '7', subjectType: 'Core' },
    { title: 'General Science', code: 'SCI', classLevel: '6', subjectType: 'Core' },
  ];

  const createdCourses = [];
  for (const c of courseData) {
    const exists = await db.course.findFirst({ where: { code: c.code, branchId: branch1.id } });
    if (!exists) {
      const course = await db.course.create({
        data: {
          title: c.title,
          code: c.code,
          classLevel: c.classLevel,
          subjectType: c.subjectType,
          branchId: branch1.id,
          isActive: true,
        },
      });
      createdCourses.push(course);
    } else {
      createdCourses.push(exists);
    }
  }
  console.log('✅ 10 courses created for Branch 1');

  // ── Students for Branch 1 ─────────────────────────────────────────
  const studentNames = [
    'Ali Hassan', 'Sara Ahmed', 'Hassan Ali', 'Zainab Khan', 'Omar Farooq',
    'Amna Khalid', 'Bilal Sheikh', 'Hina Nawaz', 'Kamran Iqbal', 'Sana Arif',
    'Farhan Butt', 'Nadia Malik', 'Asad Javed', 'Maria Tahir', 'Usman Raza',
    'Rabia Qureshi', 'Aqib Hussain', 'Farah Baig', 'Saad Mirza', 'Iqra Nadeem',
    'Talha Cheema', 'Lubna Waheed', 'Hamza Saleem', 'Maira Rehman', 'Junaid Ahmad',
  ];
  const classDist = ['6', '7', '8', '9', '10'];
  const sections = ['A', 'B'];

  let studentCount = 0;
  for (let i = 0; i < studentNames.length; i++) {
    const classLevel = classDist[i % classDist.length];
    const section = sections[i % sections.length];
    const rollNum = `${classLevel}${section}${String(i + 1).padStart(3, '0')}`;
    const email = `s.${rollNum.toLowerCase()}.${branch1.id.slice(-6)}@sys.campushub.internal`;
    const exists = await db.user.findFirst({ where: { rollNumber: rollNum, branchId: branch1.id } });
    if (!exists) {
      const student = await db.user.create({
        data: {
          name: studentNames[i],
          email,
          passwordHash: await hash('Student@1234'),
          plainPassword: 'Student@1234',
          role: 'Student',
          rollNumber: rollNum,
          classLevel,
          section,
          instituteId: inst1.id,
          branchId: branch1.id,
          isActive: true,
        },
      });

      // Enroll in matching courses
      const matchingCourses = createdCourses.filter(c => c.classLevel === classLevel);
      for (const course of matchingCourses.slice(0, 3)) {
        const enrollExists = await db.enrollment.findFirst({
          where: { studentId: student.id, courseId: course.id }
        });
        if (!enrollExists) {
          await db.enrollment.create({
            data: { studentId: student.id, courseId: course.id, status: 'Active' },
          });
        }
      }
      studentCount++;
    }
  }
  console.log(`✅ ${studentCount} students created and enrolled for Branch 1`);

  // ── Students for Branch 3 (CGS Clifton) ──────────────────────────
  const cgsStudentNames = [
    'Zara Malik', 'Faisal Ahmed', 'Nimra Shah', 'Waleed Khan', 'Sadia Iqbal',
    'Taha Farooq', 'Alishba Baig', 'Raza Hussain', 'Dua Tariq', 'Muneeb Qazi',
  ];
  // First create courses for branch3
  const cgsCourseData = [
    { title: 'Mathematics', code: 'MATH', classLevel: '9', subjectType: 'Core' },
    { title: 'English', code: 'ENG', classLevel: '9', subjectType: 'Core' },
    { title: 'Physics', code: 'PHY', classLevel: '10', subjectType: 'Core' },
    { title: 'Urdu', code: 'URD', classLevel: '8', subjectType: 'Core' },
  ];
  const cgsCourses = [];
  for (const c of cgsCourseData) {
    const exists = await db.course.findFirst({ where: { code: c.code, branchId: branch3.id } });
    if (!exists) {
      const course = await db.course.create({
        data: { ...c, branchId: branch3.id, isActive: true },
      });
      cgsCourses.push(course);
    } else {
      cgsCourses.push(exists);
    }
  }

  let cgsStudentCount = 0;
  for (let i = 0; i < cgsStudentNames.length; i++) {
    const classLevel = classDist[i % classDist.length];
    const rollNum = `CGS${classLevel}${String(i + 1).padStart(3, '0')}`;
    const email = `s.${rollNum.toLowerCase()}.${branch3.id.slice(-6)}@sys.campushub.internal`;
    const exists = await db.user.findFirst({ where: { rollNumber: rollNum, branchId: branch3.id } });
    if (!exists) {
      const student = await db.user.create({
        data: {
          name: cgsStudentNames[i],
          email,
          passwordHash: await hash('Student@1234'),
          plainPassword: 'Student@1234',
          role: 'Student',
          rollNumber: rollNum,
          classLevel,
          section: 'A',
          instituteId: inst2.id,
          branchId: branch3.id,
          isActive: true,
        },
      });
      // Enroll in 2 courses
      for (const course of cgsCourses.slice(0, 2)) {
        const enrollExists = await db.enrollment.findFirst({ where: { studentId: student.id, courseId: course.id } });
        if (!enrollExists) {
          await db.enrollment.create({ data: { studentId: student.id, courseId: course.id, status: 'Active' } });
        }
      }
      cgsStudentCount++;
    }
  }
  console.log(`✅ ${cgsStudentCount} students seeded for City Grammar School`);

  // ── Teachers for Branch 3 ─────────────────────────────────────────
  const cgsTeachers = [
    { name: 'Kiran Baig', empId: 'CGS001' },
    { name: 'Nabeel Siddiqui', empId: 'CGS002' },
    { name: 'Seema Mirza', empId: 'CGS003' },
  ];
  for (const t of cgsTeachers) {
    const email = `t.${t.empId.toLowerCase()}.${branch3.id.slice(-6)}@sys.campushub.internal`;
    const exists = await db.user.findFirst({ where: { employeeId: t.empId, branchId: branch3.id } });
    if (!exists) {
      await db.user.create({
        data: {
          name: t.name, email,
          passwordHash: await hash('Teacher@1234'),
          plainPassword: 'Teacher@1234',
          role: 'Teacher', employeeId: t.empId,
          instituteId: inst2.id, branchId: branch3.id, isActive: true,
        },
      });
    }
  }
  console.log('✅ 3 teachers seeded for City Grammar School');

  // ── Summary ───────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Seed complete! Login credentials:\n');
  console.log('  SuperAdmin:      admin@campushub.pk       / Admin@1234');
  console.log('  InstituteAdmin1: tariq.bashir@gmail.com   / Tariq@1234');
  console.log('  InstituteAdmin2: sarah.khan@gmail.com     / Sarah@1234');
  console.log('  BranchAdmin1:    zara.qureshi@gmail.com   / Zara@1234');
  console.log('  BranchAdmin2:    ali.raza.admin@gmail.com / Ali@1234');
  console.log('  BranchAdmin3:    omar.sheikh@gmail.com    / Omar@1234');
  console.log('  Teachers/Students use their ID/rollNumber + Teacher@1234 / Student@1234');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(e => { console.error('Seed failed:', e); process.exit(1); }).finally(() => db.$disconnect());
