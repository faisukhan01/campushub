"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Shield,
  Building2,
  Users,
  GraduationCap,
  DollarSign,
  CreditCard,
  Layers,
  BookOpen,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  TrendingUp,
  ArrowUpRight,
  Eye,
  BarChart3,
  Target,
  Activity,
  BookMarked,
  Settings,
  Award,
  Clock,
  AlertTriangle,
} from "lucide-react";

// ============================================================
// Animation Variants
// ============================================================

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ============================================================
// Recharts Helpers
// ============================================================

const CHART_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

const tooltipProps = {
  contentStyle: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontSize: "12px",
    padding: "8px 12px",
  },
  labelStyle: { fontWeight: 600, marginBottom: 4 },
};

function MiniSparkline({
  data,
  color = "#10b981",
}: {
  data: number[];
  color?: string;
}) {
  const chartData = useMemo(
    () => data.map((v, i) => ({ i, v })),
    [data]
  );
  const id = useMemo(
    () => `spark-${color.replace("#", "")}-${Math.random().toString(36).slice(2, 6)}`,
    [color]
  );
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${id})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function AttendanceRing({ value }: { value: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 85 ? "#10b981" : value >= 75 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-14 h-14">
      <svg width="56" height="56" viewBox="0 0 64 64" className="transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="5"
        />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
        {value}%
      </span>
    </div>
  );
}

// ============================================================
// Shared Helpers
// ============================================================

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function TrendBadge({
  value,
  positive,
}: {
  value: string;
  positive: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        positive
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-500 dark:text-red-400"
      )}
    >
      {positive ? (
        <ArrowUpRight className="w-3.5 h-3.5" />
      ) : (
        <TrendingUp className="w-3.5 h-3.5 rotate-45" />
      )}
      {value}
    </span>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  trend,
  trendValue,
  sparkline,
  children,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  trend?: "up" | "down";
  trendValue?: string;
  sparkline?: number[];
  children?: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                iconBg
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            {trend && trendValue && (
              <TrendBadge value={trendValue} positive={trend === "up"} />
            )}
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {label}
          </p>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-medium text-slate-900 dark:text-slate-100">
      {children}
    </h2>
  );
}

