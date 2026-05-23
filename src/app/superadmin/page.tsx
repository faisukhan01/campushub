"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/store/app-store";
import type { UserRole } from "@/types";
import SignInPage from "@/components/SignInPage";
import SuperAdminSignIn from "@/components/SuperAdminSignIn";
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
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Shield } from "lucide-react";
import { TabIndicator } from "@/components/tab-indicator";
import { getTabUser, clearTabUser } from "@/lib/tab-session";

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
          {/* Super Admin Badge */}
          <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-red-800">Super Admin Access</span>
          </div>
          
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
              <span>&copy; 2025 CampusHub - Super Admin Portal</span>
              <span className="hidden sm:inline text-muted-foreground/50">Campus Management Platform</span>
            </div>
          </footer>
        </div>
      </SidebarInset>
      <TabIndicator />
    </SidebarProvider>
  );
}

export default function SuperAdminPage() {
  const { status } = useSession({
    refetchOnWindowFocus: false,
  });
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const login = useAppStore((s) => s.login);
  const logout = useAppStore((s) => s.logout);
  const [sessionError, setSessionError] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Sync tab session → Zustand store on initial load.
  // We deliberately do NOT read from the NextAuth cookie here.
  // The shared cookie means every tab would inherit another tab's sign-in,
  // so we only trust the tab-specific sessionStorage entry written by
  // SuperAdminSignIn after a successful sign-in on THIS tab.
  useEffect(() => {
    if (hasInitialized) return;
    if (status === "loading") return;

    setHasInitialized(true);

    const tabUser = typeof window !== "undefined" ? getTabUser() : null;

    if (tabUser) {
      // This tab has its own session — validate it is SuperAdmin.
      if (tabUser.role !== "SuperAdmin") {
        clearTabUser();
        logout();
        return;
      }
      if (!isAuthenticated || useAppStore.getState().currentUser?.id !== tabUser.id) {
        login({
          id: tabUser.id,
          name: tabUser.name,
          email: tabUser.email,
          role: tabUser.role as UserRole,
          instituteId: tabUser.instituteId,
          branchId: tabUser.branchId,
        });
      }
      return;
    }

    // No tab session — this tab has not signed in yet.
    // Log out of Zustand in case it has stale state; the page will
    // render the sign-in form.
    if (isAuthenticated) {
      logout();
    }
  }, [status, hasInitialized]);

  // Timeout to detect stuck loading state
  useEffect(() => {
    if (status === "loading") {
      const timeout = setTimeout(() => {
        // If still loading after 5 seconds, show error
        if (status === "loading") {
          setSessionError(true);
        }
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  // If session error detected, show sign-in page
  if (sessionError) {
    return <SuperAdminSignIn />;
  }

  // Loading state while NextAuth checks session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          <p className="text-sm text-red-200">Verifying Super Admin Access...</p>
        </div>
      </div>
    );
  }

  // Zustand store is the single source of truth here.
  // It is only populated when THIS tab went through SuperAdminSignIn,
  // so checking isAuthenticated is sufficient — no need to inspect the
  // shared NextAuth cookie which would let other tabs sneak through.
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

  // Unauthenticated — show Super Admin sign-in
  return <SuperAdminSignIn />;
}
