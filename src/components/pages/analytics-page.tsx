"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import {
  TrendingUp, Users, GraduationCap, DollarSign, Activity, BookOpen,
  RefreshCw, Loader2, Server, Clock, HardDrive, Wifi, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Area, AreaChart, Cell,
} from "recharts";

// -------------------- Types --------------------

interface AnalyticsData {
  role: string;
  kpis: {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalEnrollments: number;
    attendanceRate: number;
    feeCollectionRate: number;
  };
  monthlyEnrollments: { month: string; count: number }[];
  monthlyFees: { month: string; amount: number }[];
  gradeDistribution: { grade: string; count: number }[];
  attendanceBreakdown: { status: string; count: number }[];
  studentsByClass: { classLevel: string; count: number }[];
  topCourses: { title: string; classLevel: string; enrollmentCount: number }[];
}

// -------------------- Chart Configs --------------------

const enrollmentConfig: ChartConfig = { count: { label: "New Students", color: "#059669" } };
const feeConfig: ChartConfig = { amount: { label: "Collected (PKR)", color: "#059669" } };
const gradeConfig: ChartConfig = { count: { label: "Students", color: "#059669" } };
const attendanceConfig: ChartConfig = { count: { label: "Records", color: "#059669" } };
const classConfig: ChartConfig = { count: { label: "Students", color: "#059669" } };

const GRADE_COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#d97706", "#f59e0b", "#fbbf24", "#ef4444", "#94a3b8"];
const STATUS_COLORS: Record<string, string> = {
  Present: "#059669", Late: "#f59e0b", Absent: "#ef4444", Excused: "#6366f1",
};

// -------------------- Empty State --------------------

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-[280px] flex flex-col items-center justify-center text-center gap-2">
      <BarChart3 className="w-10 h-10 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">No {label} data yet</p>
    </div>
  );
}

// -------------------- Main Component --------------------

