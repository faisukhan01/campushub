"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap,
  Building2,
  ClipboardCheck,
  CreditCard,
  BookOpen,
  MessageSquare,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Animation Helpers ───────────────────────────────────────────────

function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
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
          transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────

const features = [
  {
    icon: Building2,
    title: "Multi-Branch Management",
    description:
      "Manage multiple campuses, branches, and departments from a single unified dashboard.",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance Tracking",
    description:
      "Real-time attendance with biometric integration, QR codes, and automated parent notifications.",
  },
  {
    icon: CreditCard,
    title: "Fee Management",
    description:
      "Automated billing, installment tracking, online payments, and comprehensive financial reports.",
  },
  {
    icon: BookOpen,
    title: "Grade Book",
    description:
      "Flexible grading systems, rubric builders, report cards, and performance analytics.",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    description:
      "Built-in messaging, announcements, push notifications, and parent-teacher communication.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Data-driven insights with customizable dashboards, predictive analytics, and exportable reports.",
  },
];

const stats = [
  { value: "500+", label: "Institutes", icon: Building2 },
  { value: "50,000+", label: "Students", icon: Users },
  { value: "99.9%", label: "Uptime", icon: Shield },
  { value: "4.8", label: "Rating", icon: Star },
];

const steps = [
  {
    step: 1,
    title: "Sign Up",
    description:
      "Create your institute account in under 2 minutes. No credit card required.",
  },
  {
    step: 2,
    title: "Setup Your Institute",
    description:
      "Configure branches, departments, and import existing data with our guided wizard.",
  },
  {
    step: 3,
    title: "Start Managing",
    description:
      "Invite your team, onboard students, and begin streamlining campus operations.",
  },
];

const testimonials = [
  {
    name: "Dr. Rebecca Foster",
    role: "Principal, Westfield Academy",
    quote:
      "CampusHub transformed how we manage our three campuses. Attendance tracking alone saved us 20 hours per week. The analytics dashboard gives us insights we never had before.",
    avatar: "RF",
  },
  {
    name: "Michael Torres",
    role: "IT Director, BrightPath Schools",
    quote:
      "We evaluated 12 platforms before choosing CampusHub. The multi-tenant architecture, role-based access, and API integrations made it the clear winner for our district.",
    avatar: "MT",
  },
  {
    name: "Priya Sharma",
    role: "Administrator, Green Valley Intl.",
    quote:
      "The fee management and parent communication modules are phenomenal. Parent satisfaction scores increased by 35% within the first semester of deployment.",
    avatar: "PS",
  },
];

// ─── Component ───────────────────────────────────────────────────────