function QuickAction({
  icon: Icon,
  label,
  variant = "default",
}: {
  icon: React.ElementType;
  label: string;
  variant?: "default" | "primary";
}) {
  return (
    <Button
      variant={variant === "primary" ? "default" : "outline"}
      size="sm"
      className={cn(
        "gap-2 rounded-lg text-xs",
        variant === "default" &&
          "border-slate-200/60 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Button>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <CardContent className="p-5">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">
            {title}
          </p>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================
// 1. SUPER ADMIN DASHBOARD
// ============================================================

function SuperAdminDashboard() {
  const enrollmentData = useMemo(
    () => [
      { month: "Oct", students: 2100 },
      { month: "Nov", students: 2280 },
      { month: "Dec", students: 2450 },
      { month: "Jan", students: 2600 },
      { month: "Feb", students: 2740 },
      { month: "Mar", students: 2847 },
    ],
    []
  );

  const instituteData = useMemo(
    () => [
      { name: "Greenfield", students: 1240 },
      { name: "Oakridge", students: 420 },
      { name: "Suncrest", students: 380 },
      { name: "Lakewood", students: 320 },
      { name: "Hilltop", students: 290 },
      { name: "Riverside", students: 197 },
    ],
    []
  );

  const recentInstitutes = useMemo(
    () => [
      { name: "Riverside Academy", branches: 2, students: 197, plan: "Professional", status: "Active", joined: "Feb 28, 2025" },
      { name: "Hilltop College", branches: 1, students: 290, plan: "Starter", status: "Active", joined: "Feb 15, 2025" },
      { name: "Lakewood Institute", branches: 3, students: 320, plan: "Enterprise", status: "Active", joined: "Jan 30, 2025" },
      { name: "Suncrest School", branches: 2, students: 380, plan: "Professional", status: "Active", joined: "Jan 12, 2025" },
      { name: "Oakridge Academy", branches: 1, students: 420, plan: "Starter", status: "Trial", joined: "Dec 20, 2024" },
    ],
    []
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Platform Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your entire campus management ecosystem
          </p>
        </div>
        <Badge className="bg-violet-100 text-violet-700 border-0 hover:bg-violet-100 rounded-full px-3 py-1 text-xs font-medium dark:bg-violet-900/30 dark:text-violet-400">
          <Shield className="w-3 h-3 mr-1" />
          Owner
        </Badge>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Total Institutes"
          value="12"
          icon={Building2}
          iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          trend="up"
          trendValue="+2"
          sparkline={[8, 9, 9, 10, 11, 12]}
        />
        <KpiCard
          label="Total Students"
          value="2,847"
          icon={Users}
          iconBg="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          trend="up"
          trendValue="+12.5%"
          sparkline={[2100, 2280, 2450, 2600, 2740, 2847]}
        />
        <KpiCard
          label="Total Teachers"
          value="186"
          icon={GraduationCap}
          iconBg="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
          trend="up"
          trendValue="+8.3%"
          sparkline={[148, 156, 162, 170, 178, 186]}
        />
        <KpiCard
          label="Monthly Revenue"
          value="$48.2K"
          icon={DollarSign}
          iconBg="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          trend="up"
          trendValue="+15.2%"
          sparkline={[32000, 35000, 38000, 41000, 44000, 48200]}
        />
        <KpiCard
          label="Active Subscriptions"
          value="8"
          icon={CreditCard}
          iconBg="bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
          trend="up"
          trendValue="+1"
          sparkline={[5, 5, 6, 6, 7, 8]}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Enrollment Growth">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipProps} />
                <Area type="monotone" dataKey="students" stroke="#10b981" strokeWidth={2.5} fill="url(#enrollGrad)" dot={{ fill: "#10b981", r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Institution-wise Student Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instituteData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipProps} />
                <Bar dataKey="students" radius={[6, 6, 0, 0]}>
                  {instituteData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Recent Institutes Table */}
      <motion.div variants={fadeUp}>
        <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>Recent Institute Registrations</SectionTitle>
              <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Institute</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Branches</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Students</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Plan</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInstitutes.map((inst) => (
                    <TableRow key={inst.name}>
                      <TableCell className="font-medium text-sm">{inst.name}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">{inst.branches}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">{inst.students}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] rounded-full border-slate-200 dark:border-slate-700"
                        >
                          {inst.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-[10px] rounded-full border-0",
                            inst.status === "Active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          )}
                        >
                          {inst.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{inst.joined}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <SectionTitle className="mb-3">Quick Actions</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <QuickAction icon={Plus} label="Add Institute" variant="primary" />
          <QuickAction icon={BarChart3} label="View Analytics" />
          <QuickAction icon={CreditCard} label="Manage Subscriptions" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// 2. INSTITUTE ADMIN DASHBOARD
// ============================================================

function InstituteAdminDashboard() {
  const branchStudentData = useMemo(
    () => [
      { branch: "Main Campus", undergrad: 320, postgrad: 160 },
      { branch: "North Campus", undergrad: 180, postgrad: 90 },
      { branch: "South Campus", undergrad: 150, postgrad: 70 },
      { branch: "East Campus", undergrad: 120, postgrad: 60 },
      { branch: "West Campus", undergrad: 140, postgrad: 50 },
    ],
    []
  );

  const attendanceData = useMemo(
    () => [
      { week: "Week 1", rate: 91 },
      { week: "Week 2", rate: 88 },
      { week: "Week 3", rate: 85 },
      { week: "Week 4", rate: 89 },
    ],
    []
  );

  const feeData = useMemo(
    () => [
      { label: "Collected", amount: "$8,200", value: 8200, total: 12400, color: "bg-emerald-500" },
      { label: "Pending", amount: "$3,100", value: 3100, total: 12400, color: "bg-amber-500" },
      { label: "Overdue", amount: "$1,100", value: 1100, total: 12400, color: "bg-red-500" },
    ],
    []
  );

  const branchOverview = useMemo(
    () => [
      { name: "Main Campus", students: 480, faculty: 28, courses: 45, attendance: "89%" },
      { name: "North Campus", students: 270, faculty: 18, courses: 30, attendance: "92%" },
      { name: "South Campus", students: 220, faculty: 16, courses: 22, attendance: "87%" },
      { name: "East Campus", students: 180, faculty: 14, courses: 16, attendance: "91%" },
      { name: "West Campus", students: 190, faculty: 10, courses: 7, attendance: "85%" },
    ],
    []
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Greenfield Education Group
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Institute Administration Overview
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-100 rounded-full px-3 py-1 text-xs font-medium dark:bg-blue-900/30 dark:text-blue-400">
          <Building2 className="w-3 h-3 mr-1" />
          Institute Admin
        </Badge>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Total Branches"
          value="5"
          icon={Building2}
          iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <KpiCard
          label="Total Students"
          value="1,240"
          icon={Users}
          iconBg="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          trend="up"
          trendValue="+5.8%"
        />
        <KpiCard
          label="Faculty"
          value="86"
          icon={GraduationCap}
          iconBg="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
          trend="up"
          trendValue="+3.6%"
        />
        <KpiCard
          label="Active Courses"
          value="120"
          icon={BookOpen}
          iconBg="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          trend="up"
          trendValue="+12"
        />
        <KpiCard
          label="Monthly Revenue"
          value="$12.4K"
          icon={DollarSign}
          iconBg="bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
          trend="up"
          trendValue="+8.1%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Branch-wise Student Count">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchStudentData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="branch" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipProps} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="undergrad" name="Undergrad" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="postgrad" name="Postgrad" stackId="a" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Attendance Trend This Month">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipProps} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ fill: "#8b5cf6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Fee Collection */}
      <motion.div variants={fadeUp}>
        <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
          <CardContent className="p-5">
            <SectionTitle className="mb-4">Fee Collection Overview</SectionTitle>
            <div className="space-y-4">
              {feeData.map((fee) => (
                <div key={fee.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{fee.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {fee.amount}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", fee.color)}
                      style={{ width: `${(fee.value / fee.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Branch Overview Table */}
      <motion.div variants={fadeUp}>
        <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
          <CardContent className="p-5">
            <SectionTitle className="mb-4">Branch Overview</SectionTitle>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Branch</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Students</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Faculty</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Courses</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Avg Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branchOverview.map((b) => (
                    <TableRow key={b.name}>
                      <TableCell className="font-medium text-sm">{b.name}</TableCell>
                      <TableCell className="text-sm">{b.students}</TableCell>
                      <TableCell className="text-sm">{b.faculty}</TableCell>
                      <TableCell className="text-sm">{b.courses}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            Number(b.attendance) >= 90
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          )}
                        >
                          {b.attendance}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <SectionTitle className="mb-3">Quick Actions</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <QuickAction icon={Plus} label="Add Branch" variant="primary" />
          <QuickAction icon={Activity} label="Create Announcement" />
          <QuickAction icon={FileText} label="Generate Report" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// 3. BRANCH ADMIN DASHBOARD
// ============================================================

function BranchAdminDashboard() {
  const departmentData = useMemo(
    () => [
      { department: "Computer Science", students: 140 },
      { department: "Business Admin", students: 110 },
      { department: "Arts & Humanities", students: 85 },
      { department: "Sciences", students: 75 },
      { department: "Engineering", students: 70 },
    ],
    []
  );

  const programData = useMemo(
    () => [
      { name: "CS", value: 140 },
      { name: "Business", value: 110 },
      { name: "Arts", value: 85 },
      { name: "Science", value: 75 },
    ],
    []
  );

  const activities = useMemo(
    () => [
      { text: "New batch B.Tech 2025 created successfully", time: "1 hour ago", color: "bg-emerald-500" },
      { text: "Prof. Kim updated attendance for CS-301", time: "2 hours ago", color: "bg-blue-500" },
      { text: "Fee reminder sent to 45 students", time: "3 hours ago", color: "bg-amber-500" },
      { text: "New course 'Data Science Fundamentals' approved", time: "Yesterday", color: "bg-violet-500" },
      { text: "Student enrollment deadline extended to March 20", time: "Yesterday", color: "bg-rose-500" },
      { text: "Campus maintenance scheduled for Saturday", time: "2 days ago", color: "bg-slate-400" },
    ],
    []
  );

  const coursesNeedingAttention = useMemo(
    () => [
      { name: "Organic Chemistry", batch: "B.Sc. Sem 4", attendance: 68, instructor: "Dr. Park" },
      { name: "Linear Algebra", batch: "B.Tech Sem 2", attendance: 71, instructor: "Prof. Lee" },
      { name: "Microeconomics", batch: "BBA Sem 3", attendance: 73, instructor: "Ms. Kim" },
    ],
    []
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Greenfield Main Campus
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Branch Administration Overview
          </p>
        </div>
        <Badge className="bg-teal-100 text-teal-700 border-0 hover:bg-teal-100 rounded-full px-3 py-1 text-xs font-medium dark:bg-teal-900/30 dark:text-teal-400">
          <Building2 className="w-3 h-3 mr-1" />
          Branch Admin
        </Badge>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Students"
          value="480"
          icon={Users}
          iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          trend="up"
          trendValue="+24"
        />
        <KpiCard
          label="Faculty"
          value="28"
          icon={GraduationCap}
          iconBg="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <KpiCard
          label="Active Courses"
          value="45"
          icon={BookOpen}
          iconBg="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
          trend="up"
          trendValue="+5"
        />
        <KpiCard
          label="Batches"
          value="12"
          icon={Layers}
          iconBg="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
        <KpiCard
          label="Avg Attendance"
          value="89%"
          icon={Target}
          iconBg="bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
          trend="up"
          trendValue="+2%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Department-wise Enrollment">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={110} />
                <Tooltip {...tooltipProps} />
                <Bar dataKey="students" radius={[0, 6, 6, 0]}>
                  {departmentData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Student Distribution by Program">
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={programData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {programData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipProps} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Two Column: Activities + Courses Need Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div variants={fadeUp}>
          <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
            <CardContent className="p-5">
              <SectionTitle className="mb-4">Recent Activities</SectionTitle>
              <div className="space-y-1">
                {activities.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 px-1 py-2.5">
                    <div className={cn("mt-1.5 w-2 h-2 rounded-full flex-shrink-0", act.color)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{act.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Courses Need Attention */}
        <motion.div variants={fadeUp}>
          <Card className="rounded-xl border border-amber-200/60 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <SectionTitle>Courses Need Attention</SectionTitle>
              </div>
              <div className="space-y-3">
                {coursesNeedingAttention.map((c) => (
                  <div
                    key={c.name}
                    className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.name}</p>
                      <Badge className="text-[10px] border-0 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                        {c.attendance}%
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {c.batch} &middot; {c.instructor}
                    </p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-400 transition-all"
                        style={{ width: `${c.attendance}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <SectionTitle className="mb-3">Quick Actions</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <QuickAction icon={Plus} label="Add Course" variant="primary" />
          <QuickAction icon={GraduationCap} label="Assign Teacher" />
          <QuickAction icon={Layers} label="Create Batch" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// 4. TEACHER DASHBOARD
// ============================================================

function TeacherDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const firstName = currentUser?.name?.split(" ").slice(-1)[0] ?? "Emily";

  const todaySchedule = useMemo(
    () => [
      { time: "9:00 AM", endTime: "10:00 AM", course: "Advanced Mathematics", class: "11-A", room: "Room 201", color: "bg-emerald-500" },
      { time: "10:30 AM", endTime: "11:30 AM", course: "Mathematics", class: "10-A", room: "Room 105", color: "bg-blue-500" },
      { time: "1:00 PM", endTime: "2:00 PM", course: "Physics", class: "9-A", room: "Lab 3", color: "bg-violet-500" },
      { time: "2:30 PM", endTime: "3:30 PM", course: "Mathematics", class: "10-B", room: "Room 106", color: "bg-amber-500" },
    ],
    []
  );

  const classes = useMemo(
    () => [
      { name: "Class 10-A", subject: "Mathematics", students: 28, nextClass: "Today, 10:00 AM", attendance: 92 },
      { name: "Class 10-B", subject: "Mathematics", students: 26, nextClass: "Today, 11:30 AM", attendance: 87 },
      { name: "Class 9-A", subject: "Physics", students: 24, nextClass: "Today, 1:00 PM", attendance: 91 },
      { name: "Class 9-B", subject: "Physics", students: 22, nextClass: "Today, 2:00 PM", attendance: 84 },
      { name: "Class 11-A", subject: "Advanced Math", students: 22, nextClass: "Tomorrow, 9:00 AM", attendance: 95 },
      { name: "Class 11-B", subject: "Advanced Math", students: 20, nextClass: "Tomorrow, 11:00 AM", attendance: 88 },
    ],
    []
  );

  const pendingTasks = useMemo(
    () => [
      { id: "t1", status: "overdue" as const, description: "Mark attendance for Class 9-B — Today, 2:00 PM", action: "Mark" },
      { id: "t2", status: "urgent" as const, description: "Grade 23 assignments for Mathematics — Due today", action: "Review" },
      { id: "t3", status: "urgent" as const, description: "Review submitted lab reports for Class 11-A — 8 pending", action: "Review" },
      { id: "t4", status: "overdue" as const, description: "Submit mid-term marks for Class 10-A — Overdue by 1 day", action: "Mark" },
      { id: "t5", status: "urgent" as const, description: "Approve 5 leave requests from students — Due tomorrow", action: "Review" },
    ],
    []
  );

  const recentActivity = useMemo(
    () => [
      { id: "a1", text: "Graded Assignment #3 for Class 10-A", time: "2 hours ago" },
      { id: "a2", text: "Marked attendance for Class 9-A", time: "3 hours ago" },
      { id: "a3", text: "Uploaded notes for Chapter 7 — Advanced Math", time: "5 hours ago" },
      { id: "a4", text: "Graded Assignment #2 for Class 10-B", time: "1 day ago" },
      { id: "a5", text: "Marked attendance for Class 11-A", time: "1 day ago" },
    ],
    []
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Badge className="bg-violet-100 text-violet-700 border-0 hover:bg-violet-100 rounded-full px-3 py-1 text-xs font-medium dark:bg-violet-900/30 dark:text-violet-400">
          <GraduationCap className="w-3 h-3 mr-1" />
          Teacher
        </Badge>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="My Courses"
          value="6"
          icon={BookOpen}
          iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        >
          <div className="mt-2">
            <MiniSparkline data={[4, 5, 5, 5, 6, 6]} color="#10b981" />
          </div>
        </KpiCard>
        <KpiCard
          label="Total Students"
          value="142"
          icon={Users}
          iconBg="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        >
          <div className="mt-2">
            <MiniSparkline data={[110, 118, 125, 130, 138, 142]} color="#3b82f6" />
          </div>
        </KpiCard>
        <KpiCard
          label="Today's Classes"
          value="5"
          icon={Clock}
          iconBg="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
        >
          <div className="mt-2">
            <MiniSparkline data={[3, 4, 5, 4, 5, 5]} color="#8b5cf6" />
          </div>
        </KpiCard>
        <KpiCard
          label="Pending Grading"
          value="12"
          icon={Award}
          iconBg="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        >
          <div className="mt-2">
            <MiniSparkline data={[8, 10, 14, 18, 15, 12]} color="#f59e0b" />
          </div>
        </KpiCard>
        <KpiCard
          label="Avg Attendance"
          value="89%"
          icon={Target}
          iconBg="bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
          trend="up"
          trendValue="+2.1%"
        />
      </div>

      {/* Today's Schedule Timeline */}
      <motion.div variants={fadeUp}>
        <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
          <CardContent className="p-5">
            <SectionTitle className="mb-4">Today&apos;s Schedule</SectionTitle>
            <div className="space-y-3">
              {todaySchedule.map((slot, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 flex-shrink-0 text-xs text-slate-500 dark:text-slate-400 tabular-nums text-right">
                    {slot.time}
                  </div>
                  <div className={cn("w-1 h-10 rounded-full flex-shrink-0", slot.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{slot.course}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {slot.class} &middot; {slot.room} &middot; {slot.time} – {slot.endTime}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] rounded-full border-slate-200 dark:border-slate-700 flex-shrink-0"
                  >
                    Upcoming
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Classes Table */}
      <motion.div variants={fadeUp}>
        <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
          <CardContent className="p-5">
            <SectionTitle className="mb-4">My Classes</SectionTitle>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Class</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Subject</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Students</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Next Class</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.name}>
                      <TableCell className="font-medium text-sm">{cls.name}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">{cls.subject}</TableCell>
                      <TableCell className="text-sm">{cls.students}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">{cls.nextClass}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                cls.attendance >= 90
                                  ? "bg-emerald-500"
                                  : cls.attendance >= 80
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              )}
                              style={{ width: `${cls.attendance}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 tabular-nums">{cls.attendance}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Grid: Pending Tasks + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp}>
          <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
            <CardContent className="p-5">
              <SectionTitle className="mb-4">Pending Tasks</SectionTitle>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 rounded-full flex-shrink-0",
                          task.status === "overdue" ? "bg-red-500" : "bg-amber-500"
                        )}
                      />
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{task.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20 font-medium flex-shrink-0"
                    >
                      {task.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
            <CardContent className="p-5">
              <SectionTitle className="mb-4">Recent Activity</SectionTitle>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0" />
                    <div className="flex items-center justify-between gap-3 min-w-0 flex-1">
                      <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{item.text}</p>
                      <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================================
// 5. STUDENT DASHBOARD
// ============================================================

function StudentDashboard() {
  const weeklyHoursData = useMemo(
    () => [
      { day: "Mon", hours: 4.5 },
      { day: "Tue", hours: 6 },
      { day: "Wed", hours: 3 },
      { day: "Thu", hours: 5.5 },
      { day: "Fri", hours: 7 },
      { day: "Sat", hours: 2 },
      { day: "Sun", hours: 1.5 },
    ],
    []
  );

  const upcomingExams = useMemo(
    () => [
      { subject: "Chemistry", type: "Quiz", date: "Mar 10, 2025", daysLeft: 0 },
      { subject: "Physics", type: "Quiz", date: "Mar 12, 2025", daysLeft: 2 },
      { subject: "Mathematics", type: "Mid-term", date: "Mar 15, 2025", daysLeft: 5 },
      { subject: "English", type: "Final", date: "Mar 25, 2025", daysLeft: 15 },
    ],
    []
  );

  const subjects = useMemo(
    () => [
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
    ],
    []
  );

  const recentActivity = useMemo(
    () => [
      { text: "Assignment #3 submitted for Mathematics", time: "2 hours ago" },
      { text: "Quiz results published for Physics", time: "Yesterday" },
      { text: "Attendance marked for English", time: "Yesterday" },
      { text: "Fee reminder issued — PKR 12,000 due", time: "2 days ago" },
      { text: "New announcement from administration", time: "3 days ago" },
    ],
    []
  );

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
      <Badge className="rounded-full text-[10px] px-2 border-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {daysLeft}d left
      </Badge>
    );
  }

  function getAttendanceColor(rate: number) {
    if (rate >= 85) return "bg-emerald-500";
    if (rate >= 75) return "bg-amber-500";
    return "bg-red-500";
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Welcome back, Ryan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700 border-0 hover:bg-emerald-100 rounded-full px-3 py-1 text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-400">
          Student
        </Badge>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled Courses with sparkline */}
        <motion.div variants={fadeUp} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">10</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enrolled Courses</p>
              <div className="mt-2">
                <MiniSparkline data={[7, 8, 8, 9, 10, 10]} color="#10b981" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current GPA */}
        <KpiCard
          label="Current GPA"
          value="3.72"
          icon={Award}
          iconBg="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          trend="up"
          trendValue="+0.12"
        />

        {/* Attendance with progress ring */}
        <motion.div variants={fadeUp} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-2">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">87%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Attendance</p>
                </div>
                <AttendanceRing value={87} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Fees */}
        <KpiCard
          label="Pending Fees"
          value="$12K"
          icon={DollarSign}
          iconBg="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
      </div>

      {/* Weekly Study Hours Chart */}
      <ChartCard title="Weekly Study Hours">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyHoursData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipProps} />
              <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2.5} fill="url(#studyGrad)" dot={{ fill: "#3b82f6", r: 3, strokeWidth: 2, stroke: "#fff" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Upcoming Exams Table */}
      <motion.div variants={fadeUp}>
        <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
          <CardContent className="p-5">
            <SectionTitle className="mb-4">Upcoming Exams</SectionTitle>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Subject</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Type</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider">Date</TableHead>
                    <TableHead className="text-xs text-slate-500 uppercase tracking-wider text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingExams.map((exam) => (
                    <TableRow key={exam.subject + exam.type}>
                      <TableCell className="font-medium text-sm">{exam.subject}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">{exam.type}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">{exam.date}</TableCell>
                      <TableCell className="text-right">{getDaysLeftBadge(exam.daysLeft)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* My Subjects Grid */}
      <motion.div variants={fadeUp}>
        <SectionTitle className="mb-3">My Subjects</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {subjects.map((subject) => (
            <motion.div
              key={subject.name}
              variants={fadeUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <p className="text-sm font-medium truncate">{subject.name}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-3 ml-3.5">
                    {subject.teacher}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", getAttendanceColor(subject.attendance))}
                        style={{ width: `${subject.attendance}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums flex-shrink-0">
                      {subject.attendance}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={fadeUp}>
        <Card className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
          <CardContent className="p-5">
            <SectionTitle className="mb-4">Recent Activity</SectionTitle>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0" />
                  <p className="text-sm text-slate-700 dark:text-slate-300 flex-1 min-w-0">{item.text}</p>
                  <span className="text-xs text-slate-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <SectionTitle className="mb-3">Quick Actions</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <QuickAction icon={FileText} label="Assignments" variant="primary" />
          <QuickAction icon={DollarSign} label="Fee Ledger" />
          <QuickAction icon={MessageSquare} label="Messages" />
          <QuickAction icon={Calendar} label="Leave" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================

export function DashboardPage() {
  const currentUser = useAppStore((s) => s.currentUser);

  if (!currentUser) return null;

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
      return null;
  }
}
