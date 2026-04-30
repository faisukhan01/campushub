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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockSupportTickets } from "@/lib/mock-data";
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  Search,
  Plus,
  HelpCircle,
  Activity,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Star,
  Paperclip,
  Send,
  Filter,
  Ticket,
  BookOpen,
  Wifi,
  WifiOff,
  Monitor,
  Server,
  Mail,
  ArrowRight,
} from "lucide-react";

// ---------- Mock data ----------

interface TicketMessage {
  id: string;
  sender: string;
  senderRole: string;
  message: string;
  timestamp: string;
  isSupport: boolean;
}

interface SupportTicketExt {
  id: string;
  subject: string;
  category: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "InProgress" | "Resolved" | "Closed";
  createdDate: string;
  updatedDate: string;
  assignee: string;
  assigneeAvatar?: string;
  description: string;
  messages: TicketMessage[];
  resolution?: string;
  resolutionTime?: string;
  satisfaction?: number;
}

const MOCK_TICKETS: SupportTicketExt[] = [
  {
    id: "TKT-1024",
    subject: "Unable to access online library resources",
    category: "Technical",
    priority: "Medium",
    status: "InProgress",
    createdDate: "2025-01-12",
    updatedDate: "2025-01-14",
    assignee: "IT Support Team",
    description: "I'm getting a 403 Forbidden error when trying to access the IEEE Xplore digital library through the campus portal. This has been happening since yesterday.",
    messages: [
      { id: "m1", sender: "Ryan Patel", senderRole: "Student", message: "I'm getting a 403 Forbidden error when trying to access the IEEE Xplore digital library through the campus portal. This has been happening since yesterday.", timestamp: "2025-01-12 09:30", isSupport: false },
      { id: "m2", sender: "IT Support", senderRole: "Support", message: "Hi Ryan, thanks for reporting this. We've identified the issue — the proxy server configuration was updated. Could you try clearing your browser cache and logging in again?", timestamp: "2025-01-12 14:15", isSupport: true },
      { id: "m3", sender: "Ryan Patel", senderRole: "Student", message: "I cleared the cache and tried again. Still getting the same error. I've attached a screenshot of the error page.", timestamp: "2025-01-13 10:00", isSupport: false },
      { id: "m4", sender: "IT Support", senderRole: "Support", message: "Thanks for the screenshot. It looks like your IP wasn't whitelisted after the server migration. We've added it now. Please try again and let us know.", timestamp: "2025-01-14 09:00", isSupport: true },
    ],
  },
  {
    id: "TKT-1025",
    subject: "Grade discrepancy in Linear Algebra midterm",
    category: "Academic",
    priority: "High",
    status: "Open",
    createdDate: "2025-01-13",
    updatedDate: "2025-01-13",
    assignee: "Academic Office",
    description: "My midterm grade for Linear Algebra shows 65 marks but I believe there was an error in evaluating question 3. I should have received full marks.",
    messages: [
      { id: "m1", sender: "Sophia Martinez", senderRole: "Student", message: "My midterm grade for Linear Algebra shows 65 marks but I believe there was an error in evaluating question 3. I used the correct formula and showed all steps.", timestamp: "2025-01-13 11:00", isSupport: false },
    ],
  },
  {
    id: "TKT-1020",
    subject: "Scholarship application status inquiry",
    category: "Fees",
    priority: "Medium",
    status: "Resolved",
    createdDate: "2025-01-08",
    updatedDate: "2025-01-11",
    assignee: "Financial Aid Office",
    description: "Submitted scholarship application 3 weeks ago. Need status update.",
    messages: [
      { id: "m1", sender: "Noah Williams", senderRole: "Student", message: "I submitted my scholarship application 3 weeks ago but haven't received any update.", timestamp: "2025-01-08 08:00", isSupport: false },
      { id: "m2", sender: "Financial Aid", senderRole: "Support", message: "Your application is currently under review by the scholarship committee. Decisions are expected by January 20.", timestamp: "2025-01-09 10:30", isSupport: true },
      { id: "m3", sender: "Noah Williams", senderRole: "Student", message: "Thank you for the update. I'll wait for the notification.", timestamp: "2025-01-09 11:00", isSupport: false },
    ],
    resolution: "Application under review. Applicant notified of expected decision date.",
    resolutionTime: "3 days",
    satisfaction: 4,
  },
  {
    id: "TKT-1018",
    subject: "Cannot reset account password",
    category: "Account",
    priority: "Critical",
    status: "Open",
    createdDate: "2025-01-14",
    updatedDate: "2025-01-14",
    assignee: "Unassigned",
    description: "The password reset link is not being sent to my email. I've checked spam folder and tried multiple times. My account is locked.",
    messages: [
      { id: "m1", sender: "Liam Johnson", senderRole: "Student", message: "URGENT: The password reset link is not being sent to my email. I've checked spam folder and tried multiple times. My account is locked and I have an exam tomorrow.", timestamp: "2025-01-14 07:00", isSupport: false },
    ],
  },
  {
    id: "TKT-1015",
    subject: "Timetable conflict in Spring semester",
    category: "Academic",
    priority: "High",
    status: "InProgress",
    createdDate: "2025-01-10",
    updatedDate: "2025-01-13",
    assignee: "Academic Office",
    description: "Two of my courses are scheduled at the same time on Wednesday: CS401 (10:00-11:30) and MA301 (10:00-11:30).",
    messages: [
      { id: "m1", sender: "Emma Davis", senderRole: "Student", message: "Two of my courses are scheduled at the same time on Wednesday: CS401 Database Systems (10:00-11:30) and MA301 Probability & Statistics (10:00-11:30). Please help resolve this.", timestamp: "2025-01-10 09:00", isSupport: false },
      { id: "m2", sender: "Academic Office", senderRole: "Support", message: "We've noted the conflict. The timetable committee is reviewing section swaps. We'll have an update by end of this week.", timestamp: "2025-01-11 15:00", isSupport: true },
    ],
  },
  {
    id: "TKT-1010",
    subject: "Fee receipt not generated for last payment",
    category: "Fees",
    priority: "Low",
    status: "Closed",
    createdDate: "2025-01-02",
    updatedDate: "2025-01-05",
    assignee: "Accounts Office",
    description: "Paid fees on Jan 1 but no receipt generated in the portal.",
    messages: [
      { id: "m1", sender: "Olivia Brown", senderRole: "Student", message: "I paid my spring semester fees on January 1st but the receipt hasn't appeared in my fee section.", timestamp: "2025-01-02 14:00", isSupport: false },
      { id: "m2", sender: "Accounts", senderRole: "Support", message: "The receipt has been generated. There was a delay in payment gateway confirmation. Please check your fee section now.", timestamp: "2025-01-03 09:30", isSupport: true },
      { id: "m3", sender: "Olivia Brown", senderRole: "Student", message: "Found it. Thank you!", timestamp: "2025-01-03 10:00", isSupport: false },
    ],
    resolution: "Receipt generated. Payment gateway confirmation delay.",
    resolutionTime: "1 day",
    satisfaction: 5,
  },
  {
    id: "TKT-1022",
    subject: "VPN connection drops during online classes",
    category: "Technical",
    priority: "Medium",
    status: "Resolved",
    createdDate: "2025-01-06",
    updatedDate: "2025-01-09",
    assignee: "IT Support Team",
    description: "Campus VPN keeps disconnecting every 15-20 minutes during online lectures.",
    messages: [
      { id: "m1", sender: "Ava Wilson", senderRole: "Student", message: "The campus VPN keeps disconnecting every 15-20 minutes during online lectures. This is disrupting my classes.", timestamp: "2025-01-06 13:00", isSupport: false },
      { id: "m2", sender: "IT Support", senderRole: "Support", message: "We've pushed an update to the VPN client. Please download the latest version from the IT portal (v3.2.1). This should resolve the disconnection issue.", timestamp: "2025-01-07 11:00", isSupport: true },
      { id: "m3", sender: "Ava Wilson", senderRole: "Student", message: "Updated to v3.2.1 and it's working perfectly now. Thank you!", timestamp: "2025-01-09 16:00", isSupport: false },
    ],
    resolution: "VPN client updated to v3.2.1. Connection stability issue resolved.",
    resolutionTime: "3 days",
    satisfaction: 5,
  },
];

