"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockSupportTickets } from "@/lib/mock-data";
import { LifeBuoy, MessageSquare, Clock } from "lucide-react";

const statusColors: Record<string, string> = {
  Open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  InProgress: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Resolved: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  Closed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const priorityColors: Record<string, string> = {
  Low: "text-muted-foreground",
  Medium: "text-amber-600 dark:text-amber-400",
  High: "text-orange-600 dark:text-orange-400",
  Critical: "text-red-600 dark:text-red-400",
};

export function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support</h1>
          <p className="text-muted-foreground">Get help and submit support tickets</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">New Ticket</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSupportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{ticket.subject}</p>
                    <span className={`text-xs font-medium ${priorityColors[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{ticket.description.slice(0, 80)}...</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span>{ticket.category}</span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[ticket.status] ?? ""}`}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
