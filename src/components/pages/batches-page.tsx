"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { mockBatches } from "@/lib/mock-data";
import {
  Layers,
  Users,
  Calendar,
  UserCheck,
  Search,
  Plus,
  BookOpen,
  GraduationCap,
  FileText,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronUp,
  BarChart3,
  ClipboardList,
  Download,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---------- Mock enriched data ----------

const BATCH_ENROLLMENT_TREND = [
  { month: "Aug", enrolled: 243 },
  { month: "Sep", enrolled: 245 },
  { month: "Oct", enrolled: 243 },
  { month: "Nov", enrolled: 240 },
  { month: "Dec", enrolled: 238 },
  { month: "Jan", enrolled: 242 },
  { month: "Feb", enrolled: 246 },
  { month: "Mar", enrolled: 250 },
  { month: "Apr", enrolled: 253 },
  { month: "May", enrolled: 251 },
  { month: "Jun", enrolled: 248 },
  { month: "Jul", enrolled: 255 },
];

const DEPARTMENTS = ["All", "Computer Science", "Electrical Engineering", "Business Administration"];
const STATUSES = ["All", "Active", "Completed", "Upcoming"];
const PROGRAMS = ["All", "B.Tech Computer Science", "B.Tech Electrical Engineering", "BBA"];
const SEMESTERS = ["All", "2", "4", "6"];

interface EnrolledStudent {
  id: string;
  name: string;
  rollNumber: string;
  gpa: number;
  attendance: number;
  progress: number;
}

interface CourseAssignment {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
}

const MOCK_ENROLLED: EnrolledStudent[] = [
  { id: "s1", name: "Ryan Patel", rollNumber: "CS20230101", gpa: 3.72, attendance: 88, progress: 72 },
  { id: "s2", name: "Sophia Martinez", rollNumber: "CS20230102", gpa: 3.91, attendance: 94, progress: 85 },
  { id: "s3", name: "Liam Johnson", rollNumber: "CS20230103", gpa: 3.45, attendance: 76, progress: 65 },
  { id: "s4", name: "Emma Davis", rollNumber: "CS20230104", gpa: 3.88, attendance: 92, progress: 80 },
  { id: "s5", name: "Noah Williams", rollNumber: "CS20230105", gpa: 3.22, attendance: 71, progress: 58 },
  { id: "s6", name: "Olivia Brown", rollNumber: "CS20230106", gpa: 3.65, attendance: 85, progress: 70 },
  { id: "s7", name: "Ava Wilson", rollNumber: "CS20230107", gpa: 3.78, attendance: 90, progress: 77 },
  { id: "s8", name: "James Taylor", rollNumber: "CS20230108", gpa: 2.95, attendance: 68, progress: 52 },
];

const MOCK_COURSES: CourseAssignment[] = [
  { id: "c1", code: "CS401", name: "Database Systems", credits: 4, instructor: "Prof. Emily Rodriguez" },
  { id: "c2", code: "CS402", name: "Operating Systems", credits: 4, instructor: "Prof. Michael Lee" },
  { id: "c3", code: "CS403", name: "Computer Networks", credits: 3, instructor: "Prof. David Kim" },
  { id: "c4", code: "CS404", name: "Software Engineering", credits: 3, instructor: "Prof. Angela Foster" },
  { id: "c5", code: "MA301", name: "Probability & Statistics", credits: 3, instructor: "Prof. Robert Zhang" },
];

const GPA_DISTRIBUTION = [
  { range: "4.0", count: 5 },
  { range: "3.5-3.9", count: 18 },
  { range: "3.0-3.4", count: 24 },
  { range: "2.5-2.9", count: 12 },
  { range: "2.0-2.4", count: 4 },
  { range: "<2.0", count: 2 },
];

// ---------- Helpers ----------

function getBatchStatus(batch: (typeof mockBatches)[0]): "Active" | "Completed" | "Upcoming" {
  if (batch.isActive) return "Active";
  if (batch.endYear < new Date().getFullYear()) return "Completed";
  return "Upcoming";
}

const statusConfig: Record<string, { className: string; icon?: React.ReactNode }> = {
  Active: { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  Completed: { className: "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-400" },
  Upcoming: { className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
};

// ---------- Component ----------

export function BatchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [programFilter, setProgramFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<(typeof mockBatches)[0] | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    program: "",
    department: "",
    semester: "",
    year: "",
    startDate: "",
    endDate: "",
    maxCapacity: "",
    advisor: "",
    description: "",
  });

  const filteredBatches = useMemo(() => {
    return mockBatches.filter((batch) => {
      const status = getBatchStatus(batch);
      const matchesSearch =
        !searchQuery ||
        batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (batch.advisorName ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter === "All" || batch.programName.includes(departmentFilter.replace("Computer Science", "Computer Science"));
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      const matchesProgram = programFilter === "All" || batch.programName === programFilter;
      const matchesSemester = semesterFilter === "All" || batch.currentSemester === Number(semesterFilter);
      return matchesSearch && matchesDept && matchesStatus && matchesProgram && matchesSemester;
    });
  }, [searchQuery, departmentFilter, statusFilter, programFilter, semesterFilter]);

  const stats = useMemo(() => {
    const total = mockBatches.length;
    const active = mockBatches.filter((b) => getBatchStatus(b) === "Active").length;
    const totalStudents = mockBatches.reduce((sum, b) => sum + b.studentCount, 0);
    const avgSize = total > 0 ? Math.round(totalStudents / total) : 0;
    return { total, active, totalStudents, avgSize };
  }, []);

  function resetForm() {
    setFormData({
      name: "",
      code: "",
      program: "",
      department: "",
      semester: "",
      year: "",
      startDate: "",
      endDate: "",
      maxCapacity: "",
      advisor: "",
      description: "",
    });
  }

  function handleEdit(batch: (typeof mockBatches)[0]) {
    setEditingBatch(batch);
    setFormData({
      name: batch.name,
      code: batch.code,
      program: batch.programName,
      department: "Computer Science",
      semester: String(batch.currentSemester),
      year: `${batch.startYear}-${batch.endYear}`,
      startDate: "",
      endDate: "",
      maxCapacity: String(batch.studentCount + 10),
      advisor: batch.advisorName ?? "",
      description: "",
    });
    setEditDialogOpen(true);
  }

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Batches</h1>
          <p className="text-muted-foreground">Manage academic batches and cohorts</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={(open) => { setCreateDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
              <DialogDescription>Fill in the details to create a new academic batch.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Batch Name *</Label>
                  <Input placeholder="e.g., CS 2025-29" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Batch Code *</Label>
                  <Input placeholder="e.g., CS25" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Program *</Label>
                  <Select value={formData.program} onValueChange={(v) => setFormData({ ...formData, program: v })}>
                    <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B.Tech Computer Science">B.Tech Computer Science</SelectItem>
                      <SelectItem value="B.Tech Electrical Engineering">B.Tech Electrical Engineering</SelectItem>
                      <SelectItem value="BBA">BBA</SelectItem>
                      <SelectItem value="MBA">MBA</SelectItem>
                      <SelectItem value="M.Tech AI & ML">M.Tech AI & ML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="Business Administration">Business Administration</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={formData.semester} onValueChange={(v) => setFormData({ ...formData, semester: v })}>
                    <SelectTrigger><SelectValue placeholder="Sem" /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Input placeholder="e.g., 2025-2029" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Max Capacity</Label>
                  <Input type="number" placeholder="e.g., 80" value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Batch Advisor</Label>
                <Input placeholder="e.g., Prof. Emily Rodriguez" value={formData.advisor} onChange={(e) => setFormData({ ...formData, advisor: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Brief description about this batch..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCreateDialogOpen(false)}>
                Create Batch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Active Batches</p>
                <p className="text-2xl font-bold mt-1">{stats.active}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold mt-1">{stats.totalStudents}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Avg Batch Size</p>
                <p className="text-2xl font-bold mt-1">{stats.avgSize}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-lime-100 dark:bg-lime-900/50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-lime-600 dark:text-lime-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Trend Chart */}
      <Card className="card-premium">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Batch Enrollment Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BATCH_ENROLLMENT_TREND}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line type="monotone" dataKey="enrolled" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search batches by name, code, program, or advisor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[160px]"><Filter className="w-3.5 h-3.5 mr-1 text-muted-foreground" /><SelectValue /></SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROGRAMS.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SEMESTERS.map((s) => (
                <SelectItem key={s} value={s}>{s === "All" ? "All Semesters" : `Sem ${s}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Batch Cards Grid */}
      {filteredBatches.length === 0 ? (
        <Card className="empty-state">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="empty-state-icon mb-4">
              <Layers className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">No batches found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBatches.map((batch) => {
            const status = getBatchStatus(batch);
            const isExpanded = expandedBatch === batch.id;
            return (
              <Card key={batch.id} className="card-premium overflow-hidden">
                <CardContent className="p-0">
                  {/* Batch header */}
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                          <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">{batch.code}</Badge>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[status]?.className ?? ""}`}>
                              {status}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mt-1">{batch.name}</h3>
                          <p className="text-sm text-muted-foreground">{batch.programName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(batch)}>
                          <FileText className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setExpandedBatch(isExpanded ? null : batch.id)}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Batch info row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{batch.studentCount} Students</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{batch.startYear}–{batch.endYear}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span>Semester {batch.currentSemester}</span>
                      </div>
                      {batch.advisorName && (
                        <div className="flex items-center gap-2 text-sm">
                          <UserCheck className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate">{batch.advisorName}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        <BookOpen className="w-3 h-3 mr-1" /> Assign Courses
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        <Eye className="w-3 h-3 mr-1" /> View Students
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        <Download className="w-3 h-3 mr-1" /> Generate Report
                      </Button>
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <>
                      <Separator />
                      <Tabs defaultValue="students" className="p-5">
                        <TabsList className="tabs-smooth">
                          <TabsTrigger value="students">Enrolled Students</TabsTrigger>
                          <TabsTrigger value="courses">Course Assignments</TabsTrigger>
                          <TabsTrigger value="analytics">GPA Distribution</TabsTrigger>
                        </TabsList>
                        <TabsContent value="students" className="mt-4">
                          <ScrollArea className="max-h-80">
                            <div className="space-y-2">
                              {MOCK_ENROLLED.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                      {student.name.split(" ").map((n) => n[0]).join("")}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">{student.name}</p>
                                      <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs">
                                    <div className="text-center">
                                      <p className="font-medium">{student.gpa.toFixed(2)}</p>
                                      <p className="text-muted-foreground">GPA</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="font-medium">{student.attendance}%</p>
                                      <p className="text-muted-foreground">Attend.</p>
                                    </div>
                                    <div className="w-20">
                                      <Progress value={student.progress} className="h-1.5" />
                                      <p className="text-muted-foreground mt-0.5">{student.progress}%</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                        <TabsContent value="courses" className="mt-4">
                          <ScrollArea className="max-h-80">
                            <div className="space-y-2">
                              {MOCK_COURSES.map((course) => (
                                <div key={course.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">{course.code}</Badge>
                                      <p className="text-sm font-medium">{course.name}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{course.instructor}</p>
                                  </div>
                                  <Badge variant="secondary" className="text-xs">{course.credits} Credits</Badge>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                        <TabsContent value="analytics" className="mt-4">
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">GPA distribution for {batch.name} ({batch.studentCount} students)</p>
                            {GPA_DISTRIBUTION.map((item) => {
                              const pct = Math.round((item.count / batch.studentCount) * 100);
                              return (
                                <div key={item.range} className="flex items-center gap-3">
                                  <span className="text-xs font-medium w-16 text-right">{item.range}</span>
                                  <div className="flex-1 h-6 bg-muted/50 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground w-20 text-right">{item.count} students ({pct}%)</span>
                                </div>
                              );
                            })}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Batch Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) setEditingBatch(null); }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Batch: {editingBatch?.name}</DialogTitle>
            <DialogDescription>Update the batch details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Batch Name *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Batch Code *</Label>
                <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Program *</Label>
                <Select value={formData.program} onValueChange={(v) => setFormData({ ...formData, program: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B.Tech Computer Science">B.Tech Computer Science</SelectItem>
                    <SelectItem value="B.Tech Electrical Engineering">B.Tech Electrical Engineering</SelectItem>
                    <SelectItem value="BBA">BBA</SelectItem>
                    <SelectItem value="MBA">MBA</SelectItem>
                    <SelectItem value="M.Tech AI & ML">M.Tech AI & ML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={formData.semester} onValueChange={(v) => setFormData({ ...formData, semester: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Input value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Max Capacity</Label>
                <Input type="number" value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Batch Advisor</Label>
              <Input value={formData.advisor} onChange={(e) => setFormData({ ...formData, advisor: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Brief description..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setEditDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
