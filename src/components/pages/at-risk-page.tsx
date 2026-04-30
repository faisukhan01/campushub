"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import {
  AlertTriangle, TrendingUp, TrendingDown, Minus, Users, Send,
  Brain, ChevronDown, ChevronUp, Activity, BookOpen, Clock,
  GraduationCap, Mail, Bell, ArrowUpRight, ArrowDownRight, Eye,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell,
  ScatterChart, Scatter, ZAxis,
} from "recharts";
import { useState, useMemo } from "react";

// -------------------- Types --------------------

interface StudentRisk {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  course: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  attendance: number;
  gpa: number;
  missingAssignments: number;
  lastLogin: string;
  trend: "improving" | "declining" | "stable";
  aiInsight: string;
  attendanceHistory: { week: string; rate: number }[];
  gradeHistory: { week: string; gpa: number }[];
}

// -------------------- Chart Configs --------------------

const riskTrendConfig: ChartConfig = {
  critical: { label: "Critical", color: "#dc2626" },
  high: { label: "High", color: "#ea580c" },
  medium: { label: "Medium", color: "#d97706" },
  total: { label: "Total", color: "#059669" },
};

const pieConfig: ChartConfig = {
  critical: { label: "Critical", color: "#dc2626" },
  high: { label: "High", color: "#ea580c" },
  medium: { label: "Medium", color: "#d97706" },
  low: { label: "Low", color: "#059669" },
};

// -------------------- Mock Data --------------------

