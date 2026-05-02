"use client";

import { useAppStore } from "@/store/app-store";
import { TeacherDashboard } from "./teacher-dashboard";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Calendar,
  FileEdit,
  CreditCard,
  MessageSquare,
  Clock,
  GraduationCap,
  BookOpen,
  Beaker,
  Atom,
  FlaskConical,
  Star,
  Globe,
  Monitor,
  Languages,
  Building2,
  Shield,
  Users,
  PenTool,
  BarChart3,
} from "lucide-react";

// ---- Animation Variants ----

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// ---- Mock Data ----

const overallAttendance = 87;

const upcomingExams = [
  { subject: "Mathematics", type: "Mid-term", date: "Mar 15, 2025", daysLeft: 5 },
  { subject: "Physics", type: "Quiz", date: "Mar 12, 2025", daysLeft: 2 },
  { subject: "English", type: "Final", date: "Mar 25, 2025", daysLeft: 15 },
  { subject: "Chemistry", type: "Quiz", date: "Mar 10, 2025", daysLeft: 0 },
];

const subjects = [
  { name: "English", icon: Languages, color: "bg-blue-500", teacher: "Ms. Fatima Noor", attendance: 92, grade: "A" },
  { name: "Mathematics", icon: CalculatorIcon, color: "bg-emerald-500", teacher: "Mr. Ahmed Khan", attendance: 85, grade: "A-" },
  { name: "Physics", icon: Atom, color: "bg-purple-500", teacher: "Mr. Tariq Malik", attendance: 78, grade: "B+" },
  { name: "Chemistry", icon: FlaskConical, color: "bg-amber-500", teacher: "Dr. Sana Ali", attendance: 90, grade: "A" },
  { name: "Biology", icon: Beaker, color: "bg-rose-500", teacher: "Ms. Hina Raza", attendance: 88, grade: "A-" },
  { name: "Islamiat", icon: Star, color: "bg-teal-500", teacher: "Mr. Imran Shah", attendance: 95, grade: "A+" },
  { name: "Quran", icon: BookOpen, color: "bg-emerald-600", teacher: "Qari Bilal Ahmad", attendance: 97, grade: "A+" },
  { name: "Pakistan Studies", icon: Globe, color: "bg-orange-500", teacher: "Ms. Nadia Hussain", attendance: 82, grade: "B+" },
  { name: "Computer Science", icon: Monitor, color: "bg-cyan-500", teacher: "Mr. Usman Tariq", attendance: 91, grade: "A" },
  { name: "Urdu", icon: PenTool, color: "bg-pink-500", teacher: "Ms. Samina Akhtar", attendance: 86, grade: "A-" },
];

function CalculatorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <line x1="8" x2="8" y1="10" y2="10" />
      <line x1="12" x2="12" y1="10" y2="10" />
      <line x1="16" x2="16" y1="10" y2="10" />
      <line x1="8" x2="8" y1="14" y2="14" />
      <line x1="12" x2="12" y1="14" y2="14" />
      <line x1="8" x2="8" y1="18" y2="18" />
      <line x1="12" x2="12" y1="18" y2="18" />
    </svg>
  );
}

// ---- Helpers ----

function getAttendanceCircleColor(rate: number) {
  if (rate >= 75) return "text-emerald-500";
  return "text-amber-500";
}

function getAttendanceCircleTrack(rate: number) {
  if (rate >= 75) return "stroke-emerald-200 dark:stroke-emerald-800";
  return "stroke-amber-200 dark:stroke-amber-800";
}

function getDaysLeftBadge(daysLeft: number) {
  if (daysLeft <= 0) {
    return <Badge variant="destructive" className="text-[10px] font-semibold">Today</Badge>;
  }
  if (daysLeft <= 3) {
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 text-[10px] font-semibold">
        {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
      </Badge>
    );
  }
  if (daysLeft <= 7) {
    return (
      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-[10px] font-semibold">
        {daysLeft} days left
      </Badge>
    );
  }
  return (
    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px] font-semibold">
      {daysLeft} days left
    </Badge>
  );
}

function getSubjectAttendanceColor(rate: number) {
  if (rate >= 85) return "bg-emerald-500";
  if (rate >= 75) return "bg-amber-500";
  return "bg-red-500";
}

// ---- Sub-Components ----

function AttendanceCircle({ percentage }: { percentage: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const circleColor = getAttendanceCircleColor(percentage);
  const trackColor = getAttendanceCircleTrack(percentage);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44 sm:w-52 sm:h-52">
        <svg className="w-44 h-44 sm:w-52 sm:h-52 -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            strokeWidth="10"
            className={cn("opacity-50", trackColor)}
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-1000 ease-out", circleColor)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl sm:text-5xl font-bold tracking-tight", circleColor)}>
            {percentage}%
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium mt-3">Overall Attendance</p>
    </div>
  );
}