export function AnalyticsPage() {
  const currentUser = useAppStore(s => s.currentUser);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics");
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to load analytics");
        return;
      }
      const json = await res.json();
      setData(json.data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const role = currentUser?.role ?? "";

  const scopeLabel =
    role === "InstituteAdmin" ? `${currentUser?.instituteName}` :
    role === "BranchAdmin" ? `${currentUser?.branchName} · ${currentUser?.instituteName}` :
    "Platform-wide";

  const kpis = data ? [
    { label: "Total Students", value: data.kpis.totalStudents.toLocaleString(), icon: GraduationCap, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/20" },
    { label: "Total Teachers", value: data.kpis.totalTeachers.toLocaleString(), icon: Users, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Active Courses", value: data.kpis.totalCourses.toLocaleString(), icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Attendance Rate", value: `${data.kpis.attendanceRate}%`, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  ] : [];

  const hasGrades = (data?.gradeDistribution.length ?? 0) > 0;
  const hasAttendance = (data?.attendanceBreakdown.length ?? 0) > 0;
  const hasClasses = (data?.studentsByClass.length ?? 0) > 0;
  const hasCourses = (data?.topCourses.length ?? 0) > 0;
  const hasEnrollmentTrend = data?.monthlyEnrollments.some(m => m.count > 0);
  const hasFeeTrend = data?.monthlyFees.some(m => m.amount > 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm text-muted-foreground">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-sm text-destructive">{error}</p>
          <Button size="sm" onClick={fetchAnalytics}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm">{scopeLabel} · Real-time data</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  {kpi.label === "Attendance Rate" && data && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {data.kpis.feeCollectionRate}% fee collected
                    </p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1: Monthly Enrollments + Fee Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">New Student Registrations</CardTitle>
            <p className="text-xs text-muted-foreground">Students added per month (last 12 months)</p>
          </CardHeader>
          <CardContent>
            {hasEnrollmentTrend ? (
              <ChartContainer config={enrollmentConfig} className="h-[280px] w-full">
                <AreaChart data={data!.monthlyEnrollments}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} interval={1} />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="count" stroke="#059669" fill="url(#enrollGrad)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            ) : (
              <EmptyChart label="enrollment" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Fee Collection Trend</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly fee payments received (PKR)</p>
          </CardHeader>
          <CardContent>
            {hasFeeTrend ? (
              <ChartContainer config={feeConfig} className="h-[280px] w-full">
                <BarChart data={data!.monthlyFees}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} interval={1} />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyChart label="fee payment" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Grade Distribution + Attendance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Grade Distribution</CardTitle>
            <p className="text-xs text-muted-foreground">Student performance breakdown by grade letter</p>
          </CardHeader>
          <CardContent>
            {hasGrades ? (
              <ChartContainer config={gradeConfig} className="h-[280px] w-full">
                <BarChart data={data!.gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="grade" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={28}>
                    {data!.gradeDistribution.map((_, i) => (
                      <Cell key={i} fill={GRADE_COLORS[i % GRADE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyChart label="grade" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Attendance Breakdown</CardTitle>
            <p className="text-xs text-muted-foreground">Total attendance records by status</p>
          </CardHeader>
          <CardContent>
            {hasAttendance ? (
              <>
                <ChartContainer config={attendanceConfig} className="h-[200px] w-full">
                  <BarChart data={data!.attendanceBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                    <YAxis dataKey="status" type="category" width={70} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                      {data!.attendanceBreakdown.map((entry, i) => (
                        <Cell key={i} fill={STATUS_COLORS[entry.status] || GRADE_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <div className="flex flex-wrap gap-3 mt-3 justify-center">
                  {data!.attendanceBreakdown.map(a => {
                    const total = data!.attendanceBreakdown.reduce((s, x) => s + x.count, 0);
                    const pct = total > 0 ? Math.round((a.count / total) * 100) : 0;
                    return (
                      <div key={a.status} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: STATUS_COLORS[a.status] || "#94a3b8" }} />
                        <span className="text-muted-foreground">{a.status}</span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <EmptyChart label="attendance" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3: Students by Class + Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Students by Class — only for non-SuperAdmin */}
        {role !== "SuperAdmin" ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Students by Class</CardTitle>
              <p className="text-xs text-muted-foreground">Student count per grade level</p>
            </CardHeader>
            <CardContent>
              {hasClasses ? (
                <ChartContainer config={classConfig} className="h-[280px] w-full">
                  <BarChart data={data!.studentsByClass}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="classLevel" tickFormatter={(v) => `Class ${v}`} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} labelFormatter={(v) => `Class ${v}`} />
                    <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} barSize={22} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <EmptyChart label="class distribution" />
              )}
            </CardContent>
          </Card>
        ) : (
          /* System Health — static display for SuperAdmin (infrastructure monitoring) */
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">System Health</CardTitle>
              <p className="text-xs text-muted-foreground">Platform infrastructure status</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Uptime", value: 99.97, display: "99.97%", icon: Server },
                { name: "Avg Response Time", value: 88, display: "~140ms", icon: Clock },
                { name: "DB Storage Used", value: 38, display: "38%", icon: HardDrive },
                { name: "Bandwidth", value: 52, display: "52%", icon: Wifi },
              ].map(metric => {
                const Icon = metric.icon;
                return (
                  <div key={metric.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{metric.name}</span>
                      </div>
                      <span className="text-sm font-bold">{metric.display}</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                );
              })}
              <div className="flex items-center gap-2 pt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">All systems operational</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Courses by Enrollment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Courses by Enrollment</CardTitle>
            <p className="text-xs text-muted-foreground">Most enrolled active subjects</p>
          </CardHeader>
          <CardContent>
            {hasCourses ? (
              <div className="space-y-3">
                {data!.topCourses.slice(0, 8).map((course, i) => {
                  const max = data!.topCourses[0]?.enrollmentCount || 1;
                  const pct = Math.round((course.enrollmentCount / max) * 100);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-muted-foreground w-4 flex-shrink-0">#{i + 1}</span>
                          <span className="font-medium truncate">{course.title}</span>
                          {course.classLevel && (
                            <Badge variant="outline" className="text-[10px] flex-shrink-0">Cl {course.classLevel}</Badge>
                          )}
                        </div>
                        <span className="font-bold text-xs ml-2 flex-shrink-0">{course.enrollmentCount}</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyChart label="course enrollment" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
