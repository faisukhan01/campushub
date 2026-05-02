"use client";

import {
  Building2,
  ClipboardCheck,
  CreditCard,
  BookOpen,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Building2,
    title: "Multi-Branch Management",
    description:
      "Centralize operations across all your branches with real-time sync.",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance Tracking",
    description:
      "Automated attendance with alerts for low-performing students.",
  },
  {
    icon: CreditCard,
    title: "Fee Management",
    description:
      "Complete fee lifecycle — invoicing, payments, reminders, and reports.",
  },
  {
    icon: BookOpen,
    title: "Grade Book",
    description:
      "Flexible grading with custom rubrics, weighted assessments, and analytics.",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    description:
      "Built-in messaging, announcements, and parent communication tools.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Data-driven insights on enrollment, attendance, and academic performance.",
  },
];

const metrics = [
  { value: "500+", label: "institutions" },
  { value: "50K+", label: "students" },
  { value: "99.9%", label: "uptime" },
  { value: "4.8\u2605", label: "rating" },
];

const testimonials = [
  {
    quote:
      "CampusHub transformed how we manage our three campuses. Attendance tracking alone saved us 20 hours per week.",
    name: "Dr. Rebecca Foster",
    title: "Principal, Westfield Academy",
    initials: "RF",
  },
  {
    quote:
      "We evaluated 12 platforms before choosing CampusHub. The multi-tenant architecture made it the clear winner for our district.",
    name: "Michael Torres",
    title: "IT Director, BrightPath Schools",
    initials: "MT",
  },
  {
    quote:
      "The fee management and parent communication modules are phenomenal. Parent satisfaction increased by 35% in the first semester.",
    name: "Priya Sharma",
    title: "Administrator, Green Valley Intl.",
    initials: "PS",
  },
];

const trustLogos = ["Harvard", "Stanford", "MIT", "Oxford", "Cambridge"];

export function LandingPage({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <nav className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">
                CampusHub
              </span>
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            </div>

            <div className="hidden md:flex items-center gap-8">
              {["Features", "Pricing", "About", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm text-slate-500"
                >
                  {link}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-slate-500">
                Log in
              </Button>
              <Button
                size="sm"
                onClick={onEnterDemo}
                className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="mb-6 text-xs font-medium uppercase tracking-widest text-slate-400">
              Campus Management Platform
            </p>

            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl leading-[1.1]">
              Everything your campus needs, in one place.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
              Streamline operations across branches, manage teachers and
              students, track attendance, and gain actionable insights — all
              from a single dashboard.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={onEnterDemo}
                className="rounded-full bg-emerald-600 px-8 text-white hover:bg-emerald-700"
              >
                Start Free Trial
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-slate-200 px-8 text-slate-700"
              >
                <Play className="mr-1 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Trust line */}
            <div className="mt-16 flex flex-col items-center gap-4">
              <p className="text-xs text-slate-400">
                Trusted by 500+ institutions worldwide
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
                {trustLogos.map((logo) => (
                  <span
                    key={logo}
                    className="text-sm font-semibold tracking-tight text-slate-300"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="border-t border-slate-100 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Built for modern campuses
            </h2>
            <p className="mt-3 max-w-xl text-slate-500">
              A comprehensive suite of tools designed to simplify every aspect of
              campus administration.
            </p>

            <div className="mt-14 grid gap-px rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-white p-6 sm:p-8"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200">
                      <Icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Metrics ── */}
        <section className="border-t border-slate-100 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-0">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="flex items-center gap-8 text-center sm:gap-0"
                >
                  <div className="flex flex-col items-center sm:px-10">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">
                      {metric.value}
                    </span>
                    <span className="mt-1 text-sm text-slate-400">
                      {metric.label}
                    </span>
                  </div>
                  {index < metrics.length - 1 && (
                    <span className="hidden h-10 w-px bg-slate-200 sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="about" className="border-t border-slate-100 bg-slate-50 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What our customers say
            </h2>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="border border-slate-200 bg-white p-6"
                >
                  <blockquote className="text-sm leading-relaxed text-slate-600">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-500">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-400">{t.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-slate-900 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your campus?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-400">
              Join 500+ institutions already using CampusHub.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={onEnterDemo}
                className="rounded-full bg-emerald-600 px-8 text-white hover:bg-emerald-700"
              >
                Get Started Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "rounded-full border-slate-600 px-8 text-slate-300",
                  "hover:bg-slate-800 hover:text-white"
                )}
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">
                  CampusHub
                </span>
              </div>
              <p className="mt-3 max-w-[200px] text-sm leading-relaxed text-slate-500">
                The all-in-one campus management platform for modern
                educational institutions.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Product
              </h4>
              <ul className="mt-4 space-y-3">
                {["Features", "Pricing", "Integrations", "Changelog"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-slate-300"
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
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Company
              </h4>
              <ul className="mt-4 space-y-3">
                {["About", "Careers", "Blog", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Legal
              </h4>
              <ul className="mt-4 space-y-3">
                {["Privacy", "Terms", "Security", "GDPR"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-slate-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
            <p className="text-xs text-slate-600">
              &copy; 2025 CampusHub. All rights reserved.
            </p>
            <p className="text-xs text-slate-600">
              Built for education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
