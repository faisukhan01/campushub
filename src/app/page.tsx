"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { LoginView } from "@/components/login-view";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { CoursesPage } from "@/components/pages/courses-page";
import { AttendancePage } from "@/components/pages/attendance-page";
import { AssignmentsPage } from "@/components/pages/assignments-page";
import { GradesPage } from "@/components/pages/grades-page";
import { TimetablePage } from "@/components/pages/timetable-page";
import { FeesPage } from "@/components/pages/fees-page";
import { MessagesPage } from "@/components/pages/messages-page";
import { AnnouncementsPage } from "@/components/pages/announcements-page";
import { LeavePage } from "@/components/pages/leave-page";
import { SupportPage } from "@/components/pages/support-page";
import { UsersPage } from "@/components/pages/users-page";
import { SettingsPage } from "@/components/pages/settings-page";
import { ReportsPage } from "@/components/pages/reports-page";
import { BranchesPage } from "@/components/pages/branches-page";
import { DepartmentsPage } from "@/components/pages/departments-page";
import { BatchesPage } from "@/components/pages/batches-page";
import { DocumentsPage } from "@/components/pages/documents-page";
import { AnalyticsPage } from "@/components/pages/analytics-page";
import { InstitutesPage } from "@/components/pages/institutes-page";
import { ChildrenPage } from "@/components/pages/children-page";
import { AssessmentsPage } from "@/components/pages/assessments-page";
import { StudentsPage } from "@/components/pages/students-page";

// Page routing map
const pageComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  courses: CoursesPage,
  attendance: AttendancePage,
  assignments: AssignmentsPage,
  grades: GradesPage,
  timetable: TimetablePage,
  fees: FeesPage,
  messages: MessagesPage,
  announcements: AnnouncementsPage,
  leave: LeavePage,
  support: SupportPage,
  users: UsersPage,
  settings: SettingsPage,
  reports: ReportsPage,
  branches: BranchesPage,
  departments: DepartmentsPage,
  batches: BatchesPage,
  documents: DocumentsPage,
  analytics: AnalyticsPage,
  institutes: InstitutesPage,
  children: ChildrenPage,
  assessments: AssessmentsPage,
  students: StudentsPage,
};

function AppShell() {
  const currentPage = useAppStore((s) => s.currentPage);
  const theme = useAppStore((s) => s.theme);

  // Apply dark class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const PageComponent = pageComponents[currentPage];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6">
          {PageComponent ? <PageComponent /> : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-muted-foreground">Page Not Found</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  The page &quot;{currentPage}&quot; is not available yet.
                </p>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Home() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated ? <AppShell /> : <LoginView />}
    </div>
  );
}