const studentsRisk: StudentRisk[] = [
  {
    id: "SR-001", name: "Marcus Johnson", rollNo: "CS-2024-042", department: "Computer Science", course: "Data Structures",
    riskLevel: "Critical", attendance: 48, gpa: 1.4, missingAssignments: 7, lastLogin: "5 days ago", trend: "declining",
    aiInsight: "Student has missed 3 consecutive classes in Data Structures. Recommend immediate parent-teacher meeting and attendance recovery plan. GPA has dropped 0.6 points in the last month.",
    attendanceHistory: [
      { week: "Wk 1", rate: 72 }, { week: "Wk 2", rate: 65 }, { week: "Wk 3", rate: 58 }, { week: "Wk 4", rate: 48 },
    ],
    gradeHistory: [
      { week: "Wk 1", gpa: 2.0 }, { week: "Wk 2", gpa: 1.8 }, { week: "Wk 3", gpa: 1.5 }, { week: "Wk 4", gpa: 1.4 },
    ],
  },
  {
    id: "SR-002", name: "Aisha Khan", rollNo: "EC-2024-018", department: "Electronics", course: "Circuit Theory",
    riskLevel: "Critical", attendance: 52, gpa: 1.6, missingAssignments: 5, lastLogin: "2 days ago", trend: "declining",
    aiInsight: "Attendance drop coincides with missing 5 lab assignments. Student may be facing personal challenges. Suggest counseling referral and flexible assignment deadlines.",
    attendanceHistory: [
      { week: "Wk 1", rate: 68 }, { week: "Wk 2", rate: 60 }, { week: "Wk 3", rate: 55 }, { week: "Wk 4", rate: 52 },
    ],
    gradeHistory: [
      { week: "Wk 1", gpa: 2.1 }, { week: "Wk 2", gpa: 1.9 }, { week: "Wk 3", gpa: 1.7 }, { week: "Wk 4", gpa: 1.6 },
    ],
  },
  {
    id: "SR-003", name: "Tyler Brooks", rollNo: "ME-2024-071", department: "Mechanical", course: "Thermodynamics",
    riskLevel: "High", attendance: 62, gpa: 1.8, missingAssignments: 4, lastLogin: "1 day ago", trend: "declining",
    aiInsight: "Declining trend in both attendance and grades. Currently on academic probation warning. Early intervention with peer tutoring recommended.",
    attendanceHistory: [
      { week: "Wk 1", rate: 75 }, { week: "Wk 2", rate: 70 }, { week: "Wk 3", rate: 66 }, { week: "Wk 4", rate: 62 },
    ],
    gradeHistory: [
      { week: "Wk 1", gpa: 2.2 }, { week: "Wk 2", gpa: 2.0 }, { week: "Wk 3", gpa: 1.9 }, { week: "Wk 4", gpa: 1.8 },
    ],
  },
  {
    id: "SR-004", name: "Priya Sharma", rollNo: "CS-2024-015", department: "Computer Science", course: "Algorithms",
    riskLevel: "High", attendance: 65, gpa: 1.9, missingAssignments: 3, lastLogin: "3 days ago", trend: "stable",
    aiInsight: "Attendance is borderline and GPA has stabilized. Weekly check-ins and assignment reminders could help maintain current trajectory.",
    attendanceHistory: [
      { week: "Wk 1", rate: 63 }, { week: "Wk 2", rate: 64 }, { week: "Wk 3", rate: 66 }, { week: "Wk 4", rate: 65 },
    ],
    gradeHistory: [
      { week: "Wk 1", gpa: 1.8 }, { week: "Wk 2", gpa: 1.9 }, { week: "Wk 3", gpa: 1.9 }, { week: "Wk 4", gpa: 1.9 },
    ],
  },
  {
    id: "SR-005", name: "James Lee", rollNo: "CE-2024-033", department: "Civil Eng.", course: "Structural Analysis",
    riskLevel: "Medium", attendance: 70, gpa: 2.1, missingAssignments: 2, lastLogin: "1 day ago", trend: "improving",
    aiInsight: "Show improvement in attendance after initial struggles. Continue monitoring but current recovery plan seems effective.",
    attendanceHistory: [
      { week: "Wk 1", rate: 60 }, { week: "Wk 2", rate: 65 }, { week: "Wk 3", rate: 68 }, { week: "Wk 4", rate: 70 },
    ],
    gradeHistory: [
      { week: "Wk 1", gpa: 1.9 }, { week: "Wk 2", gpa: 2.0 }, { week: "Wk 3", gpa: 2.0 }, { week: "Wk 4", gpa: 2.1 },
    ],
  },
  {
    id: "SR-006", name: "Fatima Al-Rashid", rollNo: "CS-2024-008", department: "Computer Science", course: "Database Systems",
    riskLevel: "Medium", attendance: 72, gpa: 2.2, missingAssignments: 2, lastLogin: "Today", trend: "improving",
    aiInsight: "Improving trend is encouraging. Suggest study group enrollment and additional office hours to maintain momentum.",
    attendanceHistory: [
      { week: "Wk 1", rate: 64 }, { week: "Wk 2", rate: 68 }, { week: "Wk 3", rate: 70 }, { week: "Wk 4", rate: 72 },
    ],
    gradeHistory: [
      { week: "Wk 1", gpa: 2.0 }, { week: "Wk 2", gpa: 2.1 }, { week: "Wk 3", gpa: 2.1 }, { week: "Wk 4", gpa: 2.2 },
    ],
  },
  {
    id: "SR-007", name: "Daniel Martinez", rollNo: "EC-2024-055", department: "Electronics", course: "Signals & Systems",
    riskLevel: "Low", attendance: 76, gpa: 2.4, missingAssignments: 1, lastLogin: "Today", trend: "improving",
    aiInsight: "Student was flagged for GPA concern but has shown steady recovery. No immediate intervention needed. Add to monitoring list.",
    attendanceHistory: [
      { week: "Wk 1", rate: 70 }, { week: "Wk 2", rate: 73 }, { week: "Wk 3", rate: 75 }, { week: "Wk 4", rate: 76 },
    ],
    gradeHistory: [
      { week: "Wk 1", gpa: 2.2 }, { week: "Wk 2", gpa: 2.3 }, { week: "Wk 3", gpa: 2.3 }, { week: "Wk 4", gpa: 2.4 },
    ],
  },
  {
    id: "SR-008", name: "Sophia Chen", rollNo: "ME-2024-029", department: "Mechanical", course: "Manufacturing",
    riskLevel: "Low", attendance: 78, gpa: 2.5, missingAssignments: 0, lastLogin: "Yesterday", trend: "stable",
    aiInsight: "Recovering well after a brief attendance dip. All assignments submitted. Consider removing from risk list after next assessment.",
    attendanceHistory: [
      { week: "Wk 1", rate: 74 }, { week: "Wk 2", rate: 76 }, { week: "Wk 3", rate: 77 }, { week: "Wk 4", rate: 78 },
    ],
    gradeHistory: [
      { week: "Wk 1", gpa: 2.4 }, { week: "Wk 2", gpa: 2.5 }, { week: "Wk 3", gpa: 2.5 }, { week: "Wk 4", gpa: 2.5 },
    ],
  },
];

