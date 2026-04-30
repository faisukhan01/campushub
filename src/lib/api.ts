// ============================================================
// Campus Management System - API Client
// ============================================================
// All API calls use relative paths. The Caddy gateway handles routing.
// Do NOT use absolute paths like http://localhost:PORT.

import type {
  ApiResponse,
  ApiError,
  DashboardStats,
  DashboardQueryParams,
  Course,
  CourseQueryParams,
  AttendanceSession,
  AttendanceRecord,
  AttendanceQueryParams,
  Assignment,
  Submission,
  AssignmentQueryParams,
  Grade,
  GradeQueryParams,
  TimetableSlot,
  TimetableQueryParams,
  Announcement,
  Notification,
  Message,
  Conversation,
  MessageQueryParams,
  FeeInvoice,
  FeePayment,
  FeeQueryParams,
  NotificationQueryParams,
  PaginatedQueryParams,
  LeaveRequest,
  SupportTicket,
  DocumentRequest,
  Enrollment,
  Institute,
  Branch,
  Batch,
  Student,
  Teacher,
  Assessment,
  QuizAttempt,
  CalendarEvent,
} from "@/types";

import {
  getDashboardData,
  mockCourses,
  mockAttendanceSessions,
  mockAttendanceRecords,
  mockAssignments,
  mockSubmissions,
  mockGrades,
  mockTimetable,
  mockAnnouncements,
  mockNotifications,
  mockMessages,
  mockConversations,
  mockFeeInvoices,
  mockLeaveRequests,
  mockSupportTickets,
  mockDocumentRequests,
  mockEnrollments,
  mockInstitutes,
  mockBranches,
  mockBatches,
  mockStudents,
  mockTeachers,
  mockAssessments,
  mockQuizAttempts,
  mockCalendarEvents,
} from "@/lib/mock-data";

// -------------------- Base Fetch Helper --------------------

class ApiClientError extends Error {
  code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
  }
}

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as ApiError | null;
      throw new ApiClientError(
        errorBody?.message ?? `Request failed with status ${response.status}`,
        errorBody?.code ?? response.status
      );
    }

    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    throw new ApiClientError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        for (const v of value) {
          searchParams.append(key, String(v));
        }
      } else {
        searchParams.append(key, String(value));
      }
    }
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

// -------------------- Helper: Fall back to mock data --------------------

function paginate<T>(items: T[], params?: PaginatedQueryParams): ApiResponse<T> {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const search = params?.search?.toLowerCase();

  let filtered = items;
  if (search) {
    filtered = items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search)
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize;
  const paginatedItems = filtered.slice(start, start + pageSize);

  return {
    success: true,
    data: paginatedItems,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// -------------------- Dashboard --------------------

export async function getDashboardStats(
  params: DashboardQueryParams
): Promise<ApiResponse<DashboardStats>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<DashboardStats>(`/api/dashboard${qs}`);
  } catch {
    // Fallback to mock data
    return {
      success: true,
      data: getDashboardData(params.role),
    };
  }
}

// -------------------- Courses --------------------

export async function getCourses(
  params?: CourseQueryParams
): Promise<ApiResponse<Course[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Course[]>(`/api/courses${qs}`);
  } catch {
    return paginate(mockCourses, params);
  }
}

export async function getCourseById(
  courseId: string
): Promise<ApiResponse<Course>> {
  try {
    return await apiFetch<Course>(`/api/courses/${courseId}`);
  } catch {
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) {
      throw new ApiClientError("Course not found", 404);
    }
    return { success: true, data: course };
  }
}

// -------------------- Enrollments --------------------

