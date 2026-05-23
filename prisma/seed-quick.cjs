// Quick seed — run with: node prisma/seed-quick.cjs
'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');

async function hash(pw) { return bcrypt.hash(pw, 10); }

async function main() {
  // Dynamic imports for ESM-only packages
  const { createClient } = await import('@libsql/client');
  const { PrismaLibSql } = await import('@prisma/adapter-libsql');
  const { PrismaClient } = await import('@prisma/client');

  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const adapter = new PrismaLibSql(libsql);
  const db = new PrismaClient({ adapter });

  console.log('🌱 Seeding Turso database…\n');
  console.log('  DB URL:', process.env.TURSO_DATABASE_URL?.slice(0, 50) ?? 'UNDEFINED');
  console.log('  Token:', process.env.TURSO_AUTH_TOKEN ? 'SET' : 'UNDEFINED');

  // ── SuperAdmin ──────────────────────────────────────────────────────
  const saEmail = 'admin@campushub.pk';
  let superAdmin = await db.user.findUnique({ where: { email: saEmail } });
  if (!superAdmin) {
    superAdmin = await db.user.create({
      data: {
        name: 'Super Administrator',
        email: saEmail,
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
        address: '15 Gulberg III, Lahore',
        website: 'https://beaconhouse.edu.pk',
      },
    });
    console.log('✅ Institute: Beacon House School System');
  } else {
    console.log('ℹ️  Institute BHS already exists');
  }

  // InstituteAdmin 1
  let ia1 = await db.user.findUnique({ where: { email: 'tariq.bashir@gmail.com' } });
  if (!ia1) {
    ia1 = await db.user.create({
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

  // Branch 1: Main Campus Lahore
  let b1 = await db.branch.findFirst({ where: { code: 'BHS-LHR', instituteId: inst1.id } });
  if (!b1) {
    b1 = await db.branch.create({
      data: {
        name: 'Main Campus — Lahore',
        code: 'BHS-LHR',
        address: '15 Gulberg III, Lahore',
        phone: '+92-42-111-234-568',
        email: 'lahore@beaconhouse.edu.pk',
        instituteId: inst1.id,
      },
    });
    console.log('   ✅ Branch: Main Campus Lahore');
  }
  let ba1 = await db.user.findUnique({ where: { email: 'zara.qureshi@gmail.com' } });
  if (!ba1) {
    ba1 = await db.user.create({
      data: {
        name: 'Zara Qureshi',
        email: 'zara.qureshi@gmail.com',
        passwordHash: await hash('Zara@1234'),
        plainPassword: 'Zara@1234',
        role: 'BranchAdmin',
        instituteId: inst1.id,
        branchId: b1.id,
        isActive: true,
      },
    });
    console.log('   ✅ BranchAdmin: zara.qureshi@gmail.com / Zara@1234');
  }

  // Branch 2: Defence Campus
  let b2 = await db.branch.findFirst({ where: { code: 'BHS-DHA', instituteId: inst1.id } });
  if (!b2) {
    b2 = await db.branch.create({
      data: {
        name: 'Defence Campus — Lahore',
        code: 'BHS-DHA',
        address: 'DHA Phase 5, Lahore',
        phone: '+92-42-111-234-569',
        email: 'dha@beaconhouse.edu.pk',
        instituteId: inst1.id,
      },
    });
    console.log('   ✅ Branch: Defence Campus Lahore');
  }
  let ba2 = await db.user.findUnique({ where: { email: 'ali.raza.ba@gmail.com' } });
  if (!ba2) {
    ba2 = await db.user.create({
      data: {
        name: 'Ali Raza',
        email: 'ali.raza.ba@gmail.com',
        passwordHash: await hash('Ali@1234'),
        plainPassword: 'Ali@1234',
        role: 'BranchAdmin',
        instituteId: inst1.id,
        branchId: b2.id,
        isActive: true,
      },
    });
    console.log('   ✅ BranchAdmin: ali.raza.ba@gmail.com / Ali@1234');
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
        address: 'Clifton, Karachi',
        website: 'https://cgs.edu.pk',
      },
    });
    console.log('\n✅ Institute: City Grammar School');
  } else {
    console.log('\nℹ️  Institute CGS already exists');
  }

  let ia2 = await db.user.findUnique({ where: { email: 'sarah.khan.ia@gmail.com' } });
  if (!ia2) {
    ia2 = await db.user.create({
      data: {
        name: 'Sarah Khan',
        email: 'sarah.khan.ia@gmail.com',
        passwordHash: await hash('Sarah@1234'),
        plainPassword: 'Sarah@1234',
        role: 'InstituteAdmin',
        instituteId: inst2.id,
        isActive: true,
      },
    });
    console.log('   ✅ InstituteAdmin: sarah.khan.ia@gmail.com / Sarah@1234');
  }

  let b3 = await db.branch.findFirst({ where: { code: 'CGS-CLF', instituteId: inst2.id } });
  if (!b3) {
    b3 = await db.branch.create({
      data: {
        name: 'Clifton Campus',
        code: 'CGS-CLF',
        address: 'Block 5, Clifton, Karachi',
        phone: '+92-21-111-345-679',
        email: 'clifton@cgs.edu.pk',
        instituteId: inst2.id,
      },
    });
    console.log('   ✅ Branch: Clifton Campus Karachi');
  }
  let ba3 = await db.user.findUnique({ where: { email: 'omar.sheikh.ba@gmail.com' } });
  if (!ba3) {
    ba3 = await db.user.create({
      data: {
        name: 'Omar Sheikh',
        email: 'omar.sheikh.ba@gmail.com',
        passwordHash: await hash('Omar@1234'),
        plainPassword: 'Omar@1234',
        role: 'BranchAdmin',
        instituteId: inst2.id,
        branchId: b3.id,
        isActive: true,
      },
    });
    console.log('   ✅ BranchAdmin: omar.sheikh.ba@gmail.com / Omar@1234');
  }

  // ── Courses — Branch 1 (BHS Main Campus) ─────────────────────────
  const b1Courses = [
    { code: 'B1-MATH6', title: 'Mathematics', classLevel: '6', subjectType: 'Core' },
    { code: 'B1-ENG6',  title: 'English Language', classLevel: '6', subjectType: 'Core' },
    { code: 'B1-SCI6',  title: 'General Science', classLevel: '6', subjectType: 'Core' },
    { code: 'B1-URD6',  title: 'Urdu', classLevel: '6', subjectType: 'Core' },
    { code: 'B1-MATH7', title: 'Mathematics', classLevel: '7', subjectType: 'Core' },
    { code: 'B1-ENG7',  title: 'English Language', classLevel: '7', subjectType: 'Core' },
    { code: 'B1-MATH8', title: 'Mathematics', classLevel: '8', subjectType: 'Core' },
    { code: 'B1-PHY8',  title: 'Physics', classLevel: '8', subjectType: 'Core' },
    { code: 'B1-MATH9', title: 'Mathematics', classLevel: '9', subjectType: 'Core' },
    { code: 'B1-PHY9',  title: 'Physics', classLevel: '9', subjectType: 'Core' },
    { code: 'B1-CHEM9', title: 'Chemistry', classLevel: '9', subjectType: 'Core' },
    { code: 'B1-CS9',   title: 'Computer Science', classLevel: '9', subjectType: 'Elective' },
    { code: 'B1-BIO10', title: 'Biology', classLevel: '10', subjectType: 'Core' },
    { code: 'B1-PHY10', title: 'Physics', classLevel: '10', subjectType: 'Core' },
    { code: 'B1-ENG10', title: 'English Language', classLevel: '10', subjectType: 'Core' },
  ];

  const createdB1Courses = [];
  for (const c of b1Courses) {
    let course = await db.course.findFirst({ where: { code: c.code, branchId: b1.id } });
    if (!course) {
      course = await db.course.create({ data: { ...c, branchId: b1.id, isActive: true } });
    }
    createdB1Courses.push(course);
  }
  console.log(`\n✅ ${b1Courses.length} courses created for BHS Main Campus`);

  // ── Teachers — Branch 1 ───────────────────────────────────────────
  const b1Teachers = [
    { name: 'Ahmed Khan', empId: 'BHS-T001' },
    { name: 'Fatima Malik', empId: 'BHS-T002' },
    { name: 'Bilal Hassan', empId: 'BHS-T003' },
    { name: 'Ayesha Siddiqui', empId: 'BHS-T004' },
    { name: 'Usman Tariq', empId: 'BHS-T005' },
    { name: 'Nadia Shah', empId: 'BHS-T006' },
  ];

  for (const t of b1Teachers) {
    const exists = await db.user.findFirst({ where: { employeeId: t.empId, branchId: b1.id } });
    if (!exists) {
      await db.user.create({
        data: {
          name: t.name,
          email: `t.${t.empId.toLowerCase().replace(/-/g,'')}@sys.campushub.internal`,
          passwordHash: await hash('Teacher@1234'),
          plainPassword: 'Teacher@1234',
          role: 'Teacher', employeeId: t.empId,
          instituteId: inst1.id, branchId: b1.id, isActive: true,
        },
      });
    }
  }
  console.log(`✅ ${b1Teachers.length} teachers created for BHS Main Campus`);

  // ── Students — Branch 1 ───────────────────────────────────────────
  const studentNames = [
    'Ali Hassan','Sara Ahmed','Hassan Ali','Zainab Khan','Omar Farooq',
    'Amna Khalid','Bilal Sheikh','Hina Nawaz','Kamran Iqbal','Sana Arif',
    'Farhan Butt','Nadia Malik','Asad Javed','Maria Tahir','Usman Raza',
    'Rabia Qureshi','Aqib Hussain','Farah Baig','Saad Mirza','Iqra Nadeem',
    'Talha Cheema','Lubna Waheed','Hamza Saleem','Maira Rehman','Junaid Ahmad',
    'Sobia Riaz','Imran Aslam','Rida Faheem','Mohsin Ali','Huma Tariq',
  ];
  const classDist = ['6','7','8','9','10'];
  const sects = ['A','B'];
  let addedStudents = 0;

  for (let i = 0; i < studentNames.length; i++) {
    const cl = classDist[i % classDist.length];
    const sec = sects[i % sects.length];
    const roll = `BHS${cl}${sec}${String(i+1).padStart(3,'0')}`;
    const exists = await db.user.findFirst({ where: { rollNumber: roll, branchId: b1.id } });
    if (!exists) {
      const student = await db.user.create({
        data: {
          name: studentNames[i],
          email: `s.${roll.toLowerCase()}@sys.campushub.internal`,
          passwordHash: await hash('Student@1234'),
          plainPassword: 'Student@1234',
          role: 'Student', rollNumber: roll,
          classLevel: cl, section: sec,
          instituteId: inst1.id, branchId: b1.id, isActive: true,
        },
      });
      // Enroll in 3 matching courses
      const matching = createdB1Courses.filter(c => c.classLevel === cl).slice(0, 3);
      for (const course of matching) {
        const enrolled = await db.enrollment.findFirst({ where: { studentId: student.id, courseId: course.id } });
        if (!enrolled) {
          await db.enrollment.create({ data: { studentId: student.id, courseId: course.id, status: 'Active' } });
        }
      }
      addedStudents++;
    }
  }
  console.log(`✅ ${addedStudents} students enrolled in BHS Main Campus`);

  // ── Students & Courses — Branch 3 (CGS) ──────────────────────────
  const cgsCourses = [
    { code: 'CGS-MATH9', title: 'Mathematics', classLevel: '9', subjectType: 'Core' },
    { code: 'CGS-ENG9',  title: 'English', classLevel: '9', subjectType: 'Core' },
    { code: 'CGS-PHY10', title: 'Physics', classLevel: '10', subjectType: 'Core' },
    { code: 'CGS-BIO10', title: 'Biology', classLevel: '10', subjectType: 'Core' },
    { code: 'CGS-URD8',  title: 'Urdu', classLevel: '8', subjectType: 'Core' },
    { code: 'CGS-CS9',   title: 'Computer Science', classLevel: '9', subjectType: 'Elective' },
  ];
  const createdCgsCourses = [];
  for (const c of cgsCourses) {
    let course = await db.course.findFirst({ where: { code: c.code, branchId: b3.id } });
    if (!course) course = await db.course.create({ data: { ...c, branchId: b3.id, isActive: true } });
    createdCgsCourses.push(course);
  }

  const cgsNames = [
    'Zara Malik','Faisal Ahmed','Nimra Shah','Waleed Khan','Sadia Iqbal',
    'Taha Farooq','Alishba Baig','Raza Hussain','Dua Tariq','Muneeb Qazi',
    'Yusra Sheikh','Arslan Baig','Hania Awan','Shaheer Mir','Amina Syed',
  ];
  let addedCgs = 0;
  for (let i = 0; i < cgsNames.length; i++) {
    const cl = classDist[i % classDist.length];
    const roll = `CGS${cl}${String(i+1).padStart(3,'0')}`;
    const exists = await db.user.findFirst({ where: { rollNumber: roll, branchId: b3.id } });
    if (!exists) {
      const student = await db.user.create({
        data: {
          name: cgsNames[i],
          email: `s.${roll.toLowerCase()}@sys.campushub.internal`,
          passwordHash: await hash('Student@1234'),
          plainPassword: 'Student@1234',
          role: 'Student', rollNumber: roll,
          classLevel: cl, section: 'A',
          instituteId: inst2.id, branchId: b3.id, isActive: true,
        },
      });
      for (const course of createdCgsCourses.filter(c => c.classLevel === cl).slice(0, 2)) {
        const enrolled = await db.enrollment.findFirst({ where: { studentId: student.id, courseId: course.id } });
        if (!enrolled) await db.enrollment.create({ data: { studentId: student.id, courseId: course.id, status: 'Active' } });
      }
      addedCgs++;
    }
  }
  console.log(`✅ ${addedCgs} students + ${cgsCourses.length} courses seeded for CGS`);

  // Teachers for CGS
  const cgsTeachers = [
    { name: 'Kiran Baig', empId: 'CGS-T001' },
    { name: 'Nabeel Siddiqui', empId: 'CGS-T002' },
    { name: 'Seema Mirza', empId: 'CGS-T003' },
  ];
  for (const t of cgsTeachers) {
    const exists = await db.user.findFirst({ where: { employeeId: t.empId, branchId: b3.id } });
    if (!exists) {
      await db.user.create({
        data: {
          name: t.name,
          email: `t.${t.empId.toLowerCase().replace(/-/g,'')}@sys.campushub.internal`,
          passwordHash: await hash('Teacher@1234'),
          plainPassword: 'Teacher@1234',
          role: 'Teacher', employeeId: t.empId,
          instituteId: inst2.id, branchId: b3.id, isActive: true,
        },
      });
    }
  }
  console.log(`✅ ${cgsTeachers.length} teachers seeded for CGS`);

  // ── Final Summary ─────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Database seeded! Login credentials:\n');
  console.log('  SuperAdmin:       admin@campushub.pk        / Admin@1234');
  console.log('  InstituteAdmin 1: tariq.bashir@gmail.com    / Tariq@1234  (BHS)');
  console.log('  InstituteAdmin 2: sarah.khan.ia@gmail.com   / Sarah@1234  (CGS)');
  console.log('  BranchAdmin 1:    zara.qureshi@gmail.com    / Zara@1234   (BHS-LHR)');
  console.log('  BranchAdmin 2:    ali.raza.ba@gmail.com     / Ali@1234    (BHS-DHA)');
  console.log('  BranchAdmin 3:    omar.sheikh.ba@gmail.com  / Omar@1234   (CGS-CLF)');
  console.log('  Teachers:  use employeeId  + Teacher@1234');
  console.log('  Students:  use rollNumber  + Student@1234');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await db.$disconnect();
}

main().catch(e => { console.error('\n❌ Seed failed:', e.message || e); process.exit(1); });
