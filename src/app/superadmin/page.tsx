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
import { CalendarPage } from "@/components/pages/calendar-page";
import { SubscriptionPage } from "@/components/pages/subscription-page";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { TabIndicator } from "@/components/tab-indicator";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { data: session, status } = useSession({
    refetchOnWindowFocus: false,
  });
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const login = useAppStore((s) => s.login);
  const logout = useAppStore((s) => s.logout);
  const [sessionError, setSessionError] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Sync NextAuth session → Zustand store ONLY on initial load
  useEffect(() => {
    // Only run once when component first mounts
    if (hasInitialized) return;
    
    if (status === "loading") return;
    
    setHasInitialized(true);

    if (status === "authenticated" && session?.user) {
      // If user is not SuperAdmin, don't log them in to Zustand
      if (session.user.role !== "SuperAdmin") {
        // Clear any existing auth state
        logout();
        return;
      }
      
      // Only login if not already authenticated or if user changed
      if (!isAuthenticated || useAppStore.getState().currentUser?.id !== session.user.id) {
        login({
          id: session.user.id,
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          role: session.user.role as UserRole,
          instituteId: session.user.instituteId,
          branchId: session.user.branchId,
        });
      }
    } else if (status === "unauthenticated") {
      // Clear Zustand auth if NextAuth session is gone
      if (isAuthenticated) {
        logout();
      }
    }
  }, [status, hasInitialized]); // Removed session, isAuthenticated, login, logout from deps

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

  // If authenticated as SuperAdmin — show the main app
  if (status === "authenticated" && session?.user?.role === "SuperAdmin" && isAuthenticated) {
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

  // If authenticated but NOT SuperAdmin — show access denied
  if (status === "authenticated" && session?.user?.role !== "SuperAdmin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You do not have permission to access the Super Admin portal. This area is restricted to Super Administrators only.
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-lg transition-all"
            >
              Return to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Unauthenticated — show Super Admin sign-in
  return <SuperAdminSignIn />;
}
