"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/app-store";
import {
  ScrollText, Search, Download, Filter, Shield, User, Settings,
  LogIn, LogOut, Edit, Trash2, FileText, CreditCard, Activity,
  AlertTriangle, CheckCircle2, Clock, ChevronDown, ChevronUp,
  Eye, RefreshCw, Monitor, Globe, Fingerprint,
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// -------------------- Types --------------------

type ActionType = "Login" | "Data Change" | "User Management" | "System Config" | "Export" | "Payment";
type Severity = "Critical" | "Warning" | "Info";
type Status = "Success" | "Warning" | "Failed";

interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  action: ActionType;
  description: string;
  targetResource: string;
  ipAddress: string;
  severity: Severity;
  status: Status;
  details?: {
    before?: Record<string, string>;
    after?: Record<string, string>;
    metadata?: Record<string, string>;
  };
}

// -------------------- Mock Data --------------------

const MOCK_EVENTS: AuditEvent[] = [
  { id: "ae-1", timestamp: "2025-03-12 14:32:05", userId: "u-super-001", userName: "Alex Morgan", userAvatar: "AM", userRole: "SuperAdmin", action: "Login", description: "Successful login from Chrome on macOS", targetResource: "User Session", ipAddress: "192.168.1.100", severity: "Info", status: "Success", details: { metadata: { browser: "Chrome 122", os: "macOS 14.3", device: "Desktop", location: "New York, US" } } },
  { id: "ae-2", timestamp: "2025-03-12 14:28:12", userId: "u-inst-001", userName: "Dr. Sarah Chen", userAvatar: "SC", userRole: "InstituteAdmin", action: "Data Change", description: "Updated fee structure for Semester 2 courses", targetResource: "Fee Configuration", ipAddress: "192.168.1.55", severity: "Warning", status: "Success", details: { before: { "lab_fee": "$500", "tuition_base": "$8,000" }, after: { "lab_fee": "$600", "tuition_base": "$8,500" }, metadata: { "reason": "Annual increase per board decision", "affected_records": "234" } } },
  { id: "ae-3", timestamp: "2025-03-12 14:15:44", userId: "u-super-001", userName: "Alex Morgan", userAvatar: "AM", userRole: "SuperAdmin", action: "User Management", description: "Created new teacher account for Prof. David Kim", targetResource: "User: prof-david-kim", ipAddress: "192.168.1.100", severity: "Info", status: "Success", details: { after: { "name": "Prof. David Kim", "email": "david.kim@campus.edu", "role": "Teacher", "branch": "Main Campus" }, metadata: { "created_by": "SuperAdmin", "method": "Manual Creation" } } },
  { id: "ae-4", timestamp: "2025-03-12 13:58:20", userId: "u-branch-001", userName: "James Wilson", userAvatar: "JW", userRole: "BranchAdmin", action: "System Config", description: "Modified attendance policy threshold from 75% to 70%", targetResource: "System Settings: Attendance", ipAddress: "192.168.2.22", severity: "Warning", status: "Success", details: { before: { "min_attendance_pct": "75%", "late_threshold_min": "10" }, after: { "min_attendance_pct": "70%", "late_threshold_min": "15" }, metadata: { "reason": "Adjusted for new semester policy" } } },
  { id: "ae-5", timestamp: "2025-03-12 13:45:03", userId: "u-student-008", userName: "Marcus Brown", userAvatar: "MB", userRole: "Student", action: "Login", description: "Failed login attempt — invalid password", targetResource: "User Session", ipAddress: "10.0.0.88", severity: "Critical", status: "Failed", details: { metadata: { "attempt_number": "3", "lockout_status": "Account locked for 15 min", "browser": "Firefox 123" } } },
  { id: "ae-6", timestamp: "2025-03-12 13:30:15", userId: "u-inst-001", userName: "Dr. Sarah Chen", userAvatar: "SC", userRole: "InstituteAdmin", action: "Export", description: "Exported student enrollment report for Q1 2025", targetResource: "Report: Enrollment Q1-2025", ipAddress: "192.168.1.55", severity: "Info", status: "Success", details: { metadata: { "format": "Excel (.xlsx)", "records_count": "1,247", "file_size": "2.4 MB", "duration_ms": "3,200" } } },
  { id: "ae-7", timestamp: "2025-03-12 13:12:08", userId: "u-teacher-002", userName: "Prof. James Walker", userAvatar: "JW", userRole: "Teacher", action: "Data Change", description: "Published grades for CS201 Midterm Exam", targetResource: "Assessment: CS201-Midterm", ipAddress: "192.168.3.10", severity: "Info", status: "Success", details: { after: { "status": "Published", "total_students": "68", "class_avg": "72.3%", "highest": "98%", "lowest": "34%" }, metadata: { "publish_method": "Bulk publish", "notification_sent": "Yes" } } },
  { id: "ae-8", timestamp: "2025-03-12 12:55:30", userId: "u-super-001", userName: "Alex Morgan", userAvatar: "AM", userRole: "SuperAdmin", action: "System Config", description: "Updated SMTP email configuration for outgoing notifications", targetResource: "System Settings: Email", ipAddress: "192.168.1.100", severity: "Critical", status: "Success", details: { before: { "smtp_host": "smtp.old-provider.com", "smtp_port": "587" }, after: { "smtp_host": "smtp.campus-relay.edu", "smtp_port": "465", "encryption": "SSL" }, metadata: { "test_email_sent": "Success", "test_recipient": "admin@campus.edu" } } },
  { id: "ae-9", timestamp: "2025-03-12 12:40:17", userId: "u-parent-003", userName: "Michael Lee", userAvatar: "ML", userRole: "Parent", action: "Payment", description: "Paid tuition fee for Semester 2 — $8,500 via credit card", targetResource: "Invoice: INV-2025-0342", ipAddress: "172.16.0.45", severity: "Info", status: "Success", details: { metadata: { "amount": "$8,500.00", "method": "Visa ending 4532", "transaction_id": "TXN-8823411", "gateway": "Stripe", "student": "Ethan Lee (u-student-012)" } } },
  { id: "ae-10", timestamp: "2025-03-12 12:25:50", userId: "u-branch-001", userName: "James Wilson", userAvatar: "JW", userRole: "BranchAdmin", action: "User Management", description: "Deactivated student account for academic misconduct review", targetResource: "User: u-student-045", ipAddress: "192.168.2.22", severity: "Critical", status: "Success", details: { before: { "status": "Active", "enrollment": "Full-time" }, after: { "status": "Suspended", "enrollment": "Under Review" }, metadata: { "reason": "Academic integrity violation", "reported_by": "Prof. Rodriguez", "review_date": "2025-03-20" } } },
  { id: "ae-11", timestamp: "2025-03-12 11:58:33", userId: "u-super-001", userName: "Alex Morgan", userAvatar: "AM", userRole: "SuperAdmin", action: "Data Change", description: "Restored deleted course CSE-401 from backup", targetResource: "Course: CSE-401", ipAddress: "192.168.1.100", severity: "Warning", status: "Success", details: { before: { "status": "Deleted", "deleted_at": "2025-03-11 16:00" }, after: { "status": "Active", "restored_from": "Backup 2025-03-11" }, metadata: { "restored_records": "enrollments: 42, grades: 168, assignments: 12" } } },
  { id: "ae-12", timestamp: "2025-03-12 11:42:10", userId: "u-teacher-001", userName: "Prof. Emily Rodriguez", userAvatar: "ER", userRole: "Teacher", action: "Data Change", description: "Modified attendance record for CS301 class on March 10", targetResource: "Attendance: CS301-2025-03-10", ipAddress: "192.168.3.8", severity: "Warning", status: "Success", details: { before: { "student_rpatel_status": "Absent" }, after: { "student_rpatel_status": "Present", "audit_reason": "Late arrival recorded by system, teacher override" }, metadata: { "students_affected": "1", "override_approved": "Yes" } } },
  { id: "ae-13", timestamp: "2025-03-12 11:20:05", userId: "u-inst-001", userName: "Dr. Sarah Chen", userAvatar: "SC", userRole: "InstituteAdmin", action: "Export", description: "Generated financial summary report for all branches", targetResource: "Report: Financial Summary Q1", ipAddress: "192.168.1.55", severity: "Info", status: "Success", details: { metadata: { "format": "PDF", "pages": "24", "includes": "Revenue, Expenses, Outstanding" } } },
  { id: "ae-14", timestamp: "2025-03-12 11:05:22", userId: "u-student-015", userName: "Aisha Khan", userAvatar: "AK", userRole: "Student", action: "Login", description: "Successful login from mobile app (iOS)", targetResource: "User Session", ipAddress: "10.10.5.30", severity: "Info", status: "Success", details: { metadata: { "device": "iPhone 15 Pro", "app_version": "3.2.1", "os": "iOS 17.3" } } },
  { id: "ae-15", timestamp: "2025-03-12 10:48:15", userId: "u-super-001", userName: "Alex Morgan", userAvatar: "AM", userRole: "SuperAdmin", action: "System Config", description: "Enabled two-factor authentication requirement for admin accounts", targetResource: "System Settings: Security", ipAddress: "192.168.1.100", severity: "Critical", status: "Success", details: { before: { "2fa_required": "No", "2fa_roles": "None" }, after: { "2fa_required": "Yes", "2fa_roles": "SuperAdmin, InstituteAdmin, BranchAdmin" }, metadata: { "effective_date": "2025-03-12", "affected_users": "18" } } },
  { id: "ae-16", timestamp: "2025-03-12 10:30:00", userId: "system", userName: "System", userAvatar: "SY", userRole: "System", action: "System Config", description: "Automated backup completed successfully", targetResource: "System Backup", ipAddress: "127.0.0.1", severity: "Info", status: "Success", details: { metadata: { "backup_size": "4.2 GB", "duration": "12 min 30 sec", "storage": "S3 backup-bucket-01", "next_backup": "2025-03-13 02:00 UTC" } } },
];

