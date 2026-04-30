"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Shield, UserCog, BookOpen, Users, Heart, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/types";
import { useAppStore } from "@/store/app-store";

interface RoleCard {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  borderColor: string;
  iconBg: string;
}

const roles: RoleCard[] = [
  {
    role: "SuperAdmin",
    title: "Super Admin",
    description: "Full system access across all institutes, branches, and users",
    icon: Shield,
    gradient: "from-emerald-500 to-teal-600",
    borderColor: "border-t-emerald-500",
    iconBg: "from-emerald-500 to-teal-600",
  },
  {
    role: "InstituteAdmin",
    title: "Institute Admin",
    description: "Manage branches, departments, courses, and fee operations",
    icon: UserCog,
    gradient: "from-teal-500 to-cyan-600",
    borderColor: "border-t-teal-500",
    iconBg: "from-teal-500 to-cyan-600",
  },
  {
    role: "BranchAdmin",
    title: "Branch Admin",
    description: "Oversee branch operations, batches, timetable, and attendance",
    icon: GraduationCap,
    gradient: "from-green-500 to-emerald-600",
    borderColor: "border-t-green-500",
    iconBg: "from-green-500 to-emerald-600",
  },
  {
    role: "Teacher",
    title: "Teacher",
    description: "Manage courses, grade assignments, track attendance and assessments",
    icon: BookOpen,
    gradient: "from-emerald-600 to-green-600",
    borderColor: "border-t-emerald-600",
    iconBg: "from-emerald-600 to-green-600",
  },
  {
    role: "Student",
    title: "Student",
    description: "View courses, submit assignments, check grades and fees",
    icon: Users,
    gradient: "from-teal-600 to-emerald-700",
    borderColor: "border-t-teal-600",
    iconBg: "from-teal-600 to-emerald-700",
  },
  {
    role: "Parent",
    title: "Parent",
    description: "Monitor child progress, attendance, fees, and communicate",
    icon: Heart,
    gradient: "from-green-600 to-teal-700",
    borderColor: "border-t-green-600",
    iconBg: "from-green-600 to-teal-700",
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

const hintText = "Select a role to continue";

export function LoginView() {
  const login = useAppStore((s) => s.login);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Parallax effect for floating shapes
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= hintText.length) {
        setTypedText(hintText.slice(0, index));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 60);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsTypingComplete(true);
      setTypedText(hintText);
    }, hintText.length * 60 + 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden"
    >
      {/* Multi-layer background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/40 dark:via-background dark:to-teal-950/30 -z-10" />
      {/* Large ambient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-200/40 dark:bg-emerald-900/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-[10%] w-[500px] h-[500px] bg-teal-200/30 dark:bg-teal-900/15 rounded-full blur-3xl -z-10" />
      <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] bg-green-200/20 dark:bg-green-900/10 rounded-full blur-3xl -z-10" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.55 0.17 155) 1px, transparent 1px), linear-gradient(90deg, oklch(0.55 0.17 155) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Noise texture overlay */}
      <div className="noise-overlay -z-10" />

      {/* Emerald dot-grid pattern */}
      <div className="dot-grid -z-10" />

      {/* Floating geometric shapes with parallax */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[8%] w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-emerald-300/30 dark:border-emerald-700/20 animate-[float-shape-1_12s_ease-in-out_infinite]" style={{ transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 6}px)` }} />
        <div className="absolute top-[20%] right-[12%] w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-emerald-200/20 dark:bg-emerald-800/15 animate-[float-shape-2_15s_ease-in-out_infinite]" style={{ transform: `translate(${mousePos.x * -6}px, ${mousePos.y * 10}px)` }} />
        <div className="absolute bottom-[25%] left-[5%] w-12 h-12 sm:w-20 sm:h-20 rounded-lg border-2 border-teal-300/25 dark:border-teal-700/20 rotate-45 animate-[float-shape-3_18s_ease-in-out_infinite]" style={{ transform: `translate(${mousePos.x * 12}px, ${mousePos.y * -8}px) rotate(45deg)` }} />
        <div className="absolute top-[60%] right-[8%] w-8 h-8 sm:w-14 sm:h-14 rounded-lg bg-teal-200/15 dark:bg-teal-800/10 rotate-12 animate-[float-shape-1_14s_ease-in-out_infinite_2s]" style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * 5}px) rotate(12deg)` }} />
        <div className="absolute bottom-[15%] right-[20%] w-6 h-6 sm:w-10 sm:h-10 rounded-full border border-emerald-400/20 dark:border-emerald-600/15 animate-[float-shape-2_10s_ease-in-out_infinite_4s]" style={{ transform: `translate(${mousePos.x * 5}px, ${mousePos.y * -12}px)` }} />
        <div className="absolute top-[40%] left-[15%] w-6 h-6 sm:w-10 sm:h-10 rounded-sm border border-teal-400/20 dark:border-teal-600/15 rotate-45 animate-[float-shape-3_20s_ease-in-out_infinite_1s]" style={{ transform: `translate(${mousePos.x * 7}px, ${mousePos.y * 9}px) rotate(45deg)` }} />
      </div>

      {/* Particle dots */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-400/30 dark:bg-emerald-500/20"
            style={{
              left: `${(i * 5.2 + 3) % 100}%`,
              top: `${(i * 7.1 + 5) % 100}%`,
              animation: `particle-float ${4 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 sm:mb-12 relative z-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 mb-4 sm:mb-6 relative">
          {/* Pulsing glow ring */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 animate-ping opacity-20" />
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 blur-xl animate-pulse-slow" />
          <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          CampusHub
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="secondary" className="text-[10px] font-medium tracking-wider uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-0 gap-1">
            <Sparkles className="w-3 h-3" />
            Version 2.0
          </Badge>
        </div>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-md mx-auto">
          Comprehensive Campus Management System — Select a role to explore the demo
        </p>
      </motion.div>

      {/* Role cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-4xl w-full relative z-10"
      >
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <motion.div key={r.role} variants={cardVariants}>
              <Card
                className={`group cursor-pointer border-0 border-t-[3px] ${r.borderColor} glass-card gradient-border-hover rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02]`}
                onClick={() => login(r.role)}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${r.iconBg} shadow-md shadow-emerald-500/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20`}
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
                  <div className="mt-4 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
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

      {/* Typewriter hint text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-6 relative z-10"
      >
        <p className="text-sm text-muted-foreground/60 h-5">
          {typedText}
          {!isTypingComplete && <span className="inline-block w-[2px] h-4 bg-emerald-500/70 align-middle ml-0.5 animate-pulse" />}
        </p>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 sm:mt-14 text-center space-y-3 relative z-10"
      >
        <p className="text-xs text-muted-foreground">
          Demo application — Select any role to explore the system
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-emerald-400/40" />
          <p className="text-[11px] text-muted-foreground/70 flex items-center gap-1">
            Powered by
            <span className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Z.ai
            </span>
          </p>
          <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-emerald-400/40" />
        </div>
      </motion.div>

      {/* Floating shape keyframes */}
      <style jsx global>{`
        @keyframes float-shape-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-3deg); }
        }
        @keyframes float-shape-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        @keyframes float-shape-3 {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-25px) rotate(50deg); }
        }
        @keyframes particle-float {
          0%, 100% { opacity: 0.2; transform: translateY(0px) scale(1); }
          50% { opacity: 0.8; transform: translateY(-12px) scale(1.5); }
        }
      `}</style>
    </div>
  );
}
