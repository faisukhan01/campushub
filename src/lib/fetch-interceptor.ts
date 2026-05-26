/**
 * Global fetch interceptor for tab-isolated authentication.
 *
 * Patches window.fetch so that every request to /api/* automatically
 * includes an `Authorization: Bearer <tab-jwt>` header.
 *
 * Each browser tab stores its own JWT in sessionStorage (written by the
 * /api/auth/tab-login endpoint after a successful sign-in).  The middleware
 * (proxy.ts) validates this header and uses it in preference to the shared
 * next-auth session cookie, giving every tab a fully independent auth context.
 */

import { getTabJwt } from "@/lib/tab-session"

let installed = false

export function installFetchInterceptor() {
  if (typeof window === "undefined" || installed) return
  installed = true

  const originalFetch = window.fetch.bind(window)

  window.fetch = function tabAwareFetch(
    input: RequestInfo | URL,
    init: RequestInit = {}
  ) {
    // Determine the URL string
    let url = ""
    if (typeof input === "string") {
      url = input
    } else if (input instanceof URL) {
      url = input.href
    } else if (typeof input === "object" && "url" in input) {
      url = (input as Request).url
    }

    // Only inject for same-origin /api/ requests
    const isApiCall =
      url.startsWith("/api/") ||
      (url.startsWith(window.location.origin) &&
        new URL(url).pathname.startsWith("/api/"))

    if (isApiCall) {
      const tabJwt = getTabJwt()
      if (tabJwt) {
        // Merge headers without mutating the caller's object
        const existingHeaders = new Headers(init.headers)
        existingHeaders.set("Authorization", `Bearer ${tabJwt}`)
        init = { ...init, headers: existingHeaders }
      }
    }

    return originalFetch(input, init)
  }
}
