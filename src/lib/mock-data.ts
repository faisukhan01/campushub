// ============================================================
// Mock Data for School Management System
// ============================================================

export interface SubjectCourse {
  id: string;
  code: string;
  title: string;
  classLevel: string;
  section: string;
  teacherId: string;
  teacherName: string;
  icon: string;
  color: string;
  totalStudents: number;
  upcomingQuiz?: string;
  upcomingTest?: string;
  pendingAssignments: number;
  averageMarks?: number;
  attendanceRate?: number;
}

export interface QuizTest {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: "Quiz" | "Test" | "Exam";
  date: string;
  totalMarks: number;
  duration: number;
  status: "Upcoming" | "Completed" | "In Progress";
  obtainedMarks?: number;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  type: "PDF" | "Video" | "Document" | "Link";
  uploadedAt: string;
  uploadedBy: string;
  size?: string;
  url: string;
}

export interface CourseAnnouncement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  postedAt: string;
  postedBy: string;
  isImportant: boolean;
}

export interface DiaryEntry {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  topic: string;
  homework?: string;
  notes?: string;
}

// School Subjects with Icons and Colors
export const SCHOOL_SUBJECTS = [
  { name: "English", icon: "BookOpen", color: "#3b82f6" },
  { name: "Mathematics", icon: "Calculator", color: "#8b5cf6" },
  { name: "Physics", icon: "Atom", color: "#06b6d4" },
  { name: "Chemistry", icon: "FlaskConical", color: "#10b981" },
  { name: "Biology", icon: "Microscope", color: "#22c55e" },
  { name: "Islamiat", icon: "BookHeart", color: "#14b8a6" },
  { name: "Quran", icon: "Book", color: "#059669" },
  { name: "Pakistan Studies", icon: "Flag", color: "#f59e0b" },
  { name: "Urdu", icon: "Languages", color: "#ec4899" },
  { name: "Computer Science", icon: "Monitor", color: "#6366f1" },
];

// Mock Student Courses
export const mockStudentCourses: SubjectCourse[] = [
  {
    id: "course-001",
    code: "ENG-10A",
    title: "English",
    classLevel: "Class 10",
    section: "A",
    teacherId: "t-001",
    teacherName: "Ms. Sarah Ahmed",
    icon: "BookOpen",
    color: "#3b82f6",
    totalStudents: 35,
    upcomingQuiz: "2026-05-10",
    pendingAssignments: 2,
    averageMarks: 78,
    attendanceRate: 92,
  },
  {
    id: "course-002",
    code: "MATH-10A",
    title: "Mathematics",
    classLevel: "Class 10",
    section: "A",
    teacherId: "t-002",
    teacherName: "Mr. Ahmed Khan",
    icon: "Calculator",
    color: "#8b5cf6",
    totalStudents: 35,
    upcomingTest: "2026-05-15",
    pendingAssignments: 1,
    averageMarks: 85,
    attendanceRate: 95,
  },
  {
    id: "course-003",
    code: "PHY-10A",
    title: "Physics",
    classLevel: "Class 10",
    section: "A",
    teacherId: "t-003",
    teacherName: "Dr. Hassan Ali",
    icon: "Atom",
    color: "#06b6d4",
    totalStudents: 35,
    pendingAssignments: 0,
    averageMarks: 72,
    attendanceRate: 88,
  },
  {
    id: "course-004",
    code: "CHEM-10A",
    title: "Chemistry",
    classLevel: "Class 10",
    section: "A",
    teacherId: "t-004",
    teacherName: "Ms. Fatima Noor",
    icon: "FlaskConical",
    color: "#10b981",
    totalStudents: 35,
    upcomingQuiz: "2026-05-12",
    pendingAssignments: 1,
    averageMarks: 80,
    attendanceRate: 90,
  },
  {
    id: "course-005",
    code: "BIO-10A",
    title: "Biology",
    classLevel: "Class 10",
    section: "A",
    teacherId: "t-005",
    teacherName: "Dr. Ayesha Malik",
    icon: "Microscope",
    color: "#22c55e",
    totalStudents: 35,
    pendingAssignments: 2,
    averageMarks: 76,
    attendanceRate: 93,
  },
  {
    id: "course-006",
    code: "ISL-10A",
    title: "Islamiat",
    classLevel: "Class 10",
    section: "A",
    teacherId: "t-006",
    teacherName: "Maulana Tariq Jameel",
    icon: "BookHeart",
    color: "#14b8a6",
    totalStudents: 35,
    pendingAssignments: 0,
    averageMarks: 88,
    attendanceRate: 96,
  },
  {
    id: "course-007",
    code: "PAK-10A",
    title: "Pakistan Studies",
    classLevel: "Class 10",
    section: "A",
    teacherId: "t-007",
    teacherName: "Mr. Imran Siddiqui",
    icon: "Flag",
    color: "#f59e0b",
    totalStudents: 35,
    upcomingTest: "2026-05-18",
    pendingAssignments: 1,
    averageMarks: 82,
    attendanceRate: 91,
  },
  {
    id: "course-008",
    code: "URD-10A",
    title: "Urdu",
    classLevel: "Class 10",
    section: "A",
    teacherId: "t-008",
    teacherName: "Ms. Zainab Hussain",
    icon: "Languages",
    color: "#ec4899",
    totalStudents: 35,
    pendingAssignments: 1,
    averageMarks: 84,
    attendanceRate: 94,
  },
];

