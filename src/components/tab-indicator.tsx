"use client";

import { useAppStore } from "@/store/app-store";
import { getTabId } from "@/lib/tab-session";
import { useEffect, useState } from "react";

/**
 * Visual indicator showing the current tab's session ID and user
 * Useful for debugging multi-tab sessions
 * Remove this component in production
 */
export function TabIndicator() {
  const currentUser = useAppStore((s) => s.currentUser);
  const [tabId, setTabId] = useState<string>("");

  useEffect(() => {
    setTabId(getTabId());
  }, []);

  if (!currentUser || process.env.NODE_ENV === "production") {
    return null;
  }

  const shortTabId = tabId.split("_").pop()?.slice(0, 6) || "unknown";

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-900/90 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-mono backdrop-blur-sm border border-slate-700">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Tab:</span>
          <span className="text-emerald-400">{shortTabId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">User:</span>
          <span className="text-blue-400">{currentUser.role}</span>
        </div>
        <div className="text-slate-500 text-[10px] mt-0.5">
          {currentUser.name}
        </div>
      </div>
    </div>
  );
}
