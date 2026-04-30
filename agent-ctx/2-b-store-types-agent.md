# Task 2-b: Store, Types, Mock Data, and API Client

## Agent: store-types-agent

## Work Completed

### 1. `src/types/index.ts` - TypeScript Type Definitions
- **UserRole**: 6 role literals (SuperAdmin, InstituteAdmin, BranchAdmin, Teacher, Student, Parent)
- **Utility types**: Gender, AttendanceStatus, LeaveStatus, SubmissionStatus, FeePaymentStatus, etc.
- **Navigation**: NavigationItem interface with id, label, icon, href, badge, children, roles
- **Core entities**: Institute, Branch, Department, Program, AcademicYear, Term, Batch
- **User entities**: User, Student, Teacher, Parent (all extending User)
- **Course entities**: Course, CourseModule, CourseLesson, Enrollment
- **Attendance**: AttendanceSession, AttendanceRecord
- **Academic**: Assignment, Submission, Assessment, QuizAttempt, Grade
- **Timetable**: TimetableSlot
- **Finance**: FeeInvoice, FeePayment
- **Communication**: Announcement, Notification, Message, Conversation
- **Requests**: LeaveRequest, SupportTicket, DocumentRequest
- **Dashboard**: Role-specific dashboard stats (SuperAdmin, InstituteAdmin, BranchAdmin, Teacher, Student, Parent)
- **API**: ApiResponse, ApiError, Pagination, PaginatedQueryParams, and domain-specific query param types

### 2. `src/store/app-store.ts` - Zustand Store
- **Auth state**: isAuthenticated, currentUser with demo users for each role
- **Navigation**: currentPage, sidebarExpanded, navigationItems (role-based menu config)
- **Theme**: light/dark mode toggle
- **Notifications**: unreadNotificationCount
- **Active context**: activeInstituteId, activeBranchId
- **Actions**: login(role), logout(), setCurrentPage(), toggleSidebar(), setTheme(), toggleTheme(), etc.
- **Selectors**: Exported memoized selectors for common state slices

### 3. `src/lib/mock-data.ts` - Comprehensive Mock Data
- **Organizational**: 3 institutes, 3 branches, 6 departments, 6 programs, 1 academic year, 4 batches
- **Users**: 6 students, 5 teachers, 2 parents, 3 admin users
- **Academic**: 6 courses with modules/lessons, 8 enrollments
- **Attendance**: 4 sessions, 10 records
- **Assignments**: 5 assignments, 6 submissions
- **Assessments**: 4 assessments, 5 quiz attempts, 7 grades
- **Timetable**: 11 slots across the week
- **Finance**: 5 fee invoices with payments
- **Communication**: 5 announcements, 10 notifications, 3 conversations, 10 messages
- **Requests**: 3 leave requests, 3 support tickets, 2 document requests
- **Calendar**: 6 events
- **Dashboard helpers**: getSuperAdminDashboardData(), getInstituteAdminDashboardData(), getBranchAdminDashboardData(), getTeacherDashboardData(), getStudentDashboardData(), getParentDashboardData(), getDashboardData(role)

### 4. `src/lib/api.ts` - API Client
- **Base fetch helper**: apiFetch() with error handling and typed responses
- **Query string builder**: buildQueryString() for pagination/search/filter params
- **Pagination helper**: paginate() for mock data fallback
- **API functions** (all with try/catch falling back to mock data):
  - getDashboardStats(), getCourses(), getCourseById()
  - getEnrollments(), getAttendanceSessions(), getAttendanceRecords()
  - getAssignments(), getSubmissions(), getGrades()
  - getAssessments(), getQuizAttempts(), getTimetable()
  - getAnnouncements(), getConversations(), getMessages()
  - getNotifications(), getFeeData(), getFeePayments()
  - getLeaveRequests(), getSupportTickets(), getDocumentRequests()
  - getInstitutes(), getBranches(), getBatches()
  - getStudents(), getTeachers(), getCalendarEvents()

## Verification
- ESLint: Passed with 0 errors
- All files use proper TypeScript types
- All API functions use relative paths as required
