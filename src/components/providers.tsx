"use client"

import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"
import { disableCrossTabSync } from "@/lib/session-utils"

// Initialize immediately when module loads
if (typeof window !== 'undefined') {
  disableCrossTabSync()
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Double-check on mount
  useEffect(() => {
    disableCrossTabSync()
  }, [])

  return (
    <SessionProvider 
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  )
}
