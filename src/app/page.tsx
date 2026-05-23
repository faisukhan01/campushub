"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/store/app-store";
import { getTabUser, clearTabUser } from "@/lib/tab-session";
import type { UserRole } from "@/types";
import { LandingPage } from "@/components/landing-page";
import SignInPage from "@/components/SignInPage";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { CoursesPage } from "@/components/pages/courses-page";
import { CourseManagementPage } from "@/components/pages/course-management-page";
import { AttendancePage } from "@/components/pages/attendance-page";
import { AssignmentsPage } from "@/components/pages/assignments-page";
import { GradesPage } from "@/components/pages/grades-page";
import { TimetablePage } from "@/components/pages/timetable-page";
import { FeesPage } from "@/components/pages/fees-page";
import { MessagesPage } from "@/components/pages/messages-page";
import { AnnouncementsPage } from "@/components/pages/announcements-page";
import { UsersPage } from "@/components/pages/users-page";
import { SettingsPage } from "@/components/pages/settings-page";
import { ReportsPage } from "@/components/pages/reports-page";
import { BranchesPage } from "@/components/pages/branches-page";
import { DepartmentsPage } from "@/components/pages/departments-page";
import { BatchesPage } from "@/components/pages/batches-page";
import { AnalyticsPage } from "@/components/pages/analytics-page";
import { InstitutesPage } from "@/components/pages/institutes-page";
import { StudentsPage } from "@/components/pages/students-page";
import { TeachersPage } from "@/components/pages/teachers-page";
import { CalendarPage } from "@/components/pages/calendar-page";
import { SubscriptionPage } from "@/components/pages/subscription-page";
import { UserSettingsPage } from "@/components/pages/user-settings-page";
import { SchoolClassesPage } from "@/components/pages/school-classes-page";
import { TeacherClassesPage } from "@/components/pages/teacher-classes-page";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { TabIndicator } from "@/components/tab-indicator";

const pageComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  courses: CoursesPage,
  "course-management": CourseManagementPage,
  attendance: AttendancePage,
  assignments: AssignmentsPage,
  grades: GradesPage,
  timetable: TimetablePage,
  fees: FeesPage,
  messages: MessagesPage,
  announcements: AnnouncementsPage,
  users: UsersPage,
  settings: SettingsPage,
  reports: ReportsPage,
  branches: BranchesPage,
  departments: DepartmentsPage,
  batches: BatchesPage,
  analytics: AnalyticsPage,
  institutes: InstitutesPage,
  students: StudentsPage,
  teachers: TeachersPage,
  calendar: CalendarPage,
  subscription: SubscriptionPage,
  "user-settings": UserSettingsPage,
  "school-classes": SchoolClassesPage,
  "teacher-classes": TeacherClassesPage,
};

function AppShell() {
  const currentPage = useAppStore((s) => s.currentPage);
  const theme = useAppStore((s) => s.theme);

  const handleThemeSync = useCallback(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
  handleThemeSync();

  const PageComponent = pageComponents[currentPage];

  return (
    <SidebarProvider style={{ "--sidebar-width": "17.5rem" } as React.CSSProperties}>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-svh">
        <AppHeader />
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {PageComponent ? (
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <PageComponent />
              </motion.div>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h2 className="text-lg font-medium text-muted-foreground">Page not found</h2>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    The page &quot;{currentPage}&quot; is not available yet.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-auto border-t">
          <footer className="px-6 py-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>&copy; 2025 CampusHub</span>
              <span className="hidden sm:inline text-muted-foreground/50">Campus Management Platform</span>
            </div>
          </footer>
        </div>
      </SidebarInset>
      <TabIndicator />
    </SidebarProvider>
  );
}

type UnauthView = "landing" | "signin";

export default function Home() {
  const { status } = useSession();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const login = useAppStore((s) => s.login);
  const logout = useAppStore((s) => s.logout);
  const [unauthView, setUnauthView] = useState<UnauthView>("landing");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [tabId] = useState(() => {
    // Generate unique tab ID on mount
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('tab_session_id') || `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return '';
  });

  // Sync NextAuth session → Zustand store ONLY for THIS TAB
  useEffect(() => {
    // Only run once when component first mounts
    if (hasInitialized) return;
    
    if (status === "loading") return;
    
    setHasInitialized(true);

    // Check if this tab already has a session
    const tabUser = typeof window !== 'undefined' ? getTabUser() : null;

    // If this tab has a session, it is authoritative — use it unconditionally.
    // Never invalidate it based on the shared NextAuth cookie (another tab may have changed it).
    if (tabUser) {
      if (!isAuthenticated || useAppStore.getState().currentUser?.id !== tabUser.id) {
        login({
          id: tabUser.id,
          name: tabUser.name,
          email: tabUser.email,
          role: tabUser.role as UserRole,
          instituteId: tabUser.instituteId,
          branchId: tabUser.branchId,
          classLevel: tabUser.classLevel,
          section: tabUser.section,
        });
      }
      return;
    }

    // No tab session for this tab — show sign-in page.
    // Do NOT auto-login from the NextAuth cookie; another tab may be signed in
    // and every tab must sign in independently to get its own tab session.
    if (isAuthenticated) {
      logout();
    }
  }, [status, hasInitialized, tabId]); // Added tabId to ensure tab-specific behavior

  // Loading state while NextAuth checks session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Authenticated — show the main app
  if (isAuthenticated) {
    return (
      <motion.div
        key="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AppShell />
      </motion.div>
    );
  }

  // Unauthenticated — show landing or sign-in
  return (
    <AnimatePresence mode="wait">
      {unauthView === "signin" ? (
        <motion.div
          key="signin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SignInPage onBack={() => setUnauthView("landing")} />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LandingPage
            onGoToSignIn={() => setUnauthView("signin")}
            onGoToSignUp={() => setUnauthView("signin")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
