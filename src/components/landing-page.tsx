"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Building2,
  ClipboardCheck,
  CreditCard,
  BookOpen,
  MessageSquare,
  BarChart3,
  Sparkles,
  Shield,
  Zap,
  Globe,
  GraduationCap,
  Users,
  Calendar,
  Bell,
  FileText,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ================================================================
   LANDING PAGE — Honest, animated, professional B2B SaaS
   ================================================================ */

interface LandingPageProps {
  onGoToSignIn: () => void;
  onGoToSignUp: () => void;
}

/* ---------- Animation helpers ---------- */
function FadeIn({
  children,
  delay = 0,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const dirMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
  };
  const d = dirMap[direction];
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...d }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Data ---------- */

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}[] = [
  {
    icon: Building2,
    title: "Multi-Branch Management",
    description:
      "Centralize operations across all your branches. Sync data in real-time and maintain consistency campus-wide.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: ClipboardCheck,
    title: "Smart Attendance",
    description:
      "Track attendance with automated alerts. Identify at-risk students early and take proactive action.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: CreditCard,
    title: "Fee Management",
    description:
      "Complete fee lifecycle — invoicing, online payments, automated reminders, and detailed financial reports.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: BookOpen,
    title: "Academic Hub",
    description:
      "Flexible grading with custom rubrics, weighted assessments, course management, and performance analytics.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: MessageSquare,
    title: "Communication Suite",
    description:
      "Built-in messaging between teachers, students, and parents. Announcements and notifications keep everyone aligned.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Data-driven insights on enrollment, attendance, academic performance, and financial metrics — all in real-time.",
    gradient: "from-slate-600 to-slate-800",
  },
];

const capabilities = [
  { icon: Shield, label: "Role-Based Access" },
  { icon: Globe, label: "Multi-Tenant" },
  { icon: Zap, label: "Real-Time Sync" },
  { icon: GraduationCap, label: "6 User Portals" },
  { icon: Users, label: "Student Lifecycle" },
  { icon: Calendar, label: "Timetable Engine" },
  { icon: Bell, label: "Smart Notifications" },
  { icon: FileText, label: "Custom Reports" },
];

