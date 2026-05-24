// ============================================================
// Campus Management System - Core TypeScript Types
// ============================================================

// -------------------- Enums & Literal Types --------------------

export type UserRole =
  | "SuperAdmin"
  | "InstituteAdmin"
  | "BranchAdmin"
  | "Teacher"
  | "Student";

export type Gender = "Male" | "Female" | "Other";

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";

export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export type SubmissionStatus = "NotSubmitted" | "Submitted" | "Late" | "Graded";

export type FeePaymentStatus =
  | "Pending"
  | "Partial"
  | "Paid"
  | "Overdue"
  | "Refunded";

export type AssignmentType = "Homework" | "Classwork" | "Project" | "Lab" | "Quiz";

export type AssessmentType =
  | "Exam"
  | "Quiz"
  | "Assignment"
  | "Project"
  | "Presentation";

export type NotificationType =
  | "Info"
  | "Warning"
  | "Success"
  | "Error"
  | "Announcement";

export type TicketStatus =
  | "Open"
  | "InProgress"
  | "Resolved"
  | "Closed";

export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export type DocumentStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Expired";

export type MessageType = "Direct" | "Group" | "System";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

// -------------------- Navigation --------------------

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  children?: NavigationItem[];
  roles?: UserRole[];
}

// -------------------- Core Entities --------------------

export interface Institute {
  id: string;
  name: string;
  code: string;
  logo?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  established?: string;
  branchCount: number;
  studentCount: number;
  teacherCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  instituteId: string;
  instituteName: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  principal?: string;
  studentCount: number;
  teacherCount: number;
  departmentCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  branchId: string;
  branchName: string;
  name: string;
  code: string;
  headOfDepartment?: string;
  description?: string;
  teacherCount: number;
  studentCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Program {
  id: string;
  departmentId: string;
  departmentName: string;
  name: string;
  code: string;
  duration: number;
  durationUnit: "Years" | "Months" | "Semesters";
  description?: string;
  totalCredits: number;
  isActive: boolean;
  createdAt: string;
}

export interface AcademicYear {
  id: string;
  branchId: string;
  name: string;
  startDate: string;
  endDate: string;
  currentTerm?: string;
  terms: Term[];
  isActive: boolean;
}

export interface Term {
  id: string;
  academicYearId: string;
  name: string;
  startDate: string;
  endDate: string;
  termNumber: number;
  isActive: boolean;
}

export interface Batch {
  id: string;
  programId: string;
  programName: string;
  branchId: string;
  name: string;
  code: string;
  startYear: number;
  endYear: number;
  currentSemester: number;
  studentCount: number;
  advisorId?: string;
  advisorName?: string;
  isActive: boolean;
  createdAt: string;
}

// -------------------- User --------------------

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  gender?: Gender;
  dateOfBirth?: string;
  address?: string;
  instituteId: string;
  instituteName: string;
  branchId?: string;
  branchName?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  role: "Student";
  rollNumber: string;
  batchId: string;
  batchName: string;
  programId: string;
  programName: string;
  departmentId: string;
  departmentName: string;
  semester: number;
  enrollmentDate: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  parentIds: string[];
}

export interface Teacher extends User {
  role: "Teacher";
  employeeId: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  specialization: string[];
  qualification?: string;
  joinDate: string;
  subjects: string[];
  batchIds: string[];
}

// Parent role has been removed from the system

// -------------------- Course --------------------

export interface Course {
  id: string;
  code: string;
  name: string;
  description?: string;
  departmentId: string;
  departmentName: string;
  teacherId: string;
  teacherName: string;
  programId?: string;
  programName?: string;
  batchId?: string;
  batchName?: string;
  credits: number;
  semester: number;
  totalHours: number;
  syllabus?: string;
  modules: CourseModule[];
  enrolledCount: number;
  maxCapacity?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
  createdAt: string;
}