const weeklyRiskTrend = [
  { week: "Wk 1", critical: 1, high: 2, medium: 3, total: 8 },
  { week: "Wk 2", critical: 1, high: 3, medium: 2, total: 8 },
  { week: "Wk 3", critical: 2, high: 2, medium: 3, total: 8 },
  { week: "Wk 4", critical: 2, high: 2, medium: 2, total: 8 },
  { week: "Wk 5", critical: 2, high: 3, medium: 2, total: 9 },
  { week: "Wk 6", critical: 2, high: 2, medium: 2, total: 8 },
  { week: "Wk 7", critical: 2, high: 2, medium: 2, total: 8 },
  { week: "Wk 8", critical: 2, high: 2, medium: 2, total: 8 },
];

const riskDistribution = [
  { name: "Critical", value: 2, color: "#dc2626" },
  { name: "High", value: 2, color: "#ea580c" },
  { name: "Medium", value: 2, color: "#d97706" },
  { name: "Low", value: 2, color: "#059669" },
];

const scatterData = studentsRisk.map((s) => ({
  name: s.name,
  attendance: s.attendance,
  gpa: s.gpa,
  risk: s.riskLevel,
  z: s.riskLevel === "Critical" ? 400 : s.riskLevel === "High" ? 300 : s.riskLevel === "Medium" ? 200 : 100,
}));

// -------------------- Helper Functions --------------------