const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; border: string; dot: string }> = {
  Critical: { color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20", border: "border-l-red-500", dot: "bg-red-500" },
  Warning: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-l-amber-500", dot: "bg-amber-500" },
  Info: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-l-emerald-500", dot: "bg-emerald-500" },
};

const STATUS_CONFIG: Record<Status, { color: string; icon: React.ElementType }> = {
  Success: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
  Warning: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: AlertTriangle },
  Failed: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: AlertTriangle },
};

const ACTION_ICONS: Record<ActionType, { icon: React.ElementType; color: string }> = {
  "Login": { icon: LogIn, color: "text-emerald-600 dark:text-emerald-400" },
  "Data Change": { icon: Edit, color: "text-amber-600 dark:text-amber-400" },
  "User Management": { icon: User, color: "text-teal-600 dark:text-teal-400" },
  "System Config": { icon: Settings, color: "text-purple-600 dark:text-purple-400" },
  "Export": { icon: Download, color: "text-sky-600 dark:text-sky-400" },
  "Payment": { icon: CreditCard, color: "text-emerald-600 dark:text-emerald-400" },
};

// Activity trend data (last 14 days)
const TREND_DATA = [
  { day: "Feb 27", events: 42 }, { day: "Feb 28", events: 38 }, { day: "Mar 01", events: 55 },
  { day: "Mar 02", events: 12 }, { day: "Mar 03", events: 67 }, { day: "Mar 04", events: 73 },
  { day: "Mar 05", events: 58 }, { day: "Mar 06", events: 61 }, { day: "Mar 07", events: 45 },
  { day: "Mar 08", events: 8 }, { day: "Mar 09", events: 15 }, { day: "Mar 10", events: 72 },
  { day: "Mar 11", events: 80 }, { day: "Mar 12", events: 65 },
];

