"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { LandingPage } from "@/components/landing-page";
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

type AppView = "landing" | "login" | "app";

function AppShell() {
  const currentPage = useAppStore((s) => s.currentPage);
  const theme = useAppStore((s) => s.theme);

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
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6">
          {PageComponent ? (
            <div key={currentPage}>
              <PageComponent />
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-muted-foreground">
                  Page Not Found
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  The page &quot;{currentPage}&quot; is not available yet.
                </p>
              </div>
            </div>
          )}
        </main>
        <div className="mt-auto">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <footer className="px-4 sm:px-6 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/80">
                &copy; 2025 CampusHub. All rights reserved.
              </span>
              <span className="hidden sm:inline-block text-muted-foreground/60 text-[11px]">
                Made with{" "}
                <span className="text-red-400 inline-block animate-pulse">
                  ❤️
                </span>{" "}
                by{" "}
                <span className="font-medium text-emerald-600/70 dark:text-emerald-400/60">
                  CampusHub Team
                </span>
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Privacy
                </a>
                <span className="text-muted-foreground/30">&middot;</span>
                <a
                  href="#"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Terms
                </a>
                <span className="text-muted-foreground/30">&middot;</span>
                <a
                  href="#"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Home() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [view, setView] = useState<AppView>("landing");

  const handleEnterDemo = useCallback(() => {
    setView("login");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated ? (
        <AppShell />
      ) : view === "login" ? (
        <LoginView />
      ) : (
        <LandingPage onEnterDemo={handleEnterDemo} />
      )}
    </div>
  );
}
