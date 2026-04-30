"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Bell,
  Check,
  CheckCheck,
  Pin,
  PinOff,
  Trash2,
  BookOpen,
  CreditCard,
  Settings,
  Users,
  Megaphone,
  AlertCircle,
  Inbox,
  Filter,
  Clock,
  ChevronDown,
  ChevronUp,
  Mail,
  Calendar,
} from "lucide-react";

// ---- Types ----

type NotifCategory = "all" | "academic" | "financial" | "system" | "social";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: "academic" | "financial" | "system" | "social";
  isRead: boolean;
  isPinned: boolean;
  timestamp: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  fullContent?: string;
}

// ---- Category Config ----

const categoryConfig: Record<
  string,
  { icon: React.ElementType; label: string; color: string; bg: string }
> = {
  all: {
    icon: Inbox,
    label: "All",
    color: "text-muted-foreground",
    bg: "bg-muted/50",
  },
  academic: {
    icon: BookOpen,
    label: "Academic",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  financial: {
    icon: CreditCard,
    label: "Financial",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  system: {
    icon: Settings,
    label: "System",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-100 dark:bg-sky-900/30",
  },
  social: {
    icon: Users,
    label: "Social",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
};

// ---- Mock Notifications (20+) ----

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Grade Published: Machine Learning",
    description: "Your grade for ML Mid-term has been published. You scored 85/100.",
    category: "academic",
    isRead: false,
    isPinned: true,
    timestamp: "2 min ago",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    fullContent:
      "Your Machine Learning Mid-term Exam grade has been published. You scored 85 out of 100 marks (Grade: A). Class average was 72. Your performance is in the top 20% of the class.\n\nDetailed breakdown:\n- Multiple Choice: 18/20\n- Short Answer: 28/30\n- Problem Solving: 22/25\n- Coding: 17/25\n\nKeep up the good work!",
  },
  {
    id: "n2",
    title: "Fee Reminder: Semester 6 Tuition",
    description: "Your tuition fee of $2,500 is due by January 31, 2025.",
    category: "financial",
    isRead: false,
    isPinned: false,
    timestamp: "1 hour ago",
    icon: CreditCard,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    fullContent:
      "Payment Reminder: Your Semester 6 tuition fee of $2,500 is due by January 31, 2025. Current status: Pending.\n\nPayment Methods:\n- Online Bank Transfer\n- Credit/Debit Card\n- UPI Payment\n\nLate payment fee of $50 will be charged after the due date.",
  },
  {
    id: "n3",
    title: "Assignment Deadline Tomorrow",
    description:
      "Data Structures Assignment 4 is due tomorrow at 11:59 PM.",
    category: "academic",
    isRead: false,
    isPinned: false,
    timestamp: "3 hours ago",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    fullContent:
      "Reminder: Data Structures Assignment 4 'Graph Traversal Algorithms' is due tomorrow, January 20, 2025 at 11:59 PM.\n\nRequirements:\n- Implement BFS and DFS algorithms\n- Time complexity analysis\n- Submit as a single PDF file\n\nMaximum marks: 100 | Late submissions accepted with 5% penalty per hour.",
  },
  {
    id: "n4",
    title: "New Message from Prof. Rodriguez",
    description: "Please come to office hours tomorrow at 3 PM.",
    category: "social",
    isRead: true,
    isPinned: false,
    timestamp: "5 hours ago",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    fullContent:
      "From: Prof. Emily Rodriguez (CS201 - Data Structures)\n\nHi Ryan,\n\nI'd like to discuss your project proposal during office hours tomorrow at 3 PM. Please bring your initial design document.\n\nBest regards,\nProf. Rodriguez",
  },
  {
    id: "n5",
    title: "System Maintenance Scheduled",
    description: "CampusHub will undergo maintenance on Jan 22 from 2-4 AM.",
    category: "system",
    isRead: true,
    isPinned: false,
    timestamp: "8 hours ago",
    icon: Settings,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-100 dark:bg-sky-900/30",
    fullContent:
      "Scheduled Maintenance Notice:\n\nCampusHub will undergo system maintenance on January 22, 2025 from 2:00 AM to 4:00 AM (EST). During this time, the system will be unavailable.\n\nWhat to expect:\n- Improved loading times\n- Bug fixes\n- New features for the Resource Library\n\nWe apologize for any inconvenience.",
  },
  {
    id: "n6",
    title: "Attendance Alert: Low Attendance",
    description:
      "Your attendance in Operating Systems has dropped to 72%.",
    category: "academic",
    isRead: false,
    isPinned: true,
    timestamp: "1 day ago",
    icon: AlertCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
    fullContent:
      "Attendance Alert: Your attendance in CS203 - Operating Systems has dropped to 72%, which is below the required 75% minimum.\n\nClasses missed: 4 out of 14\nImpact: You may be barred from the final exam if attendance drops below 65%.\n\nAction required: Please ensure regular attendance in upcoming classes. Contact your course instructor if you have valid reasons for absence.",
  },
  {
    id: "n7",
    title: "Scholarship Application Open",
    description:
      "Apply for the Merit Scholarship before February 15, 2025.",
    category: "financial",
    isRead: true,
    isPinned: false,
    timestamp: "2 days ago",
    icon: CreditCard,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    fullContent:
      "Merit Scholarship Application is now open!\n\nEligibility:\n- CGPA 3.5 or above\n- Minimum 90% attendance\n- Active in extracurriculars\n\nScholarship Amount: Up to $5,000\nDeadline: February 15, 2025\n\nApply through the Student Portal > Financial Aid section.",
  },
  {
    id: "n8",
    title: "New Announcement: Tech Fest",
    description: "Annual Tech Fest 2025 registrations are now open!",
    category: "social",
    isRead: true,
    isPinned: false,
    timestamp: "3 days ago",
    icon: Megaphone,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    fullContent:
      "Annual Tech Fest 2025!\n\nDates: February 10-12, 2025\nLocation: Main Auditorium\n\nEvents:\n- Hackathon (24 hrs)\n- Coding Challenge\n- Quiz Competition\n- Project Exhibition\n- AI/ML Workshop\n\nRegister now! Limited spots available for each event.",
  },
  {
    id: "n9",
    title: "Course Registration Opens",
    description: "Semester 7 course registration opens on Feb 1.",
    category: "academic",
    isRead: true,
    isPinned: false,
    timestamp: "4 days ago",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    fullContent:
      "Course Registration for Semester 7 opens on February 1, 2025 at 10:00 AM.\n\nImportant:\n- Check your degree audit before registering\n- Maximum 21 credits allowed\n- Priority registration based on CGPA\n- Waitlist available for full sections\n\nAdvising appointment recommended before registration.",
  },
  {
    id: "n10",
    title: "Password Changed Successfully",
    description: "Your CampusHub password was changed successfully.",
    category: "system",
    isRead: true,
    isPinned: false,
    timestamp: "5 days ago",
    icon: Settings,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-100 dark:bg-sky-900/30",
    fullContent:
      "Your CampusHub account password was changed successfully on January 12, 2025 at 3:45 PM.\n\nIf you did not make this change, please contact IT Support immediately.\n\nIT Support: support@campus.edu | Ext. 1234",
  },
  {
    id: "n11",
    title: "Library Book Due Soon",
    description:
      "Your borrowed book 'Introduction to Algorithms' is due in 3 days.",
    category: "academic",
    isRead: false,
    isPinned: false,
    timestamp: "5 days ago",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    fullContent:
      "Library Reminder: The book 'Introduction to Algorithms' (ISBN: 978-0-262-03384-8) borrowed on January 5, 2025 is due on January 18, 2025.\n\nReturn it to the Main Library front desk or renew online through the library portal.\nLate fee: $1 per day.",
  },
  {
    id: "n12",
    title: "Fee Payment Confirmed",
    description:
      "Your payment of $1,250 for Semester 5 fees has been confirmed.",
    category: "financial",
    isRead: true,
    isPinned: false,
    timestamp: "1 week ago",
    icon: CreditCard,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    fullContent:
      "Payment Confirmation: Your payment of $1,250 for Semester 5 tuition fees has been confirmed.\n\nTransaction ID: TXN-2025-0112-ABCD\nMethod: Online Bank Transfer\nDate: January 10, 2025\n\nReceipt available in Fee Payments > Payment History.",
  },
  {
    id: "n13",
    title: "Group Study Session Invite",
    description:
      "You've been invited to a study group for Database Systems on Saturday.",
    category: "social",
    isRead: false,
    isPinned: false,
    timestamp: "1 week ago",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    fullContent:
      "Study Group Invitation\n\nTopic: Database Systems - Normalization & ER Diagrams\nDate: Saturday, January 25, 2025\nTime: 2:00 PM - 5:00 PM\nLocation: Library Study Room B3\n\nOrganized by: Priya Sharma\nMembers: 5/8 spots filled\n\nRSVP by Thursday to confirm your spot.",
  },
  {
    id: "n14",
    title: "New Course Material Uploaded",
    description:
      "Prof. Chen uploaded new lecture slides for Computer Networks.",
    category: "academic",
    isRead: true,
    isPinned: false,
    timestamp: "1 week ago",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    fullContent:
      "New Course Material Available\n\nCourse: CS205 - Computer Networks\nInstructor: Prof. David Chen\n\nUploaded: Lecture 14 - Transport Layer Protocols\n- TCP vs UDP Comparison\n- Flow Control & Congestion Control\n- Sliding Window Protocol\n\nAccess via: My Courses > Computer Networks > Resources",
  },
  {
    id: "n15",
    title: "Exam Schedule Published",
    description:
      "End-semester exam schedule for Spring 2025 has been published.",
    category: "academic",
    isRead: false,
    isPinned: true,
    timestamp: "1 week ago",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    fullContent:
      "End-Semester Exam Schedule - Spring 2025\n\nYour upcoming exams:\n1. CS201 Data Structures - Feb 15, 9:00 AM\n2. CS203 Operating Systems - Feb 18, 2:00 PM\n3. CS205 Computer Networks - Feb 21, 9:00 AM\n4. CS207 Database Systems - Feb 24, 2:00 PM\n5. CS209 Software Engineering - Feb 27, 9:00 AM\n\nAll exams will be held in the Main Examination Hall.\nCarry your student ID card.",
  },
  {
    id: "n16",
    title: "Refund Processed",
    description:
      "Your library deposit refund of $50 has been processed.",
    category: "financial",
    isRead: true,
    isPinned: false,
    timestamp: "2 weeks ago",
    icon: CreditCard,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    fullContent:
      "Refund Confirmation\n\nA refund of $50.00 has been processed to your original payment method.\n\nReason: Library deposit return\nReference: REF-2025-0089\nProcessing time: 3-5 business days\n\nContact the Finance Office if you have any questions.",
  },
  {
    id: "n17",
    title: "Security Alert: New Login Detected",
    description:
      "A new login to your account was detected from a new device.",
    category: "system",
    isRead: false,
    isPinned: false,
    timestamp: "2 weeks ago",
    icon: AlertCircle,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-100 dark:bg-sky-900/30",
    fullContent:
      "Security Alert\n\nA new login was detected on your CampusHub account.\n\nDevice: Chrome on Windows\nLocation: Campus Wi-Fi - Building A\nTime: January 6, 2025 at 10:30 AM\n\nIf this was you, no action is needed. If not, please change your password immediately and contact IT Support.",
  },
  {
    id: "n18",
    title: "Campus Event: Career Fair",
    description:
      "Annual Career Fair with 50+ companies participating next month.",
    category: "social",
    isRead: true,
    isPinned: false,
    timestamp: "2 weeks ago",
    icon: Megaphone,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    fullContent:
      "Annual Career Fair 2025\n\nDate: February 20, 2025\nTime: 10:00 AM - 4:00 PM\nLocation: Main Convention Center\n\nParticipating Companies: 50+\nSectors: Tech, Finance, Consulting, Healthcare, Manufacturing\n\nPreparation tips:\n- Update your resume\n- Prepare a 30-second elevator pitch\n- Research companies of interest\n- Dress professionally\n\nFree professional headshots available!",
  },
  {
    id: "n19",
    title: "Lab Session Rescheduled",
    description:
      "OS Lab session moved from Wednesday to Thursday this week.",
    category: "academic",
    isRead: true,
    isPinned: false,
    timestamp: "2 weeks ago",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    fullContent:
      "Lab Session Reschedule Notice\n\nCourse: CS203L - Operating Systems Lab\nOriginal: Wednesday, January 15, 2:00 PM\nNew: Thursday, January 16, 10:00 AM\nLab Room: CS Lab 2\n\nTopic: Process Scheduling Simulation\nPlease update your calendar accordingly.",
  },
  {
    id: "n20",
    title: "Hostel Fee Reminder",
    description:
      "Your hostel fees for the current quarter are due by February 5.",
    category: "financial",
    isRead: false,
    isPinned: false,
    timestamp: "3 weeks ago",
    icon: CreditCard,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    fullContent:
      "Hostel Fee Reminder\n\nQuarter: Q4 2024-2025 (January - March)\nAmount Due: $800\nDue Date: February 5, 2025\n\nRoom: Block A, Room 312\nIncludes: Accommodation, Electricity, Water, Wi-Fi\n\nPay through: Student Portal > Fee Payments > Hostel Fees",
  },
  {
    id: "n21",
    title: "Account Privacy Settings Updated",
    description:
      "Your profile visibility has been changed to 'Campus Only'.",
    category: "system",
    isRead: true,
    isPinned: false,
    timestamp: "3 weeks ago",
    icon: Settings,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-100 dark:bg-sky-900/30",
    fullContent:
      "Privacy Settings Updated\n\nYour profile visibility has been changed to 'Campus Only'. This means your profile will only be visible to registered students and staff of Greenfield Education Group.\n\nChanges effective immediately. You can update this in Settings > Privacy.\n\nUpdated on: December 28, 2024",
  },
  {
    id: "n22",
    title: "Peer Review Assignment",
    description:
      "You've been assigned to peer review 3 submissions for Software Engineering.",
    category: "academic",
    isRead: true,
    isPinned: false,
    timestamp: "3 weeks ago",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    fullContent:
      "Peer Review Assignment\n\nCourse: CS209 - Software Engineering\nAssignment: Project Phase 1 Reviews\n\nYou have been assigned to review:\n1. Team Alpha - E-Commerce Platform\n2. Team Beta - Learning Management System\n3. Team Gamma - Fitness Tracker App\n\nDeadline: January 25, 2025\nUse the provided rubric for evaluation.",
  },
  {
    id: "n23",
    title: "Campus Wi-Fi Maintenance",
    description:
      "Wi-Fi in Building B will be temporarily unavailable this weekend.",
    category: "system",
    isRead: true,
    isPinned: false,
    timestamp: "1 month ago",
    icon: Settings,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-100 dark:bg-sky-900/30",
    fullContent:
      "Wi-Fi Maintenance Notice\n\nLocation: Building B (Engineering Block)\nDate: Saturday, January 11, 2025\nTime: 8:00 AM - 12:00 PM\n\nReason: Router upgrade and bandwidth expansion\nExpected improvement: 2x faster speeds\n\nUse Building A or Library Wi-Fi as alternative during this period.",
  },
  {
    id: "n24",
    title: "Sports Team Tryouts",
    description:
      "Basketball team tryouts are scheduled for next Monday.",
    category: "social",
    isRead: true,
    isPinned: false,
    timestamp: "1 month ago",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    fullContent:
      "Basketball Team Tryouts\n\nDate: Monday, January 20, 2025\nTime: 4:00 PM - 6:00 PM\nLocation: Indoor Sports Complex\n\nRequirements:\n- Valid student ID\n- Athletic wear\n- Own basketball shoes (recommended)\n\nOpen to all students. No prior experience required for the B-team.\nCoach: Mark Thompson",
  },
];

// ---- Main Component ----

export function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [activeCategory, setActiveCategory] = useState<NotifCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [notifPrefs, setNotifPrefs] = useState({
    academic: true,
    financial: true,
    system: true,
    social: true,
    email: true,
    push: true,
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );
  const readCount = useMemo(
    () => notifications.filter((n) => n.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    const filtered =
      activeCategory === "all"
        ? notifications
        : notifications.filter((n) => n.category === activeCategory);
    return [...filtered].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return 0;
    });
  }, [notifications, activeCategory]);

  const visibleNotifications = filteredNotifications.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNotifications.length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const togglePin = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setDeleteTargetId(null);
  };

  const deleteAllRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-500" />
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Stay updated with your academic and campus activities
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={markAllAsRead}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
          {readCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-muted-foreground"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete all read
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete all read notifications?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {readCount} read notification
                    {readCount !== 1 ? "s" : ""}. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={deleteAllRead}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Badge variant="outline" className="w-fit gap-1">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Notifications */}
        <div className="lg:col-span-3">
          {/* Category Tabs */}
          <Tabs
            value={activeCategory}
            onValueChange={(v) => {
              setActiveCategory(v as NotifCategory);
              setVisibleCount(10);
            }}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="gap-1.5">
                <Inbox className="w-3.5 h-3.5" />
                All
                {notifications.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 text-[10px] h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="academic" className="gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Academic
              </TabsTrigger>
              <TabsTrigger value="financial" className="gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                Financial
              </TabsTrigger>
              <TabsTrigger value="system" className="gap-1.5">
                <Settings className="w-3.5 h-3.5" />
                System
              </TabsTrigger>
              <TabsTrigger value="social" className="gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Social
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Notifications List */}
          {visibleNotifications.length > 0 ? (
            <div className="space-y-2">
              {visibleNotifications.map((notif) => {
                const isExpanded = expandedId === notif.id;
                const config = categoryConfig[notif.category];

                return (
                  <Card
                    key={notif.id}
                    className={`transition-shadow hover:shadow-md ${
                      !notif.isRead
                        ? "border-l-4 border-l-emerald-500"
                        : ""
                    } ${notif.isPinned ? "bg-muted/30" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.bg}`}
                        >
                          <notif.icon
                            className={`w-5 h-5 ${notif.color}`}
                          />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3
                                  className={`text-sm truncate ${
                                    !notif.isRead
                                      ? "font-bold"
                                      : "font-medium text-muted-foreground"
                                  }`}
                                >
                                  {notif.title}
                                </h3>
                                {notif.isPinned && (
                                  <Pin className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                )}
                                {!notif.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {notif.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {notif.timestamp}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] gap-1"
                                >
                                  <config.icon className="w-3 h-3" />
                                  {config.label}
                                </Badge>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notif.isRead && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => markAsRead(notif.id)}
                                  title="Mark as read"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => togglePin(notif.id)}
                                title={
                                  notif.isPinned ? "Unpin" : "Pin"
                                }
                              >
                                {notif.isPinned ? (
                                  <PinOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Pin className="w-3.5 h-3.5" />
                                )}
                              </Button>
                              <AlertDialog
                                open={deleteTargetId === notif.id}
                                onOpenChange={(open) =>
                                  !open && setDeleteTargetId(null)
                                }
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                    onClick={() => setDeleteTargetId(notif.id)}
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete this notification?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete &quot;{notif.title}&quot;. This action
                                      cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        deleteNotification(notif.id)
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>

                          {/* Expand/Collapse */}
                          {notif.fullContent && (
                            <div className="mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-xs text-muted-foreground h-7"
                                onClick={() => toggleExpand(notif.id)}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                                {isExpanded ? "Show less" : "Read more"}
                              </Button>
                              {isExpanded && (
                                <div className="mt-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground whitespace-pre-wrap">
                                  {notif.fullContent}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Load More */}
              {hasMore && (
                <div className="text-center pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                    className="gap-2"
                  >
                    Load More ({filteredNotifications.length - visibleCount}{" "}
                    remaining)
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Inbox className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">
                  No notifications
                </h3>
                <p className="text-sm text-muted-foreground">
                  {activeCategory === "all"
                    ? "You're all caught up!"
                    : `No ${categoryConfig[activeCategory]?.label.toLowerCase()} notifications`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-500" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {(
                  ["academic", "financial", "system", "social"] as const
                ).map((cat) => {
                  const config = categoryConfig[cat];
                  const count = notifications.filter(
                    (n) => n.category === cat
                  ).length;
                  const unread = notifications.filter(
                    (n) => n.category === cat && !n.isRead
                  ).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategory === cat
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                      onClick={() => {
                        setActiveCategory(cat);
                        setVisibleCount(10);
                      }}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.bg}`}
                      >
                        <config.icon
                          className={`w-3.5 h-3.5 ${config.color}`}
                        />
                      </div>
                      <span className="flex-1 text-left">
                        {config.label}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px]"
                      >
                        {count}
                      </Badge>
                      {unread > 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-500" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Email Notifications</span>
                </div>
                <Switch
                  checked={notifPrefs.email}
                  onCheckedChange={(v) =>
                    setNotifPrefs({ ...notifPrefs, email: v })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <Switch
                  checked={notifPrefs.push}
                  onCheckedChange={(v) =>
                    setNotifPrefs({ ...notifPrefs, push: v })
                  }
                />
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Category Alerts
              </p>
              {(
                ["academic", "financial", "system", "social"] as const
              ).map((cat) => {
                const config = categoryConfig[cat];
                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <config.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs">{config.label}</span>
                    </div>
                    <Switch
                      checked={notifPrefs[cat]}
                      onCheckedChange={(v) =>
                        setNotifPrefs({ ...notifPrefs, [cat]: v })
                      }
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Recent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-48">
                <div className="space-y-2">
                  {notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center gap-2 py-1.5"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          n.isRead
                            ? "bg-muted-foreground/30"
                            : "bg-emerald-500"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground truncate flex-1">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {n.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