// Top action types data
const ACTION_TYPE_DATA = [
  { name: "Login", count: 284, fill: "#059669" },
  { name: "Data Change", count: 156, fill: "#0d9488" },
  { name: "User Mgmt", count: 89, fill: "#14b8a6" },
  { name: "Export", count: 67, fill: "#2dd4bf" },
  { name: "System Config", count: 45, fill: "#5eead4" },
  { name: "Payment", count: 123, fill: "#10b981" },
];

const ITEMS_PER_PAGE = 8;

// -------------------- Component --------------------

export function AuditLogPage() {
  const currentUser = useAppStore((s) => s.currentUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      if (searchQuery && !e.description.toLowerCase().includes(searchQuery.toLowerCase()) && !e.userName.toLowerCase().includes(searchQuery.toLowerCase()) && !e.targetResource.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterAction !== "all" && e.action !== filterAction) return false;
      if (filterSeverity !== "all" && e.severity !== filterSeverity) return false;
      if (filterUser !== "all" && e.userId !== filterUser) return false;
      return true;
    });
  }, [searchQuery, filterAction, filterSeverity, filterUser]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const uniqueUsers = useMemo(() => {
    const users = [...new Map(MOCK_EVENTS.map((e) => [e.userId, { userId: e.userId, userName: e.userName }])).values()];
    return users;
  }, []);

  const criticalCount = MOCK_EVENTS.filter((e) => e.severity === "Critical").length;
  const failedCount = MOCK_EVENTS.filter((e) => e.status === "Failed").length;
  const activeUsersCount = uniqueUsers.length;

  const formatDate = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <ScrollText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Audit Log
            </h1>
            <p className="text-muted-foreground text-sm">Monitor all system activities and security events</p>
          </div>
          {/* Live Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Live</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          <Download className="w-3.5 h-3.5 mr-1.5" />Export Audit Log
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Events Today", value: MOCK_EVENTS.length, icon: Activity, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Critical Events", value: criticalCount, icon: AlertTriangle, color: "text-red-600 dark:text-red-400" },
          { label: "Active Users", value: activeUsersCount, icon: Users, color: "text-teal-600 dark:text-teal-400" },
          { label: "Last Sync", value: "Just now", icon: RefreshCw, color: "text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label} className="stat-card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-lg font-bold mt-0.5">{s.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-4.5 h-4.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="chart-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Activity Trend (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.55 0.17 155/0.08)" />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={45} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.55 0.17 155/0.15)", fontSize: 12 }} />
                  <Line type="monotone" dataKey="events" stroke="#059669" strokeWidth={2} dot={{ fill: "#059669", r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="chart-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top Action Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ACTION_TYPE_DATA} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.55 0.17 155/0.08)" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={55} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.55 0.17 155/0.15)", fontSize: 12 }} />
                  <Bar dataKey="count" name="Events" radius={[0, 4, 4, 0]} barSize={14}>
                    {ACTION_TYPE_DATA.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="tabs-smooth">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by action, user, or resource..." className="pl-9" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterAction} onValueChange={(v) => { setFilterAction(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[145px] h-9 text-xs"><SelectValue placeholder="Action Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="Login">Login</SelectItem>
                  <SelectItem value="Data Change">Data Change</SelectItem>
                  <SelectItem value="User Management">User Mgmt</SelectItem>
                  <SelectItem value="System Config">System Config</SelectItem>
                  <SelectItem value="Export">Export</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSeverity} onValueChange={(v) => { setFilterSeverity(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[125px] h-9 text-xs"><SelectValue placeholder="Severity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterUser} onValueChange={(v) => { setFilterUser(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="User" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((u) => <SelectItem key={u.userId} value={u.userId}>{u.userName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event Timeline */}
          <ScrollArea className="max-h-[600px]">
            <div className="relative pl-6 sm:pl-8">
              {/* Timeline line */}
              <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-[2px] bg-gradient-to-b from-emerald-500/40 via-amber-500/30 to-emerald-500/10" />

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {paginatedEvents.map((event) => {
                    const sev = SEVERITY_CONFIG[event.severity];
                    const stat = STATUS_CONFIG[event.status];
                    const act = ACTION_ICONS[event.action];
                    const isExpanded = expandedId === event.id;
                    const ActionIcon = act.icon;
                    const StatusIcon = stat.icon;

                    return (
                      <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        {/* Timeline dot */}
                        <div className={`absolute -left-[22px] sm:-left-6 top-5 w-3 h-3 rounded-full ${sev.dot} ring-2 ring-background z-10`} />

                        <Card className={`border-l-[3px] ${sev.border} overflow-hidden transition-all ${isExpanded ? "ring-1 ring-emerald-300 dark:ring-emerald-800" : ""}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              {/* Action Icon */}
                              <div className={`w-9 h-9 rounded-lg ${sev.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                <ActionIcon className={`w-4 h-4 ${act.color}`} />
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* Header row */}
                                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                  <Badge className={`text-[10px] px-1.5 py-0 ${sev.color} bg-transparent border-0 font-semibold`}>
                                    {event.severity.toUpperCase()}
                                  </Badge>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{event.action}</Badge>
                                  <Badge className={`text-[10px] px-1.5 py-0 ${stat.color}`}>
                                    <StatusIcon className="w-3 h-3 mr-0.5" />
                                    {event.status}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{formatTime(event.timestamp)}
                                  </span>
                                </div>

                                {/* User info */}
                                <div className="flex items-center gap-2 mb-1.5">
                                  <Avatar className="w-5 h-5">
                                    <AvatarFallback className="text-[8px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                      {event.userAvatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs font-medium">{event.userName}</span>
                                  <Badge variant="secondary" className="text-[9px] px-1 py-0">{event.userRole}</Badge>
                                </div>

                                {/* Description */}
                                <p className="text-sm leading-relaxed">{event.description}</p>

                                {/* Meta row */}
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />{event.targetResource}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />{event.ipAddress}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Monitor className="w-3 h-3" />{formatDate(event.timestamp)}
                                  </span>
                                </div>

                                {/* Expanded Detail */}
                                <AnimatePresence>
                                  {isExpanded && event.details && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.25 }}
                                      className="overflow-hidden"
                                    >
                                      <Separator className="my-3" />
                                      <div className="space-y-3">
                                        {/* Before/After state */}
                                        {event.details.before && event.details.after && (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Before</p>
                                              <div className="bg-red-50 dark:bg-red-950/10 rounded-md p-2.5 space-y-1 border border-red-100 dark:border-red-900/30">
                                                {Object.entries(event.details.before).map(([key, val]) => (
                                                  <div key={key} className="text-[11px]">
                                                    <span className="text-muted-foreground">{key}:</span>{" "}
                                                    <span className="font-mono font-medium">{val}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                            <div className="space-y-1.5">
                                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">After</p>
                                              <div className="bg-emerald-50 dark:bg-emerald-950/10 rounded-md p-2.5 space-y-1 border border-emerald-100 dark:border-emerald-900/30">
                                                {Object.entries(event.details.after).map(([key, val]) => (
                                                  <div key={key} className="text-[11px]">
                                                    <span className="text-muted-foreground">{key}:</span>{" "}
                                                    <span className="font-mono font-medium">{val}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {/* Metadata JSON */}
                                        {event.details.metadata && (
                                          <div className="space-y-1.5">
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                              <Fingerprint className="w-3 h-3" />Metadata
                                            </p>
                                            <div className="bg-muted rounded-md p-2.5 border">
                                              <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap">
                                                {JSON.stringify(event.details.metadata, null, 2)}
                                              </pre>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Expand/Collapse */}
                                {event.details && (
                                  <button
                                    onClick={() => setExpandedId(isExpanded ? null : event.id)}
                                    className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline mt-2"
                                  >
                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    {isExpanded ? "Show Less" : "View Details"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {paginatedEvents.length === 0 && (
                  <div className="relative pl-8 py-8 text-center">
                    <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium">No events found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search query</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)} of {filteredEvents.length} events
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={`h-7 w-7 text-xs p-0 ${currentPage === page ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(["Critical", "Warning", "Info"] as Severity[]).map((sev) => {
              const count = MOCK_EVENTS.filter((e) => e.severity === sev).length;
              const cfg = SEVERITY_CONFIG[sev];
              return (
                <Card key={sev} className="stat-card-gradient">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                      <div>
                        <p className="text-sm font-semibold">{count}</p>
                        <p className={`text-xs ${cfg.color}`}>{sev} Events</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(["Success", "Warning", "Failed"] as Status[]).map((status) => {
              const count = MOCK_EVENTS.filter((e) => e.status === status).length;
              const cfg = STATUS_CONFIG[status];
              const StatusIcon = cfg.icon;
              return (
                <Card key={status} className="p-3 text-center">
                  <StatusIcon className={`w-5 h-5 mx-auto mb-1 ${cfg.color.split(" ")[0]}`} />
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{status}</p>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Activity by User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {uniqueUsers
                  .map((u) => ({
                    ...u,
                    count: MOCK_EVENTS.filter((e) => e.userId === u.userId).length,
                    latest: MOCK_EVENTS.filter((e) => e.userId === u.userId).sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0],
                  }))
                  .sort((a, b) => b.count - a.count)
                  .map((u) => (
                    <div key={u.userId} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          {u.latest.userAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{u.userName}</p>
                        <p className="text-[10px] text-muted-foreground">{u.latest.userRole}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{u.count}</p>
                        <p className="text-[10px] text-muted-foreground">events</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">IP Address Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...new Map(MOCK_EVENTS.map((e) => [e.ipAddress, MOCK_EVENTS.filter((ev) => ev.ipAddress === e.ipAddress).length])).values()]
                  .sort((a, b) => b - a)
                  .slice(0, 6)
                  .map((count, idx) => {
                    const ip = [...new Map(MOCK_EVENTS.map((e) => [e.ipAddress, e.ipAddress]))].map(([, v]) => v).sort((a, b) => {
                      const ca = MOCK_EVENTS.filter((e) => e.ipAddress === a).length;
                      const cb = MOCK_EVENTS.filter((e) => e.ipAddress === b).length;
                      return cb - ca;
                    })[idx];
                    return (
                      <div key={ip} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs font-mono flex-1">{ip}</span>
                        <Badge variant="outline" className="text-[10px]">{count} events</Badge>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


