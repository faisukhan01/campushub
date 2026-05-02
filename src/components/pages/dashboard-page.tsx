"use client";

import { useAppStore } from "@/store/app-store";
import { TeacherDashboard } from "./teacher-dashboard";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Building2,
  Shield,
} from "lucide-react";

// ---- Mock Data ----

const studentStats = [
  { label: "Attendance", value: "87%", highlight: true },
  { label: "GPA", value: "3.72", highlight: false },
  { label: "Courses", value: "10", highlight: false },
  { label: "Pending", value: "PKR 12K", highlight: false },
];

const upcomingExams = [
  { subject: "Chemistry", type: "Quiz", date: "Mar 10, 2025", daysLeft: 0 },
  { subject: "Physics", type: "Quiz", date: "Mar 12, 2025", daysLeft: 2 },
  { subject: "Mathematics", type: "Mid-term", date: "Mar 15, 2025", daysLeft: 5 },
  { subject: "English", type: "Final", date: "Mar 25, 2025", daysLeft: 15 },
];

const subjects = [
  { name: "English", teacher: "Ms. Fatima Noor", attendance: 92 },
  { name: "Mathematics", teacher: "Mr. Ahmed Khan", attendance: 85 },
  { name: "Physics", teacher: "Mr. Tariq Malik", attendance: 78 },
  { name: "Chemistry", teacher: "Dr. Sana Ali", attendance: 90 },
  { name: "Biology", teacher: "Ms. Hina Raza", attendance: 88 },
  { name: "Islamiat", teacher: "Mr. Imran Shah", attendance: 95 },
  { name: "Quran", teacher: "Qari Bilal Ahmad", attendance: 97 },
  { name: "Pakistan Studies", teacher: "Ms. Nadia Hussain", attendance: 82 },
  { name: "Computer Science", teacher: "Mr. Usman Tariq", attendance: 91 },
  { name: "Urdu", teacher: "Ms. Samina Akhtar", attendance: 86 },
];

const recentActivity = [
  { text: "Assignment #3 submitted for Mathematics", time: "2 hours ago" },
  { text: "Quiz results published for Physics", time: "Yesterday" },
  { text: "Attendance marked for English", time: "Yesterday" },
  { text: "Fee reminder issued — PKR 12,000 due", time: "2 days ago" },
  { text: "New announcement from administration", time: "3 days ago" },
];

// ---- Helpers ----

function getAttendanceColor(rate: number) {
  if (rate >= 85) return "bg-emerald-500";
  if (rate >= 75) return "bg-amber-500";
  return "bg-red-500";
}

function getDaysLeftBadge(daysLeft: number) {
  if (daysLeft <= 0) {
    return (
      <Badge className="rounded-full text-[10px] px-2 border-0 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        Today
      </Badge>
    );
  }
  if (daysLeft <= 3) {
    return (
      <Badge className="rounded-full text-[10px] px-2 border-0 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        {daysLeft}d left
      </Badge>
    );
  }
  if (daysLeft <= 7) {
    return (
      <Badge className="rounded-full text-[10px] px-2 border-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
        {daysLeft}d left
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full text-[10px] px-2 border-0 bg-muted text-muted-foreground">
      {daysLeft}d left
    </Badge>
  );
}

// ---- Student Dashboard ----

function StudentDashboard({ name }: { name: string }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {name}
          </p>
        </div>
        <Badge
          variant="outline"
          className="rounded-full text-xs w-fit"
        >
          Academic Year 2024-2025
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {studentStats.map((stat) => (
          <Card
            key={stat.label}
            className="shadow-none py-0 gap-0"
          >
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  stat.highlight && stat.label === "Attendance"
                    ? Number(stat.value) >= 75
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                    : undefined
                )}
              >
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Exams Table */}
      <div>
        <h2 className="text-sm font-medium mb-3">Upcoming Exams</h2>
        <Card className="shadow-none py-0 gap-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Subject
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Type
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Date
                  </TableHead>
                  <TableHead className="text-xs text-muted-foreground uppercase tracking-wider font-medium text-right">
                    Days Left
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingExams.map((exam) => (
                  <TableRow key={exam.subject + exam.type}>
                    <TableCell className="text-sm font-medium py-3">
                      {exam.subject}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground py-3">
                      {exam.type}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground py-3">
                      {exam.date}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      {getDaysLeftBadge(exam.daysLeft)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* My Subjects Grid */}
      <div>
        <h2 className="text-sm font-medium mb-3">My Subjects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {subjects.map((subject) => (
            <Card
              key={subject.name}
              className="shadow-none py-0 gap-0 hover:bg-accent transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted flex-shrink-0" />
                  <p className="text-sm font-medium truncate">{subject.name}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate mb-3 ml-3.5">
                  {subject.teacher}
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        getAttendanceColor(subject.attendance)
                      )}
                      style={{ width: `${subject.attendance}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                    {subject.attendance}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-medium mb-3">Recent Activity</h2>
        <Card className="shadow-none py-0 gap-0">
          <CardContent className="p-0 divide-y">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-muted flex-shrink-0" />
                <p className="text-sm flex-1 min-w-0">{item.text}</p>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {item.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---- Placeholder Dashboard for other roles ----

function RolePlaceholder({ role }: { role: string }) {
  const roleConfig: Record<string, { icon: React.ElementType; stats: { label: string; value: string }[] }> = {
    SuperAdmin: {
      icon: Shield,
      stats: [
        { label: "Institutes", value: "12" },
        { label: "Branches", value: "34" },
        { label: "Active Users", value: "2,847" },
        { label: "Monthly Revenue", value: "$48.2K" },
      ],
    },
    InstituteAdmin: {
      icon: Building2,
      stats: [
        { label: "Branches", value: "5" },
        { label: "Students", value: "1,240" },
        { label: "Faculty", value: "86" },
        { label: "Courses", value: "120" },
      ],
    },
    BranchAdmin: {
      icon: Users,
      stats: [
        { label: "Students", value: "480" },
        { label: "Faculty", value: "28" },
        { label: "Batches", value: "12" },
        { label: "Courses", value: "45" },
      ],
    },
  };

  const config = roleConfig[role];
  if (!config) return null;
  const RoleIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {role} Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back
          </p>
        </div>
        <Badge
          variant="outline"
          className="rounded-full text-xs w-fit"
        >
          Academic Year 2024-2025
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {config.stats.map((stat) => (
          <Card
            key={stat.label}
            className="shadow-none py-0 gap-0"
          >
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon */}
      <Card className="shadow-none py-0 gap-0">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 rounded-xl border flex items-center justify-center mb-4">
            <RoleIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium">
            {role} Dashboard
          </h3>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
            Dashboard coming soon. Analytics, reports, and management tools are being prepared.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Main Component ----

export function DashboardPage() {
  const currentUser = useAppStore((s) => s.currentUser);

  if (!currentUser) return null;

  if (currentUser.role === "Teacher") {
    return <TeacherDashboard />;
  }

  if (currentUser.role === "Student") {
    const firstName = currentUser.name?.split(" ")[0] ?? "Student";
    return <StudentDashboard name={firstName} />;
  }

  return <RolePlaceholder role={currentUser.role} />;
}
