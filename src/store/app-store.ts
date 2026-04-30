import { create } from "zustand";
import type { UserRole, NavigationItem } from "@/types";

// -------------------- Demo Users --------------------

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  instituteId: string;
  instituteName: string;
  branchId?: string;
  branchName?: string;
}

const DEMO_USERS: Record<UserRole, DemoUser> = {
  SuperAdmin: {
    id: "u-super-001",
    name: "Alex Morgan",
    email: "alex.morgan@campus.edu",
    role: "SuperAdmin",
    avatar: "",
    instituteId: "inst-001",
    instituteName: "Greenfield Education Group",
  },
  InstituteAdmin: {
    id: "u-inst-001",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@campus.edu",
    role: "InstituteAdmin",
    avatar: "",
    instituteId: "inst-001",
    instituteName: "Greenfield Education Group",
  },
  BranchAdmin: {
    id: "u-branch-001",
    name: "James Wilson",
    email: "james.wilson@campus.edu",
    role: "BranchAdmin",
    avatar: "",
    instituteId: "inst-001",
    instituteName: "Greenfield Education Group",
    branchId: "branch-001",
    branchName: "Greenfield Main Campus",
  },
  Teacher: {
    id: "u-teacher-001",
    name: "Prof. Emily Rodriguez",
    email: "emily.rodriguez@campus.edu",
    role: "Teacher",
    avatar: "",
    instituteId: "inst-001",
    instituteName: "Greenfield Education Group",
    branchId: "branch-001",
    branchName: "Greenfield Main Campus",
  },
  Student: {
    id: "u-student-001",
    name: "Ryan Patel",
    email: "ryan.patel@student.campus.edu",
    role: "Student",
    avatar: "",
    instituteId: "inst-001",
    instituteName: "Greenfield Education Group",
    branchId: "branch-001",
    branchName: "Greenfield Main Campus",
  },
  Parent: {
    id: "u-parent-001",
    name: "Meera Patel",
    email: "meera.patel@email.com",
    role: "Parent",
    avatar: "",
    instituteId: "inst-001",
    instituteName: "Greenfield Education Group",
    branchId: "branch-001",
    branchName: "Greenfield Main Campus",
  },
};

// -------------------- Navigation Config --------------------

