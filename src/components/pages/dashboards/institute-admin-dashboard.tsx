"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  MapPin, Users, GraduationCap, BookOpen,
  Building2, Loader2, RefreshCw, TrendingUp, DollarSign,
  ChevronRight, Phone, Mail, Plus,
} from "lucide-react";

interface BranchStat {
  id: string; name: string; code: string; address?: string; phone?: string; email?: string;
  isActive: boolean; createdAt: string;
  studentCount: number; teacherCount: number; courseCount: number;
  admin: { id: string; name: string; email: string } | null;
}

interface Teacher {
  id: string; name: string; email: string; phone?: string;
  employeeId?: string; branchId?: string; branchName?: string;
  courseCount: number; createdAt: string;
}

interface Student {
  id: string; name: string; email: string; phone?: string;
  rollNumber?: string; classLevel?: string; section?: string;
  branchId?: string; branchName?: string; createdAt: string;
}

interface DashStats {
  totalBranches: number; totalStudents: number; totalTeachers: number;
  totalCourses: number; totalEnrollments: number; avgAttendance: number;
  openTickets: number;
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function InstituteAdminDashboard() {
  const currentUser = useAppStore(s => s.currentUser);
  const setPage = useAppStore(s => s.setCurrentPage);

  const [stats, setStats] = useState<DashStats | null>(null);
  const [branches, setBranches] = useState<BranchStat[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Branch drill-down sheet
  const [selectedBranch, setSelectedBranch] = useState<BranchStat | null>(null);
  const [branchSheetOpen, setBranchSheetOpen] = useState(false);
  const [branchTeachers, setBranchTeachers] = useState<Teacher[]>([]);
  const [branchStudents, setBranchStudents] = useState<Student[]>([]);
  const [isBranchLoading, setIsBranchLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const [dashRes, branchRes, teacherRes, studentRes] = await Promise.all([
        fetch(`/api/dashboard?role=InstituteAdmin`),
        fetch(`/api/branches`),
        fetch(`/api/users?role=Teacher`),
        fetch(`/api/users?role=Student`),
      ]);

      if (dashRes.ok) { const d = await dashRes.json(); setStats(d.data); }
      if (branchRes.ok) { const d = await branchRes.json(); setBranches(d.data ?? []); }
      if (teacherRes.ok) { const d = await teacherRes.json(); setTeachers(d.data?.users ?? []); }
      if (studentRes.ok) { const d = await studentRes.json(); setStudents(d.data?.users ?? []); }
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, [currentUser]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openBranchSheet = async (branch: BranchStat) => {
    setSelectedBranch(branch);
    setBranchSheetOpen(true);
    setIsBranchLoading(true);
    try {
      const [tRes, sRes] = await Promise.all([
        fetch(`/api/users?role=Teacher&branchId=${branch.id}`),
        fetch(`/api/users?role=Student&branchId=${branch.id}`),
      ]);
      if (tRes.ok) { const d = await tRes.json(); setBranchTeachers(d.data?.users ?? []); }
      if (sRes.ok) { const d = await sRes.json(); setBranchStudents(d.data?.users ?? []); }
    } catch { /* silent */ }
    finally { setIsBranchLoading(false); }
  };

  const kpis = [
    { label: "Branches", value: stats?.totalBranches, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Students", value: stats?.totalStudents?.toLocaleString(), icon: GraduationCap, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/20" },
    { label: "Teachers", value: stats?.totalTeachers, icon: Users, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Courses", value: stats?.totalCourses, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Institute Dashboard</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{currentUser?.instituteName} — live overview</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold">{isLoading ? "—" : (kpi.value ?? 0)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Branches overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Branches</CardTitle>
              <CardDescription>Real-time overview of all branches</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setPage("branches")}>
              <Plus className="w-4 h-4 mr-1.5" />Manage Branches
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500 mr-2" />
              <span className="text-sm text-muted-foreground">Loading…</span>
            </div>
          ) : branches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground mb-3">No branches yet. Add your first branch.</p>
              <Button size="sm" onClick={() => setPage("branches")}>
                <MapPin className="w-4 h-4 mr-1.5" />Add Branch
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {branches.map(branch => (
                <div
                  key={branch.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border hover:bg-muted/30 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => openBranchSheet(branch)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm">{branch.name}</p>
                        <Badge variant="outline" className="text-[10px]">{branch.code}</Badge>
                        {!branch.isActive && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                      </div>
                      {branch.address && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0" />{branch.address}
                        </p>
                      )}
                      {branch.admin && (
                        <p className="text-xs text-muted-foreground">Admin: {branch.admin.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-base font-bold">{branch.studentCount}</p>
                        <p className="text-[10px] text-muted-foreground">Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-base font-bold">{branch.teacherCount}</p>
                        <p className="text-[10px] text-muted-foreground">Teachers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-base font-bold">{branch.courseCount}</p>
                        <p className="text-[10px] text-muted-foreground">Courses</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teachers & Students side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Teachers */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">All Teachers</CardTitle>
                <CardDescription>{teachers.length} across all branches</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setPage("users")}>View All</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[280px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              ) : teachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <Users className="w-10 h-10 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No teachers yet</p>
                </div>
              ) : (
                <div className="space-y-0 divide-y">
                  {teachers.slice(0, 15).map(teacher => (
                    <div key={teacher.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold">
                          {initials(teacher.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{teacher.email}</p>
                      </div>
                      {teacher.employeeId && (
                        <Badge variant="outline" className="text-[10px] flex-shrink-0">{teacher.employeeId}</Badge>
                      )}
                    </div>
                  ))}
                  {teachers.length > 15 && (
                    <div className="px-4 py-2 text-xs text-center text-muted-foreground">
                      +{teachers.length - 15} more teachers
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Students */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">All Students</CardTitle>
                <CardDescription>{students.length} across all branches</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setPage("users")}>View All</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[280px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              ) : students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <GraduationCap className="w-10 h-10 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No students yet</p>
                </div>
              ) : (
                <div className="space-y-0 divide-y">
                  {students.slice(0, 15).map(student => (
                    <div key={student.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 text-xs font-semibold">
                          {initials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {student.classLevel && (
                          <Badge className="text-[10px] bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                            Cl {student.classLevel}{student.section ? `-${student.section}` : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {students.length > 15 && (
                    <div className="px-4 py-2 text-xs text-center text-muted-foreground">
                      +{students.length - 15} more students
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Add Branch", icon: MapPin, page: "branches", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "User Management", icon: Users, page: "users", color: "text-sky-600 bg-sky-50 dark:bg-sky-900/20" },
          { label: "Fee Management", icon: DollarSign, page: "fees", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
          { label: "Reports", icon: TrendingUp, page: "reports", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
        ].map(action => (
          <Card
            key={action.label}
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-700"
            onClick={() => setPage(action.page)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-20">
              <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center`}>
                <action.icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-medium">{action.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Branch Detail Sheet ──────────────────────────────────────────── */}
      <Sheet open={branchSheetOpen} onOpenChange={setBranchSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
          {selectedBranch && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <SheetTitle>{selectedBranch.name}</SheetTitle>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px]">{selectedBranch.code}</Badge>
                      <Badge className={`text-[10px] ${selectedBranch.isActive ? "bg-emerald-100 text-emerald-700" : ""}`}>
                        {selectedBranch.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="px-6 pt-4 pb-2">
                {/* Branch contact info */}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                  {selectedBranch.address && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedBranch.address}</span>
                  )}
                  {selectedBranch.phone && (
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{selectedBranch.phone}</span>
                  )}
                  {selectedBranch.email && (
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{selectedBranch.email}</span>
                  )}
                </div>
                {/* Branch KPIs */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Students", value: selectedBranch.studentCount, color: "text-sky-600" },
                    { label: "Teachers", value: selectedBranch.teacherCount, color: "text-amber-600" },
                    { label: "Courses", value: selectedBranch.courseCount, color: "text-purple-600" },
                  ].map(s => (
                    <div key={s.label} className="text-center p-3 rounded-lg bg-muted/50">
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
                {selectedBranch.admin && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-lg bg-muted/40 mb-4">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>Branch Admin: <span className="font-medium text-foreground">{selectedBranch.admin.name}</span> · {selectedBranch.admin.email}</span>
                  </div>
                )}
              </div>

              <Tabs defaultValue="teachers" className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="mx-6 w-fit">
                  <TabsTrigger value="teachers" className="text-xs">
                    Teachers ({isBranchLoading ? "…" : branchTeachers.length})
                  </TabsTrigger>
                  <TabsTrigger value="students" className="text-xs">
                    Students ({isBranchLoading ? "…" : branchStudents.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="teachers" className="flex-1 overflow-hidden m-0 px-6 pt-3">
                  <ScrollArea className="h-full">
                    {isBranchLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : branchTeachers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Users className="w-10 h-10 text-muted-foreground/30 mb-2" />
                        <p className="text-sm text-muted-foreground">No teachers in this branch yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2 pb-4">
                        {branchTeachers.map(t => (
                          <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold">
                                {initials(t.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{t.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                            </div>
                            {t.employeeId && (
                              <Badge variant="outline" className="text-[10px]">{t.employeeId}</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="students" className="flex-1 overflow-hidden m-0 px-6 pt-3">
                  <ScrollArea className="h-full">
                    {isBranchLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : branchStudents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <GraduationCap className="w-10 h-10 text-muted-foreground/30 mb-2" />
                        <p className="text-sm text-muted-foreground">No students in this branch yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2 pb-4">
                        {branchStudents.map(s => (
                          <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 text-xs font-semibold">
                                {initials(s.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{s.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {s.rollNumber && <Badge variant="outline" className="text-[10px]">#{s.rollNumber}</Badge>}
                              {s.classLevel && (
                                <Badge className="text-[10px] bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                                  Cl {s.classLevel}{s.section ? `-${s.section}` : ""}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

