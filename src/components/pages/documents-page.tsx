"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { mockDocumentRequests } from "@/lib/mock-data";
import {
  FileStack,
  Clock,
  CheckCircle2,
  Download,
  Search,
  Plus,
  Package,
  Filter,
  AlertCircle,
  FileText,
  Award,
  BookOpen,
  ArrowRight,
  CircleDot,
  Sparkles,
} from "lucide-react";

// ---------- Mock data ----------

const DOCUMENT_TYPES = [
  { value: "Transcript", label: "Transcript", fee: 25, icon: FileText, desc: "Official academic transcript with all semester grades" },
  { value: "Bonafide", label: "Bonafide Certificate", fee: 10, icon: Award, desc: "Proof of enrollment at the institution" },
  { value: "Character", label: "Character Certificate", fee: 15, icon: BookOpen, desc: "Certificate of good conduct and character" },
  { value: "Migration", label: "Migration Certificate", fee: 20, icon: FileStack, desc: "Certificate for transfer between institutions" },
  { value: "Degree", label: "Degree Certificate", fee: 50, icon: Award, desc: "Official degree conferral document" },
  { value: "Other", label: "Other Document", fee: 10, icon: FileText, desc: "Custom document request" },
];

interface DocumentRequestExt {
  id: string;
  documentType: string;
  purpose: string;
  status: "Pending" | "Processing" | "Approved" | "Rejected" | "Ready";
  requestedDate: string;
  estimatedDelivery: string;
  copies: number;
  urgent: boolean;
  deliveryMethod: string;
  fee: number;
  timeline?: TimelineEntry[];
}

const MOCK_DOCUMENTS: DocumentRequestExt[] = [
  {
    id: "doc-001",
    documentType: "Transcript",
    purpose: "Graduate school application at MIT",
    status: "Pending",
    requestedDate: "2025-01-12",
    estimatedDelivery: "2025-01-19",
    copies: 3,
    urgent: true,
    deliveryMethod: "Both",
    fee: 75,
    timeline: [
      { date: "2025-01-12 09:30", action: "Request submitted", by: "You", type: "created" },
      { date: "2025-01-12 09:31", action: "Payment of $75.00 received", by: "System", type: "info" },
    ],
  },
  {
    id: "doc-002",
    documentType: "Bonafide Certificate",
    purpose: "Bank loan application — education loan",
    status: "Approved",
    requestedDate: "2025-01-05",
    estimatedDelivery: "2025-01-12",
    copies: 2,
    urgent: false,
    deliveryMethod: "Collect",
    fee: 20,
    timeline: [
      { date: "2025-01-05 10:15", action: "Request submitted", by: "You", type: "created" },
      { date: "2025-01-05 10:16", action: "Payment of $20.00 received", by: "System", type: "info" },
      { date: "2025-01-07 14:00", action: "Document verified by registrar", by: "Admin Office", type: "progress" },
      { date: "2025-01-09 11:30", action: "Document approved and printed", by: "Admin Office", type: "success" },
      { date: "2025-01-09 12:00", action: "Ready for collection at Admin Block, Room 102", by: "System", type: "info" },
    ],
  },
  {
    id: "doc-003",
    documentType: "Character Certificate",
    purpose: "Visa application for study abroad",
    status: "Processing",
    requestedDate: "2025-01-10",
    estimatedDelivery: "2025-01-17",
    copies: 1,
    urgent: false,
    deliveryMethod: "Digital",
    fee: 15,
    timeline: [
      { date: "2025-01-10 08:45", action: "Request submitted", by: "You", type: "created" },
      { date: "2025-01-10 08:46", action: "Payment of $15.00 received", by: "System", type: "info" },
      { date: "2025-01-12 16:20", action: "Under review by HOD", by: "CS Department", type: "progress" },
    ],
  },
  {
    id: "doc-004",
    documentType: "Migration Certificate",
    purpose: "Transfer to another university",
    status: "Ready",
    requestedDate: "2024-12-28",
    estimatedDelivery: "2025-01-08",
    copies: 1,
    urgent: false,
    deliveryMethod: "Collect",
    fee: 20,
    timeline: [
      { date: "2024-12-28 11:00", action: "Request submitted", by: "You", type: "created" },
      { date: "2024-12-28 11:01", action: "Payment of $20.00 received", by: "System", type: "info" },
      { date: "2024-12-30 09:00", action: "Academic records verified", by: "Registrar", type: "progress" },
      { date: "2025-01-03 14:00", action: "Certificate prepared and signed", by: "Registrar", type: "success" },
      { date: "2025-01-05 10:00", action: "Ready for collection at Admin Block, Room 102", by: "System", type: "info" },
    ],
  },
  {
    id: "doc-005",
    documentType: "Transcript",
    purpose: "Job application at Google",
    status: "Rejected",
    requestedDate: "2024-12-20",
    estimatedDelivery: "2024-12-27",
    copies: 2,
    urgent: false,
    deliveryMethod: "Digital",
    fee: 50,
    timeline: [
      { date: "2024-12-20 13:00", action: "Request submitted", by: "You", type: "created" },
      { date: "2024-12-20 13:01", action: "Payment of $50.00 received", by: "System", type: "info" },
      { date: "2024-12-22 10:00", action: "Rejected: Missing clearance from Library. Please clear dues and reapply.", by: "Admin Office", type: "error" },
    ],
  },
  {
    id: "doc-006",
    documentType: "Degree Certificate",
    purpose: "Employment verification",
    status: "Pending",
    requestedDate: "2025-01-14",
    estimatedDelivery: "2025-01-28",
    copies: 1,
    urgent: false,
    deliveryMethod: "Both",
    fee: 50,
    timeline: [
      { date: "2025-01-14 07:00", action: "Request submitted", by: "You", type: "created" },
      { date: "2025-01-14 07:01", action: "Payment of $50.00 received", by: "System", type: "info" },
    ],
  },
];

