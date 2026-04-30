"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppStore } from "@/store/app-store";
import {
  Award,
  Download,
  Share2,
  ShieldCheck,
  Search,
  FileText,
  Star,
  Lock,
  CheckCircle2,
  Plus,
  ExternalLink,
  Eye,
} from "lucide-react";

// ---- Mock Data ----

const certificateTypes = [
  "Course Completion",
  "Merit",
  "Attendance",
  "Dean's List",
  "Sports Achievement",
];

const courses = [
  "Data Structures & Algorithms",
  "Machine Learning",
  "Operating Systems",
  "Database Management",
  "Computer Networks",
  "Software Engineering",
];

interface Certificate {
  id: string;
  title: string;
  type: string;
  issuingAuthority: string;
  dateIssued: string;
  status: "Issued" | "Processing" | "Requested";
  course: string;
  certificateId: string;
  studentName: string;
}

const mockCertificates: Certificate[] = [
  { id: "c1", title: "Advanced Data Structures", type: "Course Completion", issuingAuthority: "Dept. of Computer Science", dateIssued: "2024-12-15", status: "Issued", course: "Data Structures & Algorithms", certificateId: "CERT-2024-001", studentName: "Ryan Patel" },
  { id: "c2", title: "Machine Learning Fundamentals", type: "Merit", issuingAuthority: "Dept. of Computer Science", dateIssued: "2024-11-20", status: "Issued", course: "Machine Learning", certificateId: "CERT-2024-002", studentName: "Ryan Patel" },
  { id: "c3", title: "Perfect Attendance - Sem 6", type: "Attendance", issuingAuthority: "Academic Affairs", dateIssued: "2024-10-30", status: "Issued", course: "All Courses", certificateId: "CERT-2024-003", studentName: "Ryan Patel" },
  { id: "c4", title: "Dean's List - Spring 2024", type: "Dean's List", issuingAuthority: "Office of the Dean", dateIssued: "2024-09-15", status: "Issued", course: "Semester 6", certificateId: "CERT-2024-004", studentName: "Ryan Patel" },
  { id: "c5", title: "Inter-College Basketball", type: "Sports Achievement", issuingAuthority: "Sports Department", dateIssued: "2024-08-20", status: "Issued", course: "Sports", certificateId: "CERT-2024-005", studentName: "Ryan Patel" },
  { id: "c6", title: "Operating Systems Mastery", type: "Course Completion", issuingAuthority: "Dept. of Computer Science", dateIssued: "2025-01-10", status: "Processing", course: "Operating Systems", certificateId: "CERT-2025-001", studentName: "Ryan Patel" },
  { id: "c7", title: "Software Engineering Project", type: "Course Completion", issuingAuthority: "Dept. of Computer Science", dateIssued: "2025-01-20", status: "Processing", course: "Software Engineering", certificateId: "CERT-2025-002", studentName: "Ryan Patel" },
  { id: "c8", title: "Research Excellence Award", type: "Merit", issuingAuthority: "Research Committee", dateIssued: "", status: "Requested", course: "Independent Study", certificateId: "CERT-2025-003", studentName: "Ryan Patel" },
];

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
  icon: string;
}

const mockBadges: BadgeItem[] = [
  { id: "b1", name: "First Dean's List", description: "Achieved Dean's List status for the first time", earned: true, earnedDate: "2024-09-15", icon: "🎓" },
  { id: "b2", name: "100% Attendance", description: "Maintained perfect attendance for an entire semester", earned: true, earnedDate: "2024-10-30", icon: "📋" },
  { id: "b3", name: "Top Scorer", description: "Scored the highest marks in at least one course", earned: true, earnedDate: "2024-11-20", icon: "🏆" },
  { id: "b4", name: "Research Paper Published", description: "Published a paper in a recognized journal or conference", earned: false, icon: "📄" },
  { id: "b5", name: "Hackathon Winner", description: "Won first place in a campus or inter-college hackathon", earned: false, icon: "💻" },
  { id: "b6", name: "Community Service", description: "Completed 50+ hours of community service", earned: true, earnedDate: "2024-08-20", icon: "🤝" },
];

// ---- Helpers ----