function getNavigationForRole(role: UserRole): NavigationItem[] {
  const baseNav: NavigationItem[] = [
    { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "dashboard" },
  ];

  const roleNav: Record<UserRole, NavigationItem[]> = {
    SuperAdmin: [
      ...baseNav,
      { id: "institutes", label: "Institutes", icon: "Building2", href: "institutes" },
      { id: "branches", label: "Branches", icon: "MapPin", href: "branches" },
      { id: "departments", label: "Departments", icon: "FolderTree", href: "departments" },
      { id: "users", label: "User Management", icon: "Users", href: "users" },
      { id: "courses", label: "Courses", icon: "BookOpen", href: "courses" },
      { id: "calendar", label: "Calendar", icon: "Calendar", href: "calendar" },
      { id: "exam-schedule", label: "Exam Schedule", icon: "CalendarClock", href: "exam-schedule" },
      { id: "gallery", label: "Gallery", icon: "Image", href: "gallery" },
      { id: "fees", label: "Fee Management", icon: "CreditCard", href: "fees" },
      { id: "hostel", label: "Hostel Management", icon: "BedDouble", href: "hostel" },
      { id: "transport", label: "Transport", icon: "Bus", href: "transport" },
      { id: "analytics", label: "Analytics", icon: "BarChart3", href: "analytics" },
      { id: "subscription", label: "Subscription", icon: "CreditCard", href: "subscription" },
      { id: "reports", label: "Reports", icon: "FileText", href: "reports" },
      { id: "notifications", label: "Notifications", icon: "Bell", href: "notifications", badge: 2 },
      { id: "announcements", label: "Announcements", icon: "Megaphone", href: "announcements" },
      { id: "alumni", label: "Alumni", icon: "GraduationCap", href: "alumni" },
      { id: "profile", label: "My Profile", icon: "User", href: "profile" },
      { id: "help", label: "Help Center", icon: "LifeBuoy", href: "help" },
      { id: "settings", label: "Settings", icon: "Settings", href: "settings" },
    ],
    InstituteAdmin: [
      ...baseNav,
      { id: "branches", label: "Branches", icon: "MapPin", href: "branches" },
      { id: "departments", label: "Departments", icon: "FolderTree", href: "departments" },
      { id: "users", label: "User Management", icon: "Users", href: "users" },
      { id: "courses", label: "Courses", icon: "BookOpen", href: "courses" },
      { id: "calendar", label: "Calendar", icon: "Calendar", href: "calendar" },
      { id: "exam-schedule", label: "Exam Schedule", icon: "CalendarClock", href: "exam-schedule" },
      { id: "gallery", label: "Gallery", icon: "Image", href: "gallery" },
      { id: "fees", label: "Fee Management", icon: "CreditCard", href: "fees" },
      { id: "hostel", label: "Hostel Management", icon: "BedDouble", href: "hostel" },
      { id: "transport", label: "Transport", icon: "Bus", href: "transport" },
      { id: "reports", label: "Reports", icon: "FileText", href: "reports" },
      { id: "data-export", label: "Data Export", icon: "Download", href: "data-export" },
      { id: "notifications", label: "Notifications", icon: "Bell", href: "notifications", badge: 2 },
      { id: "announcements", label: "Announcements", icon: "Megaphone", href: "announcements" },
      { id: "profile", label: "My Profile", icon: "User", href: "profile" },
      { id: "help", label: "Help Center", icon: "LifeBuoy", href: "help" },
      { id: "mentorship", label: "Mentorship", icon: "Users", href: "mentorship" },
      { id: "feedback", label: "Feedback", icon: "MessageSquare", href: "feedback" },
      { id: "settings", label: "Settings", icon: "Settings", href: "settings" },
      { id: "alumni", label: "Alumni", icon: "GraduationCap", href: "alumni" },
    ],
    BranchAdmin: [
      ...baseNav,
      { id: "departments", label: "Departments", icon: "FolderTree", href: "departments" },
      { id: "batches", label: "Batches", icon: "Layers", href: "batches" },
      { id: "users", label: "User Management", icon: "Users", href: "users" },
      { id: "courses", label: "Courses", icon: "BookOpen", href: "courses" },
      { id: "timetable", label: "Timetable", icon: "Calendar", href: "timetable" },
      { id: "attendance", label: "Attendance", icon: "ClipboardCheck", href: "attendance" },
      { id: "fees", label: "Fee Management", icon: "CreditCard", href: "fees" },
      { id: "hostel", label: "Hostel Management", icon: "BedDouble", href: "hostel" },
      { id: "transport", label: "Transport", icon: "Bus", href: "transport" },
      { id: "reports", label: "Reports", icon: "FileText", href: "reports" },
      { id: "announcements", label: "Announcements", icon: "Megaphone", href: "announcements" },
      { id: "exam-schedule", label: "Exam Schedule", icon: "CalendarClock", href: "exam-schedule" },
      { id: "gallery", label: "Gallery", icon: "Image", href: "gallery" },
      { id: "help", label: "Help Center", icon: "LifeBuoy", href: "help" },
      { id: "settings", label: "Settings", icon: "Settings", href: "settings" },
      { id: "alumni", label: "Alumni", icon: "GraduationCap", href: "alumni" },
    ],
    Teacher: [
      ...baseNav,
      { id: "courses", label: "My Courses", icon: "BookOpen", href: "courses" },
      { id: "students", label: "Students", icon: "GraduationCap", href: "students" },
      { id: "at-risk", label: "At-Risk Alerts", icon: "AlertTriangle", href: "at-risk" },
      { id: "attendance", label: "Attendance", icon: "ClipboardCheck", href: "attendance" },
      { id: "assignments", label: "Assignments", icon: "FileEdit", href: "assignments" },
      { id: "assessments", label: "Assessments", icon: "FileQuestion", href: "assessments" },
      { id: "rubric", label: "Rubric Builder", icon: "ClipboardList", href: "rubric" },
      { id: "plagiarism", label: "Plagiarism Checker", icon: "ShieldCheck", href: "plagiarism" },
      { id: "grades", label: "Grading", icon: "Award", href: "grades" },
      { id: "library", label: "Resource Library", icon: "BookOpen", href: "library" },
      { id: "timetable", label: "My Timetable", icon: "Calendar", href: "timetable" },
      { id: "messages", label: "Messages", icon: "MessageSquare", href: "messages", badge: 3 },
      { id: "notifications", label: "Notifications", icon: "Bell", href: "notifications", badge: 3 },
      { id: "announcements", label: "Announcements", icon: "Megaphone", href: "announcements" },
      { id: "forum", label: "Forum", icon: "MessageCircle", href: "forum" },
      { id: "calendar", label: "Calendar", icon: "Calendar", href: "calendar" },
      { id: "classes", label: "Online Classes", icon: "Video", href: "classes" },
      { id: "profile", label: "My Profile", icon: "User", href: "profile" },
      { id: "help", label: "Help Center", icon: "LifeBuoy", href: "help" },
      { id: "gallery", label: "Gallery", icon: "Image", href: "gallery" },
      { id: "mentorship", label: "Mentorship", icon: "Users", href: "mentorship" },
      { id: "feedback", label: "Feedback", icon: "MessageSquare", href: "feedback" },
      { id: "whiteboard", label: "Whiteboard", icon: "PenTool", href: "whiteboard" },
      { id: "alumni", label: "Alumni", icon: "GraduationCap", href: "alumni" },
    ],
    Student: [
      ...baseNav,
      { id: "courses", label: "My Courses", icon: "BookOpen", href: "courses" },
      { id: "assignments", label: "Assignments", icon: "FileEdit", href: "assignments" },
      { id: "grades", label: "Grades & Results", icon: "Award", href: "grades" },
      { id: "performance", label: "Performance", icon: "BarChart3", href: "performance" },
      { id: "attendance", label: "Attendance", icon: "ClipboardCheck", href: "attendance" },
      { id: "timetable", label: "Timetable", icon: "Calendar", href: "timetable" },
      { id: "transport", label: "Transport", icon: "Bus", href: "transport" },
      { id: "calendar", label: "Calendar", icon: "Calendar", href: "calendar" },
      { id: "exam-schedule", label: "Exam Schedule", icon: "CalendarClock", href: "exam-schedule" },
      { id: "gallery", label: "Gallery", icon: "Image", href: "gallery" },
      { id: "classes", label: "Online Classes", icon: "Video", href: "classes" },
      { id: "fees", label: "Fees", icon: "CreditCard", href: "fees", badge: 2 },
      { id: "messages", label: "Messages", icon: "MessageSquare", href: "messages", badge: 5 },
      { id: "notifications", label: "Notifications", icon: "Bell", href: "notifications", badge: 7 },
      { id: "announcements", label: "Announcements", icon: "Megaphone", href: "announcements" },
      { id: "forum", label: "Forum", icon: "MessageCircle", href: "forum" },
      { id: "leave", label: "Leave Request", icon: "CalendarOff", href: "leave" },
      { id: "documents", label: "Documents", icon: "FileStack", href: "documents" },
      { id: "library", label: "Resource Library", icon: "BookOpen", href: "library" },
      { id: "profile", label: "My Profile", icon: "User", href: "profile" },
      { id: "help", label: "Help Center", icon: "LifeBuoy", href: "help" },
      { id: "ai-assistant", label: "AI Assistant", icon: "Bot", href: "ai-assistant" },
      { id: "quiz", label: "Quiz Center", icon: "FileQuestion", href: "quiz" },
      { id: "certificates", label: "Certificates", icon: "Award", href: "certificates" },
      { id: "mentorship", label: "Mentorship", icon: "Users", href: "mentorship" },
      { id: "feedback", label: "Feedback", icon: "MessageSquare", href: "feedback" },
      { id: "whiteboard", label: "Whiteboard", icon: "PenTool", href: "whiteboard" },
      { id: "alumni", label: "Alumni", icon: "GraduationCap", href: "alumni" },
    ],
    Parent: [
      ...baseNav,
      { id: "children", label: "My Children", icon: "Users", href: "children" },
      { id: "grades", label: "Academic Progress", icon: "Award", href: "grades" },
      { id: "attendance", label: "Attendance", icon: "ClipboardCheck", href: "attendance" },
      { id: "fees", label: "Fee Payments", icon: "CreditCard", href: "fees" },
      { id: "messages", label: "Messages", icon: "MessageSquare", href: "messages", badge: 2 },
      { id: "notifications", label: "Notifications", icon: "Bell", href: "notifications", badge: 2 },
      { id: "announcements", label: "Announcements", icon: "Megaphone", href: "announcements" },
      { id: "leave", label: "Leave Requests", icon: "CalendarOff", href: "leave" },
      { id: "profile", label: "My Profile", icon: "User", href: "profile" },
      { id: "help", label: "Help Center", icon: "LifeBuoy", href: "help" },
      { id: "exam-schedule", label: "Exam Schedule", icon: "CalendarClock", href: "exam-schedule" },
      { id: "alumni", label: "Alumni", icon: "GraduationCap", href: "alumni" },
    ],
  };

  return roleNav[role] ?? baseNav;
}

