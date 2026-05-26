"use client"

import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"
import { disableCrossTabSync } from "@/lib/session-utils"
import { installFetchInterceptor } from "@/lib/fetch-interceptor"

// Run both guards as early as possible — before any component renders
if (typeof window !== "undefined") {
  // 1. Block NextAuth cross-tab sync so session changes in one tab don't
  //    propagate to others via BroadcastChannel / localStorage.
  disableCrossTabSync()

  // 2. Patch window.fetch to attach `Authorization: Bearer <tab-jwt>` to
  //    all /api/ requests.  Each tab has its own JWT in sessionStorage, so
  //    every tab's API calls are authenticated with the right identity even
  //    when the shared next-auth cookie belongs to a different user.
  installFetchInterceptor()
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Double-check on mount (handles any SSR / hydration edge cases)
    disableCrossTabSync()
    installFetchInterceptor()
  }, [])

  return (
    <SessionProvider
      // Disable all automatic session re-fetching.
      // We no longer rely on the NextAuth session cookie for auth decisions —
      // each tab uses its own per-tab JWT via the Authorization header.
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}
