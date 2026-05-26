/**
 * Tab-specific session management.
 * Allows different users to be logged in on different browser tabs.
 *
 * Key guarantee: when a browser opens a new tab from an existing one
 * (right-click → "Open in new tab", Ctrl+click, window.open), Chrome/Edge
 * copies sessionStorage into the child tab.  We break that inheritance on
 * every non-reload navigation so every new tab starts anonymous.
 */

const TAB_SESSION_KEY = 'tab_session_id';
const TAB_USER_KEY = 'tab_user_data';
const TAB_JWT_KEY = 'tab_jwt';

const isBrowser = typeof window !== 'undefined';

// Module-level cache so getTabId() is idempotent within one page lifetime.
let _cachedTabId: string | null = null;

function isPageReload(): boolean {
  try {
    // Modern API (supported in all evergreen browsers)
    const nav = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming | undefined;
    if (nav) return nav.type === 'reload' || nav.type === 'back_forward';

    // Deprecated fallback for older browsers
    if (typeof performance !== 'undefined' && performance.navigation) {
      // 1 = reload, 2 = back/forward
      return performance.navigation.type === 1 || performance.navigation.type === 2;
    }
  } catch {
    // Ignore — treat as new navigation
  }
  return false;
}

/**
 * Returns the unique ID for this browser tab.
 *
 * On a reload the existing ID is kept so the signed-in session survives.
 * On any other navigation (fresh tab, link open, typed URL) a new ID is
 * generated and any inherited sessionStorage data is cleared.
 */
export function getTabId(): string {
  if (!isBrowser) return '';

  // Return cached value for the current page lifetime.
  if (_cachedTabId) return _cachedTabId;

  const stored = sessionStorage.getItem(TAB_SESSION_KEY);
  const reload = isPageReload();

  if (stored && reload) {
    // Reload of an existing tab — keep the session.
    _cachedTabId = stored;
  } else {
    // New tab, fresh navigation, or inherited sessionStorage — start clean.
    if (stored) {
      // Remove any user / JWT data that may have been copied from a parent tab.
      sessionStorage.removeItem(`${TAB_USER_KEY}_${stored}`);
      sessionStorage.removeItem(`${TAB_JWT_KEY}_${stored}`);
    }
    _cachedTabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(TAB_SESSION_KEY, _cachedTabId);
  }

  return _cachedTabId;
}

/** Store user data for this specific tab. */
export function setTabUser(userData: any) {
  if (!isBrowser) return;
  const key = `${TAB_USER_KEY}_${getTabId()}`;
  sessionStorage.setItem(key, JSON.stringify(userData));
}

/** Get user data for this specific tab. Returns null if not signed in. */
export function getTabUser() {
  if (!isBrowser) return null;
  const key = `${TAB_USER_KEY}_${getTabId()}`;
  const data = sessionStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/** Clear user data for this specific tab (sign-out). */
export function clearTabUser() {
  if (!isBrowser) return;
  const key = `${TAB_USER_KEY}_${getTabId()}`;
  sessionStorage.removeItem(key);
}

/** True when this tab has an active session. */
export function hasTabSession(): boolean {
  return getTabUser() !== null;
}

// ─── Per-tab JWT (used for API Authorization header) ────────────────────────

/**
 * Store the per-tab JWT returned by /api/auth/tab-login.
 * This token is sent as `Authorization: Bearer <token>` for every /api/ call
 * so that different tabs can authenticate as different users simultaneously,
 * completely independent of the shared next-auth session cookie.
 */
export function setTabJwt(jwt: string) {
  if (!isBrowser) return;
  sessionStorage.setItem(`${TAB_JWT_KEY}_${getTabId()}`, jwt);
}

/** Get the per-tab JWT for this browser tab. Returns null if not signed in. */
export function getTabJwt(): string | null {
  if (!isBrowser) return null;
  return sessionStorage.getItem(`${TAB_JWT_KEY}_${getTabId()}`);
}

/** Remove the per-tab JWT (sign-out). */
export function clearTabJwt() {
  if (!isBrowser) return;
  sessionStorage.removeItem(`${TAB_JWT_KEY}_${getTabId()}`);
}
