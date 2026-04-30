"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import {
  Crown, Check, X, Download, CreditCard, Building2, Users, HardDrive,
  ArrowUpRight, ArrowDownRight, Calendar, TrendingUp, Zap, Star, Shield,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { useState } from "react";

// -------------------- Chart Config --------------------

const revenueConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "#059669" },
};

// -------------------- Mock Data --------------------

const currentPlan = {
  name: "Enterprise",
  price: 299,
  period: "month",
  renewalDate: "Feb 15, 2026",
  status: "Active" as const,
  features: [
    "Unlimited Branches",
    "Unlimited Users",
    "100 GB Storage",
    "Priority Support 24/7",
    "Custom Integrations",
    "Advanced Analytics",
    "White Label",
    "API Access",
  ],
};

const plans = [
  {
    name: "Starter",
    price: 49,
    period: "month",
    popular: false,
    description: "For small institutions getting started",
    features: {
      "Max Branches": 2,
      "Max Users": 100,
      Storage: "5 GB",
      "Priority Support": false,
      "Custom Integrations": false,
      "Advanced Analytics": false,
      "White Label": false,
      "API Access": false,
    },
  },
  {
    name: "Professional",
    price: 149,
    period: "month",
    popular: true,
    description: "For growing schools and colleges",
    features: {
      "Max Branches": 10,
      "Max Users": 1000,
      Storage: "25 GB",
      "Priority Support": true,
      "Custom Integrations": true,
      "Advanced Analytics": true,
      "White Label": false,
      "API Access": false,
    },
  },
  {
    name: "Enterprise",
    price: 299,
    period: "month",
    popular: false,
    description: "For large institutions and groups",
    current: true,
    features: {
      "Max Branches": "Unlimited",
      "Max Users": "Unlimited",
      Storage: "100 GB",
      "Priority Support": true,
      "Custom Integrations": true,
      "Advanced Analytics": true,
      "White Label": true,
      "API Access": true,
    },
  },
];

const usageStats = [
  { label: "Branches", used: 8, max: "Unlimited", percent: 35, icon: Building2 },
  { label: "Users", used: 4820, max: "Unlimited", percent: 42, icon: Users },
  { label: "Storage", used: 62, max: "100 GB", percent: 62, icon: HardDrive },
];

const billingHistory = [
  { id: "INV-2026-001", date: "Jan 15, 2026", amount: "$299.00", status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-2025-012", date: "Dec 15, 2025", amount: "$299.00", status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-2025-011", date: "Nov 15, 2025", amount: "$299.00", status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-2025-010", date: "Oct 15, 2025", amount: "$299.00", status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-2025-009", date: "Sep 15, 2025", amount: "$299.00", status: "Paid", method: "Visa •••• 4242" },
  { id: "INV-2025-008", date: "Aug 15, 2025", amount: "$249.00", status: "Paid", method: "Visa •••• 4242" },
];

const revenueTrend = [
  { month: "Aug", revenue: 1800 },
  { month: "Sep", revenue: 2100 },
  { month: "Oct", revenue: 2400 },
  { month: "Nov", revenue: 2650 },
  { month: "Dec", revenue: 2900 },
  { month: "Jan", revenue: 3200 },
];

const planFeatures = [
  "Max Branches",
  "Max Users",
  "Storage",
  "Priority Support",
  "Custom Integrations",
  "Advanced Analytics",
  "White Label",
  "API Access",
];