// -------------------- Store Types --------------------

interface AppState {
  // Auth
  isAuthenticated: boolean;
  currentUser: DemoUser | null;

  // Navigation
  currentPage: string;
  sidebarExpanded: boolean;
  navigationItems: NavigationItem[];

  // Theme
  theme: "light" | "dark";

  // Notifications
  unreadNotificationCount: number;

  // Active context
  activeInstituteId: string | null;
  activeBranchId: string | null;

  // Global loading
  isLoading: boolean;
  globalError: string | null;

  // Actions
  login: (role: UserRole) => void;
  logout: () => void;
  setCurrentPage: (page: string) => void;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  setUnreadNotificationCount: (count: number) => void;
  setActiveInstitute: (instituteId: string) => void;
  setActiveBranch: (branchId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
  clearAll: () => void;
}

// -------------------- Store --------------------

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  currentUser: null,
  currentPage: "dashboard",
  sidebarExpanded: true,
  navigationItems: [],
  theme: "light",
  unreadNotificationCount: 0,
  activeInstituteId: null,
  activeBranchId: null,
  isLoading: false,
  globalError: null,

  // Actions
  login: (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    if (!demoUser) return;

    set({
      isAuthenticated: true,
      currentUser: demoUser,
      activeInstituteId: demoUser.instituteId,
      activeBranchId: demoUser.branchId ?? null,
      navigationItems: getNavigationForRole(role),
      unreadNotificationCount: role === "Student" ? 7 : role === "Teacher" ? 3 : 2,
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      currentUser: null,
      currentPage: "dashboard",
      navigationItems: [],
      unreadNotificationCount: 0,
      activeBranchId: null,
    });
  },

