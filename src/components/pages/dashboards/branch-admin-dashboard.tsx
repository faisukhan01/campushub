"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  UserPlus,
  FileText,
  Loader2,
} from "lucide-react";

export function BranchAdminDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalStudents = stats?.totalStudents || 0;
  const totalTeachers = stats?.totalTeachers || 0;
  const totalCourses = stats?.totalCourses || 0;
  const avgAttendance = stats?.avgAttendance || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Branch Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          {currentUser?.branchName} • {currentUser?.instituteName}
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
            <p className="text-xs text-muted-foreground mt-2">Active teachers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-2">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttendance}%</div>
            <Progress value={avgAttendance} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {totalStudents === 0 && totalTeachers === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start by adding students and teachers</p>
            <div className="flex gap-2">
              <Button>Add Student</Button>
              <Button variant="outline">Add Teacher</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button className="h-20" variant="outline">
            <div className="flex flex-col items-center gap-2">
              <UserPlus className="h-5 w-5" />
              <span className="text-sm">Add Student</span>
            </div>
          </Button>
          <Button className="h-20" variant="outline">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Add Teacher</span>
            </div>
          </Button>
          <Button className="h-20" variant="outline">
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm">Assign Courses</span>
            </div>
          </Button>
          <Button className="h-20" variant="outline">
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="text-sm">View Reports</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
