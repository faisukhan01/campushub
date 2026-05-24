import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

function SkeletonBlock({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shine animate-pulse rounded-md",
        className
      )}
      style={style}
    />
  );
}

// ---- Page Skeleton ----
export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-7 w-48" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <SkeletonBlock className="h-9 w-24 rounded-lg" />
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-9 w-9 rounded-lg" />
              <SkeletonBlock className="h-4 w-14 rounded-full" />
            </div>
            <SkeletonBlock className="h-6 w-24" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Two content areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-8 w-20 rounded-md" />
          </div>
          <SkeletonBlock className="h-[200px] w-full rounded-lg" />
        </div>
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-5 w-28" />
            <SkeletonBlock className="h-8 w-20 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBlock className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Card Skeleton ----
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 space-y-3",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <SkeletonBlock className="h-11 w-11 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <SkeletonBlock className="h-6 w-16 rounded-full" />
        <SkeletonBlock className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

// ---- Table Skeleton ----
interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function TableSkeleton({
  columns = 5,
  rows = 5,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        className
      )}
    >
      {/* Table header */}
      <div className="border-b bg-muted/30 px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonBlock
              key={`head-${i}`}
              className={cn("h-3.5", i === 0 ? "w-1/5" : "flex-1")}
            />
          ))}
        </div>
      </div>
      {/* Table rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={`row-${rowIdx}`} className="px-4 py-3">
            <div className="flex items-center gap-4">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <SkeletonBlock
                  key={`cell-${rowIdx}-${colIdx}`}
                  className={cn(
                    "h-4 rounded",
                    colIdx === 0 ? "w-1/5" : "flex-1"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Chart Skeleton ----
export function ChartSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-5 w-36" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-7 w-16 rounded-md" />
          <SkeletonBlock className="h-7 w-16 rounded-md" />
        </div>
      </div>
      {/* Chart placeholder with fake axes */}
      <div className="relative h-[220px] w-full rounded-lg bg-muted/20 overflow-hidden">
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={`y-${i}`} className="h-2 w-6" />
          ))}
        </div>
        {/* Chart area */}
        <div className="absolute left-10 right-0 top-0 bottom-6">
          {/* Grid lines */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`grid-${i}`}
              className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/10"
              style={{ top: `${(i + 1) * 25}%` }}
            />
          ))}
          {/* Fake bar chart */}
          <div className="absolute inset-x-2 bottom-1 flex items-end justify-around gap-2 h-[calc(100%-8px)]">
            {[65, 45, 80, 55, 70, 40, 85, 60, 50, 75].map((h, i) => (
              <SkeletonBlock
                key={`bar-${i}`}
                className="w-full max-w-[32px] rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        {/* X-axis */}
        <div className="absolute bottom-0 left-10 right-0 h-6 flex items-center justify-around">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonBlock key={`x-${i}`} className="h-2 w-4" />
          ))}
        </div>
      </div>
    </div>
  );
}
