"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import {
  mockStudents,
  mockEnrollments,
  mockAttendanceRecords,
} from "@/lib/mock-data";
import {
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---- Helpers ----

function getAttendanceColor(rate: number) {
  if (rate >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (rate >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getAttendanceBgClass(rate: number) {
  if (rate >= 85) return "bg-emerald-500";
  if (rate >= 75) return "bg-amber-500";
  return "bg-red-500";
}

// ---- Component ----

export function AttendancePage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);

  const children = currentRole === "Parent" ? mockStudents.slice(0, 2) : [];
  const hasChildren = children.length > 0;
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? "");
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("monthly");

  const selectedChild = children.find((c) => c.id === selectedChildId) ?? children[0];
  const studentId = selectedChild?.id ?? "u-student-001";

  const isParentView = currentRole === "Parent";

  // Get attendance records for student
  const records = mockAttendanceRecords.filter((r) => r.studentId === studentId);
  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;
  const lateCount = records.filter((r) => r.status === "Late").length;
  const excusedCount = records.filter((r) => r.status === "Excused").length;
  const totalRecords = records.length;
  const overallRate = totalRecords > 0
    ? Math.round(((presentCount + lateCount) / totalRecords) * 100)
    : 0;

  // Course-wise breakdown using enrollments
  const enrollments = mockEnrollments.filter((e) => e.studentId === studentId);
  const courseAttendance = enrollments.map((enr) => {
    const courseRecords = records.filter((r) => r.courseId === enr.courseId);
    const present = courseRecords.filter((r) => r.status === "Present").length;
    const late = courseRecords.filter((r) => r.status === "Late").length;
    const absent = courseRecords.filter((r) => r.status === "Absent").length;
    const total = courseRecords.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : (enr.attendancePercentage ?? 0);
    return {
      courseId: enr.courseId,
      courseName: enr.courseName,
      present,
      late,
      absent,
      total,
      rate,
    };
  });

  // Calendar data - generate last 30 days of attendance
  const calendarData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split("T")[0];
    // Find record for this date (mock assignment)
    const dayRecords = records.filter((r) => r.date === dateStr);
    let status: "Present" | "Absent" | "Late" | "None" = "None";
    if (dayRecords.length > 0) {
      if (dayRecords.some((r) => r.status === "Present")) status = "Present";
      else if (dayRecords.some((r) => r.status === "Absent")) status = "Absent";
      else if (dayRecords.some((r) => r.status === "Late")) status = "Late";
    }
    return {
      date: dateStr,
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      status,
    };
  });

  // Weekly trend data
  const weeklyTrend = [
    { week: "Week 1", rate: 100 },
    { week: "Week 2", rate: 95 },
    { week: "Week 3", rate: 88 },
    { week: "Week 4", rate: 93 },
    { week: "Week 5", rate: 90 },
    { week: "Week 6", rate: overallRate },
  ];

  const monthlyTrend = [
    { month: "Jan", rate: 96 },
    { month: "Feb", rate: 92 },
    { month: "Mar", rate: 88 },
    { month: "Apr", rate: overallRate },
  ];

  const trendData = viewMode === "weekly" ? weeklyTrend : monthlyTrend;
  const xKey = viewMode === "weekly" ? "week" : "month";

  const isLowAttendance = overallRate < 75;
  const isWarning = overallRate >= 75 && overallRate < 85;

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            {isParentView ? "Track your child's attendance records" : "Track and manage attendance records"}
          </p>
        </div>
        {isParentView && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Child:</label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Overall Attendance - Large */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-4 ${getAttendanceBgClass(overallRate)} flex items-center justify-center`}>
                <div className="bg-card w-24 h-24 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <p className={`text-3xl font-bold ${getAttendanceColor(overallRate)}`}>
                      {overallRate}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">Overall</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lateCount}</p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{totalRecords}</p>
                <p className="text-xs text-muted-foreground">Total Days</p>
              </div>
            </div>
          </div>

          {/* Alert */}
          {isLowAttendance && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-700 dark:text-red-300">
                Attendance is below the minimum required 75%. Please ensure regular attendance to avoid academic consequences.
              </p>
            </div>
          )}
          {isWarning && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Attendance is below 85%. Please encourage regular attendance for better academic performance.
              </p>
            </div>
          )}
          {overallRate >= 85 && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Great attendance record! Keep it up.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course-wise Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Course-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseAttendance.map((course) => (
              <div key={course.courseId}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-sm font-medium truncate">{course.courseName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {course.present}P &middot; {course.absent}A &middot; {course.late}L &middot; {course.total} total
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Progress value={course.rate} className="w-20 h-2" />
                    <span className={`text-sm font-bold min-w-[40px] text-right ${getAttendanceColor(course.rate)}`}>
                      {course.rate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Attendance Calendar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Daily Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d} className="text-[10px] font-medium text-muted-foreground">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarData.map((day, i) => {
                // Offset to align with actual days of week
                const dayOfWeek = new Date(day.date).getDay();
                const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

                let cellClass = "bg-muted/30 text-muted-foreground";
                let dotClass = "";
                if (day.status === "Present") {
                  cellClass = "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
                  dotClass = "bg-emerald-500";
                } else if (day.status === "Absent") {
                  cellClass = "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
                  dotClass = "bg-red-500";
                } else if (day.status === "Late") {
                  cellClass = "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
                  dotClass = "bg-amber-500";
                }

                // Show empty cells for alignment (first row)
                if (i === 0 && adjustedIndex > 0) {
                  return (
                    <div key={day.date} className="col-start-[{adjustedIndex + 1}]" />
                  );
                }

                return (
                  <div
                    key={day.date}
                    className={`rounded-lg p-1.5 text-center ${cellClass}`}
                    title={`${day.month} ${day.dayNum}: ${day.status}`}
                  >
                    <p className="text-[10px] font-medium">{day.dayNum}</p>
                    {day.status !== "None" && (
                      <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-0.5 ${dotClass}`} />
                    )}
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 justify-center">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-muted-foreground">Present</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-[10px] text-muted-foreground">Absent</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-[10px] text-muted-foreground">Late</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                <span className="text-[10px] text-muted-foreground">No Data</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Attendance Trend
              </CardTitle>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode("weekly")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === "weekly"
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setViewMode("monthly")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === "monthly"
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                    }}
                    formatter={(value: number) => [`${value}%`, "Attendance"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#attendanceGradient)"
                    dot={{ r: 4, fill: "#10b981" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
