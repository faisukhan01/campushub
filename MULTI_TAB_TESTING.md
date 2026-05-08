# Multi-Tab Testing Guide

## What Was Fixed

The platform now supports **independent sessions per browser tab**. This means:

✅ Each tab can have a different user logged in
✅ Logging out from one tab does NOT log out other tabs
✅ Each tab maintains its own authentication state
✅ You can test different portals simultaneously

## How It Works

### Technical Implementation

1. **Tab-Specific Session Storage**: Each tab gets a unique ID stored in `sessionStorage`
2. **Independent State Management**: User data is stored per-tab using the unique tab ID
3. **No Cross-Tab Sync**: NextAuth session synchronization is disabled
4. **Local Logout**: Logout only clears the current tab's session, not the global cookie

### Key Changes Made

1. **`src/app/page.tsx`**:
   - Disabled `refetchOnWindowFocus` in `useSession()`
   - Modified session sync to only run on initial load
   - Removed automatic logout when NextAuth session changes

2. **`src/components/app-header.tsx`**:
   - Changed logout to use Zustand store's `logout()` instead of NextAuth's `signOut()`
   - Removed NextAuth import

3. **`src/components/app-sidebar.tsx`**:
   - Changed logout to use Zustand store's `logout()` instead of NextAuth's `signOut()`
   - Removed NextAuth import

4. **`src/lib/tab-session.ts`** (already existed):
   - Provides tab-specific session management
   - Each tab gets a unique ID
   - User data stored per tab

## Testing Instructions

### Test 1: Multiple Users in Different Tabs

1. Open `http://localhost:3000` in **Tab 1**
2. Login as a **Student**
3. Open `http://localhost:3000` in **Tab 2** (new tab)
4. Login as a **Teacher**
5. Open `http://localhost:3000` in **Tab 3** (new tab)
6. Login as an **Admin**

**Expected Result**: Each tab shows a different portal with different navigation and features.

### Test 2: Independent Logout

1. With all 3 tabs open (from Test 1)
2. Go to **Tab 2** (Teacher)
3. Click logout
4. Switch to **Tab 1** (Student) - should still be logged in
5. Switch to **Tab 3** (Admin) - should still be logged in

**Expected Result**: Only Tab 2 logs out. Other tabs remain logged in.

### Test 3: Same User in Multiple Tabs

1. Open `http://localhost:3000` in **Tab 1**
2. Login as a **Student**
3. Open `http://localhost:3000` in **Tab 2**
4. Login as the **same Student**
5. Navigate to different pages in each tab

**Expected Result**: Both tabs work independently. Navigation in one tab doesn't affect the other.

### Test 4: Refresh Behavior

1. Login in **Tab 1**
2. Refresh the page
3. **Expected Result**: User remains logged in (session persists in sessionStorage)

### Test 5: New Tab from Existing Tab

1. Login in **Tab 1**
2. Right-click a link and "Open in new tab" OR press Ctrl+T for a new tab
3. Navigate to `http://localhost:3000` in the new tab
4. **Expected Result**: New tab shows login page (each tab has independent session)

## Demo Credentials

Use these credentials for testing:

### Student Portal
- Email: `ali.hassan@student.beaconhouse.edu.pk`
- Password: (check your seed data)

### Teacher Portal
- Email: `ahmed.khan@beaconhouse.edu.pk`
- Password: (check your seed data)

### Admin Portal
- Email: `tariq.bashir@beaconhouse.edu.pk`
- Password: (check your seed data)

## Troubleshooting

### Issue: All tabs still logging out together
**Solution**: Clear your browser cache and cookies, then restart the dev server

### Issue: Session not persisting on refresh
**Solution**: Check browser console for errors. Ensure sessionStorage is enabled.

### Issue: Can't login in second tab
**Solution**: Make sure you're using different credentials or the same credentials (both should work)

## Technical Notes

- Sessions are stored in `sessionStorage` (cleared when tab closes)
- Each tab has a unique ID: `tab_${timestamp}_${random}`
- NextAuth cookies are still present but not used for cross-tab sync
- The Zustand store reads from tab-specific sessionStorage on mount

## Benefits

1. **Better Testing**: Test multiple user roles simultaneously
2. **Better UX**: Users can have multiple accounts open
3. **Isolation**: Each tab is completely independent
4. **No Conflicts**: No race conditions or state conflicts between tabs
