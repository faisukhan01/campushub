"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Globe, Palette, Bell, Shield, GraduationCap, Calendar,
  CreditCard, Save, Upload, Plus, Trash2, Lock, Eye, EyeOff,
  Loader2, CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function SectionSave({ label = "Save Changes" }: { label?: string }) {
  return (
    <div className="flex justify-end pt-4 border-t mt-4">
      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => toast.success("Settings saved successfully!")}>
        <Save className="w-4 h-4 mr-2" />{label}
      </Button>
    </div>
  );
}

export function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    instituteName: "Greenfield Education Group",
    timezone: "America/Chicago",
    dateFormat: "MM/DD/YYYY",
    academicYearPattern: "YYYY-YY",
    language: "en",
    currency: "USD",
  });

  const [brandingSettings, setBrandingSettings] = useState({
    primaryColor: "#059669",
    faviconUrl: "",
    loginPageText: "Welcome to CampusHub - Your complete campus management solution",
  });

  const [gradingSettings, setGradingSettings] = useState({
    gpaScale: "4.0",
    passPercentage: "40",
  });

  const [attendanceSettings, setAttendanceSettings] = useState({
    minimumPercentage: "75",
    lateMinutes: "10",
    deductionsEnabled: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailEnrollments: true,
    emailFees: true,
    emailAttendance: false,
    pushAnnouncements: true,
    pushGrades: true,
    smsEmergency: true,
  });

  const [holidays, setHolidays] = useState([
    { id: "1", name: "Independence Day", date: "2025-08-14", type: "Holiday" },
    { id: "2", name: "Eid ul Fitr", date: "2025-03-31", type: "Holiday" },
    { id: "3", name: "Eid ul Adha", date: "2025-06-07", type: "Holiday" },
    { id: "4", name: "Pakistan Day", date: "2025-03-23", type: "Holiday" },
  ]);

  // Change password state
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isPwSaving, setIsPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwError("All password fields are required.");
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
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const json = await res.json();
      if (!res.ok) { setPwError(json.error ?? "Failed to change password."); return; }
      setPwSuccess("Password changed successfully. Use your new password next time you log in.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setIsPwSaving(false);
    }
  };

  return (
    <div className="space-y-6 page-transition">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your institution configuration and preferences</p>
      </div>

      <Tabs defaultValue="security" className="space-y-4">
        <TabsList className="flex-wrap h-auto tabs-smooth">
          <TabsTrigger value="security" className="gap-1"><Lock className="w-3 h-3" />Security</TabsTrigger>
          <TabsTrigger value="general" className="gap-1"><Globe className="w-3 h-3" />General</TabsTrigger>
          <TabsTrigger value="branding" className="gap-1"><Palette className="w-3 h-3" />Branding</TabsTrigger>
          <TabsTrigger value="grading" className="gap-1"><GraduationCap className="w-3 h-3" />Grading</TabsTrigger>
          <TabsTrigger value="attendance" className="gap-1"><Calendar className="w-3 h-3" />Attendance</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1"><Bell className="w-3 h-3" />Notifications</TabsTrigger>
          <TabsTrigger value="calendar" className="gap-1"><Calendar className="w-3 h-3" />Calendar</TabsTrigger>
        </TabsList>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lock className="w-4 h-4" />Change Password</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                <p className="text-sm text-muted-foreground">
                  Update your password. After changing, use the new password on your next login.
                </p>

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
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

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
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-pw">Confirm New Password</Label>
                  <Input
                    id="confirm-pw"
                    type="password"
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    disabled={isPwSaving}
                  />
                </div>

                {pwError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                    <Shield className="w-4 h-4 flex-shrink-0" />{pwError}
                  </div>
                )}
                {pwSuccess && (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{pwSuccess}
                  </div>
                )}

                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isPwSaving}>
                  {isPwSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                  {isPwSaving ? "Changing Password…" : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General */}
        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle className="text-base">General Settings</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <SettingRow label="Institute Name" description="The official name displayed across the platform">
                <Input value={generalSettings.instituteName} onChange={(e) => setGeneralSettings({ ...generalSettings, instituteName: e.target.value })} className="w-[280px]" />
              </SettingRow>
              <SettingRow label="Timezone" description="Default timezone for scheduling and dates">
                <Select value={generalSettings.timezone} onValueChange={(v) => setGeneralSettings({ ...generalSettings, timezone: v })}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Date Format" description="How dates are displayed to users">
                <Select value={generalSettings.dateFormat} onValueChange={(v) => setGeneralSettings({ ...generalSettings, dateFormat: v })}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Academic Year Pattern" description="Format for academic year labels">
                <Select value={generalSettings.academicYearPattern} onValueChange={(v) => setGeneralSettings({ ...generalSettings, academicYearPattern: v })}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YYYY-YY">2024-25</SelectItem>
                    <SelectItem value="YYYY-YYYY">2024-2025</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Language" description="Default interface language">
                <Select value={generalSettings.language} onValueChange={(v) => setGeneralSettings({ ...generalSettings, language: v })}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Currency" description="Default currency for fee display">
                <Select value={generalSettings.currency} onValueChange={(v) => setGeneralSettings({ ...generalSettings, currency: v })}>
                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SectionSave />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding">
          <Card>
            <CardHeader><CardTitle className="text-base">Branding & Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <SettingRow label="Logo" description="Upload your institution logo">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center border">
                    <Globe className="w-6 h-6 text-emerald-600" />
                  </div>
                  <Button variant="outline" size="sm"><Upload className="w-3 h-3 mr-1" />Upload</Button>
                </div>
              </SettingRow>
              <SettingRow label="Primary Color" description="Main brand color used across the app">
                <div className="flex items-center gap-2">
                  <Input type="color" value={brandingSettings.primaryColor} onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })} className="w-10 h-8 p-1 cursor-pointer" />
                  <Input value={brandingSettings.primaryColor} onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })} className="w-[100px] h-8" />
                </div>
              </SettingRow>
              <SettingRow label="Favicon" description="Small icon shown in the browser tab">
                <Button variant="outline" size="sm"><Upload className="w-3 h-3 mr-1" />Upload</Button>
              </SettingRow>
              <SettingRow label="Login Page Text" description="Custom welcome message on the login page">
                <Input value={brandingSettings.loginPageText} onChange={(e) => setBrandingSettings({ ...brandingSettings, loginPageText: e.target.value })} className="w-[300px]" />
              </SettingRow>
              <SectionSave />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grading */}
        <TabsContent value="grading">
          <Card>
            <CardHeader><CardTitle className="text-base">Grading Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <SettingRow label="GPA Scale" description="Maximum GPA value">
                <Select value={gradingSettings.gpaScale} onValueChange={(v) => setGradingSettings({ ...gradingSettings, gpaScale: v })}>
                  <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4.0">4.0</SelectItem>
                    <SelectItem value="5.0">5.0</SelectItem>
                    <SelectItem value="10.0">10.0</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <SettingRow label="Pass Percentage" description="Minimum percentage to pass a course">
                <div className="flex items-center gap-1">
                  <Input type="number" value={gradingSettings.passPercentage} onChange={(e) => setGradingSettings({ ...gradingSettings, passPercentage: e.target.value })} className="w-[80px]" />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </SettingRow>
              <Separator className="my-2" />
              <p className="text-sm font-medium mb-2">Grade Letter Mappings</p>
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead>Min %</TableHead>
                    <TableHead>Max %</TableHead>
                    <TableHead>GPA Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["A+", "95", "100", "4.0"], ["A", "90", "94", "4.0"], ["B+", "85", "89", "3.5"],
                    ["B", "80", "84", "3.0"], ["C+", "75", "79", "2.5"], ["C", "70", "74", "2.0"],
                    ["D", "60", "69", "1.0"], ["F", "0", "59", "0.0"],
                  ].map(([grade, min, max, pts]) => (
                    <TableRow key={grade}>
                      <TableCell className="font-medium">{grade}</TableCell>
                      <TableCell>{min}%</TableCell>
                      <TableCell>{max}%</TableCell>
                      <TableCell>{pts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <SectionSave />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader><CardTitle className="text-base">Attendance Policy</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <SettingRow label="Minimum Attendance %" description="Students must maintain this to be eligible for exams">
                <div className="flex items-center gap-1">
                  <Input type="number" value={attendanceSettings.minimumPercentage} onChange={(e) => setAttendanceSettings({ ...attendanceSettings, minimumPercentage: e.target.value })} className="w-[80px]" />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </SettingRow>
              <SettingRow label="Late Threshold (minutes)" description="Minutes after class start to mark as late">
                <Input type="number" value={attendanceSettings.lateMinutes} onChange={(e) => setAttendanceSettings({ ...attendanceSettings, lateMinutes: e.target.value })} className="w-[80px]" />
              </SettingRow>
              <SettingRow label="Deductions Policy" description="Automatically deduct marks for low attendance">
                <Switch checked={attendanceSettings.deductionsEnabled} onCheckedChange={(v) => setAttendanceSettings({ ...attendanceSettings, deductionsEnabled: v })} />
              </SettingRow>
              <SectionSave />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <p className="text-xs text-muted-foreground mb-2">Email Notifications</p>
              <SettingRow label="New Enrollments" description="Get notified when new students enroll">
                <Switch checked={notificationSettings.emailEnrollments} onCheckedChange={(v) => setNotificationSettings({ ...notificationSettings, emailEnrollments: v })} />
              </SettingRow>
              <SettingRow label="Fee Payments" description="Notifications about fee payments and reminders">
                <Switch checked={notificationSettings.emailFees} onCheckedChange={(v) => setNotificationSettings({ ...notificationSettings, emailFees: v })} />
              </SettingRow>
              <SettingRow label="Attendance Alerts" description="Low attendance warnings">
                <Switch checked={notificationSettings.emailAttendance} onCheckedChange={(v) => setNotificationSettings({ ...notificationSettings, emailAttendance: v })} />
              </SettingRow>
              <Separator className="my-2" />
              <p className="text-xs text-muted-foreground mb-2">Push Notifications</p>
              <SettingRow label="Announcements" description="New announcements from the institution">
                <Switch checked={notificationSettings.pushAnnouncements} onCheckedChange={(v) => setNotificationSettings({ ...notificationSettings, pushAnnouncements: v })} />
              </SettingRow>
              <SettingRow label="Grade Results" description="When new grades are published">
                <Switch checked={notificationSettings.pushGrades} onCheckedChange={(v) => setNotificationSettings({ ...notificationSettings, pushGrades: v })} />
              </SettingRow>
              <SettingRow label="Emergency Alerts" description="SMS alerts for emergencies (additional charges may apply)">
                <Switch checked={notificationSettings.smsEmergency} onCheckedChange={(v) => setNotificationSettings({ ...notificationSettings, smsEmergency: v })} />
              </SettingRow>
              <SectionSave />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Calendar */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Academic Calendar</CardTitle>
              <Button variant="outline" size="sm"><Plus className="w-3 h-3 mr-1" />Add Holiday</Button>
            </CardHeader>
            <CardContent>
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Holiday / Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holidays.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="font-medium">{h.name}</TableCell>
                      <TableCell>{h.date}</TableCell>
                      <TableCell className="hidden sm:table-cell"><Badge variant="outline">{h.type}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm"><Trash2 className="w-3 h-3 text-red-400" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <SectionSave label="Update Calendar" />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