  setCurrentPage: (page: string) => {
    set({ currentPage: page });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded }));
  },

  setSidebarExpanded: (expanded: boolean) => {
    set({ sidebarExpanded: expanded });
  },

  setTheme: (theme: "light" | "dark") => {
    set({ theme });
  },

  toggleTheme: () => {
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }));
  },

  setUnreadNotificationCount: (count: number) => {
    set({ unreadNotificationCount: count });
  },

  setActiveInstitute: (instituteId: string) => {
    set({ activeInstituteId: instituteId });
  },

  setActiveBranch: (branchId: string | null) => {
    set({ activeBranchId: branchId });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setGlobalError: (error: string | null) => {
    set({ globalError: error });
  },

  clearAll: () => {
    set({
      isAuthenticated: false,
      currentUser: null,
      currentPage: "dashboard",
      sidebarExpanded: true,
      navigationItems: [],
      unreadNotificationCount: 0,
      activeInstituteId: null,
      activeBranchId: null,
      isLoading: false,
      globalError: null,
    });
  },
}));

// -------------------- Selectors --------------------

export const selectCurrentUser = (state: AppState) => state.currentUser;
export const selectIsAuthenticated = (state: AppState) => state.isAuthenticated;
export const selectCurrentRole = (state: AppState) => state.currentUser?.role;
export const selectNavigation = (state: AppState) => state.navigationItems;
export const selectCurrentPage = (state: AppState) => state.currentPage;
export const selectSidebarExpanded = (state: AppState) => state.sidebarExpanded;
export const selectTheme = (state: AppState) => state.theme;
export const selectNotificationCount = (state: AppState) => state.unreadNotificationCount;
export const selectActiveBranchId = (state: AppState) => state.activeBranchId;
export const selectActiveInstituteId = (state: AppState) => state.activeInstituteId;
