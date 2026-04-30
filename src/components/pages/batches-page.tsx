"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockBatches } from "@/lib/mock-data";
import { Layers, Users, Calendar, UserCheck } from "lucide-react";

export function BatchesPage() {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Batches</h1>
          <p className="text-muted-foreground">Manage academic batches and groups</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Create Batch</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockBatches.map((batch) => (
          <Card key={batch.id} className="card-premium">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant="outline" className="text-xs mb-2">{batch.code}</Badge>
                  <h3 className="text-base font-semibold">{batch.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{batch.programName}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {batch.studentCount} students</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {batch.startYear}-{batch.endYear}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>Semester: {batch.currentSemester}</span>
                {batch.advisorName && (
                  <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> {batch.advisorName}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
