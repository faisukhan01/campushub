"use client";

import { useSession } from "next-auth/react";
import { ClipboardList } from "lucide-react";

export function AssessmentsPage() {
  const { data: session } = useSession();
  return (
    <div className="space-y-6 page-transition">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground">Tests, quizzes and exams</p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-purple-500" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No assessments yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Quizzes, tests and exams will appear here once created by teachers.
        </p>
      </div>
    </div>
  );
}
