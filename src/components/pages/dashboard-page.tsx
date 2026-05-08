"use client";

import { useAppStore } from "@/store/app-store";
import { SuperAdminDashboard } from "./dashboards/super-admin-dashboard";
import { InstituteAdminDashboard } from "./dashboards/institute-admin-dashboard";
import { BranchAdminDashboard } from "./dashboards/branch-admin-dashboard";
import { TeacherDashboard } from "./dashboards/teacher-dashboard";
import { StudentDashboard } from "./dashboards/student-dashboard";

export function DashboardPage() {
  const currentUser = useAppStore((s) => s.currentUser);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  switch (currentUser.role) {
    case "SuperAdmin":
      return <SuperAdminDashboard />;
    case "InstituteAdmin":
      return <InstituteAdminDashboard />;
    case "BranchAdmin":
      return <BranchAdminDashboard />;
    case "Teacher":
      return <TeacherDashboard />;
    case "Student":
      return <StudentDashboard />;
    default:
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Dashboard not available for this role</p>
        </div>
      );
  }
}
