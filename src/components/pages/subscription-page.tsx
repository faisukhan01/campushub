"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
  Crown, Check, X, Building2, Users, GraduationCap, MapPin,
  ArrowUpRight, ArrowDownRight, Calendar, Zap, Star, Shield,
  RefreshCw, Loader2, AlertCircle, CheckCircle2, TrendingUp, Clock,
  AlertTriangle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubRecord {
  id: string;
  instituteId: string; instituteName: string; instituteCode: string;
  plan: string; maxUsers: number; isActive: boolean;
  startDate: string; endDate: string; createdAt: string; updatedAt: string;
  usage: { userCount: number; studentCount: number; teacherCount: number; branchCount: number };
  limits: { maxBranches: number | string; maxUsers: number | string; storage: string };
  daysLeft: number; isExpired: boolean; isExpiringSoon: boolean;
}

interface Totals {
  totalInstitutes: number; totalUsers: number;
  totalStudents: number; totalTeachers: number; totalBranches: number;
}

// ─── Plan definitions ─────────────────────────────────────────────────────────

const PLANS = [
  {
    name: "Starter", price: 49, popular: false,
    description: "Perfect for small schools",
    features: { "Max Branches": 2, "Max Users": 100, Storage: "5 GB", "Priority Support": false, "Advanced Analytics": false, "API Access": false },
  },
  {
    name: "Professional", price: 149, popular: true,
    description: "For growing institutions",
    features: { "Max Branches": 10, "Max Users": 1000, Storage: "25 GB", "Priority Support": true, "Advanced Analytics": true, "API Access": false },
  },
  {
    name: "Enterprise", price: 299, popular: false,
    description: "Unlimited scale",
    features: { "Max Branches": "Unlimited", "Max Users": "Unlimited", Storage: "100 GB", "Priority Support": true, "Advanced Analytics": true, "API Access": true },
  },
];

const PLAN_FEATURES = ["Max Branches","Max Users","Storage","Priority Support","Advanced Analytics","API Access"];

