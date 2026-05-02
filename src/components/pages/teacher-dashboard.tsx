"use client";

import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileUp,
  ChevronDown,
  ChevronUp,
  Award,
  ClipboardCheck,
  Upload,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";

// ── Mock Data ────────────────────────────────────────────────────────────────

const overviewStats = [
  { label: "Today's Classes", value: "5", icon: BookOpen, color: "bg-emerald-500" },
  { label: "Total Students", value: "142", icon: Users, color: "bg-teal-500" },
  { label: "Pending Grading", value: "12", icon: ClipboardList, color: "bg-amber-500" },
  { label: "Avg Attendance", value: "89%", icon: TrendingUp, color: "bg-emerald-600" },
];

interface ClassSection {
  id: string;
  name: string;
  subject: string;
  students: number;
  nextClass: string;
  attendance: number;
  borderColor: string;
  accentBg: string;
  accentText: string;
}

const classSections: ClassSection[] = [
  {
    id: "c10a",
    name: "Class 10-A",
    subject: "Mathematics",
    students: 28,
    nextClass: "Today, 10:00 AM",
    attendance: 92,
    borderColor: "border-l-emerald-500",
    accentBg: "bg-emerald-100 dark:bg-emerald-900/40",
    accentText: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "c10b",
    name: "Class 10-B",
    subject: "Mathematics",
    students: 26,
    nextClass: "Today, 11:30 AM",
    attendance: 87,
    borderColor: "border-l-teal-500",
    accentBg: "bg-teal-100 dark:bg-teal-900/40",
    accentText: "text-teal-700 dark:text-teal-300",
  },
  {
    id: "c9a",
    name: "Class 9-A",
    subject: "Physics",
    students: 24,
    nextClass: "Today, 1:00 PM",
    attendance: 91,
    borderColor: "border-l-cyan-500",
    accentBg: "bg-cyan-100 dark:bg-cyan-900/40",
    accentText: "text-cyan-700 dark:text-cyan-300",
  },
  {
    id: "c9b",
    name: "Class 9-B",
    subject: "Physics",
    students: 22,
    nextClass: "Tomorrow, 9:00 AM",
    attendance: 84,
    borderColor: "border-l-amber-500",
    accentBg: "bg-amber-100 dark:bg-amber-900/40",
    accentText: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "c11a",
    name: "Class 11-A",
    subject: "Advanced Mathematics",
    students: 22,
    nextClass: "Today, 2:30 PM",
    attendance: 95,
    borderColor: "border-l-emerald-600",
    accentBg: "bg-emerald-100 dark:bg-emerald-900/40",
    accentText: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "c11b",
    name: "Class 11-B",
    subject: "Advanced Mathematics",
    students: 20,
    nextClass: "Tomorrow, 11:00 AM",
    attendance: 88,
    borderColor: "border-l-teal-600",
    accentBg: "bg-teal-100 dark:bg-teal-900/40",
    accentText: "text-teal-700 dark:text-teal-300",
  },
];

interface RecentActivity {
  id: string;
  text: string;
  time: string;
  icon: React.ElementType;
  iconColor: string;
}

const recentActivities: RecentActivity[] = [
  {
    id: "a1",
    text: "Graded Assignment #3 for Class 10-A",
    time: "2 hours ago",
    icon: Award,
    iconColor: "text-emerald-500",
  },
  {
    id: "a2",
    text: "Marked attendance for Class 9-B",
    time: "3 hours ago",
    icon: ClipboardCheck,
    iconColor: "text-teal-500",
  },
  {
    id: "a3",
    text: "Uploaded notes for Class 11-A",
    time: "5 hours ago",
    icon: Upload,
    iconColor: "text-cyan-500",
  },
  {
    id: "a4",
    text: "Graded Assignment #2 for Class 10-B",
    time: "1 day ago",
    icon: Award,
    iconColor: "text-emerald-500",
  },
  {
    id: "a5",
    text: "Marked attendance for Class 9-A",
    time: "1 day ago",
    icon: ClipboardCheck,
    iconColor: "text-teal-500",
  },
];

// ── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ── Attendance Color Helper ──────────────────────────────────────────────────

function getAttendanceLabel(rate: number) {
  if (rate >= 90) return { text: "Excellent", classes: "text-emerald-600 dark:text-emerald-400" };
  if (rate >= 80) return { text: "Good", classes: "text-teal-600 dark:text-teal-400" };
  return { text: "Needs Improvement", classes: "text-amber-600 dark:text-amber-400" };
}

// ── Stat Card ────────────────────────────────────────────────────────────────

function OverviewStatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0", color)}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Class Section Card ───────────────────────────────────────────────────────

function ClassSectionCard({ section, index }: { section: ClassSection; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const attendanceInfo = getAttendanceLabel(section.attendance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.07, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 group",
          section.borderColor
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <CardContent className="p-4 sm:p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-base">{section.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{section.subject}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge variant="secondary" className="text-[10px] font-medium">
                <Users className="w-3 h-3 mr-0.5" />
                {section.students}
              </Badge>
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Next class time */}
          <div className="flex items-center gap-1.5 mt-3">
            <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">{section.nextClass}</span>
          </div>

          {/* Attendance progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground">Attendance</span>
              <span className={cn("text-xs font-semibold", attendanceInfo.classes)}>
                {section.attendance}%
              </span>
            </div>
            <Progress value={section.attendance} className="h-1.5" />
          </div>

          {/* Expanded section */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={cn("rounded-lg p-3", section.accentBg)}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Students</p>
                  <p className={cn("text-lg font-bold mt-0.5", section.accentText)}>{section.students}</p>
                </div>
                <div className={cn("rounded-lg p-3", section.accentBg)}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Attendance</p>
                  <p className={cn("text-lg font-bold mt-0.5", section.accentText)}>{section.attendance}%</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Attendance
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <FileUp className="w-3.5 h-3.5" />
                  Upload Data
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function TeacherDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {currentUser?.name?.split(" ")[0] ?? "Teacher"}!
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s your teaching overview for today.
          </p>
        </div>
        <Badge variant="outline" className="w-fit gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
          Teacher Portal
        </Badge>
      </motion.div>

      {/* Today's Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {overviewStats.map((stat, i) => (
          <OverviewStatCard key={stat.label} {...stat} delay={0.05 + i * 0.06} />
        ))}
      </div>

      {/* Class Section Cards Grid */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-lg font-semibold mb-4"
        >
          My Classes
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {classSections.map((section, i) => (
            <ClassSectionCard key={section.id} section={section} index={i} />
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          variants={itemVariants}
          className="text-lg font-semibold mb-4"
        >
          Recent Activity
        </motion.h2>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="divide-y">
              {recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 bg-muted", activity.iconColor)}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