export interface CourseLesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  contentType: "Video" | "Document" | "Presentation" | "Link" | "Text";
  contentUrl?: string;
  duration?: number;
  order: number;
  isCompleted?: boolean;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  enrolledDate: string;
  status: "Active" | "Dropped" | "Completed";
  grade?: string;
  attendancePercentage?: number;
}

// -------------------- Attendance --------------------

export interface AttendanceSession {
  id: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  teacherId: string;
  teacherName: string;
  date: string;
  startTime?: string;
  endTime?: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
  markedAt: string;
}

// -------------------- Assignments --------------------

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  type: AssignmentType;
  totalMarks: number;
  dueDate: string;
  submissionDate?: string;
  allowLateSubmission: boolean;
  latePenalty?: number;
  attachments?: string[];
  submissionsCount: number;
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  status: SubmissionStatus;
  submittedAt?: string;
  content?: string;
  attachments?: string[];
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  createdAt: string;
}

// -------------------- Assessment & Grades --------------------

export interface Assessment {
  id: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  teacherId: string;
  teacherName: string;
  title: string;
  type: AssessmentType;
  totalMarks: number;
  passingMarks: number;
  weightage: number;
  date: string;
  duration?: number;
  questionsCount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeSpent?: number;
  startedAt: string;
  submittedAt?: string;
  isCompleted: boolean;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  assessmentId?: string;
  assessmentName?: string;
  batchId: string;
  batchName: string;
  semester: number;
  marksObtained: number;
  totalMarks: number;
  gradePoint: number;
  letterGrade: string;
  comments?: string;
  gradedBy: string;
  gradedAt: string;
  termId?: string;
}

// -------------------- Timetable --------------------

export interface TimetableSlot {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  batchId: string;
  batchName: string;
  teacherId: string;
  teacherName: string;
  roomId: string;
  roomName: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  color?: string;
}

// -------------------- Fees --------------------

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  batchId: string;
  batchName: string;
  invoiceNumber: string;
  amount: number;
  discount?: number;
  tax?: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: FeePaymentStatus;
  dueDate: string;
  issuedDate: string;
  description: string;
  payments: FeePayment[];
  createdAt: string;
}

export interface FeePayment {
  id: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  method: "Cash" | "Card" | "Bank Transfer" | "Online" | "UPI";
  transactionId?: string;
  receiptNumber: string;
  paymentDate: string;
  status: "Success" | "Failed" | "Pending";
  remarks?: string;
}

// -------------------- Communication --------------------

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  targetAudience: UserRole[];
  targetBranches?: string[];
  targetBatches?: string[];
  isImportant: boolean;
  attachments?: string[];
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  content: string;
  type: MessageType;
  attachments?: string[];
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: {
    userId: string;
    name: string;
    avatar?: string;
    role: UserRole;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// -------------------- Requests & Tickets --------------------

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  batchId: string;
  batchName: string;
  leaveType: "Sick" | "Personal" | "Family" | "Medical" | "Other";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  attachments?: string[];
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  attachments?: string[];
  assignedTo?: string;
  assignedToName?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface DocumentRequest {
  id: string;
  studentId: string;
  studentName: string;
  documentType:
    | "Transcript"
    | "Degree"
    | "Certificate"
    | "Bonafide"
    | "Migration"
    | "Character"
    | "Other";
  purpose: string;
  status: DocumentStatus;
  requestedDate: string;
  processedDate?: string;
  processedBy?: string;
  remarks?: string;
  fee?: number;
  createdAt: string;
}

// -------------------- Dashboard Stats --------------------

export interface BaseDashboardStats {
  pendingTasks: number;
  upcomingEvents: number;
  notifications: number;
  attendanceRate?: number;
}

export interface SuperAdminDashboardStats extends BaseDashboardStats {
  totalInstitutes: number;
  totalStudents: number;
  totalTeachers: number;
  totalBranches: number;
  revenue?: number;
  monthlyGrowth: number;
  activeUsers: number;
  systemHealth: "Healthy" | "Warning" | "Critical";
  recentActivity: ActivityItem[];
  chartsData: {
    enrollmentTrend: { month: string; count: number }[];
    revenueTrend: { month: string; amount: number }[];
  };
}

export interface InstituteAdminDashboardStats extends BaseDashboardStats {
  totalBranches: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  monthlyRevenue?: number;
  attendanceRate: number;
  feeCollection: { collected: number; pending: number; overdue: number };
  recentActivity: ActivityItem[];
  chartsData: {
    branchComparison: { branch: string; students: number; teachers: number }[];
    enrollmentTrend: { month: string; count: number }[];
  };
}

export interface BranchAdminDashboardStats extends BaseDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalDepartments: number;
  attendanceRate: number;
  feeCollection: { collected: number; pending: number; overdue: number };
  recentActivity: ActivityItem[];
  chartsData: {
    departmentStats: { department: string; students: number; teachers: number }[];
    attendanceTrend: { week: string; rate: number }[];
  };
}

