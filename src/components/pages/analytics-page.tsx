"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import {
  TrendingUp, Users, GraduationCap, DollarSign, Activity, BarChart3,
  Server, Clock, HardDrive, Wifi, ArrowUpRight, Calendar,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Area, AreaChart, RadialBarChart, RadialBar,
} from "recharts";
import { useState } from "react";

// -------------------- Chart Configs --------------------

const enrollmentForecastConfig: ChartConfig = {
  actual: { label: "Actual", color: "#059669" },
  projected: { label: "Projected", color: "#d97706" },
};

const feeTrendConfig: ChartConfig = {
  amount: { label: "Amount", color: "#059669" },
};

const featureConfig: ChartConfig = {
  usage: { label: "Usage %", color: "#059669" },
};

const engagementConfig: ChartConfig = {
  logins: { label: "Logins", color: "#059669" },
};

const systemHealthConfig: ChartConfig = {
  value: { label: "Health", color: "#059669" },
};

// -------------------- Data --------------------

const enrollmentForecast = [
  { month: "Jan", actual: 8200, projected: null },
  { month: "Feb", actual: 8900, projected: null },
  { month: "Mar", actual: 9400, projected: null },
  { month: "Apr", actual: 10100, projected: null },
  { month: "May", actual: 10800, projected: null },
  { month: "Jun", actual: 11200, projected: null },
  { month: "Jul", actual: null, projected: 11800 },
  { month: "Aug", actual: null, projected: 12500 },
  { month: "Sep", actual: null, projected: 13200 },
  { month: "Oct", actual: null, projected: 14000 },
  { month: "Nov", actual: null, projected: 14500 },
  { month: "Dec", actual: null, projected: 15000 },
];

const feeTrend = [
  { month: "Jan", amount: 320000 }, { month: "Feb", amount: 285000 },
  { month: "Mar", amount: 410000 }, { month: "Apr", amount: 380000 },
  { month: "May", amount: 350000 }, { month: "Jun", amount: 420000 },
  { month: "Jul", amount: 290000 }, { month: "Aug", amount: 480000 },
  { month: "Sep", amount: 520000 }, { month: "Oct", amount: 460000 },
  { month: "Nov", amount: 390000 }, { month: "Dec", amount: 340000 },
];

const featureAdoption = [
  { feature: "Attendance", usage: 95 },
  { feature: "Grades", usage: 92 },
  { feature: "Courses", usage: 88 },
  { feature: "Fees", usage: 82 },
  { feature: "Assignments", usage: 78 },
  { feature: "Messages", usage: 71 },
  { feature: "Timetable", usage: 65 },
  { feature: "Reports", usage: 58 },
  { feature: "Announcements", usage: 52 },
  { feature: "Support", usage: 45 },
];

const engagementData = [
  { day: "Mon", logins: 820 }, { day: "Tue", logins: 910 },
  { day: "Wed", logins: 880 }, { day: "Thu", logins: 920 },
  { day: "Fri", logins: 760 }, { day: "Sat", logins: 320 },
  { day: "Sun", logins: 180 },
];

const systemMetrics = [
  { name: "Uptime", value: 99.97, display: "99.97%", color: "#059669", icon: Server },
  { name: "Response Time", value: 87, display: "142ms", color: "#059669", icon: Clock },
  { name: "Storage", value: 62, display: "62%", color: "#d97706", icon: HardDrive },
  { name: "Bandwidth", value: 45, display: "45%", color: "#059669", icon: Wifi },
];

// -------------------- Heatmap Data --------------------

const heatmapHours = ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"];
const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heatmapData: number[][] = [
  [5, 45, 82, 65, 78, 70, 35, 15, 8],
  [4, 48, 88, 60, 80, 72, 38, 18, 10],
  [6, 42, 85, 68, 75, 68, 32, 14, 7],
  [5, 50, 90, 62, 82, 75, 40, 20, 12],
  [3, 38, 78, 55, 70, 60, 28, 12, 5],
  [1, 8, 15, 20, 18, 12, 8, 5, 3],
  [1, 5, 10, 12, 10, 8, 5, 3, 2],
];

