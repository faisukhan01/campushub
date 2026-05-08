"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, FileText } from "lucide-react";

interface CourseOption { id: string; code: string; title: string }

export function AssignmentsPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/courses");
      if (res.ok) { const json = await res.json(); setCourses(json.data ?? []); }
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">View and submit assignments</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchCourses} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mr-2" />
          <span className="text-sm text-muted-foreground">Loading…</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No assignments yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {courses.length > 0
              ? "Assignments will appear here once teachers post them to their courses."
              : "Assignments will appear here once courses are created and teachers post work."}
          </p>
        </div>
      )}
    </div>
  );
}
