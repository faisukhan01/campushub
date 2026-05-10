/**
 * Utility to disable NextAuth's cross-tab session synchronization
 * This prevents automatic sign-in/sign-out across multiple tabs
 */

let isInitialized = false;

/**
 * Completely disables cross-tab session synchronization by:
 * 1. Blocking all storage events related to NextAuth
 * 2. Overriding BroadcastChannel if used
 * 3. Preventing visibility change triggers
 */
export function disableCrossTabSync() {
  if (typeof window === 'undefined' || isInitialized) return;
  
  isInitialized = true;

  // Block storage events at the capture phase (highest priority)
  const blockStorageEvent = (e: StorageEvent) => {
    if (e.key && (
      e.key.includes('next-auth') || 
      e.key.includes('nextauth') ||
      e.key.includes('session-token') ||
      e.key.includes('__Secure-next-auth')
    )) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      return;
    }
  };

  // Add listener at capture phase with highest priority
  window.addEventListener('storage', blockStorageEvent, { capture: true });

  // Override BroadcastChannel to prevent cross-tab messaging
  const OriginalBroadcastChannel = window.BroadcastChannel;
  if (OriginalBroadcastChannel) {
    window.BroadcastChannel = class extends OriginalBroadcastChannel {
      constructor(name: string) {
        super(name);
        // Block NextAuth channels
        if (name.includes('next-auth') || name.includes('nextauth')) {
          // Override postMessage to do nothing
          this.postMessage = () => {};
          // Override onmessage to never trigger
          this.onmessage = null;
        }
      }
    } as any;
  }

  // Prevent visibility change from triggering session refresh
  const blockVisibilityChange = (e: Event) => {
    if (document.visibilityState === 'visible') {
      // Don't let NextAuth know the tab became visible
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
  };

  // This prevents NextAuth from refetching session when tab becomes visible
  document.addEventListener('visibilitychange', blockVisibilityChange, { capture: true });

  console.log('[Session] Cross-tab synchronization disabled');
}