function getStatusBadge(status: string) {
  switch (status) {
    case "Issued":
      return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs">Issued</Badge>;
    case "Processing":
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-xs">Processing</Badge>;
    case "Requested":
      return <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-0 text-xs">Requested</Badge>;
    default:
      return null;
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return "Pending";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---- Main Component ----

export function CertificatesPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const currentUser = useAppStore((s) => s.currentUser);

  const [selectedCertType, setSelectedCertType] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState<"success" | "not_found" | "invalid" | null>(null);

  const issuedCount = useMemo(() => mockCertificates.filter((c) => c.status === "Issued").length, []);
  const processingCount = useMemo(() => mockCertificates.filter((c) => c.status === "Processing").length, []);
  const earnedBadgesCount = useMemo(() => mockBadges.filter((b) => b.earned).length, []);

  const handleVerify = () => {
    if (!verifyId.trim()) return;
    if (verifyId.startsWith("CERT-")) {
      const found = mockCertificates.find((c) => c.certificateId === verifyId);
      setVerifyResult(found ? "success" : "not_found");
    } else {
      setVerifyResult("invalid");
    }
  };

  return (
    <div className="page-transition space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Digital Certificates & Badges</h1>
            <p className="text-sm text-muted-foreground">Manage your certificates and achievement badges</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Issued", value: issuedCount, icon: CheckCircle2, color: "bg-emerald-500" },
          { label: "Processing", value: processingCount, icon: FileText, color: "bg-amber-500" },
          { label: "Badges Earned", value: `${earnedBadgesCount}/${mockBadges.length}`, icon: Star, color: "bg-purple-500" },
        ].map((stat) => (
          <Card key={stat.label} className="stat-card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Certificate Request Form */}
      <Card className="card-premium">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" />
            Request Certificate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Certificate Type</Label>
              <Select value={selectedCertType} onValueChange={setSelectedCertType}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {certificateTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" disabled={!selectedCertType || !selectedCourse}>
              <Plus className="w-3.5 h-3.5" /> Submit Request
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My Certificates Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Certificates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockCertificates.map((cert) => (
            <Card key={cert.id} className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold truncate">{cert.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cert.type}</p>
                  </div>
                  {getStatusBadge(cert.status)}
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                  <p className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">Authority:</span> {cert.issuingAuthority}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">Issued:</span> {formatDate(cert.dateIssued)}
                  </p>
                  <p className="flex items-center gap-1.5 font-mono">
                    <span className="font-medium text-foreground">ID:</span> {cert.certificateId}
                  </p>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-1" disabled={cert.status !== "Issued"}>
                    <Download className="w-3 h-3" /> PDF
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-1" disabled={cert.status !== "Issued"}>
                    <Share2 className="w-3 h-3" /> Share
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setPreviewCert(cert)}>
                    <Eye className="w-3 h-3" />
                  </Button>
                  {cert.status === "Issued" && (
                    <div className="ml-auto">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 text-xs" side="top">
                          <p className="font-semibold mb-1">Verified Certificate</p>
                          <p className="text-muted-foreground">This certificate has been digitally signed and verified by the issuing authority.</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Certificate Preview Dialog */}
      <Dialog open={!!previewCert} onOpenChange={() => setPreviewCert(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              Certificate Preview
            </DialogTitle>
          </DialogHeader>
          {previewCert && (
            <div className="border-2 border-double border-emerald-300 dark:border-emerald-700 rounded-xl p-6 sm:p-8 bg-gradient-to-br from-white to-emerald-50/50 dark:from-emerald-950/20 dark:to-card">
              <div className="text-center space-y-4">
                <div className="text-4xl">🎓</div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Greenfield University</p>
                  <h2 className="text-lg font-bold mt-1">Certificate of Achievement</h2>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                <p className="text-sm text-muted-foreground">This is to certify that</p>
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{previewCert.studentName}</h3>
                <p className="text-sm text-muted-foreground">has successfully completed</p>
                <h4 className="text-base font-semibold">{previewCert.title}</h4>
                <p className="text-xs text-muted-foreground">{previewCert.course}</p>
                {previewCert.dateIssued && (
                  <p className="text-xs text-muted-foreground">
                    Issued on {formatDate(previewCert.dateIssued)}
                  </p>
                )}
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                <div className="flex items-center justify-between text-xs">
                  <div className="text-left">
                    <div className="w-32 border-b border-muted-foreground/30 mb-1" />
                    <p className="text-muted-foreground">Dr. Sarah Chen</p>
                    <p className="text-muted-foreground">Dean, Academic Affairs</p>
                  </div>
                  <div className="text-2xl">🏛️</div>
                  <div className="text-right">
                    <div className="w-32 border-b border-muted-foreground/30 mb-1" />
                    <p className="text-muted-foreground">Official Seal</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{previewCert.certificateId}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Digital Badges Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Digital Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockBadges.map((badge) => (
            <Popover key={badge.id}>
              <PopoverTrigger asChild>
                <Card className={`card-hover cursor-pointer ${!badge.earned ? "opacity-50" : ""}`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{badge.earned ? badge.icon : <Lock className="w-8 h-8 mx-auto text-muted-foreground/40" />}</div>
                    <p className="text-xs font-semibold truncate">{badge.name}</p>
                    {badge.earned && badge.earnedDate && (
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDate(badge.earnedDate)}</p>
                    )}
                    {badge.earned && (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px] mt-2">Earned</Badge>
                    )}
                  </CardContent>
                </Card>
              </PopoverTrigger>
              <PopoverContent className="w-56" side="top">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{badge.icon}</span>
                    <p className="text-sm font-semibold">{badge.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  {badge.earned && badge.earnedDate ? (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Earned on {formatDate(badge.earnedDate)}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Not yet earned</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>

      {/* Certificate Verification */}
      <Card className="card-premium">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Certificate Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter certificate ID (e.g., CERT-2024-001)"
                  value={verifyId}
                  onChange={(e) => { setVerifyId(e.target.value); setVerifyResult(null); }}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleVerify}>
              <ShieldCheck className="w-3.5 h-3.5" /> Verify
            </Button>
          </div>
          {verifyResult && (
            <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
              verifyResult === "success"
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}>
              {verifyResult === "success" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Certificate Verified</p>
                    <p className="text-xs opacity-80">This certificate is authentic and digitally signed.</p>
                  </div>
                </>
              ) : verifyResult === "not_found" ? (
                <>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Certificate Not Found</p>
                    <p className="text-xs opacity-80">No certificate found with this ID.</p>
                  </div>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Invalid Format</p>
                    <p className="text-xs opacity-80">Certificate ID should start with &quot;CERT-&quot;.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
