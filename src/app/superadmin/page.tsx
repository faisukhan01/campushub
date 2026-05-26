"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/app-store";
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
import { Shield } from "lucide-react";
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

/**
 * Super Admin portal entry point.
 *
 * Auth source of truth: Zustand store, initialised synchronously from THIS
 * tab's sessionStorage on module load.  SuperAdminSignIn writes the JWT and
 * user data to sessionStorage then calls login() directly on the store —
 * no shared cookie is touched, no other tab is affected.
 */
export default function SuperAdminPage() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const currentUser = useAppStore((s) => s.currentUser);

  // If this tab's session somehow belongs to a non-SuperAdmin user, show the
  // sign-in form.  This is a safety net; it should not occur in normal use
  // because SuperAdminSignIn already checks the role before calling login().
  if (isAuthenticated && currentUser?.role !== "SuperAdmin") {
    return <SuperAdminSignIn />;
  }

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

  // Not authenticated in this tab — show the sign-in form
  return <SuperAdminSignIn />;
}
