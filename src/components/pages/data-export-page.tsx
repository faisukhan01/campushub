"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Download, Upload, FileSpreadsheet, FileText, FileJson, FileType,
  Users, BookOpen, Award, ClipboardCheck, CreditCard, BarChart3,
  Clock, CheckCircle2, AlertCircle, XCircle, Play, Pause, RotateCcw,
  Calendar, ArrowRight, FolderArchive, Zap, Trash2,
} from "lucide-react";
import { useState, useCallback } from "react";

// -------------------- Types --------------------

interface ExportType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  count: number;
  formats: string[];
  lastExport: string;
  color: string;
}

interface ExportHistoryItem {
  id: string;
  date: string;
  type: string;
  format: string;
  size: string;
  status: "Completed" | "Processing" | "Failed";
  records: number;
  user: string;
}

interface ScheduledExport {
  id: string;
  name: string;
  type: string;
  format: string;
  frequency: string;
  nextRun: string;
  active: boolean;
}

interface ActivityItem {
  id: string;
  action: string;
  type: string;
  time: string;
  user: string;
  status: "success" | "error" | "info";
}

// -------------------- Mock Data --------------------

const exportTypes: ExportType[] = [
  { id: "students", name: "Students", description: "Student profiles, enrollment, and contact data", icon: Users, count: 4820, formats: ["CSV", "Excel", "PDF", "JSON"], lastExport: "2 hours ago", color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400" },
  { id: "courses", name: "Courses", description: "Course catalog, modules, and teacher assignments", icon: BookOpen, count: 156, formats: ["CSV", "Excel", "PDF", "JSON"], lastExport: "1 day ago", color: "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400" },
  { id: "grades", name: "Grades", description: "Assessment results, GPAs, and transcripts", icon: Award, count: 24500, formats: ["CSV", "Excel", "PDF"], lastExport: "3 hours ago", color: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400" },
  { id: "attendance", name: "Attendance", description: "Daily attendance records and summaries", icon: ClipboardCheck, count: 185000, formats: ["CSV", "Excel", "PDF", "JSON"], lastExport: "5 hours ago", color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400" },
  { id: "fees", name: "Fees", description: "Fee invoices, payments, and outstanding balances", icon: CreditCard, count: 8920, formats: ["CSV", "Excel", "PDF"], lastExport: "1 day ago", color: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400" },
  { id: "reports", name: "Reports", description: "Custom reports and analytics summaries", icon: BarChart3, count: 48, formats: ["PDF", "Excel"], lastExport: "4 hours ago", color: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400" },
];

const exportHistory: ExportHistoryItem[] = [
  { id: "EXP-001", date: "Jan 28, 2026 14:32", type: "Students", format: "Excel", size: "2.4 MB", status: "Completed", records: 4820, user: "Dr. Sarah Chen" },
  { id: "EXP-002", date: "Jan 28, 2026 11:15", type: "Grades", format: "PDF", size: "5.8 MB", status: "Completed", records: 12500, user: "Dr. Sarah Chen" },
  { id: "EXP-003", date: "Jan 28, 2026 09:45", type: "Attendance", format: "CSV", size: "12.3 MB", status: "Completed", records: 185000, user: "James Wilson" },
  { id: "EXP-004", date: "Jan 27, 2026 16:20", type: "Fees", format: "Excel", size: "1.9 MB", status: "Completed", records: 8920, user: "Dr. Sarah Chen" },
  { id: "EXP-005", date: "Jan 27, 2026 10:00", type: "Courses", format: "JSON", size: "340 KB", status: "Failed", records: 0, user: "James Wilson" },
  { id: "EXP-006", date: "Jan 27, 2026 08:30", type: "Reports", format: "PDF", size: "3.2 MB", status: "Processing", records: 0, user: "Dr. Sarah Chen" },
  { id: "EXP-007", date: "Jan 26, 2026 15:10", type: "Students", format: "CSV", size: "1.8 MB", status: "Completed", records: 4820, user: "Dr. Sarah Chen" },
];

const scheduledExports: ScheduledExport[] = [
  { id: "SCH-001", name: "Weekly Attendance Report", type: "Attendance", format: "PDF", frequency: "Every Monday", nextRun: "Feb 2, 2026", active: true },
  { id: "SCH-002", name: "Monthly Grades Export", type: "Grades", format: "Excel", frequency: "1st of month", nextRun: "Feb 1, 2026", active: true },
  { id: "SCH-003", name: "Daily Fee Summary", type: "Fees", format: "CSV", frequency: "Daily at 6 PM", nextRun: "Jan 29, 2026", active: true },
  { id: "SCH-004", name: "Semester Student Roster", type: "Students", format: "Excel", frequency: "Semester start", nextRun: "Aug 15, 2026", active: false },
  { id: "SCH-005", name: "Course Catalog Sync", type: "Courses", format: "JSON", frequency: "Every Sunday", nextRun: "Feb 1, 2026", active: true },
];

const recentActivity: ActivityItem[] = [
  { id: "ACT-001", action: "Exported Students (Excel)", type: "Export", time: "2 hours ago", user: "Dr. Sarah Chen", status: "success" },
  { id: "ACT-002", action: "Imported Course Updates (CSV)", type: "Import", time: "3 hours ago", user: "James Wilson", status: "success" },
  { id: "ACT-003", action: "Exported Grades (PDF)", type: "Export", time: "5 hours ago", user: "Dr. Sarah Chen", status: "success" },
  { id: "ACT-004", action: "Scheduled export failed: Courses", type: "Error", time: "1 day ago", user: "System", status: "error" },
  { id: "ACT-005", action: "New schedule: Daily Fee Summary", type: "Schedule", time: "1 day ago", user: "Dr. Sarah Chen", status: "info" },
  { id: "ACT-006", action: "Exported Attendance (CSV)", type: "Export", time: "1 day ago", user: "James Wilson", status: "success" },
  { id: "ACT-007", action: "Imported Student Batch (Excel)", type: "Import", time: "2 days ago", user: "Dr. Sarah Chen", status: "success" },
  { id: "ACT-008", action: "Cleaned up old exports (23 files)", type: "System", time: "2 days ago", user: "System", status: "info" },
];

const quickExports = [
  { label: "Full Student Roster", icon: Users, type: "students", format: "Excel" },
  { label: "Current Semester Grades", icon: Award, type: "grades", format: "PDF" },
  { label: "Monthly Attendance", icon: ClipboardCheck, type: "attendance", format: "CSV" },
  { label: "Fee Collection Summary", icon: CreditCard, type: "fees", format: "Excel" },
  { label: "Course Catalog", icon: BookOpen, type: "courses", format: "JSON" },
  { label: "Annual Report", icon: BarChart3, type: "reports", format: "PDF" },
];

function getFormatIcon(format: string) {
  switch (format) {
    case "CSV": return <FileText className="w-4 h-4" />;
    case "Excel": return <FileSpreadsheet className="w-4 h-4" />;
    case "PDF": return <FileType className="w-4 h-4" />;
    case "JSON": return <FileJson className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Completed":
      return <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700 text-xs gap-1"><CheckCircle2 className="w-3 h-3" /> Done</Badge>;
    case "Processing":
      return <Badge variant="outline" className="text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700 text-xs gap-1"><Clock className="w-3 h-3 animate-pulse" /> Processing</Badge>;
    case "Failed":
      return <Badge variant="outline" className="text-red-600 border-red-300 dark:text-red-400 dark:border-red-700 text-xs gap-1"><XCircle className="w-3 h-3" /> Failed</Badge>;
    default:
      return null;
  }
}

function getActivityIcon(status: string) {
  switch (status) {
    case "success":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    case "error":
      return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
    case "info":
      return <Zap className="w-4 h-4 text-amber-500 shrink-0" />;
    default:
      return null;
  }
}

export function DataExportPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [activeSchedules, setActiveSchedules] = useState<Record<string, boolean>>(
    Object.fromEntries(scheduledExports.map((s) => [s.id, s.active]))
  );

  const simulateImport = () => {
    setImporting(true);
    setImportProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setImporting(false);
          setImportProgress(0);
        }, 1000);
      }
      setImportProgress(Math.min(Math.round(progress), 100));
    }, 300);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateImport();
  }, []);

  const toggleSchedule = (id: string) => {
    setActiveSchedules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Export Center</h1>
            <p className="text-muted-foreground">Export, import, and schedule bulk data operations</p>
          </div>
        </div>
      </div>

      {/* Quick Export Buttons */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Quick Exports
          </CardTitle>
          <CardDescription>One-click export for common reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickExports.map((exp) => {
              const Icon = exp.icon;
              return (
                <Button
                  key={exp.label}
                  variant="outline"
                  className="h-auto py-3 px-3 flex flex-col items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">{exp.label}</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5">{exp.format}</Badge>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Export Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Export Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exportTypes.map((expType) => {
            const Icon = expType.icon;
            return (
              <Card key={expType.id} className="card-hover group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${expType.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{expType.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{expType.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Format Options */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Format</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {expType.formats.map((fmt) => (
                          <Badge key={fmt} variant="outline" className="text-[10px] cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                            {getFormatIcon(fmt)} {fmt}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Date Range + Count */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>All Time</span>
                      </div>
                      <span className="font-medium text-foreground">{expType.count.toLocaleString()} records</span>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">Last: {expType.lastExport}</span>
                      <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Download className="w-3 h-3 mr-1" /> Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Export History + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Export History Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Export History</CardTitle>
                <CardDescription>Recent exports and their status</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-1" /> Clear Old
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs whitespace-nowrap">{item.date}</TableCell>
                      <TableCell className="text-sm font-medium">{item.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          {getFormatIcon(item.format)} {item.format}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{item.records > 0 ? item.records.toLocaleString() : "—"}</TableCell>
                      <TableCell className="text-xs">{item.size}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        {item.status === "Completed" && (
                          <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-400 h-7 text-xs">
                            <Download className="w-3 h-3 mr-1" /> Download
                          </Button>
                        )}
                        {item.status === "Failed" && (
                          <Button variant="ghost" size="sm" className="text-amber-600 dark:text-amber-400 h-7 text-xs">
                            <RotateCcw className="w-3 h-3 mr-1" /> Retry
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest data operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  {getActivityIcon(item.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-tight">{item.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">{item.user}</span>
                      <span className="text-[10px] text-muted-foreground/50">•</span>
                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Import Data
          </CardTitle>
          <CardDescription>Upload CSV, Excel, or JSON files to import data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-muted-foreground/25 hover:border-emerald-400 hover:bg-muted/30"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !importing && simulateImport()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isDragging ? "bg-emerald-200 dark:bg-emerald-800" : "bg-emerald-100 dark:bg-emerald-900/50"
                  }`}>
                    <Upload className={`w-6 h-6 transition-colors ${isDragging ? "text-emerald-600" : "text-emerald-500 dark:text-emerald-400"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {isDragging ? "Drop your file here" : "Drag & drop files here"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      or <span className="text-emerald-600 dark:text-emerald-400 underline">browse</span> to upload
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {["CSV", "Excel", "JSON"].map((fmt) => (
                      <Badge key={fmt} variant="secondary" className="text-[10px]">{fmt}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Import Progress */}
              {importing && (
                <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Importing data...</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {importProgress < 30 ? "Reading file..." :
                     importProgress < 60 ? "Validating data..." :
                     importProgress < 90 ? "Importing records..." :
                     "Finalizing..."}
                  </p>
                </div>
              )}
            </div>

            {/* Import Info */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Supported File Types</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: "CSV", desc: "Comma-separated values", icon: FileText },
                    { type: "Excel", desc: ".xlsx, .xls workbooks", icon: FileSpreadsheet },
                    { type: "JSON", desc: "Structured data format", icon: FileJson },
                  ].map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.type} className="flex items-center gap-2 p-2.5 rounded-lg border bg-muted/20">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium">{f.type}</p>
                          <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Import Guidelines</h4>
                <ul className="space-y-1.5">
                  {[
                    "Maximum file size: 50 MB",
                    "First row should contain column headers",
                    "Date format: YYYY-MM-DD",
                    "Required fields must not be empty",
                    "Duplicate records will be skipped",
                  ].map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-emerald-500" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <FolderArchive className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Exports */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Scheduled Exports
              </CardTitle>
              <CardDescription>Automated recurring export configurations</CardDescription>
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Play className="w-4 h-4 mr-1" /> New Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledExports.map((schedule) => (
              <div key={schedule.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{schedule.name}</p>
                    <Badge variant="secondary" className="text-[10px]">{schedule.type}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> {schedule.frequency}
                    </span>
                    <span>•</span>
                    <span>{schedule.format}</span>
                    <span>•</span>
                    <span>Next: {schedule.nextRun}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`schedule-${schedule.id}`} className="sr-only">
                    Toggle {schedule.name}
                  </Label>
                  <Switch
                    id={`schedule-${schedule.id}`}
                    checked={activeSchedules[schedule.id]}
                    onCheckedChange={() => toggleSchedule(schedule.id)}
                  />
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    {activeSchedules[schedule.id] ? (
                      <><Pause className="w-3 h-3 mr-1" /> Pause</>
                    ) : (
                      <><Play className="w-3 h-3 mr-1" /> Resume</>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
