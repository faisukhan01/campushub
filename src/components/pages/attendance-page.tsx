"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ClipboardCheck, Loader2, RefreshCw, AlertCircle, Calendar,
} from "lucide-react";

interface CourseOption {
  id: string;
  code: string;
  title: string;
  classLevel: string;
}

export function AttendancePage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const json = await res.json();
        setCourses(json.data ?? []);
      }
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Track and manage class attendance</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.code} — {c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchCourses} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mr-2" />
          <span className="text-sm text-muted-foreground">Loading…</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <ClipboardCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No courses yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Attendance records will appear here once courses and students are added by the Branch Admin.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No attendance sessions yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {courses.length} course{courses.length !== 1 ? "s" : ""} found. Attendance sessions will appear here once teachers start marking attendance.
          </p>
        </div>
      )}
    </div>
  );
}