// Mock Teacher Courses (Multiple Sections)
export const mockTeacherCourses: SubjectCourse[] = [
  {
    id: "course-t-001",
    code: "MATH-10A",
    title: "Mathematics",
    classLevel: "Class 10",
    section: "A",
    teacherId: "t-002",
    teacherName: "Mr. Ahmed Khan",
    icon: "Calculator",
    color: "#8b5cf6",
    totalStudents: 35,
    upcomingTest: "2026-05-15",
    pendingAssignments: 12,
    averageMarks: 85,
    attendanceRate: 95,
  },
  {
    id: "course-t-002",
    code: "MATH-10B",
    title: "Mathematics",
    classLevel: "Class 10",
    section: "B",
    teacherId: "t-002",
    teacherName: "Mr. Ahmed Khan",
    icon: "Calculator",
    color: "#8b5cf6",
    totalStudents: 32,
    pendingAssignments: 8,
    averageMarks: 78,
    attendanceRate: 88,
  },
  {
    id: "course-t-003",
    code: "MATH-9A",
    title: "Mathematics",
    classLevel: "Class 9",
    section: "A",
    teacherId: "t-002",
    teacherName: "Mr. Ahmed Khan",
    icon: "Calculator",
    color: "#8b5cf6",
    totalStudents: 38,
    upcomingQuiz: "2026-05-11",
    pendingAssignments: 15,
    averageMarks: 82,
    attendanceRate: 92,
  },
  {
    id: "course-t-004",
    code: "MATH-9B",
    title: "Mathematics",
    classLevel: "Class 9",
    section: "B",
    teacherId: "t-002",
    teacherName: "Mr. Ahmed Khan",
    icon: "Calculator",
    color: "#8b5cf6",
    totalStudents: 36,
    pendingAssignments: 10,
    averageMarks: 75,
    attendanceRate: 86,
  },
];

// Mock Quizzes and Tests
export const mockQuizzesTests: QuizTest[] = [
  {
    id: "qt-001",
    courseId: "course-001",
    courseName: "English",
    title: "Grammar & Comprehension Quiz",
    type: "Quiz",
    date: "2026-05-10",
    totalMarks: 20,
    duration: 30,
    status: "Upcoming",
  },
  {
    id: "qt-002",
    courseId: "course-002",
    courseName: "Mathematics",
    title: "Algebra Chapter Test",
    type: "Test",
    date: "2026-05-15",
    totalMarks: 50,
    duration: 60,
    status: "Upcoming",
  },
  {
    id: "qt-003",
    courseId: "course-004",
    courseName: "Chemistry",
    title: "Chemical Reactions Quiz",
    type: "Quiz",
    date: "2026-05-12",
    totalMarks: 25,
    duration: 40,
    status: "Upcoming",
  },
];

// Mock Course Materials
export const mockCourseMaterials: CourseMaterial[] = [
  {
    id: "mat-001",
    courseId: "course-001",
    title: "Chapter 5: Poetry Analysis",
    type: "PDF",
    uploadedAt: "2026-05-01",
    uploadedBy: "Ms. Sarah Ahmed",
    size: "2.4 MB",
    url: "#",
  },
  {
    id: "mat-002",
    courseId: "course-002",
    title: "Algebra Lecture Video",
    type: "Video",
    uploadedAt: "2026-04-28",
    uploadedBy: "Mr. Ahmed Khan",
    size: "45 MB",
    url: "#",
  },
  {
    id: "mat-003",
    courseId: "course-003",
    title: "Newton's Laws Presentation",
    type: "Document",
    uploadedAt: "2026-04-30",
    uploadedBy: "Dr. Hassan Ali",
    size: "1.8 MB",
    url: "#",
  },
];

