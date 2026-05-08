/**
 * Tab-specific session management
 * Allows different users to be logged in on different tabs
 */

const TAB_SESSION_KEY = 'tab_session_id';
const TAB_USER_KEY = 'tab_user_data';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Generate unique tab ID
export function getTabId(): string {
  if (!isBrowser) return '';
  
  // Check if tab already has an ID in sessionStorage
  let tabId = sessionStorage.getItem(TAB_SESSION_KEY);
  
  if (!tabId) {
    // Generate new unique ID for this tab
    tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(TAB_SESSION_KEY, tabId);
  }
  
  return tabId;
}

// Store user data for this specific tab
export function setTabUser(userData: any) {
  if (!isBrowser) return;
  
  const tabId = getTabId();
  const key = `${TAB_USER_KEY}_${tabId}`;
  sessionStorage.setItem(key, JSON.stringify(userData));
}

// Get user data for this specific tab
export function getTabUser() {
  if (!isBrowser) return null;
  
  const tabId = getTabId();
  const key = `${TAB_USER_KEY}_${tabId}`;
  const data = sessionStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Clear user data for this specific tab
export function clearTabUser() {
  if (!isBrowser) return;
  
  const tabId = getTabId();
  const key = `${TAB_USER_KEY}_${tabId}`;
  sessionStorage.removeItem(key);
}

// Check if this tab has an active session
export function hasTabSession(): boolean {
  return getTabUser() !== null;
}
