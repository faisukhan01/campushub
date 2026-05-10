# Quick Sign In - Testing Checklist

## ✅ Pre-Testing Setup

- [x] Development server is running at `http://localhost:3000`
- [x] Test users exist in database
- [x] All passwords are set to `Test@123`
- [x] Code fix applied to `src/components/SignInPage.tsx`

## 🧪 Test Cases

### Test Case 1: Institute Admin Quick Sign In
**Steps:**
1. Open `http://localhost:3000`
2. Click the "Institute Admin" button (green icon)
3. Verify automatic sign-in

**Expected Result:**
- ✅ User is signed in as "Institute Admin"
- ✅ Redirected to Institute Admin dashboard
- ✅ No error messages displayed

**Credentials Used:**
- Email: `institute@example.com`
- Password: `Test@123`

---

### Test Case 2: Branch Admin Quick Sign In
**Steps:**
1. Sign out (if signed in)
2. Open `http://localhost:3000`
3. Click the "Branch Admin" button (blue icon)
4. Verify automatic sign-in

**Expected Result:**
- ✅ User is signed in as "Branch Admin"
- ✅ Redirected to Branch Admin dashboard
- ✅ No error messages displayed

**Credentials Used:**
- Email: `branch@example.com`
- Password: `Test@123`

---

### Test Case 3: Teacher Quick Sign In
**Steps:**
1. Sign out (if signed in)
2. Open `http://localhost:3000`
3. Click the "Teacher" button (purple icon)
4. Verify automatic sign-in

**Expected Result:**
- ✅ User is signed in as "Test Teacher"
- ✅ Redirected to Teacher dashboard
- ✅ No error messages displayed

**Credentials Used:**
- Employee ID: `T0001`
- Password: `Test@123`
- Name: `Test Teacher`

---

### Test Case 4: Student Quick Sign In
**Steps:**
1. Sign out (if signed in)
2. Open `http://localhost:3000`
3. Click the "Student" button (orange icon)
4. Verify automatic sign-in

**Expected Result:**
- ✅ User is signed in as "Test Student"
- ✅ Redirected to Student dashboard
- ✅ No error messages displayed

**Credentials Used:**
- Roll Number: `S0001`
- Password: `Test@123`
- Name: `Test Student`

---

## 🔍 Additional Verification Tests

### Test Case 5: Manual Login - Institute Admin
**Steps:**
1. Sign out (if signed in)
2. Manually enter: `institute@example.com`
3. Enter password: `Test@123`
4. Click "Sign In" button

**Expected Result:**
- ✅ User is signed in successfully
- ✅ Same behavior as Quick Sign In

---

### Test Case 6: Manual Login - Teacher with Name
**Steps:**
1. Sign out (if signed in)
2. Manually enter: `T0001`
3. Enter name: `Test Teacher`
4. Enter password: `Test@123`
5. Click "Sign In" button

**Expected Result:**
- ✅ User is signed in successfully
- ✅ Name field appears when using Employee ID

---

### Test Case 7: Invalid Credentials
**Steps:**
1. Sign out (if signed in)
2. Click any Quick Sign In button
3. Manually change password in browser console (if testing manually)
4. Or enter wrong credentials manually

**Expected Result:**
- ✅ Error message displayed: "Invalid credentials. Please check your information and try again."
- ✅ User remains on sign-in page
- ✅ No console errors

---

## 🚫 Negative Test Cases

### Test Case 8: SuperAdmin Blocked
**Steps:**
1. Try to sign in with SuperAdmin credentials (if any exist)

**Expected Result:**
- ✅ Error message: "Super Admin accounts cannot sign in here. Please visit /superadmin to access the Super Admin portal."
- ✅ User is signed out automatically
- ✅ Redirected to SuperAdmin portal message

---

## 📊 Browser Console Checks

Open browser DevTools (F12) and check:

- [ ] No JavaScript errors in Console
- [ ] No failed network requests (except expected 401s before login)
- [ ] Session cookie is set after successful login
- [ ] No CORS errors
- [ ] No authentication errors

---

## 🎯 Success Criteria

All tests must pass with:
- ✅ No "ERR_CONNECTION_REFUSED" errors
- ✅ No "Hmmm... can't reach this page" errors
- ✅ All 4 Quick Sign In buttons working
- ✅ Manual login still working
- ✅ Proper role-based redirects
- ✅ No console errors

---

## 🐛 If Tests Fail

1. **Check dev server is running:**
   ```bash
   npm run dev
   ```

2. **Verify test users exist:**
   ```bash
   node scripts/check-test-users.mjs
   ```

3. **Test authentication flow:**
   ```bash
   node scripts/test-auth.mjs
   ```

4. **Check browser console for errors**

5. **Clear browser cache and cookies**

6. **Restart dev server:**
   - Stop: Ctrl+C
   - Start: `npm run dev`

---

## 📝 Test Results

**Date:** _____________
**Tester:** _____________

| Test Case | Status | Notes |
|-----------|--------|-------|
| Institute Admin Quick Sign In | ⬜ Pass / ⬜ Fail | |
| Branch Admin Quick Sign In | ⬜ Pass / ⬜ Fail | |
| Teacher Quick Sign In | ⬜ Pass / ⬜ Fail | |
| Student Quick Sign In | ⬜ Pass / ⬜ Fail | |
| Manual Login - Institute Admin | ⬜ Pass / ⬜ Fail | |
| Manual Login - Teacher | ⬜ Pass / ⬜ Fail | |
| Invalid Credentials | ⬜ Pass / ⬜ Fail | |
| SuperAdmin Blocked | ⬜ Pass / ⬜ Fail | |

**Overall Status:** ⬜ All Tests Passed / ⬜ Some Tests Failed

**Additional Comments:**
_____________________________________________
_____________________________________________
_____________________________________________