// Mock Announcements
export const mockCourseAnnouncements: CourseAnnouncement[] = [
  {
    id: "ann-001",
    courseId: "course-001",
    title: "Assignment Deadline Extended",
    content: "The essay assignment deadline has been extended to May 8th.",
    postedAt: "2026-05-02",
    postedBy: "Ms. Sarah Ahmed",
    isImportant: true,
  },
  {
    id: "ann-002",
    courseId: "course-002",
    title: "Extra Class on Saturday",
    content: "There will be an extra revision class this Saturday at 10 AM.",
    postedAt: "2026-05-01",
    postedBy: "Mr. Ahmed Khan",
    isImportant: false,
  },
];

// Mock Diary Entries
export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: "diary-001",
    courseId: "course-001",
    courseName: "English",
    date: "2026-05-03",
    topic: "Poetry: The Road Not Taken",
    homework: "Write a summary of the poem (200 words)",
    notes: "Discussed themes and literary devices",
  },
  {
    id: "diary-002",
    courseId: "course-002",
    courseName: "Mathematics",
    date: "2026-05-03",
    topic: "Quadratic Equations",
    homework: "Exercise 3.2 - Questions 1-10",
    notes: "Covered factorization method",
  },
  {
    id: "diary-003",
    courseId: "course-003",
    courseName: "Physics",
    date: "2026-05-03",
    topic: "Newton's Third Law",
    homework: "Solve numerical problems from textbook",
    notes: "Demonstrated with practical examples",
  },
];