interface TimelineEntry {
  date: string;
  action: string;
  by: string;
  type: "created" | "info" | "progress" | "success" | "error";
}

const BULK_PACKAGES = [
  {
    id: "grad",
    name: "Graduation Package",
    desc: "Transcript + Bonafide + Character Certificate + Migration Certificate",
    documents: ["Transcript", "Bonafide", "Character", "Migration"],
    fee: 55,
    icon: Award,
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "job",
    name: "Job Application Package",
    desc: "Transcript + Bonafide + Character Certificate",
    documents: ["Transcript", "Bonafide", "Character"],
    fee: 40,
    icon: BookOpen,
    color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  },
  {
    id: "study",
    name: "Study Abroad Package",
    desc: "Transcript + Migration Certificate + Bonafide",
    documents: ["Transcript", "Migration", "Bonafide"],
    fee: 45,
    icon: FileText,
    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  },
];

// ---------- Status config ----------

const statusConfig: Record<string, { className: string }> = {
  Pending: { className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  Processing: { className: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  Approved: { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  Rejected: { className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  Ready: { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

// ---------- Component ----------

export function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: "",
    purpose: "",
    copies: "1",
    urgent: false,
    deliveryMethod: "Collect",
  });

  const filteredDocs = useMemo(() => {
    return MOCK_DOCUMENTS.filter((doc) => {
      const matchesSearch =
        !searchQuery ||
        doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.purpose.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "ready" ? doc.status === "Ready" : doc.status === activeTab);
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const counts = useMemo(() => ({
    total: MOCK_DOCUMENTS.length,
    pending: MOCK_DOCUMENTS.filter((d) => d.status === "Pending").length,
    approved: MOCK_DOCUMENTS.filter((d) => d.status === "Approved").length,
    ready: MOCK_DOCUMENTS.filter((d) => d.status === "Ready").length,
  }), []);

  function getDocIcon(type: string) {
    return DOCUMENT_TYPES.find((t) => t.label.includes(type) || t.value === type)?.icon ?? FileText;
  }

  function handleBulkRequest(pkgId: string) {
    setBulkDialogOpen(false);
  }

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Request and manage official documents & certificates</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Bulk Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Bulk Document Request</DialogTitle>
                <DialogDescription>Choose a pre-configured document bundle for common use cases.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {BULK_PACKAGES.map((pkg) => {
                  const PkgIcon = pkg.icon;
                  return (
                    <Card key={pkg.id} className="card-premium cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700" onClick={() => handleBulkRequest(pkg.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${pkg.color}`}>
                            <PkgIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold">{pkg.name}</h4>
                              <Badge variant="secondary" className="text-xs">${pkg.fee}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{pkg.desc}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {pkg.documents.map((d) => (
                                <Badge key={d} variant="outline" className="text-[10px]">{d}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={createDialogOpen} onOpenChange={(open) => { setCreateDialogOpen(open); if (!open) setFormData({ type: "", purpose: "", copies: "1", urgent: false, deliveryMethod: "Collect" }); }}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Request Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Request New Document</DialogTitle>
                <DialogDescription>Fill in the details to request an official document.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Document Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((dt) => {
                        const DtIcon = dt.icon;
                        return (
                          <SelectItem key={dt.value} value={dt.value}>
                            <div className="flex items-center gap-2">
                              <DtIcon className="w-3.5 h-3.5" />
                              <span>{dt.label}</span>
                              <span className="text-xs text-muted-foreground">(${dt.fee})</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {formData.type && (
                    <p className="text-xs text-muted-foreground">
                      {DOCUMENT_TYPES.find((d) => d.value === formData.type)?.desc}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Purpose *</Label>
                  <Textarea placeholder="e.g., Graduate school application" value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Number of Copies</Label>
                  <Select value={formData.copies} onValueChange={(v) => setFormData({ ...formData, copies: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "copy" : "copies"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mark as Urgent</Label>
                    <p className="text-xs text-muted-foreground">Expedited processing (additional fees apply)</p>
                  </div>
                  <Switch checked={formData.urgent} onCheckedChange={(checked) => setFormData({ ...formData, urgent: checked })} />
                </div>
                <div className="space-y-3">
                  <Label>Delivery Method</Label>
                  <RadioGroup value={formData.deliveryMethod} onValueChange={(v) => setFormData({ ...formData, deliveryMethod: v })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Collect" id="collect" />
                      <Label htmlFor="collect" className="font-normal">Collect from Admin Office</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Digital" id="digital" />
                      <Label htmlFor="digital" className="font-normal">Digital Download (PDF)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Both" id="both" />
                      <Label htmlFor="both" className="font-normal">Both Physical + Digital</Label>
                    </div>
                  </RadioGroup>
                </div>
                {formData.type && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Fee:</span>
                      <span className="font-semibold">
                        ${(DOCUMENT_TYPES.find((d) => d.value === formData.type)?.fee ?? 0) * Number(formData.copies)}
                        {formData.urgent && <span className="text-xs text-amber-600 ml-1">(+ expedite fee)</span>}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCreateDialogOpen(false)}>
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Requested</p>
                <p className="text-2xl font-bold mt-1">{counts.total}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <FileStack className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold mt-1">{counts.approved}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold mt-1">{counts.pending}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Ready for Pickup</p>
                <p className="text-2xl font-bold mt-1">{counts.ready}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="tabs-smooth">
            <TabsTrigger value="all">All ({counts.total})</TabsTrigger>
            <TabsTrigger value="Pending">Pending ({counts.pending})</TabsTrigger>
            <TabsTrigger value="Approved">Approved ({counts.approved})</TabsTrigger>
            <TabsTrigger value="Ready">Ready ({counts.ready})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 sm:max-w-xs sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by document type or purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Document Cards */}
      {filteredDocs.length === 0 ? (
        <Card className="empty-state">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="empty-state-icon mb-4">
              <FileStack className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">No documents found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => {
            const DocIcon = getDocIcon(doc.documentType);
            const isExpanded = expandedDoc === doc.id;
            return (
              <Card key={doc.id} className="card-premium overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                        <DocIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold">{doc.documentType}</h3>
                          <span className={`badge-gradient text-[11px] font-medium px-2 py-0.5 rounded-full ${statusConfig[doc.status]?.className ?? ""}`}>
                            {doc.status}
                          </span>
                          {doc.urgent && (
                            <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400">
                              <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{doc.purpose}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {doc.requestedDate}
                          </span>
                          <span>{doc.copies} {doc.copies === 1 ? "copy" : "copies"}</span>
                          <span>{doc.deliveryMethod}</span>
                          <span className="font-medium">${doc.fee}</span>
                          {doc.status !== "Rejected" && (
                            <span className="text-muted-foreground">
                              Est. delivery: {doc.estimatedDelivery}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {(doc.status === "Approved" || doc.status === "Ready") && (
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            <Download className="w-3 h-3 mr-1" /> Download
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                        >
                          <CircleDot className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded timeline */}
                  {isExpanded && doc.timeline && (
                    <>
                      <Separator />
                      <div className="p-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Activity Timeline</h4>
                        <div className="space-y-3">
                          {doc.timeline.map((entry, i) => (
                            <div key={i} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
                                  entry.type === "created" ? "bg-emerald-500" :
                                  entry.type === "success" ? "bg-emerald-500" :
                                  entry.type === "error" ? "bg-red-500" :
                                  entry.type === "progress" ? "bg-amber-500" :
                                  "bg-gray-400 dark:bg-gray-500"
                                }`} />
                                {i < doc.timeline!.length - 1 && (
                                  <div className="w-0.5 flex-1 bg-border mt-1" />
                                )}
                              </div>
                              <div className="flex-1 pb-3">
                                <p className="text-sm">{entry.action}</p>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                  <span>{entry.date}</span>
                                  <span>·</span>
                                  <span>{entry.by}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
