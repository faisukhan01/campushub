"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import {
  FileText, Download, Calendar, BarChart3, TrendingUp, Users,
  GraduationCap, CreditCard, Activity, BookOpen, Play,
  FileSpreadsheet, FileDown, Clock,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, Area, AreaChart,
} from "recharts";
import { useState } from "react";

// -------------------- Report Data --------------------

const enrollmentData = [
  { month: "Aug", count: 120 }, { month: "Sep", count: 245 }, { month: "Oct", count: 380 },
  { month: "Nov", count: 420 }, { month: "Dec", count: 510 }, { month: "Jan", count: 580 },
  { month: "Feb", count: 640 }, { month: "Mar", count: 720 }, { month: "Apr", count: 780 },
];

const attendanceData = [
  { dept: "CS", rate: 92 }, { dept: "BA", rate: 88 }, { dept: "Math", rate: 94 },
  { dept: "EE", rate: 86 }, { dept: "Eng", rate: 91 }, { dept: "Phy", rate: 89 },
];

const feeData = [
  { month: "Aug", collected: 180000, pending: 42000 },
  { month: "Sep", collected: 210000, pending: 38000 },
  { month: "Oct", collected: 195000, pending: 45000 },
  { month: "Nov", collected: 220000, pending: 30000 },
  { month: "Dec", collected: 175000, pending: 55000 },
  { month: "Jan", collected: 240000, pending: 25000 },
];

const gradeData = [
  { grade: "A+", count: 120 }, { grade: "A", count: 250 }, { grade: "B+", count: 310 },
  { grade: "B", count: 200 }, { grade: "C+", count: 100 }, { grade: "C", count: 50 },
  { grade: "D", count: 20 }, { grade: "F", count: 10 },
];

const PIE_COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#d97706", "#f59e0b", "#fbbf24", "#ef4444"];

const enrollmentChartConfig: ChartConfig = { count: { label: "Enrollments", color: "#059669" } };
const attendanceChartConfig: ChartConfig = { rate: { label: "Attendance %", color: "#059669" } };
const feeChartConfig: ChartConfig = { collected: { label: "Collected", color: "#059669" }, pending: { label: "Pending", color: "#d97706" } };

// -------------------- Report Types --------------------

const reportTypes = [
  { id: "enrollment", title: "Enrollment Summary", desc: "Student enrollment trends, department distribution, and demographics", icon: Users, color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600" },
  { id: "attendance", title: "Attendance Report", desc: "Department-wise attendance rates, trends, and absentee analysis", icon: Activity, color: "bg-amber-100 dark:bg-amber-900/50 text-amber-600" },
  { id: "fees", title: "Fee Collection Report", desc: "Revenue analytics, payment status, and collection efficiency", icon: CreditCard, color: "bg-purple-100 dark:bg-purple-900/50 text-purple-600" },
  { id: "academic", title: "Academic Performance", desc: "Grade distribution, GPA analysis, and course performance", icon: GraduationCap, color: "bg-rose-100 dark:bg-rose-900/50 text-rose-600" },
  { id: "usage", title: "Activity / Usage Report", desc: "Platform usage, login frequency, and feature adoption", icon: BarChart3, color: "bg-sky-100 dark:bg-sky-900/50 text-sky-600" },
  { id: "courses", title: "Course Analytics", desc: "Course popularity, enrollment capacity, and completion rates", icon: BookOpen, color: "bg-teal-100 dark:bg-teal-900/50 text-teal-600" },
];

// -------------------- Report Preview Component --------------------

function ReportPreview({ reportId, onClose }: { reportId: string; onClose: () => void }) {
  const report = reportTypes.find((r) => r.id === reportId);

  const renderChart = () => {
    switch (reportId) {
      case "enrollment":
        return (
          <ChartContainer config={enrollmentChartConfig} className="h-[300px] w-full">
            <AreaChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="enrollGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="count" stroke="#059669" fill="url(#enrollGrad2)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        );
      case "attendance":
        return (
          <ChartContainer config={attendanceChartConfig} className="h-[300px] w-full">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="dept" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <YAxis domain={[75, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="rate" fill="#059669" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ChartContainer>
        );
      case "fees":
        return (
          <ChartContainer config={feeChartConfig} className="h-[300px] w-full">
            <BarChart data={feeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="collected" fill="#059669" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="pending" fill="#d97706" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ChartContainer>
        );
      case "academic":
        return (
          <ChartContainer config={{ count: { label: "Students", color: "#059669" } }} className="h-[300px] w-full">
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="grade" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={24}>
                {gradeData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        );
      default:
        return (
          <div className="h-[300px] w-full flex items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Chart preview available for main reports</p>
          </div>
        );
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {report && <report.icon className="w-5 h-5 text-emerald-600" />}
            {report?.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{report?.desc}</p>
        </DialogHeader>

        {/* Date Range */}
        <div className="flex items-center gap-3 pb-2 border-b">
          <div className="flex items-center gap-2 flex-1">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">From</Label>
            <Input type="date" defaultValue="2025-01-01" className="text-sm h-9" />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">To</Label>
            <Input type="date" defaultValue="2025-06-30" className="text-sm h-9" />
          </div>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-9">
            <Play className="w-3 h-3 mr-1" />Generate
          </Button>
        </div>

        {/* Chart */}
        <div className="mt-2">
          {renderChart()}
        </div>

        {/* Data Table */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Data Summary</h4>
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow><TableCell>January 2025</TableCell><TableCell className="text-right font-medium">580</TableCell><TableCell className="text-right text-emerald-600">+12.3%</TableCell></TableRow>
              <TableRow><TableCell>February 2025</TableCell><TableCell className="text-right font-medium">640</TableCell><TableCell className="text-right text-emerald-600">+10.3%</TableCell></TableRow>
              <TableRow><TableCell>March 2025</TableCell><TableCell className="text-right font-medium">720</TableCell><TableCell className="text-right text-emerald-600">+12.5%</TableCell></TableRow>
              <TableRow><TableCell>April 2025</TableCell><TableCell className="text-right font-medium">780</TableCell><TableCell className="text-right text-emerald-600">+8.3%</TableCell></TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Export Options */}
        <div className="flex justify-end gap-2 pt-2 border-t mt-4">
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
      </DialogContent>
    </Dialog>
  );
}

// -------------------- Main Page --------------------

export function ReportsPage() {
  const [activeReport, setActiveReport] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and download institutional reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Input type="date" defaultValue="2025-01-01" className="text-sm h-9 w-[140px]" />
          <span className="text-muted-foreground">to</span>
          <Input type="date" defaultValue="2025-06-30" className="text-sm h-9 w-[140px]" />
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{}}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">This Year</Badge>
                </div>
                <h3 className="text-sm font-semibold mb-1">{report.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{report.desc}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setActiveReport(report.id)}>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold">1,240</p>
              <p className="text-xs text-muted-foreground">Reports Generated</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Download className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold">856</p>
              <p className="text-xs text-muted-foreground">Downloads</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold">24</p>
              <p className="text-xs text-muted-foreground">Scheduled Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-lg font-bold">12</p>
              <p className="text-xs text-muted-foreground">Custom Templates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Preview Dialog */}
      {activeReport && (
        <ReportPreview reportId={activeReport} onClose={() => setActiveReport(null)} />
      )}
    </div>
  );
}