// Mock Attendance Data
export interface AttendanceStats {
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export const mockStudentAttendance: Record<string, AttendanceStats> = {
  "course-001": { totalClasses: 50, present: 46, absent: 3, late: 1, percentage: 92 },
  "course-002": { totalClasses: 52, present: 49, absent: 2, late: 1, percentage: 95 },
  "course-003": { totalClasses: 48, present: 42, absent: 5, late: 1, percentage: 88 },
  "course-004": { totalClasses: 50, present: 45, absent: 4, late: 1, percentage: 90 },
  "course-005": { totalClasses: 49, present: 46, absent: 2, late: 1, percentage: 93 },
  "course-006": { totalClasses: 51, present: 49, absent: 1, late: 1, percentage: 96 },
  "course-007": { totalClasses: 47, present: 43, absent: 3, late: 1, percentage: 91 },
  "course-008": { totalClasses: 50, present: 47, absent: 2, late: 1, percentage: 94 },
};

// Overall Stats
export const mockOverallAttendance: AttendanceStats = {
  totalClasses: 397,
  present: 367,
  absent: 22,
  late: 8,
  percentage: 92.4,
};

// Mock Students
export const mockStudents = [
  {
    id: "u-student-001",
    name: "Ali Hassan",
    email: "ali.hassan@student.beaconhouse.edu.pk",
    phone: "+92 300 1234567",
    role: "Student",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-03T10:30:00",
  },
  {
    id: "u-student-002",
    name: "Fatima Ahmed",
    email: "fatima.ahmed@student.beaconhouse.edu.pk",
    phone: "+92 301 2345678",
    role: "Student",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-03T09:15:00",
  },
  {
    id: "u-student-003",
    name: "Zainab Malik",
    email: "zainab.malik@student.beaconhouse.edu.pk",
    phone: "+92 302 3456789",
    role: "Student",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-03T08:45:00",
  },
  {
    id: "u-student-004",
    name: "Omar Farooq",
    email: "omar.farooq@student.beaconhouse.edu.pk",
    phone: "+92 303 4567890",
    role: "Student",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-02T14:20:00",
  },
  {
    id: "u-student-005",
    name: "Ayesha Siddiqui",
    email: "ayesha.siddiqui@student.beaconhouse.edu.pk",
    phone: "+92 304 5678901",
    role: "Student",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-03T11:00:00",
  },
  {
    id: "u-student-006",
    name: "Hassan Raza",
    email: "hassan.raza@student.beaconhouse.edu.pk",
    phone: "+92 305 6789012",
    role: "Student",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-03T09:30:00",
  },
  {
    id: "u-student-007",
    name: "Noor Ul Ain",
    email: "noor.ulain@student.beaconhouse.edu.pk",
    phone: "+92 306 7890123",
    role: "Student",
    branchName: "Main Campus — Lahore",
    isActive: false,
    lastLogin: "2026-04-28T10:00:00",
  },
  {
    id: "u-student-008",
    name: "Bilal Khan",
    email: "bilal.khan@student.beaconhouse.edu.pk",
    phone: "+92 307 8901234",
    role: "Student",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-03T08:00:00",
  },
  {
    id: "u-student-009",
    name: "Mariam Zahid",
    email: "mariam.zahid@student.beaconhouse.edu.pk",
    phone: "+92 308 9012345",
    role: "Student",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-03T10:15:00",
  },
  {
    id: "u-student-010",
    name: "Usman Sheikh",
    email: "usman.sheikh@student.beaconhouse.edu.pk",
    phone: "+92 309 0123456",
    role: "Student",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-02T16:45:00",
  },
];

// Mock Teachers
export const mockTeachers = [
  {
    id: "u-teacher-001",
    name: "Mr. Ahmed Khan",
    email: "ahmed.khan@beaconhouse.edu.pk",
    phone: "+92 321 1234567",
    role: "Teacher",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-03T08:00:00",
  },
  {
    id: "u-teacher-002",
    name: "Ms. Sarah Ahmed",
    email: "sarah.ahmed@beaconhouse.edu.pk",
    phone: "+92 322 2345678",
    role: "Teacher",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-03T08:30:00",
  },
];

// Mock Admin Users
export const mockAdminUsers = [
  {
    id: "u-branch-001",
    name: "Zara Qureshi",
    email: "zara.qureshi@beaconhouse.edu.pk",
    phone: "+92 333 1234567",
    role: "BranchAdmin",
    branchName: "Main Campus — Lahore",
    isActive: true,
    lastLogin: "2026-05-03T07:00:00",
  },
  {
    id: "u-inst-001",
    name: "Dr. Tariq Bashir",
    email: "tariq.bashir@beaconhouse.edu.pk",
    phone: "+92 334 2345678",
    role: "InstituteAdmin",
    branchName: "Head Office",
    isActive: true,
    lastLogin: "2026-05-03T06:30:00",
  },
];

// Mock Branches
export const mockBranches = [
  { id: "branch-001", name: "Main Campus — Lahore", code: "BH-LHR-01" },
  { id: "branch-002", name: "DHA Campus — Lahore", code: "BH-LHR-02" },
  { id: "branch-003", name: "Gulberg Campus — Lahore", code: "BH-LHR-03" },
];

// Mock Batches
export const mockBatches = [
  { id: "batch-001", name: "Class 10-A", code: "10A-2026" },
  { id: "batch-002", name: "Class 10-B", code: "10B-2026" },
  { id: "batch-003", name: "Class 9-A", code: "9A-2026" },
];

// Mock Parents (empty array since we removed parent role)
export const mockParents: any[] = [];

// Mock Timetable
export const mockTimetable = [
  {
    id: "tt-001",
    courseId: "course-001",
    courseName: "English",
    courseCode: "ENG-10A",
    day: "Monday",
    startTime: "08:00",
    endTime: "09:00",
    roomName: "Room 201",
    teacherName: "Ms. Sarah Ahmed",
  },
  {
    id: "tt-002",
    courseId: "course-002",
    courseName: "Mathematics",
    courseCode: "MATH-10A",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    roomName: "Room 203",
    teacherName: "Mr. Ahmed Khan",
  },
  {
    id: "tt-003",
    courseId: "course-003",
    courseName: "Physics",
    courseCode: "PHY-10A",
    day: "Monday",
    startTime: "10:00",
    endTime: "11:00",
    roomName: "Room 205",
    teacherName: "Dr. Hassan Ali",
  },
];

// Additional Mock Data for Other Pages

export const mockCourses = mockStudentCourses;

export const mockAssignments = [
  {
    id: "assign-001",
    courseId: "course-001",
    courseName: "English",
    title: "Essay: Impact of Technology",
    dueDate: "2026-05-08",
    totalMarks: 50,
    status: "Pending",
  },
];

export const mockSubmissions: any[] = [];

export const mockAssessments = [
  {
    id: "assess-001",
    courseId: "course-001",
    courseName: "English",
    title: "Grammar Quiz",
    type: "Quiz",
    totalMarks: 20,
    date: "2026-05-10",
  },
];

export const mockGrades: any[] = [];

export const mockEnrollments: any[] = [];

export const mockAttendanceRecords: any[] = [];

export const mockDepartments = [
  { id: "dept-001", name: "Science", code: "SCI", teacherCount: 15, studentCount: 450 },
  { id: "dept-002", name: "Arts", code: "ART", teacherCount: 12, studentCount: 380 },
];

export const mockPrograms: any[] = [];

export const mockFeeInvoices = [
  {
    id: "fee-001",
    studentId: "u-student-001",
    amount: 25000,
    paidAmount: 25000,
    status: "Paid",
    dueDate: "2026-04-30",
  },
];

export const mockDocumentRequests: any[] = [];

export const mockLeaveRequests: any[] = [];

export const mockConversations: any[] = [];

export const mockMessages: any[] = [];

export const mockSupportTickets: any[] = [];

export const mockInstitutes = [
  { id: "inst-001", name: "Beacon House School System", code: "BH", branchCount: 12 },
];

export const mockAnnouncements: any[] = [];

export const mockCalendarEvents: any[] = [];
