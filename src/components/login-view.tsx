"use client";

import { motion } from "framer-motion";
import { GraduationCap, Shield, UserCog, BookOpen, Users, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { UserRole } from "@/types";
import { useAppStore } from "@/store/app-store";

interface RoleCard {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
}

const roles: RoleCard[] = [
  {
    role: "SuperAdmin",
    title: "Super Admin",
    description: "Full system access across all institutes, branches, and users",
    icon: Shield,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    role: "InstituteAdmin",
    title: "Institute Admin",
    description: "Manage branches, departments, courses, and fee operations",
    icon: UserCog,
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    role: "BranchAdmin",
    title: "Branch Admin",
    description: "Oversee branch operations, batches, timetable, and attendance",
    icon: GraduationCap,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    role: "Teacher",
    title: "Teacher",
    description: "Manage courses, grade assignments, track attendance and assessments",
    icon: BookOpen,
    gradient: "from-emerald-600 to-green-600",
  },
  {
    role: "Student",
    title: "Student",
    description: "View courses, submit assignments, check grades and fees",
    icon: Users,
    gradient: "from-teal-600 to-emerald-700",
  },
  {
    role: "Parent",
    title: "Parent",
    description: "Monitor child progress, attendance, fees, and communicate",
    icon: Heart,
    gradient: "from-green-600 to-teal-700",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

export function LoginView() {
  const login = useAppStore((s) => s.login);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/30 dark:via-background dark:to-teal-950/20 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-200/40 dark:bg-emerald-900/20 rounded-full blur-3xl -z-10" />

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 mb-4 sm:mb-6">
          <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          CampusHub
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-md mx-auto">
          Comprehensive Campus Management System — Select a role to explore the demo
        </p>
      </motion.div>

      {/* Role cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl w-full"
      >
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <motion.div key={r.role} variants={cardVariants}>
              <Card
                className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-card/80 backdrop-blur-sm"
                onClick={() => login(r.role)}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${r.gradient} shadow-sm`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground">
                        {r.title}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
                        {r.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to enter
                    <svg
                      className="ml-1 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-muted-foreground mt-10 sm:mt-14 text-center"
      >
        Demo application — Select any role to explore the system
      </motion.p>
    </div>
  );
}
