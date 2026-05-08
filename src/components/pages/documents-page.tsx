"use client";

import { useSession } from "next-auth/react";
import { FileArchive } from "lucide-react";

export function DocumentsPage() {
  const { data: session } = useSession();
  return (
    <div className="space-y-6 page-transition">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">Academic certificates and transcripts</p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <FileArchive className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No documents yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Certificates, transcripts and official documents will appear here.
        </p>
      </div>
    </div>
  );
}
