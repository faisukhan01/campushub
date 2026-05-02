"use client";

import { Shield, Building2, GraduationCap, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface RoleCard {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ElementType;
}

const roles: RoleCard[] = [
  {
    role: "SuperAdmin",
    title: "Super Admin",
    description: "Platform-wide management and oversight",
    icon: Shield,
  },
  {
    role: "InstituteAdmin",
    title: "Institute Admin",
    description: "Manage branches, departments, and resources",
    icon: Building2,
  },
  {
    role: "BranchAdmin",
    title: "Branch Admin",
    description: "Oversee branch operations and staff",
    icon: GraduationCap,
  },
  {
    role: "Teacher",
    title: "Teacher",
    description: "Manage classes, grades, and attendance",
    icon: BookOpen,
  },
  {
    role: "Student",
    title: "Student",
    description: "View courses, grades, and schedules",
    icon: Users,
  },
];

export function LoginView() {
  const login = useAppStore((s) => s.login);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-md">
        {/* Logo & heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            CampusHub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Campus Management Platform
          </p>
        </div>

        {/* Sign-in heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Sign in to your account
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Select your role to continue to the dashboard.
          </p>
        </div>

        {/* Role selection grid */}
        <div
          className={cn(
            "grid gap-3",
            "grid-cols-1",
            "sm:grid-cols-2",
            "md:grid-cols-3",
            "xl:grid-cols-5"
          )}
        >
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <Card
                key={r.role}
                className={cn(
                  "cursor-pointer hover:bg-accent transition-colors",
                  "rounded-lg border p-0"
                )}
                onClick={() => login(r.role)}
              >
                <CardContent className="p-4">
                  <div
                    className={cn(
                      "flex items-center justify-center",
                      "w-8 h-8 rounded-lg bg-muted mb-3"
                    )}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">
                    {r.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {r.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-8">
          By continuing, you agree to our{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
