"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SignInViewProps {
  onSignIn: () => void;
  onBack: () => void;
  onGoToSignUp: () => void;
}

export function SignInView({ onSignIn, onBack, onGoToSignUp }: SignInViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setIsLoading(true);
    setError("");
    // Simulate auth delay then go to role selector
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    onSignIn();
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[480px] xl:w-[560px] relative flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-emerald-400/5 blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Top */}
        <div className="relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </button>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                CampusHub
              </span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight">
              Manage your campus
              <br />
              <span className="text-emerald-400">with confidence.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-slate-400 text-sm leading-relaxed max-w-sm"
          >
            Access your institution&apos;s dashboard, manage students and faculty,
            track attendance, and streamline operations from one powerful
            platform.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {[
              "Multi-branch",
              "Real-time Analytics",
              "Fee Management",
              "AI-Powered",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom testimonial-style quote */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="relative z-10"
        >
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              &ldquo;CampusHub brings everything we need into a single, elegant
              interface. Our staff loves it.&rdquo;
            </p>
            <p className="mt-3 text-xs text-slate-500">
              — Early Adopter, Education Sector
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-12"
      >
        <div className="w-full max-w-sm">
          {/* Mobile back */}
          <button
            onClick={onBack}
            className="lg:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                CampusHub
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your campus dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-slate-200 bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-lg border-slate-200 bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-sm text-destructive"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-11 rounded-lg font-medium",
                "bg-slate-900 hover:bg-slate-800 text-white",
                "transition-all duration-200",
                "disabled:opacity-70"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* Social logins */}
          <div className="grid grid-cols-2 gap-3">
            {["Google", "Microsoft"].map((provider) => (
              <Button
                key={provider}
                type="button"
                variant="outline"
                className={cn(
                  "h-10 rounded-lg text-sm font-medium",
                  "border-slate-200 hover:bg-slate-50 hover:border-slate-300",
                  "transition-all duration-200"
                )}
              >
                {provider}
              </Button>
            ))}
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={onGoToSignUp}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors inline-flex items-center gap-1 group"
            >
              Create account
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </p>

          {/* Demo access */}
          <div className="mt-6 p-4 rounded-xl bg-emerald-50/80 border border-emerald-100">
            <p className="text-xs font-medium text-emerald-800 mb-1">
              Want to explore first?
            </p>
            <p className="text-xs text-emerald-700/70 mb-3">
              Try our interactive demo to see CampusHub in action.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSignIn}
              className={cn(
                "h-8 text-xs rounded-md font-medium w-full",
                "border-emerald-200 bg-white text-emerald-700",
                "hover:bg-emerald-100 hover:border-emerald-300",
                "transition-all duration-200"
              )}
            >
              Launch Demo
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