function planColor(plan: string) {
  if (plan === "Enterprise") return { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", icon: Crown };
  if (plan === "Professional") return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", icon: Shield };
  return { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", icon: Star };
}

function statusBadge(sub: SubRecord) {
  if (sub.isExpired) return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Expired</Badge>;
  if (sub.isExpiringSoon) return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><AlertTriangle className="w-3 h-3 mr-1"/>Expiring Soon</Badge>;
  if (!sub.isActive) return <Badge variant="secondary">Inactive</Badge>;
  return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><CheckCircle2 className="w-3 h-3 mr-1"/>Active</Badge>;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SubscriptionPage() {
  const [subs, setSubs] = useState<SubRecord[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // New sub dialog
  const [newSubOpen, setNewSubOpen] = useState(false);
  const [newInstituteId, setNewInstituteId] = useState("");
  const [newPlan, setNewPlan] = useState("Professional");
  const [newEndDate, setNewEndDate] = useState(() => {
    const d = new Date(); d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0,10);
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editSub, setEditSub] = useState<SubRecord | null>(null);
  const [editPlan, setEditPlan] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Institutes without subscriptions (for creating new ones)
  const [institutes, setInstitutes] = useState<{ id: string; name: string; code: string }[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true); setError("");
    try {
      const [subRes, instRes] = await Promise.all([
        fetch("/api/subscriptions"),
        fetch("/api/institutes"),
      ]);
      if (!subRes.ok) throw new Error("Failed to load subscriptions");
      const subJson = await subRes.json();
      setSubs(subJson.data ?? []);
      setTotals(subJson.totals ?? null);
      if (instRes.ok) {
        const instJson = await instRes.json();
        setInstitutes((instJson.data ?? []).map((i: { id: string; name: string; code: string }) => ({ id: i.id, name: i.name, code: i.code })));
      }
    } catch {
      setError("Failed to load subscription data. Please refresh.");
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(""); setSaveSuccess("");
    if (!newInstituteId || !newPlan || !newEndDate) { setSaveError("All fields are required."); return; }
    setIsSaving(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instituteId: newInstituteId, plan: newPlan, endDate: newEndDate }),
      });
      const json = await res.json();
      if (!res.ok) { setSaveError(json.error ?? "Failed to create subscription."); return; }
      setSaveSuccess("✓ Subscription created successfully");
      await fetchData();
      setTimeout(() => { setNewSubOpen(false); setSaveSuccess(""); }, 1800);
    } catch { setSaveError("Network error. Try again."); }
    finally { setIsSaving(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSub) return;
    setIsEditing(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editSub.id, plan: editPlan, endDate: editEndDate }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchData();
      setEditOpen(false);
    } catch { /* silent */ }
    finally { setIsEditing(false); }
  };

  const openEdit = (sub: SubRecord) => {
    setEditSub(sub);
    setEditPlan(sub.plan);
    setEditEndDate(new Date(sub.endDate).toISOString().slice(0,10));
    setEditOpen(true);
  };

  const expiringCount = subs.filter(s => s.isExpiringSoon).length;
  const expiredCount  = subs.filter(s => s.isExpired).length;
  const activeCount   = subs.filter(s => s.isActive && !s.isExpired).length;

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
            <p className="text-muted-foreground text-sm">Real-time subscription status for all institutes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />Refresh
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm" onClick={() => { setSaveError(""); setSaveSuccess(""); setNewSubOpen(true); }}>
            <Zap className="w-4 h-4 mr-2" />New Subscription
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4" />{error}
        </div>
      )}

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Institutes", value: totals?.totalInstitutes, icon: Building2, color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800" },
          { label: "Branches", value: totals?.totalBranches, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Students", value: totals?.totalStudents?.toLocaleString(), icon: GraduationCap, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/20" },
          { label: "Teachers", value: totals?.totalTeachers?.toLocaleString(), icon: Users, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Active Subs", value: activeCount, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-xl font-bold">{isLoading ? "—" : (kpi.value ?? 0)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert banners */}
      {!isLoading && (expiredCount > 0 || expiringCount > 0) && (
        <div className="space-y-2">
          {expiredCount > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span><strong>{expiredCount}</strong> institute{expiredCount > 1 ? "s have" : " has"} expired subscriptions — renew immediately.</span>
            </div>
          )}
          {expiringCount > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span><strong>{expiringCount}</strong> subscription{expiringCount > 1 ? "s are" : " is"} expiring within 30 days.</span>
            </div>
          )}
        </div>
      )}

      {/* Subscriptions table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Institute Subscriptions</CardTitle>
          <CardDescription>Live subscription status, plan details, and real usage for every institute</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500 mr-2" />
              <span className="text-sm text-muted-foreground">Loading…</span>
            </div>
          ) : subs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Crown className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No subscriptions found</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => setNewSubOpen(true)}>
                <Zap className="w-4 h-4 mr-1.5" />Create First Subscription
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institute</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Renewal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subs.map(sub => {
                    const pc = planColor(sub.plan);
                    const PlanIcon = pc.icon;
                    const userPct = typeof sub.limits.maxUsers === 'number' ? Math.round((sub.usage.userCount / sub.limits.maxUsers) * 100) : 0;
                    return (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{sub.instituteName}</p>
                              <p className="text-xs text-muted-foreground">{sub.instituteCode}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${pc.bg} ${pc.text}`}>
                            <PlanIcon className="w-3 h-3" />
                            {sub.plan}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-[140px]">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Users</span>
                              <span className="font-medium">{sub.usage.userCount} / {typeof sub.limits.maxUsers === 'number' ? sub.limits.maxUsers.toLocaleString() : sub.limits.maxUsers}</span>
                            </div>
                            <Progress value={userPct} className="h-1.5 mb-2" />
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{sub.usage.branchCount} branches</span>
                              <span className="flex items-center gap-0.5"><GraduationCap className="w-2.5 h-2.5" />{sub.usage.studentCount} students</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{formatDate(sub.endDate)}</p>
                            <p className={`text-xs flex items-center gap-1 ${sub.isExpired ? "text-red-500" : sub.isExpiringSoon ? "text-amber-500" : "text-muted-foreground"}`}>
                              <Clock className="w-3 h-3" />
                              {sub.isExpired ? "Expired" : `${sub.daysLeft}d left`}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{statusBadge(sub)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => openEdit(sub)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Plan Comparison</CardTitle>
          <CardDescription>Feature overview across subscription tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Feature</TableHead>
                  {PLANS.map(p => (
                    <TableHead key={p.name} className="text-center min-w-[150px]">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-xs text-muted-foreground font-normal">${p.price}/mo</span>
                        {p.popular && <Badge className="badge-gradient text-[9px] px-1.5 py-0">Popular</Badge>}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {PLAN_FEATURES.map(feat => (
                  <TableRow key={feat}>
                    <TableCell className="font-medium text-sm">{feat}</TableCell>
                    {PLANS.map(p => {
                      const val = p.features[feat as keyof typeof p.features];
                      return (
                        <TableCell key={p.name} className="text-center">
                          {typeof val === "boolean" ? (
                            val ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                          ) : (
                            <span className="text-sm">{String(val)}</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-medium text-sm">Active Institutes</TableCell>
                  {PLANS.map(p => {
                    const count = subs.filter(s => s.plan === p.name && s.isActive && !s.isExpired).length;
                    return (
                      <TableCell key={p.name} className="text-center">
                        <span className="text-sm font-semibold">{count}</span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ─── New Subscription Dialog ─────────────────────────────────────────── */}
      <Dialog open={newSubOpen} onOpenChange={o => { setNewSubOpen(o); if (!o) { setSaveError(""); setSaveSuccess(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />New Subscription
            </DialogTitle>
            <DialogDescription>Assign a plan to an institute</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Institute <span className="text-destructive">*</span></Label>
              <Select value={newInstituteId} onValueChange={setNewInstituteId} disabled={isSaving}>
                <SelectTrigger><SelectValue placeholder="Select institute…" /></SelectTrigger>
                <SelectContent>
                  {institutes.map(i => <SelectItem key={i.id} value={i.id}>{i.name} ({i.code})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Plan <span className="text-destructive">*</span></Label>
              <Select value={newPlan} onValueChange={setNewPlan} disabled={isSaving}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLANS.map(p => <SelectItem key={p.name} value={p.name}>{p.name} — ${p.price}/mo</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date <span className="text-destructive">*</span></Label>
              <Input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} disabled={isSaving} />
            </div>
            {saveError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4" />{saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4" />{saveSuccess}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewSubOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isSaving ? "Creating…" : "Create Subscription"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Subscription Dialog ─────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subscription — {editSub?.instituteName}</DialogTitle>
          </DialogHeader>
          {editSub && (
            <form onSubmit={handleEdit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Plan</Label>
                <Select value={editPlan} onValueChange={setEditPlan} disabled={isEditing}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLANS.map(p => <SelectItem key={p.name} value={p.name}>{p.name} — ${p.price}/mo</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Expiry Date</Label>
                <Input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} disabled={isEditing} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={isEditing}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isEditing}>
                  {isEditing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {isEditing ? "Saving…" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
