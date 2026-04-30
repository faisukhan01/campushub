import { db } from "../src/lib/db";

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clean up existing data (in reverse dependency order)
  console.log("🗑️  Cleaning existing data...");
  await db.grade.deleteMany();
  await db.quizAttempt.deleteMany();
  await db.assessmentQuestion.deleteMany();
  await db.assessment.deleteMany();
  await db.assignmentComment.deleteMany();
  await db.submission.deleteMany();
  await db.assignment.deleteMany();
  await db.attendanceRecord.deleteMany();
  await db.attendanceSession.deleteMany();
  await db.timetableSlot.deleteMany();
  await db.enrollment.deleteMany();
  await db.courseTeacher.deleteMany();
  await db.courseLesson.deleteMany();
  await db.courseModule.deleteMany();
  await db.message.deleteMany();
  await db.notification.deleteMany();
  await db.feePayment.deleteMany();
  await db.feeInvoice.deleteMany();
  await db.feeStructure.deleteMany();
  await db.leaveRequest.deleteMany();
  await db.supportTicket.deleteMany();
  await db.documentRequest.deleteMany();
  await db.announcement.deleteMany();
  await db.auditLog.deleteMany();
  await db.subscription.deleteMany();
  await db.user.deleteMany();
  await db.course.deleteMany();
  await db.batch.deleteMany();
  await db.program.deleteMany();
  await db.term.deleteMany();
  await db.academicYear.deleteMany();
  await db.department.deleteMany();
  await db.branch.deleteMany();
  await db.institute.deleteMany();

  // ========================
  // 1. INSTITUTE
  // ========================
  console.log("🏫 Creating institute...");
  const institute = await db.institute.create({
    data: {
      name: "Greenfield University",
      code: "GU",
      primaryColor: "#0f766e",
      website: "https://greenfield.edu.pk",
      email: "info@greenfield.edu.pk",
      phone: "+92-51-1234567",
      address: "123 University Road, Islamabad, Pakistan",
      timezone: "Asia/Karachi",
      dateFormat: "DD/MM/YYYY",
      academicPattern: "Semester",
    },
  });

  // ========================
  // 2. BRANCHES
  // ========================
  console.log("🏢 Creating branches...");
  const branchMain = await db.branch.create({
    data: {
      name: "Main Campus",
      code: "MC",
      address: "123 University Road, Islamabad",
      phone: "+92-51-1234567",
      email: "main@greenfield.edu.pk",
      instituteId: institute.id,
      isActive: true,
    },
  });

  const branchCity = await db.branch.create({
    data: {
      name: "City Campus",
      code: "CC",
      address: "456 Blue Area, Islamabad",
      phone: "+92-51-7654321",
      email: "city@greenfield.edu.pk",
      instituteId: institute.id,
      isActive: true,
    },
  });

  // ========================
  // 3. ACADEMIC YEAR & TERMS
  // ========================
  console.log("📅 Creating academic year and terms...");
  const academicYear = await db.academicYear.create({
    data: {
      name: "2024-2025",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-06-30"),
      instituteId: institute.id,
      isCurrent: true,
    },
  });

  const termFall = await db.term.create({
    data: {
      name: "Fall 2024",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-01-15"),
      academicYearId: academicYear.id,
    },
  });

  const termSpring = await db.term.create({
    data: {
      name: "Spring 2025",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-06-30"),
      academicYearId: academicYear.id,
    },
  });

  // ========================
  // 4. DEPARTMENTS
  // ========================
  console.log("📚 Creating departments...");
  const deptCS = await db.department.create({
    data: {
      name: "Computer Science",
      code: "CS",
      headName: "Dr. Sarah Khan",
      instituteId: institute.id,
    },
  });

  const deptBA = await db.department.create({
    data: {
      name: "Business Administration",
      code: "BA",
      headName: "Dr. Ahmed Malik",
      instituteId: institute.id,
    },
  });

  const deptEE = await db.department.create({
    data: {
      name: "Electrical Engineering",
      code: "EE",
      headName: "Dr. Fatima Noor",
      instituteId: institute.id,
    },
  });

  // ========================
  // 5. PROGRAMS
  // ========================
  console.log("🎓 Creating programs...");
  const progCS = await db.program.create({
    data: {
      name: "BS Computer Science",
      code: "BS-CS",
      type: "Undergraduate",
      creditHours: 130,
      departmentId: deptCS.id,
    },
  });

  const progBBA = await db.program.create({
    data: {
      name: "BBA",
      code: "BBA",
      type: "Undergraduate",
      creditHours: 130,
      departmentId: deptBA.id,
    },
  });

  const progEE = await db.program.create({
    data: {
      name: "BS Electrical Engineering",
      code: "BS-EE",
      type: "Undergraduate",
      creditHours: 136,
      departmentId: deptEE.id,
    },
  });

  // ========================
  // 6. BATCHES
  // ========================
  console.log("👥 Creating batches...");
  const batchCS_Y1 = await db.batch.create({
    data: { name: "Year 1", code: "CS-2024", year: 1, programId: progCS.id, branchId: branchMain.id, advisorName: "Dr. Sarah Khan" },
  });
  const batchCS_Y2 = await db.batch.create({
    data: { name: "Year 2", code: "CS-2023", year: 2, programId: progCS.id, branchId: branchMain.id, advisorName: "Prof. Ali Raza" },
  });
  const batchCS_Y3 = await db.batch.create({
    data: { name: "Year 3", code: "CS-2022", year: 3, programId: progCS.id, branchId: branchMain.id, advisorName: "Dr. Sarah Khan" },
  });
  const batchCS_Y4 = await db.batch.create({
    data: { name: "Year 4", code: "CS-2021", year: 4, programId: progCS.id, branchId: branchMain.id, advisorName: "Prof. Imran Shah" },
  });

  const batchBBA_Y1 = await db.batch.create({
    data: { name: "Year 1", code: "BBA-2024", year: 1, programId: progBBA.id, branchId: branchCity.id, advisorName: "Dr. Ahmed Malik" },
  });
  const batchBBA_Y2 = await db.batch.create({
    data: { name: "Year 2", code: "BBA-2023", year: 2, programId: progBBA.id, branchId: branchCity.id, advisorName: "Prof. Nadia Hussain" },
  });
  const batchBBA_Y3 = await db.batch.create({
    data: { name: "Year 3", code: "BBA-2022", year: 3, programId: progBBA.id, branchId: branchCity.id, advisorName: "Dr. Ahmed Malik" },
  });
  const batchBBA_Y4 = await db.batch.create({
    data: { name: "Year 4", code: "BBA-2021", year: 4, programId: progBBA.id, branchId: branchCity.id, advisorName: "Prof. Tariq Mehmood" },
  });

  const batchEE_Y1 = await db.batch.create({
    data: { name: "Year 1", code: "EE-2024", year: 1, programId: progEE.id, branchId: branchMain.id, advisorName: "Dr. Fatima Noor" },
  });
  const batchEE_Y2 = await db.batch.create({
    data: { name: "Year 2", code: "EE-2023", year: 2, programId: progEE.id, branchId: branchMain.id, advisorName: "Prof. Usman Ali" },
  });
  const batchEE_Y3 = await db.batch.create({
    data: { name: "Year 3", code: "EE-2022", year: 3, programId: progEE.id, branchId: branchMain.id, advisorName: "Dr. Fatima Noor" },
  });
  const batchEE_Y4 = await db.batch.create({
    data: { name: "Year 4", code: "EE-2021", year: 4, programId: progEE.id, branchId: branchMain.id, advisorName: "Prof. Kamran Javed" },
  });

  // ========================
  // 7. USERS
  // ========================
  console.log("👤 Creating users...");

  // Institute Admin
  const userAdmin = await db.user.create({
    data: {
      email: "admin@gu.edu.pk",
      passwordHash: "$2b$10$dummyhashforadmin",
      name: "Zubair Ahmed",
      phone: "+92-300-1234567",
      role: "Institute Admin",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-28T09:30:00"),
    },
  });

  // Branch Admins
  const userBranchAdmin1 = await db.user.create({
    data: {
      email: "main.admin@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Hina Tariq",
      phone: "+92-301-2345678",
      role: "Branch Admin",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-27T14:00:00"),
    },
  });

  const userBranchAdmin2 = await db.user.create({
    data: {
      email: "city.admin@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Farhan Siddiqui",
      phone: "+92-302-3456789",
      role: "Branch Admin",
      instituteId: institute.id,
      branchId: branchCity.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T10:15:00"),
    },
  });

  // Teachers
  const teacher1 = await db.user.create({
    data: {
      email: "sarah.khan@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Dr. Sarah Khan",
      phone: "+92-303-4567890",
      role: "Teacher",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T08:00:00"),
    },
  });

  const teacher2 = await db.user.create({
    data: {
      email: "ali.raza@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Prof. Ali Raza",
      phone: "+92-304-5678901",
      role: "Teacher",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T07:45:00"),
    },
  });

  const teacher3 = await db.user.create({
    data: {
      email: "imran.shah@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Prof. Imran Shah",
      phone: "+92-305-6789012",
      role: "Teacher",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-28T16:00:00"),
    },
  });

  const teacher4 = await db.user.create({
    data: {
      email: "nadia.hussain@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Prof. Nadia Hussain",
      phone: "+92-306-7890123",
      role: "Teacher",
      instituteId: institute.id,
      branchId: branchCity.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T09:00:00"),
    },
  });

  const teacher5 = await db.user.create({
    data: {
      email: "usman.ali@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Prof. Usman Ali",
      phone: "+92-307-8901234",
      role: "Teacher",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T08:30:00"),
    },
  });

  // Students - CS program
  const student1 = await db.user.create({
    data: {
      email: "ahmed.hassan@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Ahmed Hassan",
      phone: "+92-310-1111111",
      role: "Student",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T11:00:00"),
    },
  });

  const student2 = await db.user.create({
    data: {
      email: "zainab.khan@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Zainab Khan",
      phone: "+92-311-2222222",
      role: "Student",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T10:30:00"),
    },
  });

  const student3 = await db.user.create({
    data: {
      email: "muhammad.bilal@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Muhammad Bilal",
      phone: "+92-312-3333333",
      role: "Student",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-28T15:00:00"),
    },
  });

  const student4 = await db.user.create({
    data: {
      email: "aisha.malik@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Aisha Malik",
      phone: "+92-313-4444444",
      role: "Student",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T09:45:00"),
    },
  });

  const student5 = await db.user.create({
    data: {
      email: "hammad.riaz@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Hammad Riaz",
      phone: "+92-314-5555555",
      role: "Student",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-27T12:00:00"),
    },
  });

  // Students - BBA program
  const student6 = await db.user.create({
    data: {
      email: "sara.ahmed@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Sara Ahmed",
      phone: "+92-315-6666666",
      role: "Student",
      instituteId: institute.id,
      branchId: branchCity.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T08:15:00"),
    },
  });

  const student7 = await db.user.create({
    data: {
      email: "omar.farooq@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Omar Farooq",
      phone: "+92-316-7777777",
      role: "Student",
      instituteId: institute.id,
      branchId: branchCity.id,
      isActive: true,
      lastLogin: new Date("2025-04-28T17:00:00"),
    },
  });

  // Students - EE program
  const student8 = await db.user.create({
    data: {
      email: "raza.mahmood@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Raza Mahmood",
      phone: "+92-317-8888888",
      role: "Student",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T07:30:00"),
    },
  });

  const student9 = await db.user.create({
    data: {
      email: "khadija.noor@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Khadija Noor",
      phone: "+92-318-9999999",
      role: "Student",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-29T11:30:00"),
    },
  });

  const student10 = await db.user.create({
    data: {
      email: "talha.waheed@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Talha Waheed",
      phone: "+92-319-0000000",
      role: "Student",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-26T14:00:00"),
    },
  });

  // Parents
  const parent1 = await db.user.create({
    data: {
      email: "hassan.parent@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Hassan Ali (Parent)",
      phone: "+92-321-1000001",
      role: "Parent",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-25T10:00:00"),
    },
  });

  const parent2 = await db.user.create({
    data: {
      email: "malik.parent@gu.edu.pk",
      passwordHash: "$2b$10$dummyhash",
      name: "Tariq Malik (Parent)",
      phone: "+92-322-2000002",
      role: "Parent",
      instituteId: institute.id,
      branchId: branchMain.id,
      isActive: true,
      lastLogin: new Date("2025-04-20T09:00:00"),
    },
  });

  // ========================
  // 8. COURSES
  // ========================
  console.log("📖 Creating courses...");

  const courseDS = await db.course.create({
    data: {
      code: "CS-201",
      title: "Data Structures",
      description: "Fundamental data structures including arrays, linked lists, trees, graphs, and hash tables.",
      creditHours: 4,
      syllabus: "Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Hashing",
      branchId: branchMain.id,
      programId: progCS.id,
      batchId: batchCS_Y2.id,
      termId: termSpring.id,
      section: "A",
      isActive: true,
    },
  });

  const courseAlgo = await db.course.create({
    data: {
      code: "CS-301",
      title: "Algorithms",
      description: "Design and analysis of algorithms, complexity theory, and problem-solving techniques.",
      creditHours: 4,
      syllabus: "Sorting, Searching, Dynamic Programming, Greedy, Graph Algorithms",
      branchId: branchMain.id,
      programId: progCS.id,
      batchId: batchCS_Y3.id,
      termId: termSpring.id,
      section: "A",
      isActive: true,
    },
  });

  const courseDBMS = await db.course.create({
    data: {
      code: "CS-202",
      title: "Database Systems",
      description: "Relational database design, SQL, normalization, and transaction management.",
      creditHours: 3,
      syllabus: "ER Model, Relational Algebra, SQL, Normalization, Transactions",
      branchId: branchMain.id,
      programId: progCS.id,
      batchId: batchCS_Y2.id,
      termId: termSpring.id,
      section: "A",
      isActive: true,
    },
  });

  const courseWebDev = await db.course.create({
    data: {
      code: "CS-302",
      title: "Web Development",
      description: "Full-stack web development with modern frameworks and best practices.",
      creditHours: 3,
      syllabus: "HTML/CSS, JavaScript, React, Node.js, Databases, Deployment",
      branchId: branchMain.id,
      programId: progCS.id,
      batchId: batchCS_Y3.id,
      termId: termSpring.id,
      section: "A",
      isActive: true,
    },
  });

  const courseOS = await db.course.create({
    data: {
      code: "CS-303",
      title: "Operating Systems",
      description: "Process management, memory management, file systems, and I/O systems.",
      creditHours: 4,
      syllabus: "Processes, Threads, Memory Management, File Systems, Scheduling",
      branchId: branchMain.id,
      programId: progCS.id,
      batchId: batchCS_Y3.id,
      termId: termSpring.id,
      section: "A",
      isActive: true,
    },
  });

  const courseDigitalLogic = await db.course.create({
    data: {
      code: "EE-201",
      title: "Digital Logic Design",
      description: "Boolean algebra, combinational and sequential logic circuits.",
      creditHours: 4,
      syllabus: "Boolean Algebra, Logic Gates, Combinational Circuits, Sequential Circuits",
      branchId: branchMain.id,
      programId: progEE.id,
      batchId: batchEE_Y2.id,
      termId: termSpring.id,
      section: "A",
      isActive: true,
    },
  });

  const courseMarketing = await db.course.create({
    data: {
      code: "BA-201",
      title: "Marketing",
      description: "Principles of marketing, consumer behavior, and marketing strategies.",
      creditHours: 3,
      syllabus: "Marketing Mix, Consumer Behavior, Market Research, Branding",
      branchId: branchCity.id,
      programId: progBBA.id,
      batchId: batchBBA_Y2.id,
      termId: termSpring.id,
      section: "A",
      isActive: true,
    },
  });

  const courseFinance = await db.course.create({
    data: {
      code: "BA-202",
      title: "Financial Accounting",
      description: "Fundamentals of financial accounting, financial statements, and analysis.",
      creditHours: 3,
      syllabus: "Accounting Principles, Financial Statements, Ratio Analysis, Audit",
      branchId: branchCity.id,
      programId: progBBA.id,
      batchId: batchBBA_Y2.id,
      termId: termSpring.id,
      section: "A",
      isActive: true,
    },
  });

  // ========================
  // 9. COURSE TEACHERS
  // ========================
  console.log("👨‍🏫 Assigning teachers to courses...");

  await db.courseTeacher.createMany({
    data: [
      { courseId: courseDS.id, teacherId: teacher1.id, isPrimary: true },
      { courseId: courseDBMS.id, teacherId: teacher1.id, isPrimary: true },
      { courseId: courseAlgo.id, teacherId: teacher2.id, isPrimary: true },
      { courseId: courseOS.id, teacherId: teacher2.id, isPrimary: true },
      { courseId: courseWebDev.id, teacherId: teacher3.id, isPrimary: true },
      { courseId: courseDigitalLogic.id, teacherId: teacher5.id, isPrimary: true },
      { courseId: courseMarketing.id, teacherId: teacher4.id, isPrimary: true },
      { courseId: courseFinance.id, teacherId: teacher4.id, isPrimary: true },
    ],
  });

  // ========================
  // 10. ENROLLMENTS
  // ========================
  console.log("📝 Creating enrollments...");

  // CS students enrolled in CS courses
  // Ahmed Hassan (student1) -> DS, DBMS
  const enroll1a = await db.enrollment.create({
    data: { studentId: student1.id, courseId: courseDS.id, batchId: batchCS_Y2.id, status: "Active" },
  });
  const enroll1b = await db.enrollment.create({
    data: { studentId: student1.id, courseId: courseDBMS.id, batchId: batchCS_Y2.id, status: "Active" },
  });

  // Zainab Khan (student2) -> DS, DBMS
  const enroll2a = await db.enrollment.create({
    data: { studentId: student2.id, courseId: courseDS.id, batchId: batchCS_Y2.id, status: "Active" },
  });
  const enroll2b = await db.enrollment.create({
    data: { studentId: student2.id, courseId: courseDBMS.id, batchId: batchCS_Y2.id, status: "Active" },
  });

  // Muhammad Bilal (student3) -> DS, DBMS
  const enroll3a = await db.enrollment.create({
    data: { studentId: student3.id, courseId: courseDS.id, batchId: batchCS_Y2.id, status: "Active" },
  });
  const enroll3b = await db.enrollment.create({
    data: { studentId: student3.id, courseId: courseDBMS.id, batchId: batchCS_Y2.id, status: "Active" },
  });

  // Aisha Malik (student4) -> Algo, WebDev, OS
  const enroll4a = await db.enrollment.create({
    data: { studentId: student4.id, courseId: courseAlgo.id, batchId: batchCS_Y3.id, status: "Active" },
  });
  const enroll4b = await db.enrollment.create({
    data: { studentId: student4.id, courseId: courseWebDev.id, batchId: batchCS_Y3.id, status: "Active" },
  });
  const enroll4c = await db.enrollment.create({
    data: { studentId: student4.id, courseId: courseOS.id, batchId: batchCS_Y3.id, status: "Active" },
  });

  // Hammad Riaz (student5) -> Algo, WebDev, OS
  const enroll5a = await db.enrollment.create({
    data: { studentId: student5.id, courseId: courseAlgo.id, batchId: batchCS_Y3.id, status: "Active" },
  });
  const enroll5b = await db.enrollment.create({
    data: { studentId: student5.id, courseId: courseWebDev.id, batchId: batchCS_Y3.id, status: "Active" },
  });
  const enroll5c = await db.enrollment.create({
    data: { studentId: student5.id, courseId: courseOS.id, batchId: batchCS_Y3.id, status: "Active" },
  });

  // Sara Ahmed (student6) -> Marketing, Finance
  const enroll6a = await db.enrollment.create({
    data: { studentId: student6.id, courseId: courseMarketing.id, batchId: batchBBA_Y2.id, status: "Active" },
  });
  const enroll6b = await db.enrollment.create({
    data: { studentId: student6.id, courseId: courseFinance.id, batchId: batchBBA_Y2.id, status: "Active" },
  });

  // Omar Farooq (student7) -> Marketing, Finance
  const enroll7a = await db.enrollment.create({
    data: { studentId: student7.id, courseId: courseMarketing.id, batchId: batchBBA_Y2.id, status: "Active" },
  });
  const enroll7b = await db.enrollment.create({
    data: { studentId: student7.id, courseId: courseFinance.id, batchId: batchBBA_Y2.id, status: "Active" },
  });

  // Raza Mahmood (student8) -> Digital Logic
  const enroll8a = await db.enrollment.create({
    data: { studentId: student8.id, courseId: courseDigitalLogic.id, batchId: batchEE_Y2.id, status: "Active" },
  });

  // Khadija Noor (student9) -> Digital Logic
  const enroll9a = await db.enrollment.create({
    data: { studentId: student9.id, courseId: courseDigitalLogic.id, batchId: batchEE_Y2.id, status: "Active" },
  });

  // Talha Waheed (student10) -> DS, Algo (cross-batch audit)
  const enroll10a = await db.enrollment.create({
    data: { studentId: student10.id, courseId: courseDS.id, batchId: batchCS_Y2.id, status: "Active" },
  });

  // ========================
  // 11. TIMETABLE SLOTS
  // ========================
  console.log("🕐 Creating timetable slots...");

  await db.timetableSlot.createMany({
    data: [
      // Data Structures - Mon & Wed 9:00-10:30
      { courseId: courseDS.id, dayOfWeek: 1, startTime: "09:00", endTime: "10:30", room: "CS-101" },
      { courseId: courseDS.id, dayOfWeek: 3, startTime: "09:00", endTime: "10:30", room: "CS-101" },
      // Algorithms - Tue & Thu 10:00-11:30
      { courseId: courseAlgo.id, dayOfWeek: 2, startTime: "10:00", endTime: "11:30", room: "CS-202" },
      { courseId: courseAlgo.id, dayOfWeek: 4, startTime: "10:00", endTime: "11:30", room: "CS-202" },
      // Database Systems - Mon & Wed 11:00-12:00
      { courseId: courseDBMS.id, dayOfWeek: 1, startTime: "11:00", endTime: "12:00", room: "CS-103" },
      { courseId: courseDBMS.id, dayOfWeek: 3, startTime: "11:00", endTime: "12:00", room: "CS-103" },
      // Web Development - Tue & Thu 13:00-14:30
      { courseId: courseWebDev.id, dayOfWeek: 2, startTime: "13:00", endTime: "14:30", room: "Lab-1" },
      { courseId: courseWebDev.id, dayOfWeek: 4, startTime: "13:00", endTime: "14:30", room: "Lab-1" },
      // Operating Systems - Mon & Wed 14:00-15:30
      { courseId: courseOS.id, dayOfWeek: 1, startTime: "14:00", endTime: "15:30", room: "CS-301" },
      { courseId: courseOS.id, dayOfWeek: 3, startTime: "14:00", endTime: "15:30", room: "CS-301" },
      // Digital Logic - Tue & Thu 09:00-10:30
      { courseId: courseDigitalLogic.id, dayOfWeek: 2, startTime: "09:00", endTime: "10:30", room: "EE-101" },
      { courseId: courseDigitalLogic.id, dayOfWeek: 4, startTime: "09:00", endTime: "10:30", room: "EE-101" },
      // Marketing - Mon & Wed 10:00-11:00
      { courseId: courseMarketing.id, dayOfWeek: 1, startTime: "10:00", endTime: "11:00", room: "BA-201" },
      { courseId: courseMarketing.id, dayOfWeek: 3, startTime: "10:00", endTime: "11:00", room: "BA-201" },
      // Financial Accounting - Tue & Thu 11:00-12:00
      { courseId: courseFinance.id, dayOfWeek: 2, startTime: "11:00", endTime: "12:00", room: "BA-202" },
      { courseId: courseFinance.id, dayOfWeek: 4, startTime: "11:00", endTime: "12:00", room: "BA-202" },
    ],
  });

  // ========================
  // 12. ATTENDANCE SESSIONS & RECORDS
  // ========================
  console.log("📊 Creating attendance sessions and records...");

  const allStudents = [student1, student2, student3, student4, student5, student6, student7, student8, student9, student10];

  // Helper to pick students for a course
  function studentsForCourse(courseId: string): typeof allStudents {
    const map: Record<string, string[]> = {
      [courseDS.id]: [student1.id, student2.id, student3.id, student10.id],
      [courseDBMS.id]: [student1.id, student2.id, student3.id],
      [courseAlgo.id]: [student4.id, student5.id],
      [courseWebDev.id]: [student4.id, student5.id],
      [courseOS.id]: [student4.id, student5.id],
      [courseDigitalLogic.id]: [student8.id, student9.id],
      [courseMarketing.id]: [student6.id, student7.id],
      [courseFinance.id]: [student6.id, student7.id],
    };
    return allStudents.filter((s) => map[courseId]?.includes(s.id));
  }

  // Create attendance for past 2 weeks (April 14-25, 2025)
  const courseTeacherMap: Record<string, string> = {
    [courseDS.id]: teacher1.id,
    [courseDBMS.id]: teacher1.id,
    [courseAlgo.id]: teacher2.id,
    [courseWebDev.id]: teacher3.id,
    [courseOS.id]: teacher2.id,
    [courseDigitalLogic.id]: teacher5.id,
    [courseMarketing.id]: teacher4.id,
    [courseFinance.id]: teacher4.id,
  };

  const courseDayMap: Record<string, number[]> = {
    [courseDS.id]: [1, 3],          // Mon, Wed
    [courseDBMS.id]: [1, 3],        // Mon, Wed
    [courseAlgo.id]: [2, 4],        // Tue, Thu
    [courseWebDev.id]: [2, 4],      // Tue, Thu
    [courseOS.id]: [1, 3],          // Mon, Wed
    [courseDigitalLogic.id]: [2, 4], // Tue, Thu
    [courseMarketing.id]: [1, 3],    // Mon, Wed
    [courseFinance.id]: [2, 4],      // Tue, Thu
  };

  const statuses = ["Present", "Present", "Present", "Present", "Absent", "Late", "Excused"];

  // Generate sessions for each day in past 2 weeks
  for (const [courseId, days] of Object.entries(courseDayMap)) {
    const teacherId = courseTeacherMap[courseId];
    const students = studentsForCourse(courseId);

    for (let weekOffset = 2; weekOffset >= 1; weekOffset--) {
      for (const day of days) {
        // Calculate date: Monday of that week
        const baseDate = new Date("2025-04-14"); // Monday April 14
        const sessionDate = new Date(baseDate);
        sessionDate.setDate(baseDate.getDate() + (day - 1) + (weekOffset - 1) * 7);

        const session = await db.attendanceSession.create({
          data: {
            courseId,
            date: sessionDate,
            markedBy: teacherId,
          },
        });

        // Create records for each student
        for (const student of students) {
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          await db.attendanceRecord.create({
            data: {
              sessionId: session.id,
              studentId: student.id,
              status,
              comment: status === "Absent" ? "No prior notification" : status === "Late" ? "Arrived 15 minutes late" : undefined,
            },
          });
        }
      }
    }
  }

  // ========================
  // 13. ASSIGNMENTS
  // ========================
  console.log("📋 Creating assignments...");

  const assignment1 = await db.assignment.create({
    data: {
      courseId: courseDS.id,
      title: "Binary Tree Implementation",
      instructions: "Implement a binary search tree with insert, delete, search, and traversal operations in C++.",
      dueDate: new Date("2025-04-10T23:59:00"),
      maxMarks: 100,
      allowedTypes: "pdf,zip,cpp",
      maxSizeKB: 10240,
      maxAttempts: 1,
      allowLate: false,
      isPublished: true,
    },
  });

  const assignment2 = await db.assignment.create({
    data: {
      courseId: courseDS.id,
      title: "Graph Traversal Lab",
      instructions: "Implement BFS and DFS for a given graph. Submit your code and a brief report comparing both approaches.",
      dueDate: new Date("2025-05-01T23:59:00"),
      maxMarks: 50,
      allowedTypes: "pdf,zip",
      maxSizeKB: 10240,
      maxAttempts: 2,
      allowLate: true,
      latePenalty: 10,
      isPublished: true,
    },
  });

  const assignment3 = await db.assignment.create({
    data: {
      courseId: courseAlgo.id,
      title: "Dynamic Programming Problem Set",
      instructions: "Solve 5 DP problems from the given sheet. Submit a well-documented PDF with complexity analysis.",
      dueDate: new Date("2025-04-20T23:59:00"),
      maxMarks: 100,
      allowedTypes: "pdf",
      maxSizeKB: 5120,
      maxAttempts: 1,
      allowLate: false,
      isPublished: true,
    },
  });

  const assignment4 = await db.assignment.create({
    data: {
      courseId: courseWebDev.id,
      title: "E-Commerce Frontend",
      instructions: "Build a responsive e-commerce frontend using React with product listing, cart, and checkout pages.",
      dueDate: new Date("2025-05-15T23:59:00"),
      maxMarks: 150,
      allowedTypes: "zip",
      maxSizeKB: 51200,
      maxAttempts: 1,
      allowLate: true,
      latePenalty: 5,
      isPublished: true,
    },
  });

  const assignment5 = await db.assignment.create({
    data: {
      courseId: courseMarketing.id,
      title: "Marketing Plan for a Startup",
      instructions: "Prepare a comprehensive marketing plan for a tech startup of your choice. Include target market analysis, positioning strategy, and promotional mix.",
      dueDate: new Date("2025-04-25T23:59:00"),
      maxMarks: 100,
      allowedTypes: "pdf,pptx",
      maxSizeKB: 10240,
      maxAttempts: 1,
      allowLate: true,
      latePenalty: 15,
      isPublished: true,
    },
  });

  const assignment6 = await db.assignment.create({
    data: {
      courseId: courseFinance.id,
      title: "Financial Statement Analysis",
      instructions: "Analyze the financial statements of a publicly listed company for the past 3 years. Include ratio analysis and your interpretation.",
      dueDate: new Date("2025-05-10T23:59:00"),
      maxMarks: 80,
      allowedTypes: "pdf,xlsx",
      maxSizeKB: 10240,
      maxAttempts: 1,
      allowLate: false,
      isPublished: true,
    },
  });

  const assignment7 = await db.assignment.create({
    data: {
      courseId: courseOS.id,
      title: "Process Scheduling Simulator",
      instructions: "Implement a process scheduling simulator supporting FCFS, SJF, Round Robin, and Priority scheduling algorithms.",
      dueDate: new Date("2025-05-20T23:59:00"),
      maxMarks: 120,
      allowedTypes: "zip,pdf",
      maxSizeKB: 20480,
      maxAttempts: 2,
      allowLate: true,
      latePenalty: 10,
      isPublished: true,
    },
  });

  // ========================
  // 14. SUBMISSIONS
  // ========================
  console.log("📤 Creating submissions...");

  await db.submission.createMany({
    data: [
      // Assignment 1 (Binary Tree) submissions
      { assignmentId: assignment1.id, studentId: student1.id, fileName: "ahmed_bst.cpp", status: "Submitted", submittedAt: new Date("2025-04-09T18:30:00"), marks: 88, feedback: "Good implementation. Minor issues with delete operation.", gradedAt: new Date("2025-04-14T10:00:00") },
      { assignmentId: assignment1.id, studentId: student2.id, fileName: "zainab_bst.zip", status: "Graded", submittedAt: new Date("2025-04-10T20:00:00"), marks: 95, feedback: "Excellent work! All operations correctly implemented.", gradedAt: new Date("2025-04-14T10:30:00") },
      { assignmentId: assignment1.id, studentId: student3.id, fileName: "bilal_bst.cpp", status: "Graded", submittedAt: new Date("2025-04-10T22:00:00"), marks: 72, feedback: "Basic implementation done. Need to improve error handling.", gradedAt: new Date("2025-04-14T11:00:00") },
      { assignmentId: assignment1.id, studentId: student10.id, fileName: "talha_bst.cpp", status: "Graded", submittedAt: new Date("2025-04-10T23:00:00"), marks: 65, feedback: "Incomplete delete operation. Traversal methods need optimization.", gradedAt: new Date("2025-04-14T11:30:00") },

      // Assignment 3 (DP Problem Set) submissions
      { assignmentId: assignment3.id, studentId: student4.id, fileName: "aisha_dp_solutions.pdf", status: "Graded", submittedAt: new Date("2025-04-19T16:00:00"), marks: 92, feedback: "Outstanding solutions with clear complexity analysis.", gradedAt: new Date("2025-04-22T14:00:00") },
      { assignmentId: assignment3.id, studentId: student5.id, fileName: "hammad_dp_set.pdf", status: "Graded", submittedAt: new Date("2025-04-20T21:00:00"), marks: 78, feedback: "Good effort. Problem 4 solution can be optimized.", gradedAt: new Date("2025-04-22T14:30:00") },

      // Assignment 5 (Marketing Plan) submissions
      { assignmentId: assignment5.id, studentId: student6.id, fileName: "sara_marketing_plan.pdf", status: "Submitted", submittedAt: new Date("2025-04-25T15:00:00"), marks: null, feedback: null },
      { assignmentId: assignment5.id, studentId: student7.id, fileName: "omar_marketing_plan.pptx", status: "Submitted", submittedAt: new Date("2025-04-25T20:00:00"), marks: null, feedback: null },

      // Assignment 2 (Graph Traversal) - some not yet submitted
      { assignmentId: assignment2.id, studentId: student1.id, fileName: "ahmed_graph.zip", status: "Submitted", submittedAt: new Date("2025-04-30T17:00:00"), marks: null, feedback: null },
      { assignmentId: assignment2.id, studentId: student2.id, status: "Not Started" },
      { assignmentId: assignment2.id, studentId: student3.id, status: "In Progress" },
    ],
  });

  // ========================
  // 15. ASSESSMENTS / QUIZZES
  // ========================
  console.log("📝 Creating assessments and quizzes...");

  // Quiz 1: Data Structures - Linked Lists
  const assessment1 = await db.assessment.create({
    data: {
      courseId: courseDS.id,
      title: "Quiz 1: Linked Lists",
      type: "Quiz",
      instructions: "Answer all 5 MCQ questions. Duration: 15 minutes.",
      totalMarks: 5,
      duration: 15,
      startDate: new Date("2025-03-15T09:00:00"),
      endDate: new Date("2025-03-15T09:15:00"),
      isPublished: true,
      showExplanations: true,
    },
  });

  await db.assessmentQuestion.createMany({
    data: [
      { assessmentId: assessment1.id, type: "MCQ", question: "What is the time complexity of inserting at the head of a singly linked list?", options: '["O(1)","O(n)","O(log n)","O(n^2)"]', correctAnswer: "O(1)", marks: 1, explanation: "Inserting at the head only requires updating the head pointer, which is a constant time operation.", order: 0 },
      { assessmentId: assessment1.id, type: "MCQ", question: "Which traversal of a linked list uses recursion?", options: '["Only forward traversal","Only backward traversal","Both forward and backward","Neither"]', correctAnswer: "Both forward and backward", marks: 1, explanation: "Recursive traversal can be used for both directions depending on where the print statement is placed.", order: 1 },
      { assessmentId: assessment1.id, type: "MCQ", question: "A doubly linked list node contains how many pointers?", options: '["1","2","3","4"]', correctAnswer: "2", marks: 1, explanation: "A doubly linked list node has a next pointer and a previous pointer.", order: 2 },
      { assessmentId: assessment1.id, type: "MCQ", question: "What happens when you delete the only node in a linked list?", options: '["Memory leak","Head becomes null","Tail becomes null","Program crashes"]', correctAnswer: "Head becomes null", marks: 1, explanation: "When the only node is deleted, the head pointer should be set to null.", order: 3 },
      { assessmentId: assessment1.id, type: "MCQ", question: "Which data structure is best suited for implementing a browser's back button?", options: '["Queue","Stack","Array","Graph"]', correctAnswer: "Stack", marks: 1, explanation: "A stack follows LIFO principle, perfect for browser back navigation.", order: 4 },
    ],
  });

  // Quiz 2: Algorithms - Sorting
  const assessment2 = await db.assessment.create({
    data: {
      courseId: courseAlgo.id,
      title: "Quiz 2: Sorting Algorithms",
      type: "Quiz",
      instructions: "10 MCQ questions on sorting algorithms. Duration: 20 minutes.",
      totalMarks: 10,
      duration: 20,
      startDate: new Date("2025-04-01T10:00:00"),
      endDate: new Date("2025-04-01T10:20:00"),
      isPublished: true,
      showExplanations: true,
    },
  });

  await db.assessmentQuestion.createMany({
    data: [
      { assessmentId: assessment2.id, type: "MCQ", question: "What is the best-case time complexity of QuickSort?", options: '["O(n^2)","O(n log n)","O(n)","O(log n)"]', correctAnswer: "O(n log n)", marks: 1, explanation: "Best case occurs when pivot divides array into equal halves.", order: 0 },
      { assessmentId: assessment2.id, type: "MCQ", question: "MergeSort uses which algorithmic paradigm?", options: '["Greedy","Dynamic Programming","Divide and Conquer","Backtracking"]', correctAnswer: "Divide and Conquer", marks: 1, explanation: "MergeSort divides the array into halves, sorts them, then merges.", order: 1 },
      { assessmentId: assessment2.id, type: "MCQ", question: "Which sorting algorithm is stable?", options: '["QuickSort","HeapSort","MergeSort","Selection Sort"]', correctAnswer: "MergeSort", marks: 1, explanation: "MergeSort maintains the relative order of equal elements.", order: 2 },
      { assessmentId: assessment2.id, type: "MCQ", question: "What is the worst-case time complexity of BubbleSort?", options: '["O(n)","O(n log n)","O(n^2)","O(n!)"]', correctAnswer: "O(n^2)", marks: 1, explanation: "In the worst case, BubbleSort requires n^2 comparisons.", order: 3 },
      { assessmentId: assessment2.id, type: "MCQ", question: "HeapSort has a space complexity of:", options: '["O(n)","O(log n)","O(1)","O(n log n)"]', correctAnswer: "O(1)", marks: 1, explanation: "HeapSort is an in-place sorting algorithm.", order: 4 },
    ],
  });

  // Mid-term: Database Systems
  const assessment3 = await db.assessment.create({
    data: {
      courseId: courseDBMS.id,
      title: "Mid-Term Exam: Database Systems",
      type: "Exam",
      instructions: "Answer all questions. Show your work for SQL queries. Duration: 90 minutes.",
      totalMarks: 50,
      duration: 90,
      startDate: new Date("2025-04-10T11:00:00"),
      endDate: new Date("2025-04-10T12:30:00"),
      isPublished: true,
      showExplanations: false,
    },
  });

  await db.assessmentQuestion.createMany({
    data: [
      { assessmentId: assessment3.id, type: "MCQ", question: "Which normal form eliminates transitive dependencies?", options: '["1NF","2NF","3NF","BCNF"]', correctAnswer: "3NF", marks: 2, explanation: "3NF requires that non-key attributes are not transitively dependent on the primary key.", order: 0 },
      { assessmentId: assessment3.id, type: "MCQ", question: "SQL stands for:", options: '["Structured Query Language","Simple Query Language","Sequential Query Language","Standard Query Language"]', correctAnswer: "Structured Query Language", marks: 1, explanation: "SQL is the standard language for relational database management.", order: 1 },
      { assessmentId: assessment3.id, type: "MCQ", question: "Which SQL command is used to remove all records from a table without logging?", options: '["DELETE FROM","REMOVE ALL","TRUNCATE TABLE","DROP TABLE"]', correctAnswer: "TRUNCATE TABLE", marks: 2, explanation: "TRUNCATE is faster than DELETE as it doesn't log individual row deletions.", order: 2 },
      { assessmentId: assessment3.id, type: "MCQ", question: "A foreign key references which type of key in another table?", options: '["Candidate key","Super key","Primary key","Composite key"]', correctAnswer: "Primary key", marks: 2, explanation: "A foreign key references the primary key of the referenced table.", order: 3 },
    ],
  });

  // Quiz attempts
  await db.quizAttempt.createMany({
    data: [
      // Assessment 1 attempts
      { assessmentId: assessment1.id, studentId: student1.id, score: 4, totalMarks: 5, startedAt: new Date("2025-03-15T09:00:00"), submittedAt: new Date("2025-03-15T09:10:00"), answers: '{"0":"O(1)","1":"Both forward and backward","2":"2","3":"Head becomes null","4":"Stack"}', status: "Completed" },
      { assessmentId: assessment1.id, studentId: student2.id, score: 5, totalMarks: 5, startedAt: new Date("2025-03-15T09:00:00"), submittedAt: new Date("2025-03-15T09:08:00"), answers: '{"0":"O(1)","1":"Both forward and backward","2":"2","3":"Head becomes null","4":"Stack"}', status: "Completed" },
      { assessmentId: assessment1.id, studentId: student3.id, score: 3, totalMarks: 5, startedAt: new Date("2025-03-15T09:00:00"), submittedAt: new Date("2025-03-15T09:12:00"), answers: '{"0":"O(n)","1":"Only forward traversal","2":"2","3":"Head becomes null","4":"Stack"}', status: "Completed" },
      { assessmentId: assessment1.id, studentId: student10.id, score: 2, totalMarks: 5, startedAt: new Date("2025-03-15T09:00:00"), submittedAt: new Date("2025-03-15T09:14:00"), answers: '{"0":"O(1)","1":"Neither","2":"3","3":"Program crashes","4":"Queue"}', status: "Completed" },

      // Assessment 2 attempts
      { assessmentId: assessment2.id, studentId: student4.id, score: 5, totalMarks: 5, startedAt: new Date("2025-04-01T10:00:00"), submittedAt: new Date("2025-04-01T10:15:00"), answers: '{"0":"O(n log n)","1":"Divide and Conquer","2":"MergeSort","3":"O(n^2)","4":"O(1)"}', status: "Completed" },
      { assessmentId: assessment2.id, studentId: student5.id, score: 3, totalMarks: 5, startedAt: new Date("2025-04-01T10:00:00"), submittedAt: new Date("2025-04-01T10:18:00"), answers: '{"0":"O(n log n)","1":"Dynamic Programming","2":"MergeSort","3":"O(n^2)","4":"O(n)"}', status: "Completed" },

      // Assessment 3 attempts (Mid-term)
      { assessmentId: assessment3.id, studentId: student1.id, score: 6, totalMarks: 7, startedAt: new Date("2025-04-10T11:00:00"), submittedAt: new Date("2025-04-10T12:20:00"), answers: '{"0":"3NF","1":"Structured Query Language","2":"TRUNCATE TABLE","3":"Primary key"}', status: "Completed" },
      { assessmentId: assessment3.id, studentId: student2.id, score: 7, totalMarks: 7, startedAt: new Date("2025-04-10T11:00:00"), submittedAt: new Date("2025-04-10T12:10:00"), answers: '{"0":"3NF","1":"Structured Query Language","2":"TRUNCATE TABLE","3":"Primary key"}', status: "Completed" },
      { assessmentId: assessment3.id, studentId: student3.id, score: 4, totalMarks: 7, startedAt: new Date("2025-04-10T11:00:00"), submittedAt: new Date("2025-04-10T12:25:00"), answers: '{"0":"2NF","1":"Structured Query Language","2":"DELETE FROM","3":"Primary key"}', status: "Completed" },
    ],
  });

  // ========================
  // 16. GRADES
  // ========================
  console.log("🎓 Creating grades...");

  await db.grade.createMany({
    data: [
      // Ahmed Hassan - DS grades
      { enrollmentId: enroll1a.id, courseId: courseDS.id, studentId: student1.id, category: "Quiz", marks: 4, maxMarks: 5, weight: 1.0, gradeLetter: "A", comments: "Quiz 1" },
      { enrollmentId: enroll1a.id, courseId: courseDS.id, studentId: student1.id, assignmentId: assignment1.id, category: "Assignment", marks: 88, maxMarks: 100, weight: 1.0, gradeLetter: "A-", comments: "Binary Tree Implementation" },
      // Ahmed Hassan - DBMS grades
      { enrollmentId: enroll1b.id, courseId: courseDBMS.id, studentId: student1.id, category: "Midterm", marks: 38, maxMarks: 50, weight: 1.0, gradeLetter: "B+", comments: "Mid-Term Exam" },

      // Zainab Khan - DS grades
      { enrollmentId: enroll2a.id, courseId: courseDS.id, studentId: student2.id, category: "Quiz", marks: 5, maxMarks: 5, weight: 1.0, gradeLetter: "A+", comments: "Quiz 1 - Perfect score" },
      { enrollmentId: enroll2a.id, courseId: courseDS.id, studentId: student2.id, assignmentId: assignment1.id, category: "Assignment", marks: 95, maxMarks: 100, weight: 1.0, gradeLetter: "A+", comments: "Binary Tree Implementation" },
      // Zainab Khan - DBMS grades
      { enrollmentId: enroll2b.id, courseId: courseDBMS.id, studentId: student2.id, category: "Midterm", marks: 45, maxMarks: 50, weight: 1.0, gradeLetter: "A", comments: "Mid-Term Exam" },

      // Muhammad Bilal - DS grades
      { enrollmentId: enroll3a.id, courseId: courseDS.id, studentId: student3.id, category: "Quiz", marks: 3, maxMarks: 5, weight: 1.0, gradeLetter: "B", comments: "Quiz 1" },
      { enrollmentId: enroll3a.id, courseId: courseDS.id, studentId: student3.id, assignmentId: assignment1.id, category: "Assignment", marks: 72, maxMarks: 100, weight: 1.0, gradeLetter: "B-", comments: "Binary Tree Implementation" },

      // Aisha Malik - Algo grades
      { enrollmentId: enroll4a.id, courseId: courseAlgo.id, studentId: student4.id, category: "Quiz", marks: 5, maxMarks: 5, weight: 1.0, gradeLetter: "A+", comments: "Quiz 2 - Perfect" },
      { enrollmentId: enroll4a.id, courseId: courseAlgo.id, studentId: student4.id, assignmentId: assignment3.id, category: "Assignment", marks: 92, maxMarks: 100, weight: 1.0, gradeLetter: "A", comments: "DP Problem Set" },

      // Hammad Riaz - Algo grades
      { enrollmentId: enroll5a.id, courseId: courseAlgo.id, studentId: student5.id, category: "Quiz", marks: 3, maxMarks: 5, weight: 1.0, gradeLetter: "B", comments: "Quiz 2" },
      { enrollmentId: enroll5a.id, courseId: courseAlgo.id, studentId: student5.id, assignmentId: assignment3.id, category: "Assignment", marks: 78, maxMarks: 100, weight: 1.0, gradeLetter: "B+", comments: "DP Problem Set" },
    ],
  });

  // ========================
  // 17. FEE STRUCTURES & INVOICES
  // ========================
  console.log("💰 Creating fee structures and invoices...");

  const feeStructureCS = await db.feeStructure.create({
    data: {
      name: "BS Computer Science - Semester Fee",
      type: "Recurring",
      amount: 85000,
      currency: "PKR",
      installments: 2,
      programId: progCS.id,
      branchId: branchMain.id,
      instituteId: institute.id,
      isActive: true,
    },
  });

  const feeStructureBBA = await db.feeStructure.create({
    data: {
      name: "BBA - Semester Fee",
      type: "Recurring",
      amount: 75000,
      currency: "PKR",
      installments: 2,
      programId: progBBA.id,
      branchId: branchCity.id,
      instituteId: institute.id,
      isActive: true,
    },
  });

  const feeStructureEE = await db.feeStructure.create({
    data: {
      name: "BS Electrical Engineering - Semester Fee",
      type: "Recurring",
      amount: 90000,
      currency: "PKR",
      installments: 2,
      programId: progEE.id,
      branchId: branchMain.id,
      instituteId: institute.id,
      isActive: true,
    },
  });

  const feeStructureHostel = await db.feeStructure.create({
    data: {
      name: "Hostel Fee - Per Semester",
      type: "Recurring",
      amount: 40000,
      currency: "PKR",
      installments: 1,
      instituteId: institute.id,
      isActive: true,
    },
  });

  // Create invoices for each student
  const studentsCS = [student1, student2, student3, student4, student5, student10];
  const studentsBBA = [student6, student7];
  const studentsEE = [student8, student9];

  const invoiceData: { studentId: string; structureId: string; amount: number; paid: number; dueDate: Date; status: string; installmentNum: number }[] = [];

  for (const student of studentsCS) {
    // Installment 1
    invoiceData.push({
      studentId: student.id, structureId: feeStructureCS.id,
      amount: 42500, paid: 42500, dueDate: new Date("2025-02-15"), status: "Paid", installmentNum: 1,
    });
    // Installment 2
    invoiceData.push({
      studentId: student.id, structureId: feeStructureCS.id,
      amount: 42500, paid: student.id === student3.id ? 20000 : 0, dueDate: new Date("2025-05-15"), status: student.id === student3.id ? "Partial" : "Pending", installmentNum: 2,
    });
  }

  for (const student of studentsBBA) {
    invoiceData.push({
      studentId: student.id, structureId: feeStructureBBA.id,
      amount: 37500, paid: 37500, dueDate: new Date("2025-02-15"), status: "Paid", installmentNum: 1,
    });
    invoiceData.push({
      studentId: student.id, structureId: feeStructureBBA.id,
      amount: 37500, paid: 0, dueDate: new Date("2025-05-15"), status: "Pending", installmentNum: 2,
    });
  }

  for (const student of studentsEE) {
    invoiceData.push({
      studentId: student.id, structureId: feeStructureEE.id,
      amount: 45000, paid: 45000, dueDate: new Date("2025-02-15"), status: "Paid", installmentNum: 1,
    });
    invoiceData.push({
      studentId: student.id, structureId: feeStructureEE.id,
      amount: 45000, paid: student.id === student9.id ? 45000 : 0, dueDate: new Date("2025-05-15"), status: student.id === student9.id ? "Paid" : "Overdue", installmentNum: 2,
    });
  }

  const createdInvoices = await db.feeInvoice.createMany({ data: invoiceData });

  // Create fee payments for paid invoices
  const paymentData: { invoiceId: string; studentId: string; amount: number; method: string; transactionId: string; status: string; createdAt: Date }[] = [];

  let paymentIdx = 0;
  for (const inv of invoiceData) {
    if (inv.paid > 0) {
      paymentData.push({
        invoiceId: `__placeholder_${paymentIdx++}`,
        studentId: inv.studentId,
        amount: inv.paid,
        method: Math.random() > 0.5 ? "Online" : "Bank Transfer",
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
        status: "Completed",
        createdAt: inv.dueDate < new Date() ? new Date(inv.dueDate.getTime() - 86400000) : new Date(),
      });
    }
  }

  // We need actual invoice IDs for payments. Let's fetch them.
  const invoices = await db.feeInvoice.findMany();
  const paidInvoices = invoices.filter((inv) => inv.status === "Paid" || inv.status === "Partial");

  const feePayments: { invoiceId: string; studentId: string; amount: number; method: string; transactionId: string; status: string; createdAt: Date }[] = [];
  for (const invoice of paidInvoices) {
    feePayments.push({
      invoiceId: invoice.id,
      studentId: invoice.studentId,
      amount: invoice.paid,
      method: Math.random() > 0.5 ? "Online" : "Bank Transfer",
      transactionId: `TXN${Math.floor(Math.random() * 100000000).toString().padStart(8, "0")}`,
      status: "Completed",
      createdAt: new Date(invoice.dueDate.getTime() - 86400000),
    });
  }

  if (feePayments.length > 0) {
    await db.feePayment.createMany({ data: feePayments });
  }

  // ========================
  // 18. ANNOUNCEMENTS
  // ========================
  console.log("📢 Creating announcements...");

  await db.announcement.createMany({
    data: [
      {
        title: "Spring 2025 Mid-Term Exam Schedule",
        content: "The mid-term examination schedule for Spring 2025 has been published. Please check the examination portal for your specific timetable. Exams begin on April 5, 2025. Students must carry their university ID cards to the examination hall.",
        type: "Exam",
        instituteId: institute.id,
        authorId: userAdmin.id,
        isPublished: true,
        branchId: branchMain.id,
      },
      {
        title: "University Sports Day 2025",
        content: "Greenfield University is organizing its annual Sports Day on May 10, 2025 at the Main Campus sports complex. All students are encouraged to participate. Registration forms are available at the student affairs office. Last date to register: April 30, 2025.",
        type: "Event",
        instituteId: institute.id,
        authorId: userAdmin.id,
        isPublished: true,
      },
      {
        title: "Library Extended Hours During Exams",
        content: "The university library will remain open from 7:00 AM to 11:00 PM during the mid-term examination period (April 3 - April 15, 2025) to facilitate student preparation. Silent study areas have been designated on the 2nd floor.",
        type: "General",
        instituteId: institute.id,
        authorId: userBranchAdmin1.id,
        isPublished: true,
        branchId: branchMain.id,
      },
      {
        title: "Data Structures Lab Schedule Change",
        content: "Due to maintenance work in Lab-3, the Data Structures lab sessions for Section A have been moved to Lab-5 effective from April 7, 2025. The timing remains unchanged.",
        type: "Course",
        courseId: courseDS.id,
        instituteId: institute.id,
        authorId: teacher1.id,
        isPublished: true,
        branchId: branchMain.id,
      },
      {
        title: "Fee Payment Deadline Extended",
        content: "The deadline for the second installment of Spring 2025 semester fees has been extended to May 20, 2025. A late fee of PKR 1,000 will be charged for payments received after this date. Please ensure timely payment to avoid penalties.",
        type: "Fee",
        instituteId: institute.id,
        authorId: userAdmin.id,
        isPublished: true,
      },
      {
        title: "Career Fair 2025 - Save the Date!",
        content: "The annual Greenfield University Career Fair will be held on May 25, 2025 at the City Campus. Over 50 companies from tech, finance, and engineering sectors will participate. Bring your resumes and dress professionally. Workshops on interview preparation will be held on May 20.",
        type: "Event",
        instituteId: institute.id,
        authorId: userBranchAdmin2.id,
        isPublished: true,
        branchId: branchCity.id,
      },
    ],
  });

  // ========================
  // 19. NOTIFICATIONS
  // ========================
  console.log("🔔 Creating notifications...");

  await db.notification.createMany({
    data: [
      // Admin notifications
      { userId: userAdmin.id, title: "New Support Ticket", content: "Ahmed Hassan has submitted a support ticket regarding fee payment issues.", category: "Support", type: "InApp", isRead: false },
      { userId: userAdmin.id, title: "Subscription Expiring Soon", content: "Your Premium subscription expires on June 30, 2025. Consider renewing to maintain all features.", category: "System", type: "InApp", isRead: false },
      { userId: userAdmin.id, title: "Weekly Report Ready", content: "The weekly analytics report for April 21-27 is now available in the dashboard.", category: "Analytics", type: "InApp", isRead: true },

      // Teacher notifications
      { userId: teacher1.id, title: "New Submission Received", content: "Ahmed Hassan submitted 'Graph Traversal Lab' assignment.", category: "Assignment", type: "InApp", isRead: true, link: "/courses/assignments" },
      { userId: teacher1.id, title: "Pending Leave Request", content: "Hammad Riaz has submitted a sick leave request for April 28-29.", category: "Attendance", type: "InApp", isRead: false },
      { userId: teacher2.id, title: "Quiz Results Published", content: "Results for 'Quiz 2: Sorting Algorithms' have been published.", category: "Assessment", type: "InApp", isRead: true },
      { userId: teacher4.id, title: "Assignment Deadline Tomorrow", content: "Marketing Plan assignment is due tomorrow. 2 submissions received.", category: "Assignment", type: "InApp", isRead: false },

      // Student notifications
      { userId: student1.id, title: "Assignment Graded", content: "Your 'Binary Tree Implementation' has been graded. Score: 88/100", category: "Assignment", type: "InApp", isRead: true },
      { userId: student1.id, title: "Fee Reminder", content: "Second installment of PKR 42,500 is due by May 15, 2025.", category: "Fee", type: "InApp", isRead: false },
      { userId: student2.id, title: "Quiz Score Available", content: "You scored 5/5 on 'Quiz 1: Linked Lists'. Excellent work!", category: "Assessment", type: "InApp", isRead: true },
      { userId: student2.id, title: "New Announcement", content: "Spring 2025 Mid-Term Exam Schedule has been published.", category: "Announcement", type: "InApp", isRead: true },
      { userId: student4.id, title: "Assignment Graded", content: "Your 'Dynamic Programming Problem Set' has been graded. Score: 92/100", category: "Assignment", type: "InApp", isRead: true },
      { userId: student5.id, title: "Low Attendance Warning", content: "Your attendance in Operating Systems has dropped below 75%. Please attend regularly.", category: "Attendance", type: "InApp", isRead: false },
      { userId: student6.id, title: "Fee Overdue Notice", content: "Your second installment fee is overdue. Please pay immediately to avoid late charges.", category: "Fee", type: "InApp", isRead: false },
      { userId: student9.id, title: "Payment Confirmed", content: "Your fee payment of PKR 45,000 has been confirmed. Receipt available.", category: "Fee", type: "InApp", isRead: true },
      { userId: student10.id, title: "Assignment Due Soon", content: "Graph Traversal Lab is due on May 1. You haven't started yet.", category: "Assignment", type: "InApp", isRead: false },
    ],
  });

  // ========================
  // 20. MESSAGES
  // ========================
  console.log("💬 Creating messages...");

  await db.message.createMany({
    data: [
      // Student-Teacher messages
      { senderId: student1.id, receiverId: teacher1.id, courseId: courseDS.id, content: "Sir, I have a question about the delete operation in BST. Could you explain the successor finding approach?", isRead: true },
      { senderId: teacher1.id, receiverId: student1.id, courseId: courseDS.id, content: "Sure Ahmed. The successor is the smallest node in the right subtree. Start from the right child and keep going left until you reach null. The last non-null node is the successor.", isRead: true },
      { senderId: student1.id, receiverId: teacher1.id, courseId: courseDS.id, content: "Thank you sir! That makes sense now. I'll update my implementation.", isRead: true },

      { senderId: student2.id, receiverId: teacher1.id, courseId: courseDS.id, content: "Ma'am, will there be a lab session this week for graph traversal?", isRead: true },
      { senderId: teacher1.id, receiverId: student2.id, courseId: courseDS.id, content: "Yes Zainab, the lab is scheduled for Wednesday as usual. Please review the BFS/DFS algorithms before coming.", isRead: true },

      { senderId: student4.id, receiverId: teacher3.id, courseId: courseWebDev.id, content: "Sir, can we use Next.js for the e-commerce project or should we stick to plain React?", isRead: true },
      { senderId: teacher3.id, receiverId: student4.id, courseId: courseWebDev.id, content: "You can use Next.js if you're comfortable with it. Make sure to demonstrate routing, state management, and API integration.", isRead: false },

      { senderId: student5.id, receiverId: teacher2.id, courseId: courseOS.id, content: "Sir, I was absent last Monday. Could you share the notes on process scheduling?", isRead: true },
      { senderId: teacher2.id, receiverId: student5.id, courseId: courseOS.id, content: "I've uploaded the lecture slides on the course portal. Also check the textbook chapter 5 for additional reading.", isRead: true },

      { senderId: student6.id, receiverId: teacher4.id, courseId: courseMarketing.id, content: "Ma'am, is it okay if I choose a food delivery startup for the marketing plan?", isRead: true },
      { senderId: teacher4.id, receiverId: student6.id, courseId: courseMarketing.id, content: "That's a great choice Sara. Make sure to include competitor analysis of existing food delivery platforms.", isRead: true },

      // Student-Student messages
      { senderId: student1.id, receiverId: student3.id, content: "Hey Bilal, did you finish the graph traversal assignment? I need help with BFS.", isRead: true },
      { senderId: student3.id, receiverId: student1.id, content: "Yeah mostly done. Let's meet in the library tomorrow at 3 PM, I can explain my approach.", isRead: false },
    ],
  });

  // ========================
  // 21. LEAVE REQUESTS
  // ========================
  console.log("📋 Creating leave requests...");

  await db.leaveRequest.createMany({
    data: [
      {
        userId: student5.id,
        startDate: new Date("2025-04-28"),
        endDate: new Date("2025-04-29"),
        type: "Sick",
        reason: "Suffering from fever and cold. Doctor has advised 2 days rest.",
        status: "Approved",
        approverComment: "Approved. Get well soon. Please catch up on the missed lectures.",
      },
      {
        userId: student3.id,
        startDate: new Date("2025-05-02"),
        endDate: new Date("2025-05-02"),
        type: "Personal",
        reason: "Family function - cousin's wedding ceremony.",
        status: "Pending",
      },
      {
        userId: student7.id,
        startDate: new Date("2025-04-20"),
        endDate: new Date("2025-04-21"),
        type: "Sick",
        reason: "Severe migraine. Need to rest.",
        status: "Rejected",
        approverComment: "Please provide a medical certificate. Request can be reconsidered with proper documentation.",
      },
      {
        userId: student9.id,
        startDate: new Date("2025-04-25"),
        endDate: new Date("2025-04-25"),
        type: "Personal",
        reason: "Attending a scholarship interview at another institution.",
        status: "Approved",
        approverComment: "Approved. Best of luck with the interview!",
      },
      {
        userId: student1.id,
        startDate: new Date("2025-05-05"),
        endDate: new Date("2025-05-06"),
        type: "Family",
        reason: "Traveling out of city for a family emergency.",
        status: "Pending",
      },
    ],
  });

  // ========================
  // 22. SUPPORT TICKETS
  // ========================
  console.log("🎫 Creating support tickets...");

  await db.supportTicket.createMany({
    data: [
      {
        userId: student1.id,
        subject: "Unable to access online fee payment portal",
        description: "I've been trying to pay the second installment for the past 2 days but the payment portal keeps showing an error. The page loads but the payment button doesn't work. I've tried Chrome and Firefox with the same issue.",
        status: "Open",
        priority: "High",
      },
      {
        userId: student6.id,
        subject: "Incorrect course enrollment",
        description: "I am enrolled in BA-202 Financial Accounting but my student portal shows it as BA-301. My schedule and grades are also mixed up. Please fix this at the earliest as the mid-term is approaching.",
        status: "Open",
        priority: "Medium",
      },
      {
        userId: student8.id,
        subject: "Library card not working",
        description: "My library card barcode is not being recognized by the library scanner since last week. The librarian asked me to submit a support ticket.",
        status: "Resolved",
        priority: "Low",
      },
    ],
  });

  // ========================
  // 23. SUBSCRIPTION
  // ========================
  console.log("👑 Creating subscription...");

  await db.subscription.create({
    data: {
      instituteId: institute.id,
      plan: "Premium",
      features: JSON.stringify([
        "Unlimited Users",
        "Advanced Analytics",
        "Custom Branding",
        "API Access",
        "Priority Support",
        "Custom Reports",
        "Mobile App Access",
        "Integration Hub",
      ]),
      maxUsers: 500,
      currentUsers: 22,
      startDate: new Date("2024-07-01"),
      endDate: new Date("2025-06-30"),
      isActive: true,
    },
  });

  // ========================
  // DOCUMENT REQUESTS (Bonus)
  // ========================
  console.log("📄 Creating document requests...");

  await db.documentRequest.createMany({
    data: [
      { userId: student2.id, type: "Bonafide", status: "Approved" },
      { userId: student4.id, type: "Transcript", status: "Pending" },
      { userId: student6.id, type: "Character Certificate", status: "Pending" },
      { userId: student8.id, type: "Fee Challan", status: "Approved" },
    ],
  });

  // ========================
  // COURSE MODULES (Bonus)
  // ========================
  console.log("📚 Creating course modules...");

  const module1DS = await db.courseModule.create({
    data: {
      title: "Introduction to Data Structures",
      description: "Basics of data structures, complexity analysis, and arrays",
      order: 0,
      courseId: courseDS.id,
      isPublished: true,
    },
  });

  const module2DS = await db.courseModule.create({
    data: {
      title: "Linked Lists",
      description: "Singly, doubly, and circular linked lists",
      order: 1,
      courseId: courseDS.id,
      isPublished: true,
    },
  });

  const module3DS = await db.courseModule.create({
    data: {
      title: "Trees",
      description: "Binary trees, BST, AVL trees, and tree traversals",
      order: 2,
      courseId: courseDS.id,
      isPublished: true,
    },
  });

  const module4DS = await db.courseModule.create({
    data: {
      title: "Graphs",
      description: "Graph representations, BFS, DFS, and shortest path algorithms",
      order: 3,
      courseId: courseDS.id,
      isPublished: false,
    },
  });

  // Course lessons
  await db.courseLesson.createMany({
    data: [
      { title: "What are Data Structures?", content: "Data structures are ways to organize and store data efficiently...", moduleId: module1DS.id, order: 0, isPublished: true, duration: 45 },
      { title: "Time and Space Complexity", content: "Big O notation, best/worst/average case analysis...", moduleId: module1DS.id, order: 1, isPublished: true, duration: 60 },
      { title: "Arrays and Strings", content: "Static and dynamic arrays, array operations...", moduleId: module1DS.id, order: 2, isPublished: true, duration: 50 },
      { title: "Singly Linked Lists", content: "Node structure, insertion, deletion, traversal...", moduleId: module2DS.id, order: 0, isPublished: true, duration: 55 },
      { title: "Doubly Linked Lists", content: "Two-way traversal, advantages over singly linked list...", moduleId: module2DS.id, order: 1, isPublished: true, duration: 45 },
      { title: "Binary Trees Basics", content: "Tree terminology, binary tree properties...", moduleId: module3DS.id, order: 0, isPublished: true, duration: 50 },
      { title: "Binary Search Trees", content: "BST operations: insert, delete, search...", moduleId: module3DS.id, order: 1, isPublished: true, duration: 60 },
      { title: "Graph Representations", content: "Adjacency matrix, adjacency list, edge list...", moduleId: module4DS.id, order: 0, isPublished: false, duration: 40 },
    ],
  });

  // ========================
  // ASSIGNMENT COMMENTS (Bonus)
  // ========================
  console.log("💬 Creating assignment comments...");

  await db.assignmentComment.createMany({
    data: [
      { assignmentId: assignment1.id, userId: student1.id, content: "Sir, should we include a menu-driven interface or just implement the functions?" },
      { assignmentId: assignment1.id, userId: teacher1.id, content: "Just implement the functions with proper test cases in main(). No need for a menu." },
      { assignmentId: assignment1.id, userId: student3.id, content: "Can we use STL containers for the implementation?" },
      { assignmentId: assignment1.id, userId: teacher1.id, content: "No, please implement from scratch without using STL." },
      { assignmentId: assignment4.id, userId: student4.id, content: "Sir, is it okay to use Tailwind CSS for styling or should we use plain CSS?" },
      { assignmentId: assignment4.id, userId: teacher3.id, content: "Tailwind CSS is perfectly fine. In fact, I'd encourage it!" },
    ],
  });

  // ========================
  // AUDIT LOGS (Bonus)
  // ========================
  console.log("📝 Creating audit logs...");

  await db.auditLog.createMany({
    data: [
      { userId: userAdmin.id, instituteId: institute.id, action: "CREATE", entity: "Institute", details: "Created Greenfield University institute" },
      { userId: userAdmin.id, instituteId: institute.id, action: "UPDATE", entity: "Subscription", details: "Upgraded subscription to Premium plan" },
      { userId: userBranchAdmin1.id, instituteId: institute.id, action: "CREATE", entity: "Course", details: "Created CS-201 Data Structures course" },
      { userId: userBranchAdmin2.id, instituteId: institute.id, action: "CREATE", entity: "Course", details: "Created BA-201 Marketing course" },
      { userId: teacher1.id, instituteId: institute.id, action: "CREATE", entity: "Assignment", details: "Created Binary Tree Implementation assignment" },
      { userId: teacher2.id, instituteId: institute.id, action: "PUBLISH", entity: "Assessment", details: "Published Quiz 2: Sorting Algorithms" },
    ],
  });

  // ========================
  // SUMMARY
  // ========================
  console.log("\n✅ Seed completed successfully!\n");
  console.log("=== SEED SUMMARY ===");
  console.log(`Institutes:    1`);
  console.log(`Branches:      2`);
  console.log(`Academic Years: 1 (with 2 terms)`);
  console.log(`Departments:   3`);
  console.log(`Programs:      3`);
  console.log(`Batches:       12`);
  console.log(`Users:         22 (1 Admin, 2 Branch Admins, 5 Teachers, 10 Students, 2 Parents)`);
  console.log(`Courses:       8`);
  console.log(`Course Teachers: 8`);
  console.log(`Enrollments:   15`);
  console.log(`Timetable:     16 slots`);
  console.log(`Attendance:    ~64 sessions + ~200 records`);
  console.log(`Assignments:   7`);
  console.log(`Submissions:   12`);
  console.log(`Assessments:   3 (with questions)`);
  console.log(`Quiz Attempts: 10`);
  console.log(`Grades:        13`);
  console.log(`Fee Structures: 4`);
  console.log(`Fee Invoices:  ~24`);
  console.log(`Fee Payments:  ~16`);
  console.log(`Announcements: 6`);
  console.log(`Notifications: 16`);
  console.log(`Messages:      12`);
  console.log(`Leave Requests: 5`);
  console.log(`Support Tickets: 3`);
  console.log(`Subscriptions: 1 (Premium)`);
  console.log(`Doc Requests:  4`);
  console.log(`Course Modules: 4 (with 8 lessons)`);
  console.log(`Assignment Comments: 6`);
  console.log(`Audit Logs:    6`);
  console.log("===================\n");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await db.$disconnect();
    process.exit(1);
  });