const FAQ_DATA = [
  { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot Password'. Enter your registered email address. You'll receive a reset link within 5 minutes. If you don't receive the email, check your spam folder or contact IT support." },
  { q: "How can I request official documents?", a: "Navigate to the Documents section from the sidebar. Click 'Request Document', select the document type, fill in the purpose, choose delivery method, and submit. Processing typically takes 3-5 business days." },
  { q: "How do I check my attendance records?", a: "Go to the Attendance page from the sidebar. You'll see your overall attendance percentage, course-wise breakdown, and a visual calendar. Attendance is updated within 24 hours of each class." },
  { q: "What should I do if I find a grading error?", a: "First, check your detailed grade breakdown on the Grades page. If you still believe there's an error, submit a support ticket under 'Academic' category with 'High' priority. Include the course name, assessment name, and the specific concern." },
  { q: "How do I apply for a leave of absence?", a: "Go to the Leave Request page and click 'New Leave Request'. Select the leave type, choose your dates, provide a reason, and attach any supporting documents. Your request will be reviewed by your faculty advisor." },
  { q: "How can I contact my course instructor?", a: "Use the Messages feature to send a direct message to your instructor. You can also find instructor office hours listed on the course page. For urgent matters, use the Help Center to create a ticket." },
  { q: "Is there a mobile app for CampusHub?", a: "Yes, CampusHub is available as a Progressive Web App (PWA). You can install it on your mobile device by accessing the campus portal from your phone's browser and tapping 'Add to Home Screen'." },
  { q: "How do I enroll in a new course?", a: "Course enrollment is handled during the registration period. Navigate to Courses page, find the course you want to enroll in, and click 'Enroll'. Note: some courses may require advisor approval or prerequisites." },
  { q: "What payment methods are accepted for fees?", a: "We accept credit/debit cards, net banking, UPI, and campus wallet payments. All transactions are secured with bank-grade encryption. Fee payment receipts are available immediately after successful payment." },
  { q: "How do I report a technical issue?", a: "Go to Help Center and click 'New Ticket'. Select 'Technical' category, choose the appropriate priority (use 'Critical' for access issues), and describe the problem in detail including steps to reproduce and any error messages." },
];

const SYSTEM_STATUS = [
  { name: "API Services", status: "Operational", icon: Server, uptime: "99.98%", color: "bg-emerald-500" },
  { name: "Database", status: "Operational", icon: Monitor, uptime: "99.95%", color: "bg-emerald-500" },
  { name: "Email Service", status: "Degraded", icon: Mail, uptime: "97.2%", color: "bg-amber-500" },
  { name: "VPN", status: "Operational", icon: Wifi, uptime: "99.90%", color: "bg-emerald-500" },
];

// ---------- Config ----------

const statusConfig: Record<string, { className: string }> = {
  Open: { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  InProgress: { className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  Resolved: { className: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
  Closed: { className: "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-400" },
};

const priorityConfig: Record<string, { className: string; dotColor: string }> = {
  Critical: { className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800", dotColor: "bg-red-500" },
  High: { className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800", dotColor: "bg-orange-500" },
  Medium: { className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800", dotColor: "bg-amber-500" },
  Low: { className: "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400 border-gray-200 dark:border-gray-700", dotColor: "bg-gray-400" },
};

const CATEGORIES = ["All", "Technical", "Academic", "Fees", "Account", "Other"];
const PRIORITIES = ["All", "Critical", "High", "Medium", "Low"];
const STATUSES = ["All", "Open", "InProgress", "Resolved", "Closed"];

// ---------- Component ----------

export function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
  });

  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter((ticket) => {
      const matchesSearch =
        !searchQuery ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || ticket.category === categoryFilter;
      const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [searchQuery, categoryFilter, priorityFilter, statusFilter]);

  const stats = useMemo(() => ({
    open: MOCK_TICKETS.filter((t) => t.status === "Open").length,
    inProgress: MOCK_TICKETS.filter((t) => t.status === "InProgress").length,
    resolvedWeek: MOCK_TICKETS.filter((t) => t.status === "Resolved").length,
    avgResolution: "2.3 days",
  }), []);

  function renderStars(count: number) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${s <= count ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help Center & Support</h1>
          <p className="text-muted-foreground">Get help, submit tickets, and browse our knowledge base</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={(open) => { setCreateDialogOpen(open); if (!open) setFormData({ subject: "", category: "", priority: "", description: "" }); }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>Describe your issue and our team will get back to you promptly.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input placeholder="Brief summary of your issue" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Fees">Fees</SelectItem>
                      <SelectItem value="Account">Account</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  placeholder="Describe your issue in detail. Include any steps to reproduce the problem, error messages, and screenshots if applicable."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Attachments (optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer">
                  <Paperclip className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCreateDialogOpen(false)}>
                Submit Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-premium cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
          <CardContent className="p-4 flex items-center gap-3" onClick={() => setCreateDialogOpen(true)}>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">Create Ticket</p>
              <p className="text-xs text-muted-foreground">Submit a new request</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
          <CardContent className="p-4 flex items-center gap-3" onClick={() => {
            const faqSection = document.getElementById("faq-section");
            faqSection?.scrollIntoView({ behavior: "smooth" });
          }}>
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">FAQ</p>
              <p className="text-xs text-muted-foreground">Browse common questions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">Live Chat</p>
              <p className="text-xs text-muted-foreground">Chat with support</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
          <CardContent className="p-4 flex items-center gap-3" onClick={() => {
            const statusSection = document.getElementById("system-status");
            statusSection?.scrollIntoView({ behavior: "smooth" });
          }}>
            <div className="w-10 h-10 rounded-lg bg-lime-100 dark:bg-lime-900/50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">System Status</p>
              <p className="text-xs text-muted-foreground">Check service health</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold mt-1">{stats.open}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-gradient">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
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
                <p className="text-xs font-medium text-muted-foreground">Resolved This Week</p>
                <p className="text-2xl font-bold mt-1">{stats.resolvedWeek}</p>
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
                <p className="text-xs font-medium text-muted-foreground">Avg Resolution</p>
                <p className="text-2xl font-bold mt-1">{stats.avgResolution}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <LifeBuoy className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="card-premium" id="system-status">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SYSTEM_STATUS.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <div key={service.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <ServiceIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${service.color}`} />
                      <p className="text-xs font-medium truncate">{service.name}</p>
                    </div>
                    <p className={`text-[10px] mt-0.5 ${
                      service.status === "Operational" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                    }`}>
                      {service.status} · {service.uptime}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets by ID, subject, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]"><Filter className="w-3.5 h-3.5 mr-1 text-muted-foreground" /><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>{p === "All" ? "All Priority" : p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s === "All" ? "All Status" : s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c === "All" ? "All Categories" : c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ticket List */}
      {filteredTickets.length === 0 ? (
        <Card className="empty-state">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="empty-state-icon mb-4">
              <LifeBuoy className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const isExpanded = expandedTicket === ticket.id;
            return (
              <Card key={ticket.id} className="card-premium overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Ticket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                            <h3 className="text-sm font-semibold">{ticket.subject}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{ticket.description}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={`badge-gradient-danger text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityConfig[ticket.priority]?.className ?? ""}`}>
                              <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1 ${priorityConfig[ticket.priority]?.dotColor ?? ""}`} />
                              {ticket.priority}
                            </span>
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{ticket.category}</span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusConfig[ticket.status]?.className ?? ""}`}>
                              {ticket.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {ticket.createdDate}
                            </span>
                            <span>Assigned to: {ticket.assignee}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 sm:self-center">
                        {ticket.messages.length > 0 && (
                          <Badge variant="secondary" className="text-[10px]">{ticket.messages.length} replies</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded ticket detail */}
                  {isExpanded && (
                    <>
                      <Separator />
                      <div className="p-4">
                        {/* Conversation thread */}
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Conversation</h4>
                        <ScrollArea className="max-h-72">
                          <div className="space-y-3">
                            {ticket.messages.map((msg) => (
                              <div key={msg.id} className={`flex gap-3 ${msg.isSupport ? "flex-row-reverse" : ""}`}>
                                <Avatar className="w-7 h-7 flex-shrink-0">
                                  <AvatarFallback className={`text-[10px] font-medium ${
                                    msg.isSupport
                                      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                                      : "bg-muted text-muted-foreground"
                                  }`}>
                                    {msg.sender.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`max-w-[80%] ${msg.isSupport ? "text-right" : ""}`}>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-medium">{msg.sender}</span>
                                    <Badge variant="outline" className="text-[9px] px-1 py-0">{msg.senderRole}</Badge>
                                    <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                                  </div>
                                  <div className={`inline-block rounded-lg px-3 py-2 text-sm ${
                                    msg.isSupport
                                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-foreground"
                                      : "bg-muted"
                                  }`}>
                                    {msg.message}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>

                        {/* Reply input */}
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                          <Input placeholder="Type your reply..." className="flex-1" />
                          <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 w-9">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Resolution info */}
                        {ticket.resolution && (
                          <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
                            <h5 className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Resolution
                            </h5>
                            <p className="text-sm">{ticket.resolution}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>Resolved in: {ticket.resolutionTime}</span>
                              {ticket.satisfaction && (
                                <div className="flex items-center gap-1">
                                  <span>Satisfaction:</span>
                                  {renderStars(ticket.satisfaction)}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Knowledge Base FAQ */}
      <Card className="card-premium" id="faq-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Knowledge Base
          </CardTitle>
          <p className="text-sm text-muted-foreground">Frequently asked questions and helpful resources</p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_DATA.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left hover:no-underline hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