function ExamCard({
  subject,
  type,
  date,
  daysLeft,
  index,
}: {
  subject: string;
  type: string;
  date: string;
  daysLeft: number;
  index: number;
}) {
  const borderColor =
    daysLeft <= 3
      ? "border-l-red-500"
      : daysLeft <= 7
        ? "border-l-amber-500"
        : "border-l-emerald-500";

  return (
    <motion.div custom={index} variants={fadeInUp} initial="hidden" animate="visible">
      <Card className={cn("border-l-4", borderColor, "hover:shadow-md transition-shadow")}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{subject}</p>
              <Badge variant="outline" className="text-[10px] mt-1 font-medium">
                {type}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {date}
              </p>
            </div>
            <div className="flex-shrink-0">{getDaysLeftBadge(daysLeft)}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SubjectCard({
  subject,
  index,
}: {
  subject: (typeof subjects)[number];
  index: number;
}) {
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const IconComp = subject.icon;
  const barColor = getSubjectAttendanceColor(subject.attendance);

  return (
    <motion.div custom={index} variants={fadeInUp} initial="hidden" animate="visible">
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer group"
        onClick={() => setCurrentPage("courses")}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white",
                subject.color
              )}
            >
              <IconComp className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {subject.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                {subject.teacher}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="text-[11px] font-bold flex-shrink-0 px-1.5"
            >
              {subject.grade}
            </Badge>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">Attendance</span>
              <span className="text-[10px] font-medium">{subject.attendance}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", barColor)}
                style={{ width: `${subject.attendance}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="flex flex-col items-center gap-2 h-auto py-3 px-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
      onClick={onClick}
    >
      <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
    </Button>
  );
}

// ---- Placeholder Dashboard for other roles ----

function RolePlaceholder({ role }: { role: string }) {
  const roleDescriptions: Record<string, { icon: React.ElementType; color: string; stats: { label: string; value: string }[] }> = {
    Teacher: {
      icon: GraduationCap,
      color: "text-teal-500",
      stats: [
        { label: "My Courses", value: "6" },
        { label: "Total Students", value: "142" },
        { label: "Today's Classes", value: "4" },
        { label: "Pending Grades", value: "23" },
      ],
    },
    SuperAdmin: {
      icon: Shield,
      color: "text-emerald-500",
      stats: [
        { label: "Total Institutes", value: "12" },
        { label: "Total Branches", value: "34" },
        { label: "Active Users", value: "2,847" },
        { label: "Monthly Revenue", value: "$48,200" },
      ],
    },
    InstituteAdmin: {
      icon: Building2,
      color: "text-emerald-500",
      stats: [
        { label: "Branches", value: "5" },
        { label: "Total Students", value: "1,240" },
        { label: "Faculty", value: "86" },
        { label: "Active Courses", value: "120" },
      ],
    },
    BranchAdmin: {
      icon: Users,
      color: "text-teal-500",
      stats: [
        { label: "Students", value: "480" },
        { label: "Faculty", value: "28" },
        { label: "Batches", value: "12" },
        { label: "Courses", value: "45" },
      ],
    },
  };

  const config = roleDescriptions[role] ?? {
    icon: Shield,
    color: "text-emerald-500",
    stats: [],
  };
  const RoleIcon = config.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {role} Dashboard
          </h1>
          <p className="text-muted-foreground">
            Your {role.toLowerCase()} dashboard is being prepared.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {config.stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <RoleIcon className={cn("w-8 h-8", config.color)} />
          </div>
          <h3 className="text-lg font-semibold">{role} Dashboard</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md text-center">
            A comprehensive {role.toLowerCase()} dashboard with analytics, reports, and management tools is coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Main Component ----

export function DashboardPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);

  if (!currentUser) return null;

  if (currentUser.role === "Teacher") {
    return <TeacherDashboard />;
  }

  if (currentUser.role === "Student") {
    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, {currentUser.name?.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground text-sm">
                Here&apos;s your academic overview for today.
              </p>
            </div>
            <Badge variant="outline" className="w-fit gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
              Student Portal
            </Badge>
          </div>
        </motion.div>

        {/* Section 1: Attendance Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="py-8 px-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              <AttendanceCircle percentage={overallAttendance} />
              <div className="flex-1 w-full space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Semester Performance</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Keep up the good work! Your attendance is above the required 75% minimum.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[11px] text-muted-foreground">Current GPA</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">3.72</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[11px] text-muted-foreground">Enrolled Courses</p>
                    <p className="text-xl font-bold text-teal-600 dark:text-teal-400">10</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[11px] text-muted-foreground">Pending Fees</p>
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">PKR 12K</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 2: Upcoming Exams & Quizzes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              Upcoming Exams &amp; Quizzes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingExams.map((exam, i) => (
              <ExamCard
                key={exam.subject + exam.type}
                subject={exam.subject}
                type={exam.type}
                date={exam.date}
                daysLeft={exam.daysLeft}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Section 3: Subject Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              My Subjects
            </h2>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {subjects.map((subject, i) => (
              <SubjectCard key={subject.name} subject={subject} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Section 4: Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              Quick Actions
            </h2>
          </div>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <QuickActionButton
              icon={Calendar}
              label="View Timetable"
              onClick={() => setCurrentPage("timetable")}
            />
            <QuickActionButton
              icon={FileEdit}
              label="Submit Assignment"
              onClick={() => setCurrentPage("assignments")}
            />
            <QuickActionButton
              icon={CreditCard}
              label="Check Fees"
              onClick={() => setCurrentPage("fees")}
            />
            <QuickActionButton
              icon={MessageSquare}
              label="Messages"
              onClick={() => setCurrentPage("announcements")}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  // ---- Placeholder for all other roles ----
  return <RolePlaceholder role={currentUser.role} />;
}
