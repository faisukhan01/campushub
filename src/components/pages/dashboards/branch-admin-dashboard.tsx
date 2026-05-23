"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users, GraduationCap, BookOpen, ClipboardCheck,
  UserPlus, Loader2, RefreshCw, Layers, TrendingUp,
  BookPlus, Calendar, Bell, DollarSign, ChevronRight,
} from "lucide-react";

interface ClassSummary {
  grade: string; label: string;
  studentCount: number; courseCount: number; teacherCount: number;
  sections: string[];
}

interface DashStats {
  totalStudents: number; totalTeachers: number; totalCourses: number;
  totalEnrollments: number; avgAttendance: number;
}

interface RecentUser {
  id: string; name: string; email: string; role: string;
  classLevel?: string | null; section?: string | null;
  employeeId?: string | null; createdAt: string;
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
}

const GRADE_COLORS: Record<string, string> = {
  "1": "from-rose-400 to-rose-500", "2": "from-orange-400 to-orange-500",
  "3": "from-amber-400 to-amber-500", "4": "from-yellow-400 to-yellow-500",
  "5": "from-lime-400 to-lime-500", "6": "from-emerald-400 to-emerald-500",
  "7": "from-teal-400 to-teal-500", "8": "from-cyan-400 to-cyan-500",
  "9": "from-sky-400 to-sky-500", "10": "from-blue-400 to-blue-500",
  "11": "from-violet-400 to-violet-500", "12": "from-purple-400 to-purple-500",
};

export function BranchAdminDashboard() {
  const currentUser = useAppStore(s => s.currentUser);
  const setPage = useAppStore(s => s.setCurrentPage);

  const [stats, setStats] = useState<DashStats | null>(null);
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dashRes, classRes, userRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/school-classes"),
        fetch("/api/users?limit=10&sortBy=createdAt"),
      ]);
      if (dashRes.ok) { const d = await dashRes.json(); setStats(d.data); }
      if (classRes.ok) {
        const d = await classRes.json();
        // Only show classes with data
        setClasses((d.data ?? []).filter((c: ClassSummary) => c.studentCount > 0 || c.courseCount > 0));
      }
      if (userRes.ok) { const d = await userRes.json(); setRecentUsers(d.data?.users ?? []); }
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const activeClasses = classes.length;
  const totalClassStudents = classes.reduce((s, c) => s + c.studentCount, 0);

  const kpis = [
    { label: "Total Students", value: stats?.totalStudents?.toLocaleString(), icon: GraduationCap, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/20", page: "students" },
    { label: "Total Teachers", value: stats?.totalTeachers, icon: Users, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", page: "teachers" },
    { label: "Total Subjects", value: stats?.totalCourses, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20", page: "courses" },
    { label: "Active Classes", value: activeClasses, icon: Layers, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", page: "school-classes" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Branch Dashboard</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {currentUser?.branchName} · {currentUser?.instituteName}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(kpi => (
          <Card
            key={kpi.label}
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-700"
            onClick={() => setPage(kpi.page)}
          >
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

      {/* Class Management Quick View */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Class Overview</CardTitle>
              <CardDescription>
                {activeClasses} active class{activeClasses !== 1 ? "es" : ""} · {totalClassStudents.toLocaleString()} students
              </CardDescription>
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setPage("school-classes")}>
              <Layers className="w-4 h-4 mr-1.5" />Manage Classes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500 mr-2" />
              <span className="text-sm text-muted-foreground">Loading…</span>
            </div>
          ) : classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Layers className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground mb-3">No classes set up yet</p>
              <Button size="sm" onClick={() => setPage("school-classes")}>
                <Layers className="w-4 h-4 mr-1.5" />Set Up Classes
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {classes.map(cls => {
                const grad = GRADE_COLORS[cls.grade] || GRADE_COLORS["1"];
                return (
                  <div
                    key={cls.grade}
                    onClick={() => setPage("school-classes")}
                    className="relative overflow-hidden rounded-xl border cursor-pointer hover:shadow-md transition-all duration-200 group"
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${grad}`} />
                    <div className="p-3 text-center">
                      <p className="text-2xl font-black text-muted-foreground/20 absolute top-1 right-2 leading-none select-none">{cls.grade}</p>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Class {cls.grade}</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">👨‍🎓</span>
                          <span className="font-bold">{cls.studentCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">📚</span>
                          <span className="font-bold">{cls.courseCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">👩‍🏫</span>
                          <span className="font-bold">{cls.teacherCount}</span>
                        </div>
                      </div>
                      {cls.sections.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 justify-center mt-2">
                          {cls.sections.slice(0,3).map(s => (
                            <span key={s} className="text-[9px] px-1 py-0.5 rounded bg-muted font-medium">§{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent additions + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Users */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recently Added</CardTitle>
            <CardDescription>Latest students and teachers in this branch</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[260px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <Users className="w-10 h-10 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No users yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {recentUsers.filter(u => u.role === "Student" || u.role === "Teacher").map(user => (
                    <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`text-xs font-semibold ${user.role === "Teacher" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"}`}>
                          {initials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Badge variant={user.role === "Teacher" ? "default" : "secondary"} className={`text-[10px] ${user.role === "Teacher" ? "bg-amber-100 text-amber-700 border-0" : "bg-sky-100 text-sky-700 border-0"}`}>
                          {user.role}
                        </Badge>
                        {user.classLevel && (
                          <Badge variant="outline" className="text-[10px]">Cl {user.classLevel}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Class Management", desc: "Manage K-12 classes", icon: Layers, page: "school-classes", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" },
              { label: "Add Student", desc: "Enrol a new student", icon: UserPlus, page: "students", color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20" },
              { label: "Add Teacher", desc: "Register a new teacher", icon: Users, page: "teachers", color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20" },
              { label: "Manage Courses", desc: "Subjects & assignments", icon: BookOpen, page: "courses", color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20" },
              { label: "Attendance", desc: "Mark & track attendance", icon: ClipboardCheck, page: "attendance", color: "bg-teal-50 text-teal-600 dark:bg-teal-900/20" },
              { label: "Fee Management", desc: "Invoices & payments", icon: DollarSign, page: "fees", color: "bg-rose-50 text-rose-600 dark:bg-rose-900/20" },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => setPage(action.page)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
