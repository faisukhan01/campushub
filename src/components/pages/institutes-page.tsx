"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Users,
  GraduationCap,
  Phone,
  Mail,
  Globe,
  Plus,
  Pencil,
  Eye,
  Download,
  Search,
  School,
  BookOpen,
  TrendingUp,
  Activity,
  ArrowUpRight,
  CalendarDays,
  DollarSign,
  UserCog,
  Briefcase,
} from "lucide-react";

// ===================== Types =====================

type PlanType = "Starter" | "Professional" | "Enterprise";
type StatusType = "Active" | "Trial" | "Expired";

interface InstituteRecord {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  plan: PlanType;
  status: StatusType;
  branches: number;
  students: number;
  teachers: number;
  courses: number;
  monthlyRevenue: number;
  maxUsers: number;
  usersUsed: number;
  joinedDate: string;
  logo?: string;
  recentActivity: {
    id: string;
    action: string;
    timestamp: string;
    user: string;
  }[];
}

// ===================== Mock Data =====================

const mockInstitutes: InstituteRecord[] = [
  {
    id: "inst-001",
    name: "Greenfield Education Group",
    code: "GEG",
    email: "admin@greenfield.edu",
    phone: "+1-555-0100",
    website: "https://greenfield.edu",
    address: "123 Education Avenue",
    city: "Springfield",
    state: "Illinois",
    plan: "Professional",
    status: "Active",
    branches: 5,
    students: 1240,
    teachers: 156,
    courses: 89,
    monthlyRevenue: 249,
    maxUsers: 5000,
    usersUsed: 1396,
    joinedDate: "2022-03-15",
    recentActivity: [
      { id: "a1", action: "New branch added — West Campus", timestamp: "2 hours ago", user: "Sarah Chen" },
      { id: "a2", action: "247 students enrolled this month", timestamp: "1 day ago", user: "System" },
      { id: "a3", action: "Plan upgraded to Professional", timestamp: "5 days ago", user: "Alex Morgan" },
      { id: "a4", action: "Fee collection report generated", timestamp: "1 week ago", user: "James Wilson" },
      { id: "a5", action: "12 new teachers onboarded", timestamp: "2 weeks ago", user: "Sarah Chen" },
    ],
  },
  {
    id: "inst-002",
    name: "BrightPath Academy",
    code: "BPA",
    email: "info@brightpath.edu",
    phone: "+1-555-0200",
    website: "https://brightpath.edu",
    address: "456 Knowledge Park",
    city: "Austin",
    state: "Texas",
    plan: "Professional",
    status: "Active",
    branches: 3,
    students: 680,
    teachers: 92,
    courses: 54,
    monthlyRevenue: 249,
    maxUsers: 5000,
    usersUsed: 772,
    joinedDate: "2022-08-22",
    recentActivity: [
      { id: "a1", action: "Semester exams scheduled", timestamp: "3 hours ago", user: "Lisa Park" },
      { id: "a2", action: "New course added — Data Science 101", timestamp: "2 days ago", user: "Mark Thompson" },
      { id: "a3", action: "Attendance report for March published", timestamp: "4 days ago", user: "System" },
      { id: "a4", action: "8 new teacher applications received", timestamp: "1 week ago", user: "Lisa Park" },
      { id: "a5", action: "Parent-teacher meeting scheduled", timestamp: "2 weeks ago", user: "Mark Thompson" },
    ],
  },
  {
    id: "inst-003",
    name: "Westfield International",
    code: "WFI",
    email: "contact@westfield.edu",
    phone: "+1-555-0300",
    website: "https://westfield.edu",
    address: "789 Harbor Blvd",
    city: "Seattle",
    state: "Washington",
    plan: "Enterprise",
    status: "Active",
    branches: 8,
    students: 2100,
    teachers: 310,
    courses: 142,
    monthlyRevenue: 499,
    maxUsers: 15000,
    usersUsed: 2410,
    joinedDate: "2021-01-10",
    recentActivity: [
      { id: "a1", action: "Annual audit report generated", timestamp: "1 hour ago", user: "David Kim" },
      { id: "a2", action: "Custom API integration completed", timestamp: "6 hours ago", user: "Tech Team" },
      { id: "a3", action: "500+ students imported via CSV", timestamp: "1 day ago", user: "David Kim" },
      { id: "a4", action: "Multi-language support enabled", timestamp: "3 days ago", user: "Tech Team" },
      { id: "a5", action: "New branch opened — Downtown Campus", timestamp: "1 week ago", user: "David Kim" },
    ],
  },
  {
    id: "inst-004",
    name: "Sunrise Learning Center",
    code: "SLC",
    email: "hello@sunrise.edu",
    phone: "+1-555-0400",
    website: "https://sunrise.edu",
    address: "321 Learning Lane",
    city: "Portland",
    state: "Oregon",
    plan: "Starter",
    status: "Active",
    branches: 1,
    students: 120,
    teachers: 18,
    courses: 12,
    monthlyRevenue: 99,
    maxUsers: 1000,
    usersUsed: 138,
    joinedDate: "2023-06-01",
    recentActivity: [
      { id: "a1", action: "Welcome email sent to 15 parents", timestamp: "5 hours ago", user: "System" },
      { id: "a2", action: "Fee reminder for April sent", timestamp: "1 day ago", user: "System" },
      { id: "a3", action: "New batch created — Grade 5", timestamp: "3 days ago", user: "Anna Lee" },
      { id: "a4", action: "Report cards published for Q3", timestamp: "1 week ago", user: "Anna Lee" },
      { id: "a5", action: "4 new student enrollments", timestamp: "2 weeks ago", user: "System" },
    ],
  },
  {
    id: "inst-005",
    name: "TechVista Institute",
    code: "TVI",
    email: "admin@techvista.edu",
    phone: "+1-555-0500",
    website: "https://techvista.edu",
    address: "555 Innovation Drive",
    city: "San Jose",
    state: "California",
    plan: "Professional",
    status: "Trial",
    branches: 2,
    students: 340,
    teachers: 45,
    courses: 28,
    monthlyRevenue: 0,
    maxUsers: 5000,
    usersUsed: 385,
    joinedDate: "2024-11-15",
    recentActivity: [
      { id: "a1", action: "Trial period started — 14 days remaining", timestamp: "1 day ago", user: "System" },
      { id: "a2", action: "Demo session completed with admin team", timestamp: "2 days ago", user: "Sales Team" },
      { id: "a3", action: "150 students migrated from legacy system", timestamp: "3 days ago", user: "Tech Team" },
      { id: "a4", action: "Custom branding configured", timestamp: "5 days ago", user: "Design Team" },
      { id: "a5", action: "Account created by Super Admin", timestamp: "1 week ago", user: "Alex Morgan" },
    ],
  },
  {
    id: "inst-006",
    name: "Pacific Coast University",
    code: "PCU",
    email: "info@pacificcoast.edu",
    phone: "+1-555-0600",
    website: "https://pacificcoast.edu",
    address: "100 Ocean View Road",
    city: "San Diego",
    state: "California",
    plan: "Enterprise",
    status: "Active",
    branches: 12,
    students: 4500,
    teachers: 620,
    courses: 210,
    monthlyRevenue: 499,
    maxUsers: 15000,
    usersUsed: 5120,
    joinedDate: "2020-05-20",
    recentActivity: [
      { id: "a1", action: "Advanced analytics dashboard activated", timestamp: "30 min ago", user: "Tech Team" },
      { id: "a2", action: "3 new departments created", timestamp: "4 hours ago", user: "Robert Zhang" },
      { id: "a3", action: "1,200+ attendance records synced", timestamp: "1 day ago", user: "System" },
      { id: "a4", action: "API rate limit increased to 10K/min", timestamp: "2 days ago", user: "Tech Team" },
      { id: "a5", action: "Quarterly revenue report exported", timestamp: "3 days ago", user: "Robert Zhang" },
    ],
  },
  {
    id: "inst-007",
    name: "Maple Leaf Academy",
    code: "MLA",
    email: "admin@mapleleaf.edu",
    phone: "+1-555-0700",
    website: "https://mapleleaf.edu",
    address: "222 Maple Street",
    city: "Denver",
    state: "Colorado",
    plan: "Professional",
    status: "Active",
    branches: 4,
    students: 890,
    teachers: 110,
    courses: 67,
    monthlyRevenue: 249,
    maxUsers: 5000,
    usersUsed: 1000,
    joinedDate: "2022-11-08",
    recentActivity: [
      { id: "a1", action: "New program launched — MBA Online", timestamp: "2 hours ago", user: "Emily Foster" },
      { id: "a2", action: "30 new student applications processed", timestamp: "1 day ago", user: "System" },
      { id: "a3", action: "Library module activated", timestamp: "3 days ago", user: "Emily Foster" },
      { id: "a4", action: "Webinar hosted — 85 attendees", timestamp: "5 days ago", user: "Marketing" },
      { id: "a5", action: "Staff performance review completed", timestamp: "1 week ago", user: "Emily Foster" },
    ],
  },
  {
    id: "inst-008",
    name: "Horizon School System",
    code: "HSS",
    email: "contact@horizon.edu",
    phone: "+1-555-0800",
    website: "https://horizon.edu",
    address: "888 Horizon Way",
    city: "Phoenix",
    state: "Arizona",
    plan: "Starter",
    status: "Trial",
    branches: 2,
    students: 200,
    teachers: 28,
    courses: 18,
    monthlyRevenue: 0,
    maxUsers: 1000,
    usersUsed: 228,
    joinedDate: "2025-01-05",
    recentActivity: [
      { id: "a1", action: "Trial period started — 21 days remaining", timestamp: "3 days ago", user: "System" },
      { id: "a2", action: "Initial data import completed", timestamp: "4 days ago", user: "Tech Team" },
      { id: "a3", action: "Onboarding call with admin completed", timestamp: "5 days ago", user: "Sales Team" },
      { id: "a4", action: "Custom domain configured", timestamp: "6 days ago", user: "Tech Team" },
      { id: "a5", action: "Account created by Super Admin", timestamp: "1 week ago", user: "Alex Morgan" },
    ],
  },
  {
    id: "inst-009",
    name: "Summit Collegiate",
    code: "SC",
    email: "info@summit.edu",
    phone: "+1-555-0900",
    website: "https://summit.edu",
    address: "440 Peak Avenue",
    city: "Salt Lake City",
    state: "Utah",
    plan: "Professional",
    status: "Expired",
    branches: 3,
    students: 520,
    teachers: 68,
    courses: 41,
    monthlyRevenue: 0,
    maxUsers: 5000,
    usersUsed: 588,
    joinedDate: "2023-02-14",
    recentActivity: [
      { id: "a1", action: "Subscription expired — 30 days ago", timestamp: "30 days ago", user: "System" },
      { id: "a2", action: "Renewal reminder sent to admin", timestamp: "25 days ago", user: "System" },
      { id: "a3", action: "Data export requested by admin", timestamp: "20 days ago", user: "John Davis" },
      { id: "a4", action: "Second renewal reminder sent", timestamp: "15 days ago", user: "System" },
      { id: "a5", action: "Read-only mode activated", timestamp: "30 days ago", user: "System" },
    ],
  },
  {
    id: "inst-010",
    name: "Heritage Academy of Arts",
    code: "HAA",
    email: "admin@heritagearts.edu",
    phone: "+1-555-1000",
    website: "https://heritagearts.edu",
    address: "67 Gallery Lane",
    city: "Nashville",
    state: "Tennessee",
    plan: "Starter",
    status: "Expired",
    branches: 1,
    students: 85,
    teachers: 12,
    courses: 9,
    monthlyRevenue: 0,
    maxUsers: 1000,
    usersUsed: 97,
    joinedDate: "2023-09-01",
    recentActivity: [
      { id: "a1", action: "Subscription expired — 15 days ago", timestamp: "15 days ago", user: "System" },
      { id: "a2", action: "Renewal discount offered — 20% off", timestamp: "10 days ago", user: "Sales Team" },
      { id: "a3", action: "Admin login attempt blocked", timestamp: "5 days ago", user: "System" },
      { id: "a4", action: "Last active user session recorded", timestamp: "20 days ago", user: "System" },
      { id: "a5", action: "Payment method update failed", timestamp: "25 days ago", user: "Billing" },
    ],
  },
];