const steps = [
  {
    step: "01",
    title: "Sign up & set up",
    description:
      "Create your institution in under 10 minutes. Import existing data or start fresh — our onboarding wizard guides you through every step.",
  },
  {
    step: "02",
    title: "Invite your team",
    description:
      "Add administrators, teachers, and staff. Assign roles and permissions. Everyone gets a personalized portal tailored to their responsibilities.",
  },
  {
    step: "03",
    title: "Go live",
    description:
      "Launch your campus management system. Students and parents get instant access to schedules, grades, fees, and communications.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    description: "For small institutions getting started",
    price: "Free",
    period: "",
    features: [
      "Up to 100 students",
      "1 branch",
      "Core attendance & grades",
      "Basic reporting",
      "Email support",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For growing campuses",
    price: "$4",
    period: "/student/month",
    features: [
      "Unlimited students",
      "Up to 5 branches",
      "Advanced analytics",
      "Fee management",
      "Communication suite",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large education groups",
    price: "Custom",
    period: "",
    features: [
      "Unlimited everything",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "On-site training",
      "White-label option",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

/* ================================================================
   COMPONENT
   ================================================================ */

export function LandingPage({ onGoToSignIn, onGoToSignUp }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const navLinks = [
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Pricing", id: "pricing" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* ─── NAVIGATION ─── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
      >
        <nav className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight">
                CampusHub
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.id)}
                  className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={onGoToSignIn}
                className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5"
              >
                Sign in
              </button>
              <button
                onClick={onGoToSignUp}
                className={cn(
                  "text-[13px] font-medium px-4 py-2 rounded-lg",
                  "bg-slate-900 text-white hover:bg-slate-800",
                  "transition-all duration-200",
                  "shadow-sm shadow-slate-900/10"
                )}
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
            >
              <div className="px-6 py-4 space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.id)}
                    className="block w-full text-left text-sm font-medium text-slate-600 hover:text-slate-900 py-1"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onGoToSignIn();
                    }}
                    className="w-full text-sm font-medium text-slate-600 hover:text-slate-900 py-2 text-center"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onGoToSignUp();
                    }}
                    className="w-full text-sm font-medium bg-slate-900 text-white rounded-lg py-2.5 text-center"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ─── HERO ─── */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden"
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-100/60 to-teal-100/40 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -30, 20, 0],
              y: [0, 30, -20, 0],
              scale: [1, 0.95, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/40 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 20, -30, 0],
              y: [0, -20, 30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-amber-50/40 to-orange-50/30 blur-3xl"
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">
              Now available &mdash; Free 14-day trial
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight leading-[1.08]"
          >
            The campus management
            <br />
            platform{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              that just works.
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-500"
          >
            From attendance to analytics, fees to communication — manage every
            aspect of your educational institution from one powerful, intuitive
            platform.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={onGoToSignUp}
              className={cn(
                "group flex items-center gap-2 px-8 py-3 rounded-xl",
                "bg-slate-900 text-white font-medium text-[15px]",
                "hover:bg-slate-800 shadow-lg shadow-slate-900/15",
                "transition-all duration-300",
                "hover:shadow-xl hover:shadow-slate-900/20"
              )}
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={onGoToSignIn}
              className={cn(
                "flex items-center gap-2 px-8 py-3 rounded-xl",
                "bg-white text-slate-700 font-medium text-[15px]",
                "border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                "transition-all duration-300"
              )}
            >
              Sign in
            </button>
          </motion.div>

          {/* Product screenshot mockup */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 sm:mt-20 relative"
          >
            <div className="relative mx-auto max-w-4xl rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl shadow-slate-900/10 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-white">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-xs mx-auto h-6 rounded-md bg-slate-100 flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 font-medium">
                      app.campushub.io/dashboard
                    </span>
                  </div>
                </div>
                <div className="w-12" />
              </div>
              {/* Dashboard mockup */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600" />
                    <div className="h-3 w-24 rounded bg-slate-200" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200" />
                    <div className="hidden sm:block h-8 w-20 rounded-lg bg-slate-100" />
                  </div>
                </div>
                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Total Students", value: "2,847", color: "bg-emerald-500" },
                    { label: "Attendance", value: "94.2%", color: "bg-blue-500" },
                    { label: "Revenue", value: "$184K", color: "bg-violet-500" },
                    { label: "Courses", value: "156", color: "bg-amber-500" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + Math.random() * 0.3 }}
                      className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("w-2 h-2 rounded-full", stat.color)} />
                        <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                          {stat.label}
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-slate-900">
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Chart area */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 bg-white rounded-xl p-4 border border-slate-100 shadow-sm h-40 sm:h-48 flex items-end justify-between gap-1">
                    {[35, 52, 48, 70, 65, 82, 78, 90, 85, 95, 88, 92].map(
                      (h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{
                            delay: 1 + i * 0.05,
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex-1 rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 opacity-80"
                        />
                      )
                    )}
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm h-40 sm:h-48 flex flex-col items-center justify-center">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="3"
                        />
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#059669"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="94.2"
                          initial={{ strokeDashoffset: 94.2 }}
                          animate={{ strokeDashoffset: 5.6 }}
                          transition={{ delay: 1.2, duration: 0.8 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm sm:text-base font-bold text-slate-900">
                          94%
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-400 mt-2">
                      Attendance
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Fade out bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
          </motion.div>
        </div>
      </motion.section>

      {/* ─── CAPABILITIES STRIP ─── */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-6">
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <StaggerItem key={cap.label}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {cap.label}
                    </span>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">
              Features
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Everything your campus needs.
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              A comprehensive suite of tools designed to simplify every aspect
              of campus administration — from enrollment to graduation.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <StaggerItem key={feature.title}>
                  <motion.div
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group h-full p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
                  >
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center mb-5",
                        "bg-gradient-to-br shadow-sm",
                        feature.gradient
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {feature.description}
                    </p>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="how-it-works"
        className="py-20 sm:py-28 bg-slate-50 border-y border-slate-100"
      >
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">
              How it works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Up and running in three steps.
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Getting started with CampusHub is simple. No complex setup, no
              lengthy onboarding.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <StaggerItem key={s.step}>
                <div className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-10 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-px border-t border-dashed border-slate-300" />
                  )}
                  <div className="text-center">
                    <div className="inline-flex w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm items-center justify-center mb-6">
                      <span className="text-2xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500 max-w-xs mx-auto">
                      {s.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">
              Pricing
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Simple, transparent pricing.
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <StaggerItem key={plan.name}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={cn(
                    "h-full p-6 sm:p-8 rounded-2xl border",
                    "transition-all duration-300",
                    plan.highlighted
                      ? "border-emerald-500 bg-white shadow-lg shadow-emerald-500/10 relative"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium">
                        Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-slate-900">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {plan.description}
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-slate-400">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ChevronRight className="w-2.5 h-2.5 text-emerald-600" />
                        </div>
                        <span className="text-sm text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onGoToSignUp}
                    className={cn(
                      "mt-8 w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      plan.highlighted
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    )}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="contact" className="py-20 sm:py-28 bg-slate-950 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />
        </div>

        <FadeIn className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to transform your campus?
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed max-w-lg mx-auto">
            Join the next generation of campus management. Start your free trial
            today and experience the difference.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToSignUp}
              className={cn(
                "group flex items-center gap-2 px-8 py-3 rounded-xl",
                "bg-emerald-500 text-white font-medium text-[15px]",
                "hover:bg-emerald-600 shadow-lg shadow-emerald-500/25",
                "transition-all duration-300"
              )}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={onGoToSignIn}
              className={cn(
                "flex items-center gap-2 px-8 py-3 rounded-xl",
                "text-slate-300 font-medium text-[15px]",
                "border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50",
                "transition-all duration-300"
              )}
            >
              Sign in to your account
            </button>
          </div>
          <p className="mt-8 text-xs text-slate-500">
            No credit card required &middot; 14-day free trial &middot; Cancel
            anytime
          </p>
        </FadeIn>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[15px] font-semibold tracking-tight">
                  CampusHub
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 max-w-[200px]">
                The all-in-one campus management platform for modern educational
                institutions.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                {["Features", "Pricing", "Integrations", "Changelog"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {["About", "Careers", "Blog", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                {["Privacy", "Terms", "Security", "GDPR"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} CampusHub. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">Built for education.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
