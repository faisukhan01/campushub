import { create } from "zustand";
import type { UserRole, NavigationItem } from "@/types";
import { getTabUser, setTabUser, clearTabUser } from "@/lib/tab-session";

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
  classLevel?: string;
  section?: string;
}

const DEMO_USERS: Record<UserRole, DemoUser> = {
  SuperAdmin: {
    id: "u-super-001",
    name: "Faisal Mahmood",
    email: "faisal@campushub.pk",
    role: "SuperAdmin",
    avatar: "",
    instituteId: "platform",
    instituteName: "CampusHub Platform",
  },
  InstituteAdmin: {
    id: "u-inst-001",
    name: "Dr. Tariq Bashir",
    email: "tariq.bashir@beaconhouse.edu.pk",
    role: "InstituteAdmin",
    avatar: "",
    instituteId: "inst-001",
    instituteName: "Beacon House School System",
  },
  BranchAdmin: {
    id: "u-branch-001",
    name: "Zara Qureshi",
    email: "zara.qureshi@beaconhouse.edu.pk",
    role: "BranchAdmin",
    avatar: "",
    instituteId: "inst-001",
    instituteName: "Beacon House School System",
    branchId: "branch-001",
    branchName: "Main Campus — Lahore",
  },
  Teacher: {
    id: "u-teacher-001",
    name: "Mr. Ahmed Khan",
    email: "ahmed.khan@beaconhouse.edu.pk",
    role: "Teacher",
    avatar: "",
    instituteId: "inst-001",
    instituteName: "Beacon House School System",
    branchId: "branch-001",
    branchName: "Main Campus — Lahore",
  },
  Student: {
    id: "u-student-001",
    name: "Ali Hassan",
    email: "ali.hassan@student.beaconhouse.edu.pk",
    role: "Student",
    avatar: "",
    instituteId: "inst-001",
    instituteName: "Beacon House School System",
    branchId: "branch-001",
    branchName: "Main Campus — Lahore",
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
      { id: "branches", label: "All Branches", icon: "MapPin", href: "branches" },
      { id: "users", label: "All Users", icon: "Users", href: "users" },
      { id: "subscription", label: "Subscriptions", icon: "CreditCard", href: "subscription" },
      { id: "analytics", label: "Analytics", icon: "BarChart3", href: "analytics" },
      { id: "reports", label: "Reports", icon: "FileText", href: "reports" },
      { id: "settings", label: "Settings", icon: "Settings", href: "settings" },
    ],
    InstituteAdmin: [
      ...baseNav,
      { id: "branches", label: "Branches", icon: "MapPin", href: "branches" },
      { id: "users", label: "User Management", icon: "Users", href: "users" },
      { id: "courses", label: "Courses", icon: "BookOpen", href: "courses" },
      { id: "fees", label: "Fee Management", icon: "CreditCard", href: "fees" },
      { id: "reports", label: "Reports", icon: "FileText", href: "reports" },
      { id: "announcements", label: "Announcements", icon: "Megaphone", href: "announcements" },
      { id: "settings", label: "Settings", icon: "Settings", href: "settings" },
    ],
    BranchAdmin: [
      ...baseNav,
      { id: "students", label: "Students", icon: "GraduationCap", href: "students" },
      { id: "users", label: "Teachers", icon: "Users", href: "users" },
      { id: "courses", label: "Courses", icon: "BookOpen", href: "courses" },
      { id: "course-management", label: "Course Management", icon: "Settings2", href: "course-management" },
      { id: "attendance", label: "Attendance", icon: "ClipboardCheck", href: "attendance" },
      { id: "fees", label: "Fee Management", icon: "CreditCard", href: "fees" },
      { id: "timetable", label: "Timetable", icon: "Calendar", href: "timetable" },
      { id: "announcements", label: "Announcements", icon: "Megaphone", href: "announcements" },
      { id: "reports", label: "Reports", icon: "FileText", href: "reports" },
      { id: "settings", label: "Settings", icon: "Settings", href: "settings" },
    ],
    Teacher: [
      ...baseNav,
      { id: "courses", label: "My Classes", icon: "BookOpen", href: "courses" },
      { id: "attendance", label: "Mark Attendance", icon: "ClipboardCheck", href: "attendance" },
      { id: "assignments", label: "Assignments", icon: "FileEdit", href: "assignments" },
      { id: "grades", label: "Enter Marks", icon: "Award", href: "grades" },
      { id: "students", label: "My Students", icon: "GraduationCap", href: "students" },
      { id: "timetable", label: "My Schedule", icon: "Calendar", href: "timetable" },
      { id: "announcements", label: "Announcements", icon: "Megaphone", href: "announcements" },
      { id: "messages", label: "Messages", icon: "MessageSquare", href: "messages", badge: 3 },
    ],
    Student: [
      ...baseNav,
      { id: "courses", label: "My Subjects", icon: "BookOpen", href: "courses" },
      { id: "assignments", label: "Assignments", icon: "FileEdit", href: "assignments" },
      { id: "grades", label: "My Marks", icon: "Award", href: "grades" },
      { id: "attendance", label: "My Attendance", icon: "ClipboardCheck", href: "attendance" },
      { id: "timetable", label: "My Schedule", icon: "Calendar", href: "timetable" },
      { id: "fees", label: "Fee Ledger", icon: "CreditCard", href: "fees", badge: 1 },
      { id: "announcements", label: "Announcements", icon: "Megaphone", href: "announcements" },
      { id: "messages", label: "Messages", icon: "MessageSquare", href: "messages" },
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
  login: (user: { 
    id: string; 
    name: string; 
    email: string; 
    role: UserRole; 
    instituteId?: string | null; 
    branchId?: string | null;
    classLevel?: string | null;
    section?: string | null;
  }) => void;
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

export const useAppStore = create<AppState>((set, get) => {
  // Initialize from tab-specific session storage
  const tabUser = getTabUser();
  const initialAuth = tabUser !== null;
  const initialUser = tabUser;
  const initialNav = tabUser ? getNavigationForRole(tabUser.role) : [];

  // Prevent cross-tab state synchronization
  // Each tab maintains its own independent state
  if (typeof window !== 'undefined') {
    // Block any storage events that might trigger state changes
    const blockCrossTabUpdates = (e: StorageEvent) => {
      // Prevent any external storage changes from affecting this tab's Zustand store
      if (e.key && e.key.includes('tab_user_data')) {
        const currentTabId = sessionStorage.getItem('tab_session_id');
        if (e.key !== `tab_user_data_${currentTabId}`) {
          // This is from another tab, ignore it
          e.stopImmediatePropagation();
          e.stopPropagation();
        }
      }
    };
    
    window.addEventListener('storage', blockCrossTabUpdates, { capture: true });
  }

  return {
    // Initial state
    isAuthenticated: initialAuth,
    currentUser: initialUser,
    currentPage: "dashboard",
    sidebarExpanded: true,
    navigationItems: initialNav,
    theme: "light",
    unreadNotificationCount: 0,
    activeInstituteId: tabUser?.instituteId ?? null,
    activeBranchId: tabUser?.branchId ?? null,
    isLoading: false,
    globalError: null,

    // Actions
    login: (user) => {
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: "",
        instituteId: user.instituteId ?? "platform",
        instituteName: "",
        branchId: user.branchId ?? undefined,
        branchName: undefined,
        classLevel: user.classLevel ?? undefined,
        section: user.section ?? undefined,
      };
      
      // Store in tab-specific session
      setTabUser(userData);
      
      set({
        isAuthenticated: true,
        currentUser: userData,
        activeInstituteId: user.instituteId ?? null,
        activeBranchId: user.branchId ?? null,
        navigationItems: getNavigationForRole(user.role),
        unreadNotificationCount: 0,
      });
    },

    logout: () => {
      // Clear tab-specific session
      clearTabUser();
      
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
    // Clear tab-specific session
    clearTabUser();
    
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
}});

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
