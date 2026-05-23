"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import {
  FileText, Download, BarChart3, TrendingUp, Users,
  GraduationCap, CreditCard, Activity, BookOpen, Play,
  FileSpreadsheet, FileDown, Loader2, Calendar,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";

// -------------------- Types --------------------

interface EnrollmentReport {
  totalActiveEnrollments: number;
  totalStudents: number;
  topCourses: { id: string; code: string; title: string; classLevel?: string; enrollmentCount: number }[];
  usersByRole: { role: string; count: number }[];
}

interface AttendanceReport {
  totalSessions: number;
  totalRecords: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
  statusDistribution: { status: string; count: number }[];
}

interface FeesReport {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  totalAmount: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  recentPayments: { id: string; amount: number; method: string; status: string; studentName: string; createdAt: string }[];
  paymentsByMethod: { method: string; count: number; totalAmount: number }[];
}

interface AcademicReport {
  totalGrades: number;
  averageMarks: number;
  gradeDistribution: { grade: string; count: number }[];
}

type ReportData = {
  enrollment?: EnrollmentReport;
  attendance?: AttendanceReport;
  fees?: FeesReport;
  academic?: AcademicReport;
};

// -------------------- Constants --------------------

const reportTypes = [
  { id: "enrollment", title: "Enrollment Summary", desc: "Student enrollment stats, top courses, and user role breakdown", icon: Users, color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600" },
  { id: "attendance", title: "Attendance Report", desc: "Session counts, attendance rate, and status distribution", icon: Activity, color: "bg-amber-100 dark:bg-amber-900/50 text-amber-600" },
  { id: "fees", title: "Fee Collection Report", desc: "Revenue analytics, payment methods, and collection efficiency", icon: CreditCard, color: "bg-purple-100 dark:bg-purple-900/50 text-purple-600" },
  { id: "academic", title: "Academic Performance", desc: "Grade distribution, average marks, and assessment results", icon: GraduationCap, color: "bg-rose-100 dark:bg-rose-900/50 text-rose-600" },
  { id: "courses", title: "Course Analytics", desc: "Subject enrollment, top courses, and capacity usage", icon: BookOpen, color: "bg-teal-100 dark:bg-teal-900/50 text-teal-600" },
];

const PIE_COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#d97706", "#f59e0b", "#fbbf24", "#ef4444"];
const STATUS_COLORS: Record<string, string> = {
  Present: "#059669", Late: "#f59e0b", Absent: "#ef4444", Excused: "#6366f1",
};

// -------------------- Report Preview Component --------------------

function ReportPreview({
  reportId,
  onClose,
}: {
  reportId: string;
  onClose: () => void;
}) {
  const report = reportTypes.find(r => r.id === reportId);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typeToFetch = reportId === "courses" ? "enrollment" : reportId;

  const generate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports?type=${typeToFetch}`);
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to generate report");
        return;
      }
      const json = await res.json();
      setReportData(json.data);
      setGenerated(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [typeToFetch]);

  const renderChart = () => {
    if (!generated || !reportData) return null;

    if (reportId === "enrollment" || reportId === "courses") {
      const d = reportData.enrollment;
      if (!d) return null;
      const chartData = d.topCourses.slice(0, 8);
      if (chartData.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">No enrollment data yet.</p>;
      return (
        <ChartContainer config={{ enrollmentCount: { label: "Enrollments", color: "#059669" } }} className="h-[280px] w-full">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} allowDecimals={false} />
            <YAxis dataKey="title" type="category" width={110} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="enrollmentCount" fill="#059669" radius={[0, 4, 4, 0]} barSize={18} />
          </BarChart>
        </ChartContainer>
      );
    }

    if (reportId === "attendance") {
      const d = reportData.attendance;
      if (!d) return null;
      if (d.statusDistribution.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">No attendance data yet.</p>;
      const chartConfig: ChartConfig = { count: { label: "Records", color: "#059669" } };
      return (
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={d.statusDistribution}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="status" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
              {d.statusDistribution.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLORS[entry.status] || PIE_COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      );
    }

    if (reportId === "fees") {
      const d = reportData.fees;
      if (!d) return null;
      if (d.paymentsByMethod.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">No fee payment data yet.</p>;
      const chartConfig: ChartConfig = { totalAmount: { label: "Amount (PKR)", color: "#059669" } };
      return (
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={d.paymentsByMethod}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="method" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="totalAmount" fill="#059669" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ChartContainer>
      );
    }

    if (reportId === "academic") {
      const d = reportData.academic;
      if (!d) return null;
      if (d.gradeDistribution.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">No grade data yet.</p>;
      const chartConfig: ChartConfig = { count: { label: "Students", color: "#059669" } };
      return (
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={d.gradeDistribution}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="grade" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={28}>
              {d.gradeDistribution.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      );
    }

    return null;
  };

  const renderSummaryTable = () => {
    if (!generated || !reportData) return null;

    if ((reportId === "enrollment" || reportId === "courses") && reportData.enrollment) {
      const d = reportData.enrollment;
      return (
        <div className="space-y-2">
          <div className="flex gap-6 text-sm">
            <div><span className="text-muted-foreground">Total Students:</span> <strong>{d.totalStudents.toLocaleString()}</strong></div>
            <div><span className="text-muted-foreground">Active Enrollments:</span> <strong>{d.totalActiveEnrollments.toLocaleString()}</strong></div>
          </div>
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                {d.topCourses[0]?.classLevel && <TableHead>Class</TableHead>}
                <TableHead className="text-right">Enrollments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.topCourses.slice(0, 6).map((c, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  {c.classLevel && <TableCell><Badge variant="outline" className="text-[10px]">Cl {c.classLevel}</Badge></TableCell>}
                  <TableCell className="text-right font-bold">{c.enrollmentCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    if (reportId === "attendance" && reportData.attendance) {
      const d = reportData.attendance;
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-emerald-600">{d.attendanceRate}%</p>
              <p className="text-xs text-muted-foreground">Attendance Rate</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{d.totalSessions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Sessions Held</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{d.totalRecords.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Records</p>
            </div>
          </div>
          <div className="flex gap-4 text-xs">
            <div><span className="text-muted-foreground">Present:</span> <strong className="text-emerald-600">{d.present.toLocaleString()}</strong></div>
            <div><span className="text-muted-foreground">Late:</span> <strong className="text-amber-600">{d.late.toLocaleString()}</strong></div>
            <div><span className="text-muted-foreground">Absent:</span> <strong className="text-rose-600">{d.absent.toLocaleString()}</strong></div>
          </div>
        </div>
      );
    }

    if (reportId === "fees" && reportData.fees) {
      const d = reportData.fees;
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">PKR {d.totalCollected.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Collected</p>
            </div>
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20">
              <p className="text-lg font-bold text-rose-700 dark:text-rose-400">PKR {d.totalOutstanding.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Outstanding</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Collection Rate</span>
              <span className="font-semibold">{d.collectionRate}%</span>
            </div>
            <Progress value={d.collectionRate} className="h-2" />
          </div>
          <div className="flex gap-4 text-xs">
            <div><span className="text-muted-foreground">Invoices:</span> <strong>{d.totalInvoices}</strong></div>
            <div><span className="text-muted-foreground">Paid:</span> <strong className="text-emerald-600">{d.paidInvoices}</strong></div>
            <div><span className="text-muted-foreground">Pending:</span> <strong className="text-amber-600">{d.pendingInvoices}</strong></div>
          </div>
        </div>
      );
    }

    if (reportId === "academic" && reportData.academic) {
      const d = reportData.academic;
      return (
        <div className="space-y-2">
          <div className="flex gap-6 text-sm">
            <div><span className="text-muted-foreground">Total Grade Records:</span> <strong>{d.totalGrades.toLocaleString()}</strong></div>
            <div><span className="text-muted-foreground">Average Marks:</span> <strong>{d.averageMarks}</strong></div>
          </div>
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.gradeDistribution.map((g, i) => {
                const total = d.gradeDistribution.reduce((s, x) => s + x.count, 0);
                const pct = total > 0 ? Math.round((g.count / total) * 100) : 0;
                return (
                  <TableRow key={i}>
                    <TableCell><Badge variant="outline" className="text-[10px]" style={{ borderColor: PIE_COLORS[i % PIE_COLORS.length], color: PIE_COLORS[i % PIE_COLORS.length] }}>{g.grade}</Badge></TableCell>
                    <TableCell className="text-right font-medium">{g.count}</TableCell>
                    <TableCell className="text-right">{pct}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {report && <report.icon className="w-5 h-5 text-emerald-600" />}
            {report?.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{report?.desc}</p>
        </DialogHeader>

        {/* Generate button */}
        <div className="flex justify-center py-2 border-b">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={generate}
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating…</>
            ) : (
              <><Play className="w-4 h-4 mr-1" />{generated ? "Re-generate" : "Generate Report"}</>
            )}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center py-2">{error}</p>
        )}

        {!generated && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Click &ldquo;Generate Report&rdquo; to load real-time data</p>
          </div>
        )}

        {generated && (
          <>
            <div className="mt-2">{renderChart()}</div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-3">Data Summary</h4>
              {renderSummaryTable()}
            </div>

            {/* Export Options */}
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />Excel
              </Button>
              <Button variant="outline" size="sm">
                <FileDown className="w-4 h-4 mr-2" />CSV
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Download className="w-4 h-4 mr-2" />Download PDF
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// -------------------- Main Page --------------------

export function ReportsPage() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<ReportData | null>(null);
  const [summaryLoaded, setSummaryLoaded] = useState(false);

  // Load summary KPIs on mount
  const loadSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/reports?type=all");
      if (res.ok) {
        const json = await res.json();
        setSummaryData(json.data);
        setSummaryLoaded(true);
      }
    } catch { /* silent */ }
  }, []);

  // Load summary on first render
  useEffect(() => { loadSummary(); }, [loadSummary]);

  const quickStats = summaryLoaded && summaryData ? [
    {
      label: "Active Enrollments",
      value: summaryData.enrollment?.totalActiveEnrollments?.toLocaleString() ?? "—",
      icon: FileText,
      color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600",
    },
    {
      label: "Attendance Rate",
      value: summaryData.attendance ? `${summaryData.attendance.attendanceRate}%` : "—",
      icon: Activity,
      color: "bg-amber-100 dark:bg-amber-900/50 text-amber-600",
    },
    {
      label: "Fee Collection Rate",
      value: summaryData.fees ? `${summaryData.fees.collectionRate}%` : "—",
      icon: CreditCard,
      color: "bg-purple-100 dark:bg-purple-900/50 text-purple-600",
    },
    {
      label: "Avg Marks",
      value: summaryData.academic ? `${summaryData.academic.averageMarks}` : "—",
      icon: GraduationCap,
      color: "bg-rose-100 dark:bg-rose-900/50 text-rose-600",
    },
  ] : [
    { label: "Active Enrollments", value: "—", icon: FileText, color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600" },
    { label: "Attendance Rate", value: "—", icon: Activity, color: "bg-amber-100 dark:bg-amber-900/50 text-amber-600" },
    { label: "Fee Collection Rate", value: "—", icon: CreditCard, color: "bg-purple-100 dark:bg-purple-900/50 text-purple-600" },
    { label: "Avg Marks", value: "—", icon: GraduationCap, color: "bg-rose-100 dark:bg-rose-900/50 text-rose-600" },
  ];

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground text-sm">Generate real-time institutional reports scoped to your access</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map(report => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="card-premium">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-xs">Real-time</Badge>
                </div>
                <h3 className="text-sm font-semibold mb-1">{report.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{report.desc}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setActiveReport(report.id)}
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />Generate
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Report Preview Dialog */}
      {activeReport && (
        <ReportPreview reportId={activeReport} onClose={() => setActiveReport(null)} />
      )}
    </div>
  );
}
