"use client";

import { useSession } from "next-auth/react";
import { MessageSquare } from "lucide-react";

export function MessagesPage() {
  const { data: session } = useSession();
  return (
    <div className="space-y-6 page-transition">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Internal messaging system</p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-sky-500" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No messages yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Messages between staff and students will appear here.
        </p>
      </div>
    </div>
  );
}
