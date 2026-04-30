"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/app-store";
import { getDashboardData } from "@/lib/mock-data";
import {
  mockParents,
  mockGrades,
  mockMessages,
  mockAnnouncements,
  mockCalendarEvents,
  mockEnrollments,
  mockFeeInvoices,
  mockAssignments,
} from "@/lib/mock-data";
import { useEffect, useState } from "react";
import type { DashboardStats, ParentDashboardStats } from "@/types";
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
    <Card>
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

// ---- Main Component ----

export function DashboardPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const currentUser = useAppStore((s) => s.currentUser);
  const [data, setData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (currentRole) {
      setData(getDashboardData(currentRole));
    }
  }, [currentRole]);

  if (!data) return null;

  const stats = data as Record<string, unknown>;

  // ---- PARENT ROLE ----
  if (currentRole === "Parent" && currentUser) {
    const parentData = data as ParentDashboardStats;
    const parent = mockParents.find((p) => p.id === currentUser.id);
    const children = parent?.children ?? mockStudents.slice(0, 1);

    // Fee calculations
    const childIds = children.map((c) => c.id);
    const childFees = mockFeeInvoices.filter((f) =>
      childIds.includes(f.studentId)
    );
    const totalPaid = childFees.reduce((s, f) => s + f.paidAmount, 0);
    const totalPending = childFees.reduce((s, f) => s + f.balanceAmount, 0);
    const overdueCount = childFees.filter(
      (f) => f.status === "Overdue"
    ).length;

    // Upcoming events
    const upcomingEvents = mockCalendarEvents
      .filter((e) => new Date(e.startDate) >= new Date())
      .slice(0, 4);

    // Recent messages (parent-related)
    const parentMessages = mockMessages
      .filter(
        (m) =>
          m.senderId === currentUser.id || m.receiverId === currentUser.id
      )
      .slice(-3)
      .reverse();

    // Recent announcements relevant to parent
    const parentAnnouncements = mockAnnouncements
      .filter(
        (a) =>
          a.targetAudience.includes("Parent") ||
          a.targetAudience.includes("Student")
      )
      .slice(0, 3);

    // Recent activity items
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
                      {/* Attendance */}
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
                      {/* GPA */}
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
                      {/* Pending */}
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
                      {/* Recent Grade */}
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
                              {latestGrade.courseName.split(" ")[0]}...
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

  // ---- OTHER ROLES (original dashboard) ----
  const recentActivity = stats.recentActivity as
    | { title: string; description: string; timestamp: string }[]
    | undefined;

  const cards: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    trend?: string;
  }[] = [];

  if (stats.totalInstitutes)
    cards.push({
      title: "Total Institutes",
      value: stats.totalInstitutes as number,
      icon: GraduationCap,
    });
  if (stats.totalBranches)
    cards.push({
      title: "Branches",
      value: stats.totalBranches as number,
      icon: BarChart3,
    });
  if (stats.totalStudents)
    cards.push({
      title: "Total Students",
      value: stats.totalStudents as number,
      icon: Users,
      trend: "+12% this month",
    });
  if (stats.totalTeachers)
    cards.push({
      title: "Total Teachers",
      value: stats.totalTeachers as number,
      icon: GraduationCap,
    });
  if (stats.totalCourses)
    cards.push({
      title: "Courses",
      value: stats.totalCourses as number,
      icon: BarChart3,
    });
  if (stats.totalDepartments)
    cards.push({
      title: "Departments",
      value: stats.totalDepartments as number,
      icon: BarChart3,
    });
  if (stats.enrolledCourses)
    cards.push({
      title: "Enrolled Courses",
      value: stats.enrolledCourses as number,
      icon: BarChart3,
    });
  if (stats.completedCourses)
    cards.push({
      title: "Completed",
      value: stats.completedCourses as number,
      icon: BarChart3,
    });
  if (stats.overallGPA)
    cards.push({
      title: "Overall GPA",
      value: stats.overallGPA as number,
      icon: TrendingUp,
      trend: "+0.2 from last semester",
    });
  if (stats.attendanceRate)
    cards.push({
      title: "Attendance Rate",
      value: `${stats.attendanceRate as number}%`,
      icon: Activity,
      trend: "+2.5% this week",
    });
  if (stats.todayClasses)
    cards.push({
      title: "Today's Classes",
      value: stats.todayClasses as number,
      icon: Clock,
    });
  if (stats.pendingGrading)
    cards.push({
      title: "Pending Grading",
      value: stats.pendingGrading as number,
      icon: BarChart3,
    });
  if (stats.activeUsers)
    cards.push({
      title: "Active Users",
      value: stats.activeUsers as number,
      icon: Users,
      trend: "+8% this week",
    });
  if (stats.revenue)
    cards.push({
      title: "Revenue",
      value: `$${((stats.revenue as number) / 1000).toFixed(0)}k`,
      icon: TrendingUp,
      trend: "+15% this quarter",
    });
  if (stats.monthlyGrowth)
    cards.push({
      title: "Monthly Growth",
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
    });
  if (stats.pendingTasks)
    cards.push({
      title: "Pending Tasks",
      value: stats.pendingTasks as number,
      icon: Clock,
    });
  if (stats.pendingFees)
    cards.push({
      title: "Pending Fees",
      value: `$${stats.pendingFees as number}`,
      icon: BarChart3,
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {useAppStore.getState().currentUser?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your{" "}
          {currentRole === "Student"
            ? "academics"
            : currentRole === "Parent"
              ? "children"
              : "institution"}{" "}
          today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.slice(0, 8).map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((item, i) => (
                <ActivityItem
                  key={i}
                  title={item.title}
                  description={item.description}
                  time={new Date(item.timestamp).toLocaleDateString()}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Quick Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant="outline">{currentRole}</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Institute</span>
                <span className="text-sm font-medium">
                  Greenfield Education Group
                </span>
              </div>
              {stats.upcomingEvents && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Upcoming Events
                  </span>
                  <span className="text-sm font-medium">
                    {stats.upcomingEvents as number}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">
                  Notifications
                </span>
                <Badge variant="secondary">
                  {stats.notifications as number} new
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
