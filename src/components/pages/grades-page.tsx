"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Award } from "lucide-react";

interface CourseOption {
  id: string;
  code: string;
  title: string;
  classLevel: string;
}

export function GradesPage() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
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
          <h1 className="text-2xl font-bold tracking-tight">Grades</h1>
          <p className="text-muted-foreground">View and manage grade records</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchCourses} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mr-2" />
          <span className="text-sm text-muted-foreground">Loading…</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No grades recorded yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {courses.length > 0
              ? `${courses.length} course${courses.length !== 1 ? "s" : ""} found. Grade records will appear here once assessments are completed.`
              : "Grades will appear here once courses are created and assessments are conducted."}
          </p>
        </div>
      )}
    </div>
  );
}