export function LandingPage({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* ───── Navigation Bar ───── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/20">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Campus<span className="text-emerald-600">Hub</span>
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Pricing
              </a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex text-gray-600 hover:text-emerald-600"
              >
                Log in
              </Button>
              <Button
                size="sm"
                onClick={onEnterDemo}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm shadow-emerald-500/20"
              >
                Get Started
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* ───── Hero Section ───── */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-20 right-[10%] w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl" />
            <div className="absolute top-40 left-[5%] w-60 h-60 bg-teal-100/30 rounded-full blur-3xl" />
            {/* Subtle dot grid */}
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #059669 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Copy */}
              <div className="text-center lg:text-left">
                <FadeIn>
                  <Badge
                    variant="secondary"
                    className="inline-flex items-center gap-1.5 mb-6 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-medium px-3 py-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Trusted by 500+ educational institutions
                  </Badge>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                    The smarter way to{" "}
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      manage your campus
                    </span>
                  </h1>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    CampusHub is the all-in-one platform that streamlines
                    administration, enhances learning, and connects your entire
                    educational community.
                  </p>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <Button
                      size="lg"
                      onClick={onEnterDemo}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 h-12 px-8 text-base font-semibold"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 px-8 text-base font-medium border-gray-200 text-gray-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50"
                    >
                      Book a Demo
                    </Button>
                  </div>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Free 14-day trial
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      No credit card
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Cancel anytime
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right - Hero Illustration Placeholder */}
              <FadeIn delay={0.2} direction="left">
                <div className="relative">
                  <div className="relative rounded-2xl border border-gray-200/60 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 sm:p-8 shadow-xl shadow-gray-200/50 overflow-hidden">
                    {/* Dashboard mockup */}
                    <div className="space-y-4">
                      {/* Top bar */}
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-400/70" />
                        <div className="h-3 w-3 rounded-full bg-amber-400/70" />
                        <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
                        <div className="ml-4 h-5 w-40 rounded bg-gray-100" />
                      </div>
                      {/* Sidebar + Content */}
                      <div className="flex gap-4">
                        {/* Sidebar */}
                        <div className="hidden sm:block w-14 space-y-2">
                          <div className="h-8 w-14 rounded-lg bg-emerald-100" />
                          <div className="h-3 w-10 rounded bg-gray-100 ml-2" />
                          <div className="h-3 w-10 rounded bg-gray-100 ml-2" />
                          <div className="h-3 w-10 rounded bg-gray-100 ml-2" />
                          <div className="h-3 w-10 rounded bg-emerald-100 ml-2" />
                          <div className="h-3 w-10 rounded bg-gray-100 ml-2" />
                        </div>
                        {/* Main area */}
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-16 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 p-2">
                              <div className="h-2 w-8 rounded bg-white/40" />
                              <div className="h-3 w-12 rounded bg-white/70 mt-2" />
                            </div>
                            <div className="h-16 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 p-2">
                              <div className="h-2 w-8 rounded bg-white/40" />
                              <div className="h-3 w-12 rounded bg-white/70 mt-2" />
                            </div>
                            <div className="h-16 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 p-2">
                              <div className="h-2 w-8 rounded bg-white/40" />
                              <div className="h-3 w-12 rounded bg-white/70 mt-2" />
                            </div>
                          </div>
                          <div className="h-24 rounded-lg bg-gray-50 border border-gray-100 p-3">
                            <div className="flex items-end gap-1 h-full">
                              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map(
                                (h, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500 to-teal-400 opacity-80"
                                    style={{ height: `${h}%` }}
                                  />
                                )
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-12 rounded-lg bg-gray-50 border border-gray-100" />
                            <div className="h-12 rounded-lg bg-gray-50 border border-gray-100" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Decorative glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-200/40 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-teal-200/40 rounded-full blur-3xl" />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white rounded-xl shadow-lg shadow-gray-200/60 border border-gray-100 p-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                      <Clock className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        Time Saved
                      </p>
                      <p className="text-sm font-bold text-emerald-600">
                        75% reduction
                      </p>
                    </div>
                  </div>

                  {/* Floating badge 2 */}
                  <div className="absolute -top-3 -right-2 sm:-right-4 bg-white rounded-xl shadow-lg shadow-gray-200/60 border border-gray-100 p-3 flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {["RF", "MT", "PS"].map((initials) => (
                        <div
                          key={initials}
                          className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white"
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      +2.4k joined
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ───── Stats / Social Proof ───── */}
        <section className="border-y border-gray-100 bg-gray-50/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <StaggerItem key={stat.label} className="text-center">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 mb-3">
                      <Icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ───── Features Section ───── */}
        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1.5 mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-medium"
              >
                <Sparkles className="h-3 w-3" />
                Everything you need
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                A complete platform for{" "}
                <span className="text-emerald-600">modern education</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                From admissions to alumni, CampusHub covers every aspect of
                campus management with powerful, intuitive tools.
              </p>
            </FadeIn>

            <StaggerContainer
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              staggerDelay={0.08}
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <StaggerItem key={feature.title}>
                    <Card className="group relative h-full border-gray-200/80 bg-white hover:border-emerald-200/80 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 py-0 gap-0">
                      <CardContent className="p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/15 mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-500">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* ───── How It Works ───── */}
        <section
          id="how-it-works"
          className="py-20 sm:py-28 bg-gradient-to-b from-gray-50/80 to-white"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1.5 mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-medium"
              >
                <ChevronRight className="h-3 w-3" />
                Simple setup
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Up and running in{" "}
                <span className="text-emerald-600">minutes, not months</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Get your entire campus operations online with our streamlined
                onboarding process.
              </p>
            </FadeIn>

            <StaggerContainer className="relative grid md:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-200" />

              {steps.map((item) => (
                <StaggerItem key={item.step} className="text-center relative">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-100 flex items-center justify-center">
                      <span className="text-3xl font-extrabold bg-gradient-to-b from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500 max-w-xs mx-auto">
                    {item.description}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ───── Testimonials ───── */}
        <section id="testimonials" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1.5 mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-medium"
              >
                <Star className="h-3 w-3" />
                Loved by educators
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Trusted by schools{" "}
                <span className="text-emerald-600">worldwide</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Hear from administrators who have transformed their campus
                operations with CampusHub.
              </p>
            </FadeIn>

            <StaggerContainer
              className="grid md:grid-cols-3 gap-6"
              staggerDelay={0.1}
            >
              {testimonials.map((t) => (
                <StaggerItem key={t.name}>
                  <Card className="h-full border-gray-200/80 bg-white hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 py-0 gap-0">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Stars */}
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <blockquote className="text-sm leading-relaxed text-gray-600 flex-1 mb-6">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {t.name}
                          </p>
                          <p className="text-xs text-gray-500">{t.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ───── Final CTA ───── */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div
                className={cn(
                  "relative rounded-3xl overflow-hidden",
                  "bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700",
                  "px-6 py-16 sm:px-12 sm:py-20 text-center"
                )}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full" />
                  <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-2xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Ready to transform your campus?
                  </h2>
                  <p className="mt-4 text-lg text-emerald-100 max-w-lg mx-auto">
                    Join 500+ institutions already using CampusHub to deliver
                    better educational outcomes.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      size="lg"
                      onClick={onEnterDemo}
                      className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg h-12 px-8 text-base font-semibold"
                    >
                      Enter Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 px-8 text-base font-medium border-white/30 text-white hover:bg-white/10 hover:text-white"
                    >
                      Talk to Sales
                    </Button>
                  </div>
                  <p className="mt-6 text-sm text-emerald-200">
                    No credit card required &middot; Free 14-day trial
                    &middot; Dedicated onboarding support
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ───── Footer ───── */}
      <footer className="border-t border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold tracking-tight text-gray-900">
                  Campus<span className="text-emerald-600">Hub</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                The all-in-one campus management platform for modern
                educational institutions.
              </p>
              {/* Social icons placeholder */}
              <div className="flex gap-3 mt-5">
                {["X", "In", "Gh", "Yt"].map((label) => (
                  <div
                    key={label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-400 hover:bg-emerald-100 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Product
              </h4>
              <ul className="space-y-2.5">
                {["Features", "Pricing", "Integrations", "Changelog"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
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
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                {["About", "Careers", "Blog", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {["Privacy", "Terms", "Security", "GDPR"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} CampusHub. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              Built with
              <span className="text-emerald-500">&#10084;</span>
              for education
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