export function SubscriptionPage() {
  const [autoRenew, setAutoRenew] = useState(true);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleOpenPlanDialog = (planName: string) => {
    if (planName === currentPlan.name) return;
    setSelectedPlan(planName);
    setPlanDialogOpen(true);
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Subscription Management</h1>
            <p className="text-muted-foreground">Manage your subscription plan, billing, and usage</p>
          </div>
        </div>
      </div>

      {/* Current Plan + Usage Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current Plan Card */}
        <Card className="card-premium lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge className="badge-gradient">Current Plan</Badge>
              <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700">
                {currentPlan.status}
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold flex items-center gap-2 mt-2">
              <Crown className="w-5 h-5 text-amber-500" />
              {currentPlan.name}
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground mt-1">
              ${currentPlan.price}
              <span className="text-sm font-normal text-muted-foreground">/{currentPlan.period}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground mb-2">Next renewal: {currentPlan.renewalDate}</div>
            <div className="space-y-1.5">
              {currentPlan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <Button className="w-full" variant="outline" onClick={() => setPlanDialogOpen(true)}>
              Change Plan
            </Button>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Usage Overview</CardTitle>
            <CardDescription>Current usage against your plan limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {usageStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stat.used.toLocaleString()} / {stat.max}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={stat.percent} className="h-2.5" />
                    <span className="absolute right-0 -top-5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {stat.percent}%
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Quick usage summary */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">8</p>
                <p className="text-xs text-muted-foreground">Branches</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-teal-50 dark:bg-teal-900/30">
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400">4,820</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">62 GB</p>
                <p className="text-xs text-muted-foreground">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend + Settings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue from subscription over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueConfig} className="h-[280px] w-full chart-container">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} dot={{ fill: "#059669", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Subscription Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Settings</CardTitle>
            <CardDescription>Manage your subscription preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Auto-Renewal */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Auto-Renewal</Label>
                <p className="text-xs text-muted-foreground">Automatically renew subscription</p>
              </div>
              <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Payment Method</Label>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                <div className="w-10 h-7 rounded bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2027</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">Change</Button>
              </div>
            </div>

            <Separator />

            {/* Billing Email */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Billing Email</Label>
              <div className="text-sm text-muted-foreground p-2 rounded-md bg-muted/20">
                billing@greenfield.edu
              </div>
            </div>

            <Separator />

            {/* Tax Info */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Tax Information</Label>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Greenfield Education Group</p>
                <p>TIN: 12-3456789</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs">Edit Tax Info</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Comparison Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Plan Comparison</CardTitle>
          <CardDescription>Compare features across all subscription tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Feature</TableHead>
                  {plans.map((plan) => (
                    <TableHead key={plan.name} className="text-center min-w-[160px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold">{plan.name}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          ${plan.price}/{plan.period}
                        </span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {planFeatures.map((feature) => (
                  <TableRow key={feature}>
                    <TableCell className="font-medium">{feature}</TableCell>
                    {plans.map((plan) => {
                      const val = plan.features[feature as keyof typeof plan.features];
                      const isBoolean = typeof val === "boolean";
                      const isCurrentPlan = "current" in plan;
                      return (
                        <TableCell key={plan.name} className="text-center">
                          <div className={`flex items-center justify-center ${isCurrentPlan ? "bg-emerald-50 dark:bg-emerald-900/20 rounded-md py-1" : ""}`}>
                            {isBoolean ? (
                              val ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <X className="w-4 h-4 text-muted-foreground/40" />
                              )
                            ) : (
                              <span className="text-sm">{String(val)}</span>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-medium">Actions</TableCell>
                  {plans.map((plan) => (
                    <TableCell key={plan.name} className="text-center">
                      {"current" in plan ? (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700">
                          Current
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant={plan.popular ? "default" : "outline"}
                          className={plan.popular ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                          onClick={() => handleOpenPlanDialog(plan.name)}
                        >
                          {plan.name === "Starter" ? (
                            <><ArrowDownRight className="w-3 h-3 mr-1" /> Downgrade</>
                          ) : (
                            <><ArrowUpRight className="w-3 h-3 mr-1" /> Upgrade</>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Billing History</CardTitle>
              <CardDescription>View past invoices and download receipts</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-sm">{invoice.id}</TableCell>
                    <TableCell className="text-sm">{invoice.date}</TableCell>
                    <TableCell className="text-sm font-semibold">{invoice.amount}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{invoice.method}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700 text-xs">
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Plan Change Dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Change Subscription Plan
            </DialogTitle>
            <DialogDescription>
              {selectedPlan === "Starter"
                ? "Downgrading to the Starter plan will limit some features."
                : "Upgrade to unlock more powerful features for your institution."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="font-semibold flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500" /> Enterprise
                </p>
              </div>
              <p className="font-bold text-lg">$299/mo</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <ArrowUpRight className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${selectedPlan === "Starter" ? "rotate-180" : ""}`} />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div>
                <p className="text-sm text-muted-foreground">New Plan</p>
                <p className="font-semibold flex items-center gap-1.5">
                  {selectedPlan === "Starter" ? (
                    <><Star className="w-4 h-4 text-emerald-500" /> Starter</>
                  ) : (
                    <><Shield className="w-4 h-4 text-emerald-500" /> Professional</>
                  )}
                </p>
              </div>
              <p className="font-bold text-lg">
                ${selectedPlan === "Starter" ? "$49" : "$149"}/mo
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Changes will take effect at the start of your next billing cycle on Feb 15, 2026.
                You&apos;ll be charged the prorated difference.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setPlanDialogOpen(false)}>
              {selectedPlan === "Starter" ? "Downgrade" : "Upgrade"} Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
