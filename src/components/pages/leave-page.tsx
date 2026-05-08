"use client";

import { useSession } from "next-auth/react";
import { CalendarOff } from "lucide-react";

export function LeavePage() {
  const { data: session } = useSession();
  return (
    <div className="space-y-6 page-transition">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leave Requests</h1>
        <p className="text-muted-foreground">Manage and apply for leave</p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <CalendarOff className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No leave requests</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Leave requests will appear here once submitted.
        </p>
      </div>
    </div>
  );
}
