"use client";

import { DollarSign } from "lucide-react";
import { useAppStore } from "@/store/app-store";

export function FeesPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const role = currentUser?.role;

  return (
    <div className="space-y-6 page-transition">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
        <p className="text-muted-foreground">Fee structures and payment records</p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <DollarSign className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No fee records yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Fee structures and payment records will appear here once configured by the admin.
        </p>
      </div>
    </div>
  );
}
