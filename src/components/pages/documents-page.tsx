"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDocumentRequests } from "@/lib/mock-data";
import { FileStack, Clock, CheckCircle2, Download } from "lucide-react";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Expired: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

export function DocumentsPage() {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Request and download official documents</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">New Request</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Document Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockDocumentRequests.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                    <FileStack className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{doc.documentType}</p>
                    <p className="text-xs text-muted-foreground">Purpose: {doc.purpose}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Requested: {doc.requestedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[doc.status] ?? ""}`}>
                    {doc.status}
                  </span>
                  {doc.status === "Approved" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
