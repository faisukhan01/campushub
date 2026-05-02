"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Building2,
  User,
  Loader2,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SignUpViewProps {
  onGoToSignIn: () => void;
  onBack: () => void;
}

export function SignUpView({ onGoToSignIn, onBack }: SignUpViewProps) {
  const [step, setStep] = useState<"account" | "institution">("account");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    institutionName: "",
    institutionType: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = (() => {
    const p = formData.password;
    if (!p) return { level: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1)
      return { level: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 2)
      return { level: 2, label: "Fair", color: "bg-amber-500" };
    if (score <= 3)
      return { level: 3, label: "Good", color: "bg-emerald-500" };
    return { level: 4, label: "Strong", color: "bg-emerald-600" };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (passwordStrength.level < 2) {
      setError("Please choose a stronger password.");
      return;
    }
    setIsLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    // After signup, go to sign in
    onGoToSignIn();
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[480px] xl:w-[560px] relative flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />
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

        {/* Center */}
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
              Start your journey
              <br />
              <span className="text-emerald-400">with CampusHub.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-slate-400 text-sm leading-relaxed max-w-sm"
          >
            Get your institution up and running in minutes. No credit card
            required to start your free trial.
          </motion.p>

          {/* What you get */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-3"
          >
            {[
              "Free 14-day trial with full access",
              "Set up your institution in under 10 minutes",
              "Import existing data with ease",
              "Dedicated onboarding support",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="relative z-10"
        >
          <p className="text-xs text-slate-500">
            Secure &middot; SOC 2 Compliant &middot; 99.9% Uptime SLA
          </p>
        </motion.div>
      </motion.div>

      {/* Right Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-12 overflow-y-auto"
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
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started with a free 14-day trial.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setStep("account")}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                step === "account"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  step === "account"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                1
              </div>
              Account
            </button>
            <div className="flex-1 h-px bg-slate-200" />
            <button
              onClick={() => setStep("institution")}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                step === "institution"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  step === "institution"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                2
              </div>
              Institution
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === "account" ? (
              <motion.form
                key="account"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep("institution");
                }}
                className="space-y-5"
              >
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          updateField("firstName", e.target.value)
                        }
                        className="pl-10 h-11 rounded-lg border-slate-200 bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) =>
                        updateField("lastName", e.target.value)
                      }
                      className="h-11 rounded-lg border-slate-200 bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Work email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john@institution.edu"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="pl-10 h-11 rounded-lg border-slate-200 bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="signup-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
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
                  {/* Strength indicator */}
                  {formData.password && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-colors duration-300",
                              i <= passwordStrength.level
                                ? passwordStrength.color
                                : "bg-slate-100"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password strength:{" "}
                        <span className="font-medium">
                          {passwordStrength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Continue button */}
                <Button
                  type="submit"
                  className={cn(
                    "w-full h-11 rounded-lg font-medium",
                    "bg-slate-900 hover:bg-slate-800 text-white",
                    "transition-all duration-200"
                  )}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="institution"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Institution name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="instName"
                    className="text-sm font-medium"
                  >
                    Institution name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="instName"
                      type="text"
                      placeholder="Springfield Academy"
                      value={formData.institutionName}
                      onChange={(e) =>
                        updateField("institutionName", e.target.value)
                      }
                      className="pl-10 h-11 rounded-lg border-slate-200 bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Institution type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Institution type
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "university", label: "University" },
                      { value: "college", label: "College" },
                      { value: "school", label: "K-12 School" },
                      { value: "other", label: "Other" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          updateField("institutionType", type.value)
                        }
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                          formData.institutionType === type.value
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Your role */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Your role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "admin", label: "Administrator" },
                      { value: "principal", label: "Principal" },
                      { value: "teacher", label: "Teacher" },
                      { value: "it", label: "IT Manager" },
                    ].map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => updateField("role", role.value)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                          formData.role === role.value
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {role.label}
                      </button>
                    ))}
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

                {/* Create account button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-11 rounded-lg font-medium",
                    "bg-emerald-600 hover:bg-emerald-700 text-white",
                    "transition-all duration-200",
                    "disabled:opacity-70"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>

                {/* Back to step 1 */}
                <button
                  type="button"
                  onClick={() => setStep("account")}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
                >
                  &larr; Go back
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="relative my-6">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-muted-foreground">
              or
            </span>
          </div>

          {/* Social sign up */}
          <div className="grid grid-cols-2 gap-3">
            {["Google", "Microsoft"].map((provider) => (
              <Button
                key={provider}
                type="button"
                variant="outline"
                className="h-10 rounded-lg text-sm font-medium border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                {provider}
              </Button>
            ))}
          </div>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={onGoToSignIn}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors inline-flex items-center gap-1 group"
            >
              Sign in
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
