"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/app-store";
import { mockStudents, mockFeeInvoices } from "@/lib/mock-data";
import {
  CreditCard,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Download,
  Receipt,
  Calendar,
  Clock,
  Banknote,
  ExternalLink,
} from "lucide-react";

// ---- Helpers ----

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const statusColors: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Partial: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
};

const methodIcons: Record<string, string> = {
  Cash: "💵",
  Card: "💳",
  "Bank Transfer": "🏦",
  Online: "🌐",
  UPI: "📱",
};

// ---- Component ----

export function FeesPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);

  const children = currentRole === "Parent" ? mockStudents.slice(0, 2) : [];
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? "");
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const selectedChild = children.find((c) => c.id === selectedChildId) ?? children[0];
  const studentId = selectedChild?.id ?? "u-student-001";

  const isParentView = currentRole === "Parent";

  // Fee data for student
  const invoices = mockFeeInvoices.filter((f) => f.studentId === studentId);
  const allPayments = invoices.flatMap((inv) =>
    inv.payments.map((p) => ({ ...p, invoiceDescription: inv.description }))
  );

  const totalAmount = invoices.reduce((s, f) => s + f.totalAmount, 0);
  const totalPaid = invoices.reduce((s, f) => s + f.paidAmount, 0);
  const totalOutstanding = invoices.reduce((s, f) => s + f.balanceAmount, 0);
  const paidCount = invoices.filter((f) => f.status === "Paid").length;
  const pendingCount = invoices.filter((f) => f.status === "Pending").length;
  const overdueCount = invoices.filter((f) => f.status === "Overdue").length;

  // Upcoming due dates
  const upcomingDues = invoices
    .filter((f) => f.status !== "Paid")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const invoiceToPay = invoices.find((i) => i.id === selectedInvoice);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isParentView ? "Fee Payments" : "Fee Management"}
          </h1>
          <p className="text-muted-foreground">
            {isParentView
              ? "View and manage fee invoices and payments"
              : "View and manage fee invoices and payments"}
          </p>
        </div>
        {isParentView && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Child:</label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Fee Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Fees</p>
                <p className="text-2xl font-bold mt-1">${totalAmount.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                  ${totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className={`text-2xl font-bold mt-1 ${totalOutstanding > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  ${totalOutstanding.toLocaleString()}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${totalOutstanding > 0 ? "bg-amber-100 dark:bg-amber-900/50" : "bg-emerald-100 dark:bg-emerald-900/50"}`}>
                <DollarSign className={`w-5 h-5 ${totalOutstanding > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Invoices</p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">{paidCount} paid</Badge>
                  {pendingCount > 0 && <Badge variant="outline" className="text-amber-600 border-amber-300">{pendingCount} pending</Badge>}
                  {overdueCount > 0 && <Badge variant="destructive" className="text-xs">{overdueCount} overdue</Badge>}
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${overdueCount > 0 ? "bg-red-100 dark:bg-red-900/50" : "bg-muted"}`}>
                <AlertTriangle className={`w-5 h-5 ${overdueCount > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Due Dates Alert */}
      {upcomingDues.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  Upcoming Due Dates
                </p>
                <div className="mt-2 space-y-1">
                  {upcomingDues.map((inv) => {
                    const days = daysUntil(inv.dueDate);
                    return (
                      <p key={inv.id} className="text-xs text-amber-700 dark:text-amber-300">
                        <span className="font-medium">{inv.description}</span>
                        {" "}&middot; Due: {formatDate(inv.dueDate)}
                        {" "}&middot;{" "}
                        <span className={days <= 7 ? "font-semibold text-red-600 dark:text-red-400" : ""}>
                          {days <= 0 ? "OVERDUE" : days === 1 ? "Due tomorrow" : `${days} days remaining`}
                        </span>
                        {" "}&middot; ${inv.balanceAmount.toLocaleString()}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b last:border-0 gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{invoice.description}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[invoice.status] ?? ""}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Invoice: {invoice.invoiceNumber} &middot; Issued: {formatDate(invoice.issuedDate)} &middot; Due: {formatDate(invoice.dueDate)}
                  </p>
                  {invoice.discount && invoice.discount > 0 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                      Discount applied: ${invoice.discount.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold">${invoice.totalAmount.toLocaleString()}</p>
                    {invoice.balanceAmount > 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Balance: ${invoice.balanceAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  {invoice.status !== "Paid" && (
                    <Dialog open={payDialogOpen && selectedInvoice === invoice.id} onOpenChange={(open) => { setPayDialogOpen(open); if (!open) setSelectedInvoice(null); }}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => setSelectedInvoice(invoice.id)}
                        >
                          <Banknote className="w-3.5 h-3.5 mr-1" />
                          Pay
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Payment</DialogTitle>
                          <DialogDescription>
                            You are about to pay for the following invoice.
                          </DialogDescription>
                        </DialogHeader>
                        {invoiceToPay && (
                          <div className="space-y-3 py-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Description</span>
                              <span className="font-medium">{invoiceToPay.description}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Invoice</span>
                              <span>{invoiceToPay.invoiceNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Amount</span>
                              <span className="font-bold text-lg">${invoiceToPay.balanceAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Due Date</span>
                              <span>{formatDate(invoiceToPay.dueDate)}</span>
                            </div>
                          </div>
                        )}
                        <DialogFooter className="gap-2 sm:gap-0">
                          <Button variant="outline" onClick={() => { setPayDialogOpen(false); setSelectedInvoice(null); }}>
                            Cancel
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => {
                              // Mock payment
                              setPayDialogOpen(false);
                              setSelectedInvoice(null);
                            }}
                          >
                            Confirm & Pay
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-500" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Description</th>
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Method</th>
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Receipt</th>
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((payment) => (
                    <tr key={payment.id} className="border-b last:border-0">
                      <td className="py-3">{formatDate(payment.paymentDate)}</td>
                      <td className="py-3 text-muted-foreground">{payment.invoiceDescription}</td>
                      <td className="py-3 font-semibold">${payment.amount.toLocaleString()}</td>
                      <td className="py-3">
                        <span className="flex items-center gap-1">
                          <span>{methodIcons[payment.method] ?? "💳"}</span>
                          {payment.method}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline" className="text-xs font-mono">
                          {payment.receiptNumber}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={payment.status === "Success" ? "default" : "destructive"} className="text-xs">
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No payment history available.</p>
          )}

          {allPayments.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="w-3.5 h-3.5" />
                Download All Receipts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