// ===================== Helpers =====================

const planConfig: Record<PlanType, { className: string; dotColor: string }> = {
  Starter: { className: "bg-slate-100 text-slate-700 border-slate-200", dotColor: "bg-slate-400" },
  Professional: { className: "bg-emerald-50 text-emerald-700 border-emerald-200", dotColor: "bg-emerald-500" },
  Enterprise: { className: "bg-violet-50 text-violet-700 border-violet-200", dotColor: "bg-violet-500" },
};

const statusConfig: Record<StatusType, { dotColor: string; textClass: string }> = {
  Active: { dotColor: "bg-emerald-500", textClass: "text-emerald-700" },
  Trial: { dotColor: "bg-amber-500", textClass: "text-amber-700" },
  Expired: { dotColor: "bg-red-500", textClass: "text-red-600" },
};

const kpiCards = [
  {
    label: "Total Institutes",
    value: "12",
    icon: Building2,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    trend: "+2 this month",
    trendColor: "text-emerald-600",
  },
  {
    label: "Active",
    value: "10",
    icon: Activity,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    trend: "83% of total",
    trendColor: "text-emerald-600",
  },
  {
    label: "Trial",
    value: "2",
    icon: UserCog,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    trend: "Convert soon",
    trendColor: "text-amber-600",
  },
  {
    label: "Total Students",
    value: "2,847",
    icon: GraduationCap,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    trend: "+12.5% growth",
    trendColor: "text-violet-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ===================== Component =====================

export function InstitutesPage() {
  const [institutes] = useState<InstituteRecord[]>(mockInstitutes);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewingInst, setViewingInst] = useState<InstituteRecord | null>(null);

  // Add form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    plan: "Starter" as PlanType,
    maxUsers: "1000",
  });

  const filteredInstitutes = useMemo(() => {
    return institutes.filter((inst) => {
      const matchSearch =
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlan = planFilter === "all" || inst.plan === planFilter;
      const matchStatus = statusFilter === "all" || inst.status === statusFilter;
      return matchSearch && matchPlan && matchStatus;
    });
  }, [institutes, searchQuery, planFilter, statusFilter]);

  const openAddDialog = () => {
    setFormData({ name: "", code: "", email: "", phone: "", website: "", address: "", plan: "Starter", maxUsers: "1000" });
    setAddDialogOpen(true);
  };

  const handleAddSave = () => {
    setAddDialogOpen(false);
  };

  // ---------- Render ----------

  return (
    <div className="space-y-6 page-transition">
      {/* ===== Page Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Institute Management</h1>
          <p className="text-muted-foreground mt-1">Platform-wide institute tracking and management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={openAddDialog}>
            <Plus className="w-4 h-4" />
            Add Institute
          </Button>
        </div>
      </motion.div>

      {/* ===== Filter Bar ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search institutes by name, code, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="Starter">Starter</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Trial">Trial</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* ===== KPI Summary ===== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpiCards.map((kpi) => (
          <motion.div key={kpi.label} variants={itemVariants}>
            <Card className="rounded-xl border-slate-200/60 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                    <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${kpi.trendColor}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {kpi.trend}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== Institute Table ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Card className="rounded-xl border-slate-200/60 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="data-table-header hover:bg-transparent">
                    <TableHead className="pl-4">Institute</TableHead>
                    <TableHead className="text-center">Branches</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-center">Teachers</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Monthly Rev.</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="pr-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstitutes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                        No institutes found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInstitutes.map((inst) => {
                      const plan = planConfig[inst.plan];
                      const status = statusConfig[inst.status];

                      return (
                        <TableRow
                          key={inst.id}
                          className="data-table-row cursor-pointer"
                          onClick={() => setViewingInst(inst)}
                        >
                          {/* Institute Name */}
                          <TableCell className="pl-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate max-w-[200px]">{inst.name}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  {inst.city}, {inst.state}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Branches */}
                          <TableCell className="text-center">
                            <span className="text-sm font-medium">{inst.branches}</span>
                          </TableCell>

                          {/* Students */}
                          <TableCell className="text-center">
                            <span className="text-sm font-medium">{inst.students.toLocaleString()}</span>
                          </TableCell>

                          {/* Teachers */}
                          <TableCell className="text-center">
                            <span className="text-sm font-medium">{inst.teachers}</span>
                          </TableCell>

                          {/* Plan */}
                          <TableCell>
                            <Badge variant="outline" className={plan.className}>
                              <span className={`w-1.5 h-1.5 rounded-full ${plan.dotColor} mr-1`} />
                              {inst.plan}
                            </Badge>
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${status.dotColor}`} />
                              <span className={`text-xs font-medium ${status.textClass}`}>{inst.status}</span>
                            </div>
                          </TableCell>

                          {/* Revenue */}
                          <TableCell className="text-right">
                            <span className="text-sm font-medium">
                              {inst.monthlyRevenue > 0 ? `$${inst.monthlyRevenue}` : "—"}
                            </span>
                          </TableCell>

                          {/* Joined */}
                          <TableCell>
                            <span className="text-xs text-muted-foreground">{formatDate(inst.joinedDate)}</span>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="pr-4 text-right">
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-slate-100"
                                onClick={() => setViewingInst(inst)}
                              >
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-slate-100"
                              >
                                <Pencil className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing {filteredInstitutes.length} of {institutes.length} institutes</span>
              <span>Platform MRR: ${filteredInstitutes.reduce((s, i) => s + i.monthlyRevenue, 0).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== Add Institute Dialog ===== */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Plus className="w-4 h-4 text-emerald-600" />
              </div>
              Add New Institute
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Institute Name</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter institute name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-code">Code</Label>
                <Input
                  id="add-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. GEG"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@institute.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone</Label>
                <Input
                  id="add-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1-555-0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-website">Website</Label>
              <Input
                id="add-website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-address">Address</Label>
              <Input
                id="add-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select
                  value={formData.plan}
                  onValueChange={(v) => setFormData({ ...formData, plan: v as PlanType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter — $99/mo</SelectItem>
                    <SelectItem value="Professional">Professional — $249/mo</SelectItem>
                    <SelectItem value="Enterprise">Enterprise — $499/mo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-maxusers">Max Users</Label>
                <Input
                  id="add-maxusers"
                  type="number"
                  value={formData.maxUsers}
                  onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAddSave}>
              Create Institute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== View Institute Detail Sheet ===== */}
      <Sheet open={!!viewingInst} onOpenChange={() => setViewingInst(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto scrollbar-thin">
          {viewingInst && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="truncate">{viewingInst.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{viewingInst.code}</p>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Institute Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Institute Info</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem icon={Mail} label="Email" value={viewingInst.email} />
                    <InfoItem icon={Phone} label="Phone" value={viewingInst.phone} />
                    <InfoItem icon={Globe} label="Website" value={viewingInst.website} />
                    <InfoItem icon={CalendarDays} label="Joined" value={formatDate(viewingInst.joinedDate)} />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {viewingInst.address}, {viewingInst.city}, {viewingInst.state}
                  </div>
                </div>

                <Separator />

                {/* Stats Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Statistics</h4>
                  <div className="grid grid-cols-4 gap-3">
                    <StatBox icon={Building2} label="Branches" value={viewingInst.branches} iconBg="bg-slate-100" iconColor="text-slate-600" />
                    <StatBox icon={GraduationCap} label="Students" value={viewingInst.students.toLocaleString()} iconBg="bg-violet-50" iconColor="text-violet-600" />
                    <StatBox icon={Briefcase} label="Teachers" value={viewingInst.teachers} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                    <StatBox icon={BookOpen} label="Courses" value={viewingInst.courses} iconBg="bg-amber-50" iconColor="text-amber-600" />
                  </div>
                </div>

                <Separator />

                {/* Subscription Status */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subscription</h4>
                  <div className="rounded-xl border border-slate-200/60 bg-muted/30 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={planConfig[viewingInst.plan].className}>
                          <span className={`w-1.5 h-1.5 rounded-full ${planConfig[viewingInst.plan].dotColor} mr-1`} />
                          {viewingInst.plan}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${statusConfig[viewingInst.status].dotColor}`} />
                          <span className={`text-xs font-medium ${statusConfig[viewingInst.status].textClass}`}>
                            {viewingInst.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {viewingInst.monthlyRevenue > 0 ? `$${viewingInst.monthlyRevenue}/mo` : "Free Trial"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Users Used</span>
                        <span className="font-medium">{viewingInst.usersUsed.toLocaleString()} / {viewingInst.maxUsers.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={Math.min((viewingInst.usersUsed / viewingInst.maxUsers) * 100, 100)}
                        className={`h-2 ${
                          viewingInst.usersUsed / viewingInst.maxUsers > 0.9
                            ? "[&>div]:bg-red-500"
                            : viewingInst.usersUsed / viewingInst.maxUsers > 0.7
                            ? "[&>div]:bg-amber-500"
                            : "[&>div]:bg-emerald-500"
                        }`}
                      />
                      <p className="text-[10px] text-muted-foreground">
                        {viewingInst.maxUsers - viewingInst.usersUsed > 0
                          ? `${(viewingInst.maxUsers - viewingInst.usersUsed).toLocaleString()} slots remaining`
                          : "User limit reached"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Recent Activity */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Activity</h4>
                  <div className="space-y-0">
                    {viewingInst.recentActivity.map((activity, idx) => (
                      <div key={activity.id} className="flex gap-3 py-2.5">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                          {idx < viewingInst.recentActivity.length - 1 && (
                            <div className="w-px flex-1 bg-slate-200 mt-1" />
                          )}
                        </div>
                        <div className="min-w-0 pb-1">
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.user} · {activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit Institute
                  </Button>
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <DollarSign className="w-4 h-4" />
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ===================== Sub-Components =====================

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium truncate flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        {value || "—"}
      </p>
    </div>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="text-center p-3 rounded-xl border border-slate-200/60 bg-white">
      <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center mx-auto mb-1.5`}>
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      </div>
      <p className="text-lg font-bold tracking-tight">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