function getHeatColor(val: number): string {
  if (val >= 80) return "bg-emerald-600";
  if (val >= 60) return "bg-emerald-400";
  if (val >= 40) return "bg-emerald-200 dark:bg-emerald-800";
  if (val >= 20) return "bg-emerald-100 dark:bg-emerald-900/50";
  return "bg-muted/50";
}

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("6m");

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Platform-wide performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Period:</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[130px] h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Enrollments", value: "12,500", trend: "+8.2%", icon: Users },
          { label: "Active Students", value: "10,847", trend: "+5.1%", icon: GraduationCap },
          { label: "Revenue (YTD)", value: "$4.2M", trend: "+15.3%", icon: DollarSign },
          { label: "Avg. Attendance", value: "91.2%", trend: "+2.5%", icon: Activity },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {metric.trend}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Enrollment Forecasting */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Enrollment Forecasting</CardTitle>
            <p className="text-xs text-muted-foreground">Historical data with 6-month projection</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={enrollmentForecastConfig} className="h-[300px] w-full">
              <AreaChart data={enrollmentForecast}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="actual" stroke="#059669" fill="url(#actualGrad)" strokeWidth={2} connectNulls={false} />
                <Area type="monotone" dataKey="projected" stroke="#d97706" strokeDasharray="5 5" fill="url(#projGrad)" strokeWidth={2} connectNulls={false} />
              </AreaChart>
            </ChartContainer>
            <div className="flex gap-4 mt-2 justify-center">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-0.5 bg-emerald-600 rounded" />
                <span className="text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-0.5 bg-amber-600 rounded border-dashed" />
                <span className="text-muted-foreground">Projected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Collection Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Fee Collection Trend</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly fee collection over the past year</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={feeTrendConfig} className="h-[300px] w-full">
              <BarChart data={feeTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Feature Adoption */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Feature Adoption</CardTitle>
            <p className="text-xs text-muted-foreground">Module usage across all users</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={featureConfig} className="h-[300px] w-full">
              <BarChart data={featureAdoption} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v: number) => `${v}%`} />
                <YAxis dataKey="feature" type="category" width={90} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="usage" fill="#059669" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">User Engagement</CardTitle>
            <p className="text-xs text-muted-foreground">Average daily logins by day of week</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={engagementConfig} className="h-[300px] w-full">
              <AreaChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="logins" stroke="#059669" fill="url(#engGrad)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Health + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Health */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">System Health</CardTitle>
            <p className="text-xs text-muted-foreground">Real-time infrastructure monitoring</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <span className="text-sm font-bold">{metric.display}</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              );
            })}
            <div className="flex items-center gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400">All systems operational</span>
              <span className="text-xs text-muted-foreground ml-auto">Last checked: 2 min ago</span>
            </div>
          </CardContent>
        </Card>

        {/* Usage Heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Usage Heatmap</CardTitle>
            <p className="text-xs text-muted-foreground">Platform activity by time of day and day of week</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[400px]">
                {/* Header row */}
                <div className="flex gap-1 mb-1">
                  <div className="w-10" />
                  {heatmapHours.map((h) => (
                    <div key={h} className="flex-1 text-[10px] text-muted-foreground text-center">{h}</div>
                  ))}
                </div>
                {/* Data rows */}
                {heatmapDays.map((day, di) => (
                  <div key={day} className="flex gap-1 mb-1">
                    <div className="w-10 text-[10px] text-muted-foreground flex items-center">{day}</div>
                    {heatmapData[di].map((val, hi) => (
                      <div key={hi} className={`flex-1 aspect-square rounded-sm flex items-center justify-center text-[9px] font-medium text-white/90 cursor-default ${getHeatColor(val)}`}>
                        {val > 20 ? val : ""}
                      </div>
                    ))}
                  </div>
                ))}
                {/* Legend */}
                <div className="flex items-center gap-2 mt-3 justify-center">
                  <span className="text-[10px] text-muted-foreground">Less</span>
                  <div className="w-3 h-3 rounded-sm bg-muted/50" />
                  <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/50" />
                  <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-800" />
                  <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                  <div className="w-3 h-3 rounded-sm bg-emerald-600" />
                  <span className="text-[10px] text-muted-foreground">More</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