export async function getEnrollments(
  params?: PaginatedQueryParams & { courseId?: string; studentId?: string }
): Promise<ApiResponse<Enrollment[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Enrollment[]>(`/api/enrollments${qs}`);
  } catch {
    let filtered = mockEnrollments;
    if (params?.courseId) {
      filtered = filtered.filter((e) => e.courseId === params.courseId);
    }
    if (params?.studentId) {
      filtered = filtered.filter((e) => e.studentId === params.studentId);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Attendance --------------------

export async function getAttendanceSessions(
  params?: AttendanceQueryParams
): Promise<ApiResponse<AttendanceSession[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<AttendanceSession[]>(`/api/attendance/sessions${qs}`);
  } catch {
    let filtered = mockAttendanceSessions;
    if (params?.courseId) {
      filtered = filtered.filter((s) => s.courseId === params.courseId);
    }
    if (params?.batchId) {
      filtered = filtered.filter((s) => s.batchId === params.batchId);
    }
    return paginate(filtered, params);
  }
}

export async function getAttendanceRecords(
  params?: AttendanceQueryParams
): Promise<ApiResponse<AttendanceRecord[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<AttendanceRecord[]>(`/api/attendance/records${qs}`);
  } catch {
    let filtered = mockAttendanceRecords;
    if (params?.courseId) {
      filtered = filtered.filter((r) => r.courseId === params.courseId);
    }
    if (params?.studentId) {
      filtered = filtered.filter((r) => r.studentId === params.studentId);
    }
    if (params?.dateFrom) {
      filtered = filtered.filter((r) => r.date >= params.dateFrom!);
    }
    if (params?.dateTo) {
      filtered = filtered.filter((r) => r.date <= params.dateTo!);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Assignments --------------------

export async function getAssignments(
  params?: AssignmentQueryParams
): Promise<ApiResponse<Assignment[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Assignment[]>(`/api/assignments${qs}`);
  } catch {
    let filtered = mockAssignments;
    if (params?.courseId) {
      filtered = filtered.filter((a) => a.courseId === params.courseId);
    }
    if (params?.batchId) {
      filtered = filtered.filter((a) => a.batchId === params.batchId);
    }
    if (params?.teacherId) {
      filtered = filtered.filter((a) => a.teacherId === params.teacherId);
    }
    return paginate(filtered, params);
  }
}

export async function getSubmissions(
  params?: PaginatedQueryParams & { assignmentId?: string; studentId?: string }
): Promise<ApiResponse<Submission[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Submission[]>(`/api/submissions${qs}`);
  } catch {
    let filtered = mockSubmissions;
    if (params?.assignmentId) {
      filtered = filtered.filter((s) => s.assignmentId === params.assignmentId);
    }
    if (params?.studentId) {
      filtered = filtered.filter((s) => s.studentId === params.studentId);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Grades --------------------

export async function getGrades(
  params?: GradeQueryParams
): Promise<ApiResponse<Grade[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Grade[]>(`/api/grades${qs}`);
  } catch {
    let filtered = mockGrades;
    if (params?.studentId) {
      filtered = filtered.filter((g) => g.studentId === params.studentId);
    }
    if (params?.courseId) {
      filtered = filtered.filter((g) => g.courseId === params.courseId);
    }
    if (params?.batchId) {
      filtered = filtered.filter((g) => g.batchId === params.batchId);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Assessments --------------------

export async function getAssessments(
  params?: PaginatedQueryParams & { courseId?: string; teacherId?: string }
): Promise<ApiResponse<Assessment[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Assessment[]>(`/api/assessments${qs}`);
  } catch {
    let filtered = mockAssessments;
    if (params?.courseId) {
      filtered = filtered.filter((a) => a.courseId === params.courseId);
    }
    if (params?.teacherId) {
      filtered = filtered.filter((a) => a.teacherId === params.teacherId);
    }
    return paginate(filtered, params);
  }
}

export async function getQuizAttempts(
  params?: PaginatedQueryParams & { assessmentId?: string; studentId?: string }
): Promise<ApiResponse<QuizAttempt[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<QuizAttempt[]>(`/api/quiz-attempts${qs}`);
  } catch {
    let filtered = mockQuizAttempts;
    if (params?.assessmentId) {
      filtered = filtered.filter((a) => a.assessmentId === params.assessmentId);
    }
    if (params?.studentId) {
      filtered = filtered.filter((a) => a.studentId === params.studentId);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Timetable --------------------

export async function getTimetable(
  params?: TimetableQueryParams
): Promise<ApiResponse<TimetableSlot[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<TimetableSlot[]>(`/api/timetable${qs}`);
  } catch {
    let filtered = mockTimetable;
    if (params?.batchId) {
      filtered = filtered.filter((t) => t.batchId === params.batchId);
    }
    if (params?.teacherId) {
      filtered = filtered.filter((t) => t.teacherId === params.teacherId);
    }
    if (params?.day) {
      filtered = filtered.filter((t) => t.day === params.day);
    }
    return {
      success: true,
      data: filtered,
    };
  }
}

// -------------------- Announcements --------------------

export async function getAnnouncements(
  params?: PaginatedQueryParams & { targetRole?: string }
): Promise<ApiResponse<Announcement[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Announcement[]>(`/api/announcements${qs}`);
  } catch {
    return paginate(mockAnnouncements, params);
  }
}

// -------------------- Messages --------------------

export async function getConversations(
  params?: PaginatedQueryParams
): Promise<ApiResponse<Conversation[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Conversation[]>(`/api/conversations${qs}`);
  } catch {
    return paginate(mockConversations, params);
  }
}

export async function getMessages(
  params?: MessageQueryParams
): Promise<ApiResponse<Message[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Message[]>(`/api/messages${qs}`);
  } catch {
    let filtered = mockMessages;
    if (params?.conversationId) {
      // For simplicity, return all messages; in real app filter by conversation
      void params.conversationId;
    }
    if (params?.isRead !== undefined) {
      filtered = filtered.filter((m) => m.isRead === params.isRead);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Notifications --------------------

export async function getNotifications(
  params?: NotificationQueryParams
): Promise<ApiResponse<Notification[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Notification[]>(`/api/notifications${qs}`);
  } catch {
    let filtered = mockNotifications;
    if (params?.userId) {
      filtered = filtered.filter((n) => n.userId === params.userId);
    }
    if (params?.isRead !== undefined) {
      filtered = filtered.filter((n) => n.isRead === params.isRead);
    }
    if (params?.type) {
      filtered = filtered.filter((n) => n.type === params.type);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Fees --------------------

export async function getFeeData(
  params?: FeeQueryParams
): Promise<ApiResponse<FeeInvoice[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<FeeInvoice[]>(`/api/fees${qs}`);
  } catch {
    let filtered = mockFeeInvoices;
    if (params?.studentId) {
      filtered = filtered.filter((f) => f.studentId === params.studentId);
    }
    if (params?.batchId) {
      filtered = filtered.filter((f) => f.batchId === params.batchId);
    }
    if (params?.status) {
      filtered = filtered.filter((f) => f.status === params.status);
    }
    return paginate(filtered, params);
  }
}

export async function getFeePayments(
  params?: PaginatedQueryParams & { invoiceId?: string; studentId?: string }
): Promise<ApiResponse<FeePayment[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<FeePayment[]>(`/api/fees/payments${qs}`);
  } catch {
    const allPayments = mockFeeInvoices.flatMap((inv) => inv.payments);
    let filtered = allPayments;
    if (params?.invoiceId) {
      filtered = filtered.filter((p) => p.invoiceId === params.invoiceId);
    }
    if (params?.studentId) {
      filtered = filtered.filter((p) => p.studentId === params.studentId);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Leave Requests --------------------

export async function getLeaveRequests(
  params?: PaginatedQueryParams & { studentId?: string; status?: string }
): Promise<ApiResponse<LeaveRequest[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<LeaveRequest[]>(`/api/leaves${qs}`);
  } catch {
    let filtered = mockLeaveRequests;
    if (params?.studentId) {
      filtered = filtered.filter((l) => l.studentId === params.studentId);
    }
    if (params?.status) {
      filtered = filtered.filter((l) => l.status === params.status);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Support Tickets --------------------

export async function getSupportTickets(
  params?: PaginatedQueryParams & { userId?: string; status?: string }
): Promise<ApiResponse<SupportTicket[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<SupportTicket[]>(`/api/support-tickets${qs}`);
  } catch {
    let filtered = mockSupportTickets;
    if (params?.userId) {
      filtered = filtered.filter((t) => t.userId === params.userId);
    }
    if (params?.status) {
      filtered = filtered.filter((t) => t.status === params.status);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Document Requests --------------------

export async function getDocumentRequests(
  params?: PaginatedQueryParams & { studentId?: string; status?: string }
): Promise<ApiResponse<DocumentRequest[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<DocumentRequest[]>(`/api/documents${qs}`);
  } catch {
    let filtered = mockDocumentRequests;
    if (params?.studentId) {
      filtered = filtered.filter((d) => d.studentId === params.studentId);
    }
    if (params?.status) {
      filtered = filtered.filter((d) => d.status === params.status);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Institutes --------------------

export async function getInstitutes(
  params?: PaginatedQueryParams
): Promise<ApiResponse<Institute[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Institute[]>(`/api/institutes${qs}`);
  } catch {
    return paginate(mockInstitutes, params);
  }
}

// -------------------- Branches --------------------

export async function getBranches(
  params?: PaginatedQueryParams & { instituteId?: string }
): Promise<ApiResponse<Branch[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Branch[]>(`/api/branches${qs}`);
  } catch {
    let filtered = mockBranches;
    if (params?.instituteId) {
      filtered = filtered.filter((b) => b.instituteId === params.instituteId);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Batches --------------------

export async function getBatches(
  params?: PaginatedQueryParams & { branchId?: string; departmentId?: string }
): Promise<ApiResponse<Batch[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Batch[]>(`/api/batches${qs}`);
  } catch {
    let filtered = mockBatches;
    if (params?.branchId) {
      filtered = filtered.filter((b) => b.branchId === params.branchId);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Users --------------------

export async function getStudents(
  params?: PaginatedQueryParams & { batchId?: string; branchId?: string }
): Promise<ApiResponse<Student[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Student[]>(`/api/users/students${qs}`);
  } catch {
    let filtered = mockStudents;
    if (params?.batchId) {
      filtered = filtered.filter((s) => s.batchId === params.batchId);
    }
    if (params?.branchId) {
      filtered = filtered.filter((s) => s.branchId === params.branchId);
    }
    return paginate(filtered, params);
  }
}

export async function getTeachers(
  params?: PaginatedQueryParams & { departmentId?: string; branchId?: string }
): Promise<ApiResponse<Teacher[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<Teacher[]>(`/api/users/teachers${qs}`);
  } catch {
    let filtered = mockTeachers;
    if (params?.departmentId) {
      filtered = filtered.filter((t) => t.departmentId === params.departmentId);
    }
    if (params?.branchId) {
      filtered = filtered.filter((t) => t.branchId === params.branchId);
    }
    return paginate(filtered, params);
  }
}

// -------------------- Calendar Events --------------------

export async function getCalendarEvents(
  params?: PaginatedQueryParams & { type?: string }
): Promise<ApiResponse<CalendarEvent[]>> {
  try {
    const qs = buildQueryString(params as Record<string, unknown>);
    return await apiFetch<CalendarEvent[]>(`/api/calendar${qs}`);
  } catch {
    let filtered = mockCalendarEvents;
    if (params?.type) {
      filtered = filtered.filter((e) => e.type === params.type);
    }
    return paginate(filtered, params);
  }
}
