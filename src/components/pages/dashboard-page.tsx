"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/app-store";
import { getDashboardData } from "@/lib/mock-data";
import {
  mockParents,
  mockStudents,
  mockGrades,
  mockMessages,
  mockAnnouncements,
  mockCalendarEvents,
  mockEnrollments,
  mockFeeInvoices,
  mockAssignments,
  mockCourses,
  mockTimetable,
} from "@/lib/mock-data";
import { useMemo } from "react";
import type {
  DashboardStats,
  ParentDashboardStats,
  StudentDashboardStats,
  TeacherDashboardStats,
  UserRole,
} from "@/types";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  CreditCard,
  Calendar,
  MessageSquare,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  ChevronRight,
  Bell,
  Heart,
  BookOpen,
  Award,
  ClipboardCheck,
  DollarSign,
  UserPlus,
  FileText,
  Layers,
  MapPin,
  Shield,
  HelpCircle,
  Building2,
  FolderTree,
  Sparkles,
  Bot,
  Library,
  BarChart as BarChartIcon,
  CalendarDays,
  Target,
  History,
  Server,
  ArrowUpRight,
  Settings,
} from "lucide-react";

// ---- Helpers ----

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAttendanceColor(rate: number) {
  if (rate >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (rate >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getAttendanceBg(rate: number) {
  if (rate >= 85) return "bg-emerald-500";
  if (rate >= 75) return "bg-amber-500";
  return "bg-red-500";
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getTodayName(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

function getTodayFormatted(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ---- Stat Card ----

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  color?: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 ${
              color ?? "bg-emerald-100 dark:bg-emerald-900/50"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                color
                  ? "text-white"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            />
          </div>
        </div>
        {trend && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Activity Item ----

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// ---- Quick Action Button ----

function QuickActionButton({
  icon: Icon,
  label,
  color,
  page,
}: {
  icon: React.ElementType;
  label: string;
  color?: string;
  page?: string;
}) {
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  return (
    <Button
      variant="outline"
      className="flex flex-col items-center gap-2 h-auto py-4 px-3 hover:shadow-md transition-shadow"
      onClick={() => page && setCurrentPage(page)}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          color ?? "bg-emerald-100 dark:bg-emerald-900/50"
        }`}
      >
        <Icon
          className={`w-5 h-5 ${
            color
              ? "text-white"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        />
      </div>
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}

// ---- Urgency Badge ----

function UrgencyBadge({ dueDate }: { dueDate: string }) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return (
      <Badge variant="destructive" className="text-[10px]">
        Overdue
      </Badge>
    );
  }
  if (diffDays <= 3) {
    return (
      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-[10px]">
        Due Soon
      </Badge>
    );
  }
  return (
    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">
      Upcoming
    </Badge>
  );
}

// ---- Main Component ----

export function DashboardPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const currentUser = useAppStore((s) => s.currentUser);
  const data = useMemo<DashboardStats | null>(
    () => (currentRole ? getDashboardData(currentRole) : null),
    [currentRole]
  );

  if (!data || !currentUser) return null;

  const stats = data as Record<string, unknown>;

  // ============================================================
  // PARENT ROLE (keep as-is)
  // ============================================================
  if (currentRole === "Parent") {
    const parentData = data as ParentDashboardStats;
    const parent = mockParents.find((p) => p.id === currentUser.id);
    const children = parent?.children ?? mockStudents.slice(0, 1);

    const childIds = children.map((c) => c.id);
    const childFees = mockFeeInvoices.filter((f) =>
      childIds.includes(f.studentId)
    );
    const totalPaid = childFees.reduce((s, f) => s + f.paidAmount, 0);
    const totalPending = childFees.reduce((s, f) => s + f.balanceAmount, 0);
    const overdueCount = childFees.filter(
      (f) => f.status === "Overdue"
    ).length;

    const upcomingEvents = mockCalendarEvents
      .filter((e) => new Date(e.startDate) >= new Date())
      .slice(0, 4);

    const parentMessages = mockMessages
      .filter(
        (m) =>
          m.senderId === currentUser.id || m.receiverId === currentUser.id
      )
      .slice(-3)
      .reverse();

    const parentAnnouncements = mockAnnouncements
      .filter(
        (a) =>
          a.targetAudience.includes("Parent") ||
          a.targetAudience.includes("Student")
      )
      .slice(0, 3);

    const recentActivity = stats.recentActivity as {
      title: string;
      description: string;
      timestamp: string;
    }[];

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {currentUser.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s an overview of your children&apos;s progress today.
            </p>
          </div>
          <Badge variant="outline" className="w-fit gap-1">
            <Heart className="w-3 h-3 text-emerald-500" />
            Parent Portal
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Children"
            value={parentData.childrenCount}
            icon={Users}
            color="bg-emerald-500"
          />
          <StatCard
            title="Total Fees Paid"
            value={`$${totalPaid.toLocaleString()}`}
            icon={CreditCard}
            subtitle={totalPending > 0 ? `$${totalPending.toLocaleString()} pending` : "All clear"}
            color={totalPending > 0 ? "bg-amber-500" : "bg-emerald-500"}
          />
          <StatCard
            title="Pending Tasks"
            value={parentData.pendingTasks}
            icon={Clock}
          />
          <StatCard
            title="Upcoming Events"
            value={upcomingEvents.length}
            icon={Calendar}
          />
        </div>

        {/* Children Overview Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Children</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parentData.childrenData.map((childData) => {
              const child = children.find(
                (c) => c.id === childData.childId
              ) ?? children[0];
              const childGrades = mockGrades.filter(
                (g) => g.studentId === childData.childId
              );
              const childEnrollments = mockEnrollments.filter(
                (e) => e.studentId === childData.childId
              );
              const pendingAssignments = mockAssignments.filter(
                (a) =>
                  childEnrollments.some(
                    (e) => e.courseId === a.courseId
                  ) && new Date(a.dueDate) > new Date()
              );
              const latestGrade = childGrades[0];

              return (
                <Card
                  key={childData.childId}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                          {getInitials(child.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-base">
                          {child.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {child.programName} &middot; Sem {child.semester} &middot;{" "}
                          {child.batchName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-[11px] text-muted-foreground mb-1">
                          Attendance
                        </p>
                        <p
                          className={`text-lg font-bold ${getAttendanceColor(childData.attendanceRate)}`}
                        >
                          {childData.attendanceRate}%
                        </p>
                        <Progress
                          value={childData.attendanceRate}
                          className="mt-1 h-1.5"
                        />
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-[11px] text-muted-foreground mb-1">
                          Current GPA
                        </p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {childData.gpa.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {childData.gpa >= 3.5
                            ? "Excellent"
                            : childData.gpa >= 3.0
                              ? "Good"
                              : "Average"}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-[11px] text-muted-foreground mb-1">
                          Pending Tasks
                        </p>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          {pendingAssignments.length}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          assignments
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-[11px] text-muted-foreground mb-1">
                          Latest Grade
                        </p>
                        {latestGrade ? (
                          <>
                            <Badge
                              variant={
                                latestGrade.gradePoint >= 3.5
                                  ? "default"
                                  : latestGrade.gradePoint >= 2.5
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-sm"
                            >
                              {latestGrade.letterGrade}
                            </Badge>
                            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                              {latestGrade.courseName.split(" ").slice(0, 2).join(" ")}...
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            --
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Grid: Events, Messages, Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 py-2 border-b last:border-0"
                  >
                    <div
                      className="w-2 h-full min-h-[32px] rounded-full flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: event.color ?? "#10b981" }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateShort(event.startDate)}
                        {event.location ? ` · ${event.location}` : ""}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[10px] mt-1"
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parentMessages.length > 0 ? (
                  parentMessages.map((msg) => {
                    const isFromMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className="flex items-start gap-3 py-2 border-b last:border-0"
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="text-[10px] bg-muted">
                            {getInitials(
                              isFromMe ? msg.receiverName : msg.senderName
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-medium">
                            {isFromMe
                              ? `To: ${msg.receiverName}`
                              : msg.senderName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {msg.content}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatDateShort(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent messages
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-500" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parentAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className="flex items-start gap-3 py-2 border-b last:border-0"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        ann.isImportant
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-emerald-100 dark:bg-emerald-900/30"
                      }`}
                    >
                      <Megaphone
                        className={`w-3.5 h-3.5 ${
                          ann.isImportant
                            ? "text-red-600 dark:text-red-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium truncate">
                          {ann.title}
                        </p>
                        {ann.isImportant && (
                          <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {ann.content}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatDateShort(ann.createdAt)} &middot;{" "}
                        {ann.authorName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Status Summary + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Fee Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Fee Status Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${totalPaid.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Amount</p>
                    <p
                      className={`text-xl font-bold ${
                        totalPending > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      ${totalPending.toLocaleString()}
                    </p>
                  </div>
                  {totalPending > 0 && (
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  )}
                </div>
                {overdueCount > 0 && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-700 dark:text-red-300">
                      You have {overdueCount} overdue payment
                      {overdueCount > 1 ? "s" : ""}. Please pay immediately.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications / Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parentData.childrenData.map((child) => {
                  const alerts: { icon: React.ElementType; text: string; color: string }[] = [];
                  if (child.attendanceRate < 85) {
                    alerts.push({
                      icon: AlertCircle,
                      text: `${child.childName}'s attendance is below 85% (${child.attendanceRate}%)`,
                      color: "text-red-600 dark:text-red-400",
                    });
                  }
                  if (child.pendingAssignments > 0) {
                    alerts.push({
                      icon: FileEdit,
                      text: `${child.childName} has ${child.pendingAssignments} pending assignment${child.pendingAssignments > 1 ? "s" : ""}`,
                      color: "text-amber-600 dark:text-amber-400",
                    });
                  }
                  if (child.gpa < 3.0) {
                    alerts.push({
                      icon: TrendingUp,
                      text: `${child.childName}'s GPA needs attention (${child.gpa.toFixed(2)})`,
                      color: "text-amber-600 dark:text-amber-400",
                    });
                  }
                  if (alerts.length === 0) {
                    alerts.push({
                      icon: CheckCircle2,
                      text: `Everything looks good for ${child.childName}!`,
                      color: "text-emerald-600 dark:text-emerald-400",
                    });
                  }
                  return alerts.map((alert, i) => (
                    <div
                      key={`${child.childId}-${i}`}
                      className="flex items-start gap-3 py-2"
                    >
                      <alert.icon
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.color}`}
                      />
                      <p className="text-sm">{alert.text}</p>
                    </div>
                  ));
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================================
  // STUDENT ROLE
  // ============================================================
  if (currentRole === "Student") {
    const studentData = data as StudentDashboardStats;
    const student = mockStudents.find((s) => s.id === currentUser.id) ?? mockStudents[0];

    // Today's timetable
    const todayName = getTodayName() as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
    const todayClasses = mockTimetable.filter(
      (t) => t.batchId === student.batchId && t.day === todayName
    ).slice(0, 3);

    // Upcoming assignments
    const enrolledCourseIds = mockEnrollments
      .filter((e) => e.studentId === student.id)
      .map((e) => e.courseId);
    const upcomingAssignments = mockAssignments
      .filter((a) => enrolledCourseIds.includes(a.courseId) && new Date(a.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);

    // Recent announcements
    const studentAnnouncements = mockAnnouncements
      .filter((a) => a.targetAudience.includes("Student"))
      .slice(0, 3);

    // Recent grades
    const recentGrades = mockGrades
      .filter((g) => g.studentId === student.id)
      .slice(0, 3);

    // Attendance trend (mock weekly)
    const attendanceTrend = studentData.attendanceTrend ?? [
      { week: "Mon", rate: 90 },
      { week: "Tue", rate: 85 },
      { week: "Wed", rate: 92 },
      { week: "Thu", rate: 88 },
      { week: "Fri", rate: 95 },
      { week: "Sat", rate: 78 },
    ];

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {currentUser.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">{getTodayFormatted()}</p>
          </div>
          <Badge variant="outline" className="w-fit gap-1">
            <GraduationCap className="w-3 h-3 text-emerald-500" />
            Student Portal
          </Badge>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Enrolled Courses"
            value={studentData.enrolledCourses}
            icon={BookOpen}
            color="bg-emerald-500"
          />
          <StatCard
            title="Overall GPA"
            value={studentData.overallGPA.toFixed(2)}
            icon={Award}
            color="bg-teal-500"
            trend="+0.2 from last semester"
          />
          <StatCard
            title="Attendance Rate"
            value={`${studentData.attendanceRate}%`}
            icon={Activity}
            color={studentData.attendanceRate >= 85 ? "bg-emerald-500" : "bg-amber-500"}
            trend="+2.5% this week"
          />
          <StatCard
            title="Pending Fees"
            value={`$${studentData.pendingFees.toLocaleString()}`}
            icon={CreditCard}
            color="bg-amber-500"
          />
        </div>

        {/* Timetable + Attendance Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Today's Timetable */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                Today&apos;s Timetable
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayClasses.length > 0 ? (
                <div className="space-y-3">
                  {todayClasses.map((cls, i) => (
                    <div key={cls.id} className="flex items-center gap-3 py-2">
                      <div className="text-center min-w-[52px]">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{cls.startTime}</p>
                        <p className="text-[10px] text-muted-foreground">{cls.endTime}</p>
                      </div>
                      <Separator orientation="vertical" className="h-10" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{cls.courseName}</p>
                        <p className="text-xs text-muted-foreground">
                          {cls.roomName} &middot; {cls.teacherName} &middot; {cls.courseCode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No classes scheduled for today
                </p>
              )}
            </CardContent>
          </Card>

          {/* Attendance Trend */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                Attendance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                    formatter={(value: number) => [`${value}%`, "Attendance"]}
                  />
                  <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Deadlines */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAssignments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAssignments.map((asgn) => (
                  <div key={asgn.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-sm font-medium truncate">{asgn.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {asgn.courseName} &middot; {asgn.totalMarks} marks
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {formatDateShort(asgn.dueDate)}
                      </span>
                      <UrgencyBadge dueDate={asgn.dueDate} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming deadlines
              </p>
            )}
          </CardContent>
        </Card>

        {/* Announcements + Recent Grades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Announcements */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-500" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentAnnouncements.map((ann, i) => (
                  <div key={ann.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium truncate">{ann.title}</p>
                        {i === 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {ann.content}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatDateShort(ann.createdAt)} &middot; {ann.authorName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500" />
                Recent Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentGrades.length > 0 ? (
                <div className="space-y-3">
                  {recentGrades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{grade.courseName}</p>
                        <p className="text-xs text-muted-foreground">
                          {grade.assessmentName ?? "Assignment"} &middot;{" "}
                          {grade.marksObtained}/{grade.totalMarks}
                        </p>
                      </div>
                      <Badge
                        variant={
                          grade.gradePoint >= 3.5
                            ? "default"
                            : grade.gradePoint >= 2.5
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {grade.letterGrade}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No grades yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity + Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activity Timeline */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <ActivityItem title="Submitted Assignment 4" description="Data Structures - Graph Algorithms" time="2 hours ago" />
                <ActivityItem title="Grade Published" description="Machine Learning Mid-term: A (85/100)" time="1 day ago" />
                <ActivityItem title="Fee Payment" description="Semester 6 Tuition - $1,250 paid" time="2 days ago" />
                <ActivityItem title="Attendance Warning" description="Operating Systems below 75%" time="3 days ago" />
                <ActivityItem title="Course Enrolled" description="Advanced Algorithms (CS401)" time="5 days ago" />
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "GPA", value: 3.8, max: 4.0, color: "text-emerald-600 dark:text-emerald-400", trackColor: "stroke-emerald-200 dark:stroke-emerald-900/50" },
                  { label: "Attendance", value: 88, max: 100, color: "text-teal-600 dark:text-teal-400", trackColor: "stroke-teal-200 dark:stroke-teal-900/50", suffix: "%" },
                  { label: "Credits", value: 72, max: 140, color: "text-amber-600 dark:text-amber-400", trackColor: "stroke-amber-200 dark:stroke-amber-900/50" },
                  { label: "Courses Done", value: 18, max: 42, color: "text-rose-600 dark:text-rose-400", trackColor: "stroke-rose-200 dark:stroke-rose-900/50" },
                ].map((item) => {
                  const pct = Math.round((item.value / item.max) * 100);
                  const circumference = 2 * Math.PI * 36;
                  const offset = circumference - (pct / 100) * circumference;
                  return (
                    <div key={item.label} className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                      <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="36" fill="none" strokeWidth="6" className={item.trackColor} />
                          <circle cx="40" cy="40" r="36" fill="none" strokeWidth="6" stroke="currentColor" className={item.color} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-sm font-bold ${item.color}`}>{item.suffix ? `${item.value}%` : item.value}</span>
                        </div>
                      </div>
                      <p className="text-xs font-medium mt-2">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">of {item.suffix ? item.max + "%" : item.max}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
              <QuickActionButton icon={Sparkles} label="AI Assistant" color="bg-gradient-to-br from-emerald-500 to-teal-500" page="ai-assistant" />
              <QuickActionButton icon={CalendarDays} label="Calendar" page="calendar" />
              <QuickActionButton icon={Library} label="Resources" color="bg-teal-500" page="library" />
              <QuickActionButton icon={BarChartIcon} label="Analytics" color="bg-amber-500" page="performance" />
              <QuickActionButton icon={FileEdit} label="Assignments" page="assignments" />
              <QuickActionButton icon={CreditCard} label="Fee Ledger" color="bg-teal-500" page="fees" />
              <QuickActionButton icon={MessageSquare} label="Messages" color="bg-amber-500" page="messages" />
              <QuickActionButton icon={HelpCircle} label="Help Center" color="bg-rose-500" page="support" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================
  // TEACHER ROLE
  // ============================================================
  if (currentRole === "Teacher") {
    const teacherData = data as TeacherDashboardStats;
    const teacher = mockCourses.find(
      (c) => c.teacherId === currentUser.id
    ) ?? mockCourses[0];

    // Teacher's courses
    const myCourses = mockCourses.filter((c) => c.teacherId === currentUser.id);

    // Today's classes
    const todayName = getTodayName() as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
    const todayClasses = mockTimetable.filter(
      (t) => t.teacherId === currentUser.id && t.day === todayName
    );

    // Course attendance data
    const courseAttendance = teacherData.chartsData?.courseAttendance ?? [
      { course: "DS & Algo", rate: 89 },
      { course: "Machine Learning", rate: 92 },
    ];

    // Low attendance students
    const lowAttendanceStudents = [
      { name: "Liam Johnson", course: "DS & Algo", rate: 72 },
      { name: "Ava Chen", course: "DS & Algo", rate: 68 },
      { name: "Noah Williams", course: "Marketing", rate: 74 },
    ];

    // Teacher messages
    const teacherMessages = mockMessages
      .filter(
        (m) => m.senderId === currentUser.id || m.receiverId === currentUser.id
      )
      .slice(-3)
      .reverse();

    // Teacher announcements
    const teacherAnnouncements = mockAnnouncements
      .filter((a) => a.targetAudience.includes("Teacher"))
      .slice(0, 3);

    // Total students across all courses
    const totalStudents = myCourses.reduce((s, c) => s + c.enrolledCount, 0);

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {currentUser.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">{getTodayFormatted()}</p>
          </div>
          <Badge variant="outline" className="w-fit gap-1">
            <ClipboardCheck className="w-3 h-3 text-emerald-500" />
            Teacher Portal
          </Badge>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            title="My Courses"
            value={myCourses.length}
            icon={BookOpen}
            color="bg-emerald-500"
          />
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            color="bg-teal-500"
          />
          <StatCard
            title="Today's Classes"
            value={todayClasses.length}
            icon={Clock}
            color="bg-amber-500"
          />
          <StatCard
            title="Pending Grading"
            value={teacherData.pendingGrading}
            icon={FileEdit}
            color="bg-rose-500"
          />
          <StatCard
            title="Avg Attendance"
            value={`${teacherData.attendanceRate}%`}
            icon={Activity}
            color="bg-emerald-500"
            trend="+1.5% this week"
          />
        </div>

        {/* Today's Classes + Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Today's Classes */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Today&apos;s Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayClasses.length > 0 ? (
                <div className="space-y-3">
                  {todayClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                      <div className="text-center min-w-[52px]">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{cls.startTime}</p>
                        <p className="text-[10px] text-muted-foreground">{cls.endTime}</p>
                      </div>
                      <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: cls.color ?? "#10b981" }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{cls.courseName}</p>
                        <p className="text-xs text-muted-foreground">
                          {cls.roomName} &middot; {cls.batchName} &middot; {cls.courseCode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No classes today
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">3 sessions need attendance marking</p>
                    <p className="text-xs text-muted-foreground">DS & Algo, Machine Learning</p>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Mark Now
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">5 submissions need grading</p>
                    <p className="text-xs text-muted-foreground">BST Implementation, Graph Traversal</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">1 assessment scheduled this week</p>
                    <p className="text-xs text-muted-foreground">Mid-term Quiz - DS & Algo</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Setup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Attendance Chart + Low Attendance Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Course Attendance */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Course Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={courseAttendance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="course" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                    formatter={(value: number) => [`${value}%`, "Attendance"]}
                  />
                  <Bar dataKey="rate" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Low Attendance Flags */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Low Attendance Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">Students below 75% attendance threshold</p>
              <div className="space-y-3">
                {lowAttendanceStudents.map((student, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.course}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${getAttendanceColor(student.rate)}`}>
                      {student.rate}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages + Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Messages */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teacherMessages.length > 0 ? (
                  teacherMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-[10px] bg-muted">
                          {getInitials(msg.senderId === currentUser.id ? msg.receiverName : msg.senderName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-medium">{msg.senderId === currentUser.id ? msg.receiverName : msg.senderName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{msg.content}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDateShort(msg.createdAt)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent messages</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-500" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teacherAnnouncements.map((ann) => (
                  <div key={ann.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ann.isImportant ? "bg-red-100 dark:bg-red-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}>
                      <Megaphone className={`w-3.5 h-3.5 ${ann.isImportant ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{ann.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ann.content}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{formatDateShort(ann.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================================
  // ADMIN ROLES (SuperAdmin, InstituteAdmin, BranchAdmin)
  // ============================================================
  if (
    currentRole === "SuperAdmin" ||
    currentRole === "InstituteAdmin" ||
    currentRole === "BranchAdmin"
  ) {
    const roleLabel = currentRole as UserRole;

    // Role-specific stat cards
    const adminStatCards = [
      { title: "Total Students", value: (stats.totalStudents as number) ?? 6200, icon: GraduationCap, color: "bg-emerald-500" },
      { title: "Total Teachers", value: (stats.totalTeachers as number) ?? 420, icon: Users, color: "bg-teal-500" },
      { title: "Total Courses", value: (stats.totalCourses as number) ?? 45, icon: BookOpen, color: "bg-amber-500" },
    ];

    if (currentRole === "SuperAdmin") {
      adminStatCards.push(
        { title: "Total Branches", value: (stats.totalBranches as number) ?? 3, icon: MapPin, color: "bg-rose-500" },
        { title: "Fee Collection", value: "87%", icon: DollarSign, color: "bg-emerald-500", trend: "+5% this month" }
      );
    } else if (currentRole === "InstituteAdmin") {
      adminStatCards.push(
        { title: "Total Branches", value: (stats.totalBranches as number) ?? 3, icon: MapPin, color: "bg-rose-500" },
        { title: "Revenue", value: "$2.4M", icon: DollarSign, color: "bg-emerald-500", trend: "+12% this quarter" }
      );
    } else {
      adminStatCards.push(
        { title: "Total Departments", value: (stats.totalDepartments as number) ?? 8, icon: FolderTree, color: "bg-rose-500" },
        { title: "Fee Collection", value: "82%", icon: DollarSign, color: "bg-amber-500", trend: "+3% this month" }
      );
    }

    // Enrollment trend mock data
    const enrollmentTrend = [
      { month: "Oct", count: 480 },
      { month: "Nov", count: 520 },
      { month: "Dec", count: 390 },
      { month: "Jan", count: 610 },
      { month: "Feb", count: 570 },
      { month: "Mar", count: 640 },
    ];

    // Attendance overview
    const attendanceTrend = [
      { week: "Wk 1", rate: 88 },
      { week: "Wk 2", rate: 91 },
      { week: "Wk 3", rate: 86 },
      { week: "Wk 4", rate: 89 },
      { week: "Wk 5", rate: 93 },
      { week: "Wk 6", rate: 90 },
    ];

    // Fee collection
    const feeCollected = 72;
    const feePending = 18;
    const feeOverdue = 10;

    // Recent activity
    const recentActivity = stats.recentActivity as {
      title: string;
      description: string;
      timestamp: string;
    }[] | undefined;

    const activityItems = recentActivity ?? [
      { title: "New enrollment batch", description: "15 students enrolled in CS 2024-28", timestamp: daysAgo(0).split("T")[0] },
      { title: "Fee payment received", description: "$45,000 collected from Main Campus", timestamp: daysAgo(1).split("T")[0] },
      { title: "Attendance alert", description: "5 students below 75% in DS & Algo", timestamp: daysAgo(2).split("T")[0] },
      { title: "Course created", description: "Advanced Machine Learning added to CS dept", timestamp: daysAgo(3).split("T")[0] },
      { title: "Exam results published", description: "Mid-term results for Fall 2024 semester", timestamp: daysAgo(4).split("T")[0] },
    ];

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {currentUser.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">{getTodayFormatted()}</p>
          </div>
          <Badge variant="outline" className="w-fit gap-1">
            {currentRole === "SuperAdmin" ? (
              <Shield className="w-3 h-3 text-emerald-500" />
            ) : (
              <Building2 className="w-3 h-3 text-emerald-500" />
            )}
            {currentRole === "SuperAdmin" ? "Super Admin" : currentRole === "InstituteAdmin" ? "Institute Admin" : "Branch Admin"}
          </Badge>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {adminStatCards.map((card, i) => (
            <StatCard
              key={i}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              trend={card.trend}
            />
          ))}
        </div>

        {/* Enrollment Trend + Attendance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Enrollment Trend */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Enrollment Trend
              </CardTitle>
              <p className="text-xs text-muted-foreground">Monthly enrollment for the past 6 months</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={enrollmentTrend}>
                  <defs>
                    <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                    formatter={(value: number) => [value, "Enrollments"]}
                  />
                  <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fill="url(#enrollGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Attendance Overview
              </CardTitle>
              <p className="text-xs text-muted-foreground">Weekly attendance trend across all courses</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                    formatter={(value: number) => [`${value}%`, "Attendance"]}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Fee Collection Summary */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Fee Collection Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Collected</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{feeCollected}%</span>
                </div>
                <Progress value={feeCollected} className="h-3" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{feePending}%</span>
                </div>
                <Progress value={feePending} className="h-3 [&>div]:bg-amber-500" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Overdue</span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">{feeOverdue}%</span>
                </div>
                <Progress value={feeOverdue} className="h-3 [&>div]:bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SuperAdmin-only sections */}
        {currentRole === "SuperAdmin" && (
          <>
            {/* System Health + Revenue Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* System Health */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-500" />
                    System Health
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Real-time infrastructure monitoring</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uptime</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">99.97%</span>
                    </div>
                    <Progress value={99.97} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Response Time</span>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs">45ms</Badge>
                    </div>
                    <Progress value={25} className="h-2 [&>div]:bg-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Users</span>
                      <span className="text-sm font-bold">1,247</span>
                    </div>
                    <Progress value={62} className="h-2" />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +8.3% from last hour
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage</span>
                      <span className="text-sm font-bold">67.3 GB / 100 GB</span>
                    </div>
                    <Progress value={67.3} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">All systems operational</span>
                    <span className="text-xs text-muted-foreground ml-auto">Last checked: 2 min ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Overview */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    Revenue Overview
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Platform-wide financial summary</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                      <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
                      <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">$125,000</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> +12.5%
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground">Total Institutions</p>
                      <p className="text-2xl font-bold mt-1">12</p>
                      <p className="text-xs text-muted-foreground mt-1">Enterprise: 4 · Pro: 8</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground">Total Active Branches</p>
                      <p className="text-2xl font-bold mt-1">34</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +3 this quarter
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs text-muted-foreground">Growth Rate</p>
                      <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">+12.5%</p>
                      <p className="text-xs text-muted-foreground mt-1">Year over year</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Institute Comparison */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  Institute Comparison
                </CardTitle>
                <p className="text-xs text-muted-foreground">Student enrollment across top institutes</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Greenfield Main", students: 3200 },
                    { name: "Westside Academy", students: 2100 },
                    { name: "Northgate College", students: 1800 },
                    { name: "Eastview Institute", students: 1450 },
                    { name: "Southridge Campus", students: 980 },
                  ]} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                      formatter={(value: number) => [value.toLocaleString(), "Students"]}
                    />
                    <Bar dataKey="students" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Recent Activity + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {activityItems.slice(0, 5).map((item, i) => (
                <ActivityItem
                  key={i}
                  title={item.title}
                  description={item.description}
                  time={formatDateShort(item.timestamp)}
                />
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {currentRole === "SuperAdmin" ? (
                  <>
                    <QuickActionButton icon={BarChart3} label="View Analytics" color="bg-emerald-500" page="analytics" />
                    <QuickActionButton icon={Building2} label="Manage Institutes" color="bg-teal-500" page="institutes" />
                    <QuickActionButton icon={FileText} label="Generate Report" color="bg-amber-500" page="reports" />
                    <QuickActionButton icon={Settings} label="System Settings" color="bg-rose-500" page="settings" />
                  </>
                ) : (
                  <>
                    <QuickActionButton icon={UserPlus} label="Add Student" color="bg-emerald-500" page="users" />
                    <QuickActionButton icon={BookOpen} label="Create Course" color="bg-teal-500" page="courses" />
                    <QuickActionButton icon={Megaphone} label="Announcements" color="bg-amber-500" page="announcements" />
                    <QuickActionButton icon={FileText} label="Generate Report" color="bg-rose-500" page="reports" />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fallback (should not reach here)
  return null;
}

// Helper function used inline for admin section
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
