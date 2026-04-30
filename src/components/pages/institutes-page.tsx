"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { mockInstitutes } from "@/lib/mock-data";
import {
  Building2, MapPin, Users, GraduationCap, Phone, Mail, Globe,
  Plus, Pencil, Eye, Star, Calendar, CheckCircle2, CreditCard,
} from "lucide-react";
import { useState } from "react";
import type { Institute } from "@/types";

const subscriptionPlans = [
  { name: "Enterprise", price: "$499/mo", features: ["Unlimited Branches", "Unlimited Users", "Priority Support", "Custom Integrations", "Advanced Analytics"], color: "bg-emerald-600" },
  { name: "Professional", price: "$249/mo", features: ["Up to 10 Branches", "Up to 5000 Users", "Email Support", "Standard Analytics", "API Access"], color: "bg-amber-600" },
  { name: "Starter", price: "$99/mo", features: ["Up to 3 Branches", "Up to 1000 Users", "Community Support", "Basic Reports"], color: "bg-slate-600" },
];

export function InstitutesPage() {
  const [institutes, setInstitutes] = useState<Institute[]>(mockInstitutes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<Institute | null>(null);
  const [viewingInst, setViewingInst] = useState<Institute | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", address: "", city: "", state: "", phone: "", email: "", website: "" });

  const openCreate = () => {
    setEditingInst(null);
    setFormData({ name: "", code: "", address: "", city: "", state: "", phone: "", email: "", website: "" });
    setDialogOpen(true);
  };

  const openEdit = (inst: Institute) => {
    setEditingInst(inst);
    setFormData({ name: inst.name, code: inst.code, address: inst.address, city: inst.city, state: inst.state, phone: inst.phone, email: inst.email, website: inst.website || "" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingInst) {
      setInstitutes((prev) => prev.map((i) => i.id === editingInst.id ? { ...i, ...formData } : i));
    } else {
      const newInst: Institute = {
        id: `inst-${Date.now()}`, ...formData, country: "United States", zipCode: "00000",
        branchCount: 0, studentCount: 0, teacherCount: 0, isActive: true,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      setInstitutes((prev) => [...prev, newInst]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Institutes</h1>
          <p className="text-muted-foreground">Manage all educational institutions on the platform</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />Add Institute
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingInst ? "Edit Institute" : "Create New Institute"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Institute Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. GEG" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Full address" rows={2} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-emerald-300 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Click or drag to upload logo</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave}>
                {editingInst ? "Save Changes" : "Create Institute"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subscription Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.name} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 ${plan.color}`} />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{plan.name}</h3>
                <span className="text-lg font-bold text-emerald-600">{plan.price}</span>
              </div>
              <ul className="space-y-2 mt-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Institute Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {institutes.map((inst) => (
          <Card key={inst.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{inst.code}</Badge>
                    <Badge variant={inst.isActive ? "default" : "secondary"} className={`text-xs ${inst.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}`}>
                      {inst.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <h3 className="text-base font-semibold truncate">{inst.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" /> {inst.city}, {inst.state}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold">{inst.studentCount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Students</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold">{inst.teacherCount}</p>
                  <p className="text-[10px] text-muted-foreground">Teachers</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold">{inst.branchCount}</p>
                  <p className="text-[10px] text-muted-foreground">Branches</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {inst.phone}</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {inst.email}</p>
                {inst.website && <p className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> {inst.website}</p>}
              </div>
              {inst.established && (
                <p className="text-xs text-muted-foreground mb-3">Established: {inst.established}</p>
              )}
              <Separator className="mb-3" />
              {/* Subscription info */}
              <div className="flex items-center justify-between mb-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-medium">Enterprise Plan</p>
                    <p className="text-[10px] text-muted-foreground">Renews Aug 15, 2025</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs text-emerald-600">Active</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewingInst(inst)}>
                  <Eye className="w-3 h-3 mr-1" />View
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(inst)}>
                  <Pencil className="w-3 h-3 mr-1" />Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewingInst} onOpenChange={() => setViewingInst(null)}>
        <DialogContent className="max-w-lg">
          {viewingInst && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  {viewingInst.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-xs text-muted-foreground">Code</span><p className="text-sm font-medium">{viewingInst.code}</p></div>
                  <div><span className="text-xs text-muted-foreground">Established</span><p className="text-sm font-medium">{viewingInst.established || "N/A"}</p></div>
                  <div><span className="text-xs text-muted-foreground">Students</span><p className="text-sm font-medium">{viewingInst.studentCount.toLocaleString()}</p></div>
                  <div><span className="text-xs text-muted-foreground">Teachers</span><p className="text-sm font-medium">{viewingInst.teacherCount}</p></div>
                  <div><span className="text-xs text-muted-foreground">Branches</span><p className="text-sm font-medium">{viewingInst.branchCount}</p></div>
                  <div><span className="text-xs text-muted-foreground">Status</span><Badge variant={viewingInst.isActive ? "default" : "secondary"} className={viewingInst.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}>{viewingInst.isActive ? "Active" : "Inactive"}</Badge></div>
                </div>
                <Separator />
                <div><span className="text-xs text-muted-foreground">Address</span><p className="text-sm">{viewingInst.address}, {viewingInst.city}, {viewingInst.state}</p></div>
                <div><span className="text-xs text-muted-foreground">Contact</span><p className="text-sm">{viewingInst.phone} | {viewingInst.email}</p></div>
                {viewingInst.website && <div><span className="text-xs text-muted-foreground">Website</span><p className="text-sm">{viewingInst.website}</p></div>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Upload icon placeholder
function Upload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
