"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  ClipboardCheck,
  Building2,
  Loader2,
} from "lucide-react";

export function InstituteAdminDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = new URLSearchParams({
          role: currentUser?.role || 'Student',
          userId: currentUser?.id || '',
        });
        
        if (currentUser?.instituteId) {
          params.append('instituteId', currentUser.instituteId);
        }
        
        const res = await fetch(`/api/dashboard?${params.toString()}`);
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
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalBranches = stats?.totalBranches || 0;
  const totalStudents = stats?.totalStudents || 0;
  const totalTeachers = stats?.totalTeachers || 0;
  const avgAttendance = stats?.avgAttendance || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Institute Dashboard</h1>
        <p className="text-muted-foreground mt-1">{currentUser?.instituteName}</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBranches}</div>
            <p className="text-xs text-muted-foreground mt-2">Across multiple cities</p>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttendance}%</div>
            <Progress value={avgAttendance} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {totalBranches === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Branches Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start by adding your first branch</p>
            <Button>Add Branch</Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button className="h-20" variant="outline">
          <div className="flex flex-col items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span className="text-sm">Add New Branch</span>
          </div>
        </Button>
        <Button className="h-20" variant="outline">
          <div className="flex flex-col items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="text-sm">Manage Users</span>
          </div>
        </Button>
        <Button className="h-20" variant="outline">
          <div className="flex flex-col items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm">View Reports</span>
          </div>
        </Button>
        <Button className="h-20" variant="outline">
          <div className="flex flex-col items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span className="text-sm">Fee Management</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