export interface TeacherDashboardStats extends BaseDashboardStats {
  totalStudents: number;
  totalCourses: number;
  todayClasses: number;
  pendingGrading: number;
  attendanceRate: number;
  submissionsToReview: number;
  upcomingClasses: TimetableSlot[];
  recentActivity: ActivityItem[];
  chartsData: {
    courseAttendance: { course: string; rate: number }[];
    submissionsTrend: { week: string; submitted: number; graded: number }[];
  };
}

export interface StudentDashboardStats extends BaseDashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  overallGPA: number;
  attendanceRate: number;
  upcomingAssignments: Assignment[];
  recentGrades: Grade[];
  pendingFees: number;
  attendanceTrend: { week: string; rate: number }[];
}

export interface ParentDashboardStats extends BaseDashboardStats {
  childrenCount: number;
  totalFeesPaid: number;
  pendingFees: number;
  childrenData: {
    childId: string;
    childName: string;
    attendanceRate: number;
    gpa: number;
    pendingAssignments: number;
    recentGrade?: Grade;
  }[];
}

export type DashboardStats =
  | SuperAdminDashboardStats
  | InstituteAdminDashboardStats
  | BranchAdminDashboardStats
  | TeacherDashboardStats
  | StudentDashboardStats
  | ParentDashboardStats;

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  avatar?: string;
  link?: string;
}

// -------------------- API Response Types --------------------

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  code?: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string | string[]>;
}

export interface DashboardQueryParams {
  role: UserRole;
  userId?: string;
  branchId?: string;
  instituteId?: string;
}

export interface CourseQueryParams extends PaginatedQueryParams {
  branchId?: string;
  departmentId?: string;
  batchId?: string;
  teacherId?: string;
  semester?: number;
}

export interface AttendanceQueryParams extends PaginatedQueryParams {
  courseId?: string;
  batchId?: string;
  studentId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AssignmentQueryParams extends PaginatedQueryParams {
  courseId?: string;
  batchId?: string;
  teacherId?: string;
  status?: SubmissionStatus;
}

export interface GradeQueryParams extends PaginatedQueryParams {
  studentId?: string;
  courseId?: string;
  semester?: number;
  batchId?: string;
}

export interface TimetableQueryParams {
  batchId?: string;
  teacherId?: string;
  roomId?: string;
  day?: DayOfWeek;
}

export interface MessageQueryParams extends PaginatedQueryParams {
  conversationId?: string;
  userId?: string;
  isRead?: boolean;
}

export interface FeeQueryParams extends PaginatedQueryParams {
  studentId?: string;
  batchId?: string;
  status?: FeePaymentStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationQueryParams extends PaginatedQueryParams {
  userId?: string;
  isRead?: boolean;
  type?: NotificationType;
}

// -------------------- Misc --------------------

export interface FileUpload {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  type: "Academic" | "Holiday" | "Exam" | "Event" | "Meeting";
  color?: string;
  location?: string;
  createdBy: string;
}

export interface AppTheme {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  accentColor: string;
  borderRadius: "sm" | "md" | "lg";
  sidebarStyle: "expanded" | "collapsed" | "overlay";
}
