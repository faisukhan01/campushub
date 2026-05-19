"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle,
  Bell, User, Shield, GraduationCap,
} from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  Teacher: "bg-emerald-100 text-emerald-700",
  Student: "bg-sky-100 text-sky-700",
};

const ROLE_LABELS: Record<string, string> = {
  Teacher: "Teacher",
  Student: "Student",
};

export function UserSettingsPage() {
  const currentUser = useAppStore((s) => s.currentUser);

  // ── Change password state ──
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPwSaving, setIsPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // ── Notification prefs state ──
  const [notifs, setNotifs] = useState({
    announcements: true,
    grades: true,
    assignments: true,
    attendance: false,
    messages: true,
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwError("All fields are required.");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (pwForm.currentPassword === pwForm.newPassword) {
      setPwError("New password must be different from your current password.");
      return;
    }

    setIsPwSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setPwError(json.error ?? "Failed to change password.");
        return;
      }
      setPwSuccess("Password changed successfully. Use your new password next time you log in.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setIsPwSaving(false);
    }
  };

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const roleLabel = ROLE_LABELS[currentUser?.role ?? ""] ?? currentUser?.role ?? "";
  const roleColor = ROLE_COLORS[currentUser?.role ?? ""] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="space-y-6 page-transition max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <Card className="rounded-xl">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-emerald-500/20">
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-lg font-semibold truncate">{currentUser?.name}</p>
              <p className="text-sm text-muted-foreground truncate">{currentUser?.email}</p>
              <Badge className={`mt-1 text-[11px] ${roleColor}`}>
                {currentUser?.role === "Teacher" ? (
                  <><Shield className="w-3 h-3 mr-1" />{roleLabel}</>
                ) : (
                  <><GraduationCap className="w-3 h-3 mr-1" />{roleLabel}</>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="security" className="space-y-4">
        <TabsList>
          <TabsTrigger value="security" className="gap-1.5">
            <Lock className="w-3.5 h-3.5" />Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="w-3.5 h-3.5" />Notifications
          </TabsTrigger>
        </TabsList>

        {/* ── Security / Change Password ── */}
        <TabsContent value="security">
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <p className="text-sm text-muted-foreground">
                  After changing your password, use the new password the next time you log in.
                  Your branch admin will also see the updated password.
                </p>

                <Separator />

                {/* Current password */}
                <div className="space-y-1.5">
                  <Label htmlFor="cur-pw">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="cur-pw"
                      type={showCurrent ? "text" : "password"}
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      placeholder="Your current password"
                      className="pr-10"
                      disabled={isPwSaving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div className="space-y-1.5">
                  <Label htmlFor="new-pw">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-pw"
                      type={showNew ? "text" : "password"}
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      placeholder="Min. 8 characters"
                      className="pr-10"
                      disabled={isPwSaving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-pw">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-pw"
                      type={showConfirm ? "text" : "password"}
                      value={pwForm.confirmPassword}
                      onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                      placeholder="Re-enter new password"
                      className="pr-10"
                      disabled={isPwSaving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {pwForm.newPassword && (
                    <div className="flex gap-1 mt-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            pwForm.newPassword.length >= i * 3
                              ? pwForm.newPassword.length >= 12
                                ? "bg-emerald-500"
                                : pwForm.newPassword.length >= 8
                                ? "bg-amber-400"
                                : "bg-red-400"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-1">
                        {pwForm.newPassword.length < 8
                          ? "Too short"
                          : pwForm.newPassword.length < 12
                          ? "Acceptable"
                          : "Strong"}
                      </span>
                    </div>
                  )}
                </div>

                {pwError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{pwError}
                  </div>
                )}
                {pwSuccess && (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{pwSuccess}
                  </div>
                )}

                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isPwSaving}
                >
                  {isPwSaving
                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Changing…</>
                    : <><Lock className="w-4 h-4 mr-2" />Change Password</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications ── */}
        <TabsContent value="notifications">
          <Card className="rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-sky-600" />
                </div>
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "announcements", label: "Announcements", desc: "New announcements from your branch" },
                { key: "grades", label: "Grades & Results", desc: "When new marks or results are published" },
                { key: "assignments", label: "Assignments", desc: "New assignments and upcoming deadlines" },
                { key: "attendance", label: "Attendance Alerts", desc: "Low attendance warnings" },
                { key: "messages", label: "Messages", desc: "New messages from teachers or staff" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={notifs[key as keyof typeof notifs]}
                    onCheckedChange={(v) => setNotifs({ ...notifs, [key]: v })}
                  />
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-end pt-2">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => {}}
                  size="sm"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
