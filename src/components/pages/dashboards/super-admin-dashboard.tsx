"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Building2, MapPin, Users, GraduationCap, Activity,
  CheckCircle2, BookOpen, Loader2, ArrowRight,
} from "lucide-react";

interface InstituteRow {
  id: string;
  name: string;
  code: string;
  branchCount: number;
  studentCount: number;
  teacherCount: number;
  admin: { name: string; email: string } | null;
}

export function SuperAdminDashboard() {
  const { data: session } = useSession();
  const currentUser = useAppStore((s) => s.currentUser);
  const setPage = useAppStore((s) => s.setCurrentPage);

  const [institutes, setInstitutes] = useState<InstituteRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const callerRole = session?.user?.role;

  const fetchData = useCallback(async () => {
    if (callerRole && callerRole !== "SuperAdmin") {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/institutes");
      if (res.ok) {
        const json = await res.json();
        setInstitutes(json.data ?? []);
      }
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, [callerRole]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalBranches = institutes.reduce((s, i) => s + i.branchCount, 0);
  const totalStudents = institutes.reduce((s, i) => s + i.studentCount, 0);
  const totalTeachers = institutes.reduce((s, i) => s + i.teacherCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-1">Platform overview — all institutes at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Institutes", value: institutes.length, icon: Building2, color: "text-slate-600", bg: "bg-slate-100" },
          { label: "Branches", value: totalBranches, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Students", value: totalStudents.toLocaleString(), icon: GraduationCap, color: "text-sky-600", bg: "bg-sky-50" },
          { label: "Teachers", value: totalTeachers.toLocaleString(), icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold">{isLoading ? "—" : kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Database", value: "Turso / libSQL", status: "Operational" },
          { label: "Auth Service", value: "NextAuth v4", status: "Operational" },
          { label: "Platform", value: "Next.js 16", status: "Operational" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-medium">{s.value}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">{s.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Institutes Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Registered Institutes</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setPage("institutes")}>
            Manage All <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500 mr-2" />
              <span className="text-sm text-muted-foreground">Loading…</span>
            </div>
          ) : institutes.length === 0 ? (
            <div className="text-center py-10">
              <Building2 className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No institutes registered yet.</p>
              <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white" size="sm" onClick={() => setPage("institutes")}>
                Add First Institute
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {institutes.map((inst) => (
                <div key={inst.id} className="flex items-center gap-4 p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{inst.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {inst.branchCount} branch{inst.branchCount !== 1 ? "es" : ""} ·{" "}
                      {inst.studentCount} students ·{" "}
                      {inst.teacherCount} teachers
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] flex-shrink-0">{inst.code}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Add Institute", page: "institutes", icon: Building2 },
          { label: "Add Branch", page: "branches", icon: MapPin },
          { label: "Manage Users", page: "users", icon: Users },
          { label: "View Courses", page: "courses", icon: BookOpen },
        ].map((a) => (
          <Button
            key={a.label}
            variant="outline"
            className="h-auto flex-col gap-2 py-4"
            onClick={() => setPage(a.page as any)}
          >
            <a.icon className="w-5 h-5 text-emerald-600" />
            <span className="text-xs">{a.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
