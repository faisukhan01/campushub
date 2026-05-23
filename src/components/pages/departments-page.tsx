"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, FolderTree } from "lucide-react";

export function DepartmentsPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6 page-transition">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">Manage academic departments</p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <FolderTree className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No departments yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Departments will be added here as the institute grows.
        </p>
      </div>
    </div>
  );
}
