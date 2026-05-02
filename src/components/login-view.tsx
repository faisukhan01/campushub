"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  ArrowLeft,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

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
    description: "Platform-wide management and oversight",
    icon: Shield,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    role: "InstituteAdmin",
    title: "Institute Admin",
    description: "Manage branches, departments, and resources",
    icon: Building2,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    role: "BranchAdmin",
    title: "Branch Admin",
    description: "Oversee branch operations and staff",
    icon: GraduationCap,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    role: "Teacher",
    title: "Teacher",
    description: "Manage classes, grades, and attendance",
    icon: BookOpen,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    role: "Student",
    title: "Student",
    description: "View courses, grades, and schedules",
    icon: Users,
    gradient: "from-pink-500 to-rose-600",
  },
];

export function LoginView() {
  const login = useAppStore((s) => s.login);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4 sm:p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -20, 15, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 20, -15, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              CampusHub
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Demo Access
          </motion.h1>
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto"
          >
            Select a role to explore the CampusHub dashboard with sample data.
            No sign-up required.
          </motion.p>
        </div>

        {/* Role selection grid */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.role}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.25 + i * 0.06,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Card
                  className={cn(
                    "cursor-pointer group relative overflow-hidden",
                    "rounded-xl border border-slate-200 bg-white",
                    "hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50",
                    "transition-all duration-300",
                    "hover:-translate-y-1"
                  )}
                  onClick={() => login(r.role)}
                >
                  {/* Gradient top border */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      r.gradient
                    )}
                  />
                  <CardContent className="p-5">
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-xl mb-3",
                        "bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                        r.gradient
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-slate-900 transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {r.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-xs text-muted-foreground text-center mt-8"
        >
          By continuing, you agree to our{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
            Privacy Policy
          </span>
          .
        </motion.p>
      </motion.div>
    </div>
  );
}
