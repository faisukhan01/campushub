"use client";

import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ── Mock Data ────────────────────────────────────────────────────────────────

const stats = [
  { label: "Today's Classes", value: "5" },
  { label: "Total Students", value: "142" },
  { label: "Pending Grading", value: "12" },
  { label: "Avg Attendance", value: "89%" },
];

interface ClassRow {
  name: string;
  subject: string;
  students: number;
  nextClass: string;
  attendance: number;
}

const classes: ClassRow[] = [
  { name: "Class 10-A", subject: "Mathematics", students: 28, nextClass: "Today, 10:00 AM", attendance: 92 },
  { name: "Class 10-B", subject: "Mathematics", students: 26, nextClass: "Today, 11:30 AM", attendance: 87 },
  { name: "Class 9-A", subject: "Physics", students: 24, nextClass: "Today, 1:00 PM", attendance: 91 },
  { name: "Class 9-B", subject: "Physics", students: 22, nextClass: "Today, 2:00 PM", attendance: 84 },
  { name: "Class 11-A", subject: "Advanced Math", students: 22, nextClass: "Tomorrow, 9:00 AM", attendance: 95 },
  { name: "Class 11-B", subject: "Advanced Math", students: 20, nextClass: "Tomorrow, 11:00 AM", attendance: 88 },
];

interface PendingTask {
  id: string;
  status: "overdue" | "urgent";
  description: string;
  action: "Mark" | "Review";
}

const pendingTasks: PendingTask[] = [
  { id: "t1", status: "overdue", description: "Mark attendance for Class 9-B — Today, 2:00 PM", action: "Mark" },
  { id: "t2", status: "urgent", description: "Grade 23 assignments for Mathematics — Due today", action: "Review" },
  { id: "t3", status: "urgent", description: "Review submitted lab reports for Class 11-A — 8 pending", action: "Review" },
  { id: "t4", status: "overdue", description: "Submit mid-term marks for Class 10-A — Overdue by 1 day", action: "Mark" },
  { id: "t5", status: "urgent", description: "Approve 5 leave requests from students — Due tomorrow", action: "Review" },
];

interface ActivityItem {
  id: string;
  text: string;
  time: string;
}

const recentActivity: ActivityItem[] = [
  { id: "a1", text: "Graded Assignment #3 for Class 10-A", time: "2 hours ago" },
  { id: "a2", text: "Marked attendance for Class 9-A", time: "3 hours ago" },
  { id: "a3", text: "Uploaded notes for Chapter 7 — Advanced Math", time: "5 hours ago" },
  { id: "a4", text: "Graded Assignment #2 for Class 10-B", time: "1 day ago" },
  { id: "a5", text: "Marked attendance for Class 11-A", time: "1 day ago" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function TeacherDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const firstName = currentUser?.name?.split(" ").slice(-1)[0] ?? "Emily";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {firstName}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn("rounded-full text-xs font-normal")}
        >
          Teacher
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={cn("shadow-none")}>
            <CardContent className={cn("p-4")}>
              <p className={cn("text-xs text-muted-foreground uppercase tracking-wider font-medium")}>
                {stat.label}
              </p>
              <p className={cn("text-2xl font-bold text-foreground mt-1")}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Classes Table */}
      <div className="space-y-3">
        <h2 className={cn("text-sm font-medium")}>My Classes</h2>
        <Card className={cn("shadow-none overflow-hidden")}>
          <CardContent className={cn("p-0")}>
            <Table>
              <TableHeader>
                <TableRow className={cn("hover:bg-transparent")}>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Next Class</TableHead>
                  <TableHead>Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.name}>
                    <TableCell className={cn("font-medium")}>{cls.name}</TableCell>
                    <TableCell className={cn("text-muted-foreground")}>{cls.subject}</TableCell>
                    <TableCell>{cls.students}</TableCell>
                    <TableCell className={cn("text-muted-foreground")}>{cls.nextClass}</TableCell>
                    <TableCell>
                      <div className={cn("flex items-center gap-2")}>
                        <div className={cn("h-1.5 w-16 rounded-full bg-muted overflow-hidden")}>
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              cls.attendance >= 90 ? "bg-emerald-500" : cls.attendance >= 80 ? "bg-amber-500" : "bg-red-500"
                            )}
                            style={{ width: `${cls.attendance}%` }}
                          />
                        </div>
                        <span className={cn("text-xs text-muted-foreground tabular-nums")}>
                          {cls.attendance}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Pending Tasks + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="space-y-3">
          <h2 className={cn("text-sm font-medium")}>Pending Tasks</h2>
          <Card className={cn("shadow-none")}>
            <CardContent className={cn("p-0")}>
              <div className={cn("divide-y")}>
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn("flex items-center justify-between gap-3 px-4 py-3")}
                  >
                    <div className={cn("flex items-start gap-3 min-w-0")}>
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 rounded-full flex-shrink-0",
                          task.status === "overdue" ? "bg-red-500" : "bg-amber-500"
                        )}
                      />
                      <p className={cn("text-sm leading-snug")}>{task.description}</p>
                    </div>
                    <button
                      type="button"
                      className={cn(
                        "text-xs text-primary hover:text-primary/80 font-medium flex-shrink-0 transition-colors"
                      )}
                    >
                      {task.action}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h2 className={cn("text-sm font-medium")}>Recent Activity</h2>
          <Card className={cn("shadow-none")}>
            <CardContent className={cn("p-0")}>
              <div className={cn("divide-y")}>
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className={cn("flex items-center gap-3 px-4 py-3")}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0")} />
                    <div className={cn("flex items-center justify-between gap-3 min-w-0 flex-1")}>
                      <p className={cn("text-sm truncate")}>{item.text}</p>
                      <span className={cn("text-xs text-muted-foreground whitespace-nowrap flex-shrink-0")}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
