"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/app-store";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Edit3,
  Camera,
  Shield,
  Bell,
  Globe,
  Download,
  Trash2,
  Trophy,
  Star,
  Target,
  Clock,
  ChevronRight,
  CheckCircle2,
  FileEdit,
  CreditCard,
  AlertCircle,
  Heart,
  GraduationCap,
  Lock,
  Eye,
} from "lucide-react";

// ---- Helpers ----

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRelative(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(dateStr);
}

// ---- Mock Activity Data ----

interface ActivityItem {
  id: string;
  type: "assignment" | "grade" | "attendance" | "fee" | "course" | "leave";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
  dotColor: string;
  badgeColor: string;
  badgeLabel: string;
}

const mockActivities: ActivityItem[] = [
  { id: "a1", type: "assignment", title: "Submitted BST Implementation", description: "Data Structures - Assignment 4", timestamp: "2025-06-28T10:30:00", icon: FileEdit, dotColor: "bg-emerald-500", badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0", badgeLabel: "Assignment" },
  { id: "a2", type: "grade", title: "Grade Published: A", description: "Machine Learning Mid-term - 85/100", timestamp: "2025-06-27T14:00:00", icon: Award, dotColor: "bg-amber-500", badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0", badgeLabel: "Grade" },
  { id: "a3", type: "attendance", title: "Present - Data Structures", description: "Lecture 28: Graph Algorithms", timestamp: "2025-06-28T09:00:00", icon: CheckCircle2, dotColor: "bg-teal-500", badgeColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-0", badgeLabel: "Attendance" },
  { id: "a4", type: "fee", title: "Fee Payment Completed", description: "Semester 6 Tuition - $1,250", timestamp: "2025-06-26T11:00:00", icon: CreditCard, dotColor: "bg-green-500", badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0", badgeLabel: "Payment" },
  { id: "a5", type: "course", title: "Enrolled in Course", description: "Advanced Algorithms (CS401)", timestamp: "2025-06-24T08:00:00", icon: BookOpen, dotColor: "bg-purple-500", badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0", badgeLabel: "Enrollment" },
  { id: "a6", type: "leave", title: "Leave Request Approved", description: "Medical Leave - June 15-16", timestamp: "2025-06-14T09:00:00", icon: Calendar, dotColor: "bg-sky-500", badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-0", badgeLabel: "Leave" },
  { id: "a7", type: "assignment", title: "Submitted ER Diagram Project", description: "DBMS - Group Project Phase 2", timestamp: "2025-06-23T16:30:00", icon: FileEdit, dotColor: "bg-emerald-500", badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0", badgeLabel: "Assignment" },
  { id: "a8", type: "grade", title: "Grade Published: A+", description: "Linear Algebra Quiz 5 - 48/50", timestamp: "2025-06-22T13:00:00", icon: Award, dotColor: "bg-amber-500", badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0", badgeLabel: "Grade" },
  { id: "a9", type: "attendance", title: "Late Arrival Noted", description: "Database Management Systems", timestamp: "2025-06-21T11:15:00", icon: AlertCircle, dotColor: "bg-teal-500", badgeColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-0", badgeLabel: "Attendance" },
  { id: "a10", type: "fee", title: "Library Fine Paid", description: "Overdue book return fine - $5", timestamp: "2025-06-20T10:00:00", icon: CreditCard, dotColor: "bg-green-500", badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0", badgeLabel: "Payment" },
  { id: "a11", type: "assignment", title: "Submitted Linear Algebra Problem Set", description: "Eigenvalue Problems - HW 6", timestamp: "2025-06-19T23:55:00", icon: FileEdit, dotColor: "bg-emerald-500", badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0", badgeLabel: "Assignment" },
  { id: "a12", type: "grade", title: "Grade Published: B+", description: "DBMS Mid-term - 72/100", timestamp: "2025-06-18T15:00:00", icon: Award, dotColor: "bg-amber-500", badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0", badgeLabel: "Grade" },
  { id: "a13", type: "course", title: "Dropped Elective Course", description: "Philosophy of Science (PHI201)", timestamp: "2025-06-17T08:30:00", icon: BookOpen, dotColor: "bg-purple-500", badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0", badgeLabel: "Enrollment" },
  { id: "a14", type: "attendance", title: "Present - All Classes", description: "Full day attendance record", timestamp: "2025-06-16T17:00:00", icon: CheckCircle2, dotColor: "bg-teal-500", badgeColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-0", badgeLabel: "Attendance" },
  { id: "a15", type: "leave", title: "Leave Request Submitted", description: "Personal Leave - June 15", timestamp: "2025-06-12T09:00:00", icon: Calendar, dotColor: "bg-sky-500", badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-0", badgeLabel: "Leave" },
  { id: "a16", type: "assignment", title: "Feedback Submitted", description: "Course evaluation for OS (CS301)", timestamp: "2025-06-11T14:00:00", icon: FileEdit, dotColor: "bg-emerald-500", badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0", badgeLabel: "Assignment" },
];

// ---- Mock Achievements ----

interface Achievement {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  dateEarned: string;
  category: string;
  points: number;
}

const mockAchievements: Achievement[] = [
  { id: "ach1", icon: Trophy, title: "Dean's List", description: "Maintained GPA above 3.7 for two consecutive semesters", dateEarned: "2025-05-20", category: "Academic", points: 150 },
  { id: "ach2", icon: CheckCircle2, title: "Perfect Attendance", description: "100% attendance for the entire Fall semester", dateEarned: "2024-12-15", category: "Attendance", points: 100 },
  { id: "ach3", icon: Star, title: "Hackathon Winner", description: "1st place in Greenfield Annual Hackathon 2024", dateEarned: "2024-11-10", category: "Competition", points: 200 },
  { id: "ach4", icon: BookOpen, title: "Research Publication", description: "Co-authored paper accepted in IEEE conference", dateEarned: "2025-03-01", category: "Research", points: 250 },
  { id: "ach5", icon: Heart, title: "Sports Captain", description: "Led the CS department cricket team to victory", dateEarned: "2025-02-14", category: "Sports", points: 120 },
  { id: "ach6", icon: Target, title: "Top Scorer", description: "Highest score in Data Structures midterm exam", dateEarned: "2025-04-05", category: "Academic", points: 130 },
  { id: "ach7", icon: User, title: "Community Service", description: "Completed 50 hours of community volunteering", dateEarned: "2025-01-20", category: "Service", points: 80 },
  { id: "ach8", icon: Award, title: "Leadership Award", description: "Elected as Computer Science Club president", dateEarned: "2024-09-01", category: "Leadership", points: 175 },
];

const activityTypes = [
  { value: "all", label: "All Activity" },
  { value: "assignment", label: "Assignments" },
  { value: "grade", label: "Grades" },
  { value: "attendance", label: "Attendance" },
  { value: "fee", label: "Payments" },
  { value: "course", label: "Courses" },
  { value: "leave", label: "Leave" },
];

// ---- Profile Info Field ----

function InfoField({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

// ---- Main Component ----

export function ProfilePage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [activityFilter, setActivityFilter] = useState("all");
  const [bioText, setBioText] = useState(
    "Passionate computer science student with a keen interest in algorithms, machine learning, and full-stack development. Active member of the CS Club and Hackathon team. Always eager to learn and contribute to open-source projects."
  );
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [notifPrefs, setNotifPrefs] = useState({
    emailNotifs: true,
    pushNotifs: true,
    smsNotifs: false,
    assignmentReminders: true,
    gradeAlerts: true,
    announcementNotifs: true,
  });

  if (!currentUser) return null;

  const initials = getInitials(currentUser.name);
  const roleBadgeColors: Record<string, string> = {
    Student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0",
    Teacher: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-0",
    InstituteAdmin: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0",
    BranchAdmin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0",
    Parent: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-0",
    SuperAdmin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0",
  };

  const filteredActivities = activityFilter === "all"
    ? mockActivities
    : mockActivities.filter((a) => a.type === activityFilter);

  const totalPoints = mockAchievements.reduce((sum, a) => sum + a.points, 0);
  const nextAchievementProgress = 65;

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with upload overlay */}
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full ring-4 ring-emerald-500/30 overflow-hidden">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{currentUser.name}</h1>
                <Badge className={`w-fit ${roleBadgeColors[currentUser.role] ?? ""}`}>
                  {currentUser.role === "SuperAdmin" ? "Super Admin" : currentUser.role}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  +1-555-1001
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {currentUser.instituteName}
                </span>
                {currentUser.branchName && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {currentUser.branchName}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Member since August 2023
              </p>
            </div>

            {/* Edit Button */}
            <Button
              variant={isEditing ? "default" : "outline"}
              className="flex items-center gap-2 flex-shrink-0"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Profile
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs sm:text-sm">Achievements</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
        </TabsList>

        {/* =================== OVERVIEW TAB =================== */}
        <TabsContent value="overview" className="space-y-4">
          {/* Bio */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="min-h-[100px] resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">{bioText}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Personal Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Name</Label>
                      <Input defaultValue={currentUser.name} className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <Input defaultValue={currentUser.email} className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <Input defaultValue="+1-555-1001" className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                      <Input defaultValue="2004-05-15" type="date" className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Gender</Label>
                      <Select defaultValue="Male">
                        <SelectTrigger className="mt-1 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Blood Group</Label>
                      <Select defaultValue="B+">
                        <SelectTrigger className="mt-1 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs text-muted-foreground">Address</Label>
                      <Input defaultValue="42 Oak Street, Springfield" className="mt-1 h-9" />
                    </div>
                  </div>
                ) : (
                  <>
                    <InfoField label="Full Name" value={currentUser.name} icon={User} />
                    <Separator />
                    <InfoField label="Email" value={currentUser.email} icon={Mail} />
                    <Separator />
                    <InfoField label="Phone" value="+1-555-1001" icon={Phone} />
                    <Separator />
                    <InfoField label="Date of Birth" value="May 15, 2004" icon={Calendar} />
                    <Separator />
                    <InfoField label="Gender" value="Male" icon={User} />
                    <Separator />
                    <InfoField label="Address" value="42 Oak Street, Springfield" icon={MapPin} />
                    <Separator />
                    <InfoField label="Blood Group" value="B+" icon={Heart} />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                <InfoField label="Roll Number" value="CS20230101" icon={Target} />
                <Separator />
                <InfoField label="Program" value="B.Tech Computer Science" icon={BookOpen} />
                <Separator />
                <InfoField label="Semester" value="4th Semester" icon={BookOpen} />
                <Separator />
                <InfoField label="Batch" value="CS 2023-27" icon={Calendar} />
                <Separator />
                <InfoField label="Department" value="Computer Science" icon={GraduationCap} />
                <Separator />
                <InfoField label="Section" value="A" icon={User} />
                <Separator />
                <InfoField label="Current GPA" value="3.80 / 4.00" icon={Star} />
                <Separator />
                <InfoField label="Enrollment Year" value="August 2023" icon={Calendar} />
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contact */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Guardian Name</p>
                  <p className="text-sm font-medium mt-0.5">Meera Patel</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium mt-0.5">+1-555-2001</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Relationship</p>
                  <p className="text-sm font-medium mt-0.5">Mother</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================== ACTIVITY TAB =================== */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Activity Timeline
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {activityTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant={activityFilter === type.value ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => setActivityFilter(type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

                <div className="space-y-0">
                  {filteredActivities.map((item) => (
                    <div key={item.id} className="relative flex items-start gap-4 py-3 group">
                      {/* Dot */}
                      <div className={`w-[15px] h-[15px] rounded-full ${item.dotColor} border-4 border-background flex-shrink-0 z-10 mt-0.5`} />

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/50`}>
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium">{item.title}</p>
                            <Badge variant="secondary" className={`text-[10px] ${item.badgeColor}`}>
                              {item.badgeLabel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{formatRelative(item.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredActivities.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No activities found for this filter.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =================== ACHIEVEMENTS TAB =================== */}
        <TabsContent value="achievements" className="space-y-4">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {mockAchievements.length}
                </p>
                <p className="text-xs text-muted-foreground">Achievements</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {totalPoints}
                </p>
                <p className="text-xs text-muted-foreground">Points Earned</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 text-teal-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  #5
                </p>
                <p className="text-xs text-muted-foreground">Rank Among Peers</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress to next achievement */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                Next Achievement Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Scholar of the Year</p>
                  <p className="text-xs text-muted-foreground">Maintain 3.9+ GPA for 3 consecutive semesters</p>
                </div>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{nextAchievementProgress}%</span>
              </div>
              <Progress value={nextAchievementProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1.5">2 out of 3 semesters completed</p>
            </CardContent>
          </Card>

          {/* Achievement Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockAchievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-md transition-shadow group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <achievement.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{achievement.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <Badge variant="outline" className="text-[10px]">{achievement.category}</Badge>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[11px] font-medium">{achievement.points} pts</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">{formatDate(achievement.dateEarned)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* =================== SETTINGS TAB =================== */}
        <TabsContent value="settings" className="space-y-4">
          {/* Profile Visibility */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                Profile Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {["public", "connections", "private"].map((option) => (
                  <Button
                    key={option}
                    variant={profileVisibility === option ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setProfileVisibility(option)}
                  >
                    {option === "public" && <Globe className="w-3 h-3 mr-1" />}
                    {option === "connections" && <User className="w-3 h-3 mr-1" />}
                    {option === "private" && <Lock className="w-3 h-3 mr-1" />}
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {profileVisibility === "public" && "Anyone can view your profile and achievements."}
                {profileVisibility === "connections" && "Only your connections can view your profile."}
                {profileVisibility === "private" && "Only you can view your profile."}
              </p>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "emailNotifs" as const, label: "Email Notifications", desc: "Receive notifications via email" },
                { key: "pushNotifs" as const, label: "Push Notifications", desc: "Browser push notifications" },
                { key: "smsNotifs" as const, label: "SMS Notifications", desc: "Text message alerts for important updates" },
                { key: "assignmentReminders" as const, label: "Assignment Reminders", desc: "Get reminded before assignment deadlines" },
                { key: "gradeAlerts" as const, label: "Grade Alerts", desc: "Notify when grades are published" },
                { key: "announcementNotifs" as const, label: "Announcements", desc: "New announcements from institute" },
              ].map((pref) => (
                <div key={pref.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                  <Switch
                    checked={notifPrefs[pref.key]}
                    onCheckedChange={(checked) =>
                      setNotifPrefs((prev) => ({ ...prev, [pref.key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Theme & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  Theme Preference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  Language Preference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Account Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your account password</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <Download className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">Export Data</p>
                  <p className="text-xs text-muted-foreground">Download your profile and academic data</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </Button>
              <Separator />
              <Button variant="outline" className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800">
                <Trash2 className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-sm font-medium">Deactivate Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