function getRiskColor(level: string) {
  switch (level) {
    case "Critical": return { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", border: "border-red-300 dark:border-red-800", badge: "badge-gradient-danger" };
    case "High": return { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-300 dark:border-orange-800", badge: "badge-gradient-warm" };
    case "Medium": return { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-300 dark:border-amber-800", badge: "badge-gradient" };
    default: return { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-300 dark:border-emerald-800", badge: "badge-gradient" };
  }
}

function getScatterColor(risk: string) {
  switch (risk) {
    case "Critical": return "#dc2626";
    case "High": return "#ea580c";
    case "Medium": return "#d97706";
    default: return "#059669";
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "improving": return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    case "declining": return <TrendingDown className="w-4 h-4 text-red-500" />;
    default: return <Minus className="w-4 h-4 text-amber-500" />;
  }
}

function getTrendLabel(trend: string) {
  switch (trend) {
    case "improving": return "Improving";
    case "declining": return "Declining";
    default: return "Stable";
  }
}

export function AtRiskPage() {
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    return studentsRisk.filter((s) => {
      if (riskFilter !== "all" && s.riskLevel !== riskFilter) return false;
      if (courseFilter !== "all" && s.course !== courseFilter) return false;
      return true;
    });
  }, [riskFilter, courseFilter]);

  const uniqueCourses = useMemo(() => {
    const courses = Array.from(new Set(studentsRisk.map((s) => s.course)));
    return courses;
  }, []);

  const stats = useMemo(() => ({
    total: studentsRisk.length,
    critical: studentsRisk.filter((s) => s.riskLevel === "Critical").length,
    warning: studentsRisk.filter((s) => s.gpa < 2.0).length,
    improving: studentsRisk.filter((s) => s.trend === "improving").length,
  }), []);

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">At-Risk Student Alerts</h1>
              <p className="text-muted-foreground">Identify and track students who need support</p>
            </div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Send className="w-4 h-4 mr-2" /> Send Bulk Alert
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total At-Risk", value: stats.total, icon: Users, color: "from-emerald-500 to-teal-600", bgColor: "bg-emerald-100 dark:bg-emerald-900/50", textColor: "text-emerald-600 dark:text-emerald-400" },
          { label: "Critical", value: stats.critical, icon: AlertTriangle, color: "from-red-500 to-orange-500", bgColor: "bg-red-100 dark:bg-red-900/50", textColor: "text-red-600 dark:text-red-400" },
          { label: "GPA Warning", value: stats.warning, icon: GraduationCap, color: "from-amber-500 to-yellow-500", bgColor: "bg-amber-100 dark:bg-amber-900/50", textColor: "text-amber-600 dark:text-amber-400" },
          { label: "Improving", value: stats.improving, icon: TrendingUp, color: "from-teal-500 to-emerald-600", bgColor: "bg-teal-100 dark:bg-teal-900/50", textColor: "text-teal-600 dark:text-teal-400" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="stat-card-gradient">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground shrink-0">Risk Level:</Label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[150px] h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground shrink-0">Course:</Label>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-[180px] h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {uniqueCourses.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:ml-auto text-xs text-muted-foreground">
              Showing {filteredStudents.length} of {studentsRisk.length} students
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Matrix + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Matrix (Scatter Plot) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Risk Matrix</CardTitle>
            <CardDescription>Attendance % vs GPA — bubble size represents risk severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieConfig} className="h-[320px] w-full chart-container">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  type="number" dataKey="attendance" domain={[40, 100]}
                  name="Attendance" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  tickFormatter={(v: number) => `${v}%`}
                  label={{ value: "Attendance %", position: "insideBottom", offset: -5, fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  type="number" dataKey="gpa" domain={[1, 4]}
                  name="GPA" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  label={{ value: "GPA", angle: -90, position: "insideLeft", fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="z" range={[100, 500]} />
                <ChartTooltip
                  content={({ payload }) => {
                    if (!payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <p className="font-semibold text-sm">{d?.name}</p>
                        <p className="text-xs text-muted-foreground">Attendance: {d?.attendance}%</p>
                        <p className="text-xs text-muted-foreground">GPA: {d?.gpa}</p>
                        <Badge className="mt-1 text-[10px]" style={{ backgroundColor: getScatterColor(d?.risk), color: "#fff" }}>{d?.risk}</Badge>
                      </div>
                    );
                  }}
                />
                {/* Risk zone backgrounds via reference lines */}
                <Scatter name="Students" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getScatterColor(entry.risk)} fillOpacity={0.8} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ChartContainer>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-2 justify-center flex-wrap">
              {[
                { label: "Critical (Att < 60%)", color: "#dc2626" },
                { label: "High", color: "#ea580c" },
                { label: "Medium", color: "#d97706" },
                { label: "Low / Improving", color: "#059669" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Risk Distribution</CardTitle>
            <CardDescription>Students by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieConfig} className="h-[200px] w-full">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="space-y-2 mt-2">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Risk Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Weekly Risk Trend</CardTitle>
          <CardDescription>Tracking at-risk student count over the past 8 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={riskTrendConfig} className="h-[250px] w-full chart-container">
            <LineChart data={weeklyRiskTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} domain={[0, 10]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="critical" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} name="Critical" />
              <Line type="monotone" dataKey="high" stroke="#ea580c" strokeWidth={2} dot={{ r: 3 }} name="High" />
              <Line type="monotone" dataKey="medium" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} name="Medium" />
              <Line type="monotone" dataKey="total" stroke="#059669" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} name="Total" />
            </LineChart>
          </ChartContainer>
          <div className="flex items-center gap-4 mt-2 justify-center flex-wrap">
            <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-0.5 bg-red-600 rounded" /><span className="text-muted-foreground">Critical</span></div>
            <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-0.5 bg-orange-600 rounded" /><span className="text-muted-foreground">High</span></div>
            <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-0.5 bg-amber-600 rounded" /><span className="text-muted-foreground">Medium</span></div>
            <div className="flex items-center gap-1.5 text-xs"><div className="w-3 h-0.5 bg-emerald-600 rounded border-dashed" style={{ borderTop: "2px dashed #059669", height: 0 }} /><span className="text-muted-foreground">Total</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Student Risk Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Student Risk Profiles
        </h2>
        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const colors = getRiskColor(student.riskLevel);
            const isExpanded = expandedStudent === student.id;
            return (
              <Card key={student.id} className={`overflow-hidden transition-all duration-200 border-l-4 ${colors.border}`}>
                <CardContent className="p-0">
                  {/* Main Row */}
                  <button
                    className="w-full p-4 text-left flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center shrink-0`}>
                        <span className={`text-sm font-bold ${colors.text}`}>
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm truncate">{student.name}</p>
                          <Badge className={`text-[10px] ${colors.badge}`}>{student.riskLevel}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{student.rollNo} · {student.department}</p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className={`text-sm font-bold ${student.attendance < 60 ? "text-red-600 dark:text-red-400" : student.attendance < 75 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                            {student.attendance}%
                          </p>
                          <p className="text-[10px] text-muted-foreground">Attendance</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className={`text-sm font-bold ${student.gpa < 2.0 ? "text-red-600 dark:text-red-400" : student.gpa < 2.5 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                            {student.gpa.toFixed(1)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">GPA</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className={`text-sm font-bold ${student.missingAssignments > 3 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
                            {student.missingAssignments}
                          </p>
                          <p className="text-[10px] text-muted-foreground">Missing</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(student.trend)}
                        <span className="text-[10px] text-muted-foreground hidden sm:inline">{getTrendLabel(student.trend)}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Separator />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Attendance Trend */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" /> Attendance Trend (4 weeks)
                          </h4>
                          <ChartContainer config={{ rate: { label: "Rate", color: "#059669" } }} className="h-[120px] w-full">
                            <LineChart data={student.attendanceHistory}>
                              <XAxis dataKey="week" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                              <YAxis domain={[0, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} tickFormatter={(v: number) => `${v}%`} />
                              <Line type="monotone" dataKey="rate" stroke="#059669" strokeWidth={2} dot={{ r: 3, fill: "#059669" }} />
                            </LineChart>
                          </ChartContainer>
                        </div>

                        {/* Grade Trend */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5" /> GPA Trend (4 weeks)
                          </h4>
                          <ChartContainer config={{ gpa: { label: "GPA", color: "#d97706" } }} className="h-[120px] w-full">
                            <LineChart data={student.gradeHistory}>
                              <XAxis dataKey="week" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                              <YAxis domain={[0, 4]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                              <Line type="monotone" dataKey="gpa" stroke="#d97706" strokeWidth={2} dot={{ r: 3, fill: "#d97706" }} />
                            </LineChart>
                          </ChartContainer>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-2.5 rounded-lg bg-muted/30 text-center">
                          <p className="text-xs text-muted-foreground">Course</p>
                          <p className="text-sm font-medium mt-0.5">{student.course}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-muted/30 text-center">
                          <p className="text-xs text-muted-foreground">Missing Assignments</p>
                          <p className={`text-sm font-bold mt-0.5 ${student.missingAssignments > 3 ? "text-red-600 dark:text-red-400" : ""}`}>{student.missingAssignments}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-muted/30 text-center">
                          <p className="text-xs text-muted-foreground">Last Login</p>
                          <p className="text-sm font-medium mt-0.5">{student.lastLogin}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-muted/30 text-center">
                          <p className="text-xs text-muted-foreground">Trend</p>
                          <p className="text-sm font-medium mt-0.5 flex items-center justify-center gap-1">
                            {getTrendIcon(student.trend)} {getTrendLabel(student.trend)}
                          </p>
                        </div>
                      </div>

                      {/* AI Insights */}
                      <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                        <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-2">
                          <Brain className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-400">AI Insight</span>
                        </h4>
                        <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">{student.aiInsight}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          <Mail className="w-3.5 h-3.5 mr-1.5" /> Notify Parent
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bell className="w-3.5 h-3.5 mr-1.5" /> Alert Admin
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> View Full Profile
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
