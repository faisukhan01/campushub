"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { mockLeaveRequests } from "@/lib/mock-data";
import { getLeaveRequests } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import type { LeaveRequest } from "@/types";
import {
  CalendarOff,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Upload,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

export function LeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    type: "Personal",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    let cancelled = false;
    getLeaveRequests({ studentId: "u-student-001" }).then((res) => {
      if (!cancelled) {
        if (res.success) setLeaves(res.data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const pendingCount = leaves.filter((l) => l.status === "Pending").length;
  const approvedCount = leaves.filter((l) => l.status === "Approved").length;
  const rejectedCount = leaves.filter((l) => l.status === "Rejected").length;
  const totalDays = leaves.filter((l) => l.status === "Approved").reduce((s, l) => s + l.days, 0);

  const handleSubmit = () => {
    setShowForm(false);
    setShowConfirm(false);
    setForm({ type: "Personal", startDate: "", endDate: "", reason: "" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-20 rounded" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Requests</h1>
          <p className="text-muted-foreground">Submit and track leave applications</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold mt-1">{pendingCount}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-xl font-bold mt-1">{approvedCount}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-xl font-bold mt-1">{rejectedCount}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Days Used</p>
              <p className="text-xl font-bold mt-1">{totalDays}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Request Form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">New Leave Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Leave Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Sick">Sick</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Start Date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">End Date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Reason</Label>
              <Textarea placeholder="Describe the reason for your leave request..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Attachment (optional)</Label>
              <Button variant="outline" size="sm" className="gap-1">
                <Upload className="w-3 h-3" /> Upload Supporting Document
              </Button>
            </div>
            <Separator />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!form.type || !form.startDate || !form.endDate || !form.reason}
                onClick={() => setShowConfirm(true)}
              >
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Request History</CardTitle>
        </CardHeader>
        <CardContent>
          {leaves.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No leave requests yet</p>
          ) : (
            <div className="space-y-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Dates</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Days</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Reason</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave) => (
                      <tr key={leave.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <CalendarOff className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{leave.leaveType}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          <p className="text-xs">{leave.startDate}</p>
                          <p className="text-xs">to {leave.endDate}</p>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge variant="outline" className="text-xs">{leave.days} day{leave.days !== 1 ? "s" : ""}</Badge>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground max-w-[200px] truncate text-xs">{leave.reason}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", statusColors[leave.status])}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-xs text-muted-foreground max-w-[150px] truncate">
                          {leave.status === "Rejected" && leave.rejectionReason
                            ? leave.rejectionReason
                            : leave.status === "Approved"
                            ? `Approved by ${leave.approvedBy ? "Admin" : "-"}` 
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Leave Request</AlertDialogTitle>
            <AlertDialogDescription>
              You are submitting a <strong>{form.type}</strong> leave request from <strong>{form.startDate}</strong> to <strong>{form.endDate}</strong>.
              {form.startDate && form.endDate && (() => {
                const start = new Date(form.startDate);
                const end = new Date(form.endDate);
                const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                return ` Total: ${diff} day${diff !== 1 ? "s" : ""}.`;
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
