"use client";

import { useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { LandingPage } from "@/components/landing-page";
import { LoginView } from "@/components/login-view";
import { SignInView } from "@/components/sign-in-view";
import { SignUpView } from "@/components/sign-up-view";
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
import { AnimatePresence, motion } from "framer-motion";

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

type UnauthView = "landing" | "signin" | "signup" | "login";

function AppShell() {
  const currentPage = useAppStore((s) => s.currentPage);
  const theme = useAppStore((s) => s.theme);

  // Sync dark mode class
  const handleThemeSync = useCallback(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
  handleThemeSync();

  const PageComponent = pageComponents[currentPage];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 p-6">
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
                  <h2 className="text-lg font-medium text-muted-foreground">
                    Page not found
                  </h2>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    The page &quot;{currentPage}&quot; is not available yet.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </main>
        <div className="mt-auto border-t">
          <footer className="px-6 py-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>&copy; 2025 CampusHub</span>
              <span className="hidden sm:inline text-muted-foreground/50">
                Campus Management Platform
              </span>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Home() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [unauthView, setUnauthView] = useState<UnauthView>("landing");

  const handleGoToSignIn = useCallback(() => setUnauthView("signin"), []);
  const handleGoToSignUp = useCallback(() => setUnauthView("signup"), []);
  const handleGoToLogin = useCallback(() => setUnauthView("login"), []);
  const handleGoToLanding = useCallback(() => setUnauthView("landing"), []);

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
          <SignInView
            onSignIn={handleGoToLogin}
            onBack={handleGoToLanding}
            onGoToSignUp={handleGoToSignUp}
          />
        </motion.div>
      ) : unauthView === "signup" ? (
        <motion.div
          key="signup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SignUpView
            onGoToSignIn={handleGoToSignIn}
            onBack={handleGoToLanding}
          />
        </motion.div>
      ) : unauthView === "login" ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LoginView />
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
            onGoToSignIn={handleGoToSignIn}
            onGoToSignUp={handleGoToSignUp}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
