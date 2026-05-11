# 🚀 Vercel Deployment Setup Guide

## ⚠️ CRITICAL: DO NOT Push .env to GitHub!

Your `.env` file is already in `.gitignore` - this is correct and should stay that way!

## 📋 Environment Variables to Add in Vercel

You need to add these environment variables **directly in the Vercel Dashboard**, not by pushing `.env` to GitHub.

### Step-by-Step Instructions:

### 1️⃣ Go to Vercel Dashboard

1. Visit: https://vercel.com
2. Log in to your account
3. Select your project: **campushub** (or whatever your project is named)

### 2️⃣ Navigate to Environment Variables

1. Click on **Settings** tab
2. Click on **Environment Variables** in the left sidebar

### 3️⃣ Add These Variables

Add each of these variables one by one:

#### Variable 1: TURSO_DATABASE_URL
```
Name: TURSO_DATABASE_URL
Value: libsql://campus-prod-faisukhan01.aws-ap-south-1.turso.io
Environment: Production, Preview, Development (select all three)
```

#### Variable 2: TURSO_AUTH_TOKEN
```
Name: TURSO_AUTH_TOKEN
Value: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc4MTM5MTAsImlkIjoiMDE5ZGVkZjUtZjIwMS03ZmFjLWJlYzEtYjlkMDJhYTIwMjJiIiwicmlkIjoiYWRiNGQ0YmItNDg4ZC00ZGU0LTg3MWMtMTZjYzBkMGFkMWM0In0.SPrIFL7Nn3MkKL-u5WOOGifk8U8hcAIGulmXgtGiBdkSqBDyoox-ZGItQiTgRcjGDhgWfMVYnD-eQKcE9IOyAA
Environment: Production, Preview, Development (select all three)
```

#### Variable 3: NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: 9445981ce1f0e8a4a64e0ca3e680abec40dd60bd74bb6f661ed0c8fcdf7e56e5
Environment: Production, Preview, Development (select all three)
```

#### Variable 4: NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://campushub-sepia-eta.vercel.app
Environment: Production only
```

**Note:** For Preview and Development, you can leave NEXTAUTH_URL unset or set it to your preview URL.

### 4️⃣ Redeploy Your Application

After adding all environment variables:

**Option A: Automatic Redeploy**
- Vercel may automatically trigger a redeploy when you add environment variables
- Check the "Deployments" tab to see if a new deployment started

**Option B: Manual Redeploy**
1. Go to the **Deployments** tab
2. Find your latest deployment
3. Click the three dots (⋯) menu
4. Click **Redeploy**
5. Confirm the redeployment

### 5️⃣ Wait for Deployment to Complete

- Watch the deployment logs
- Wait for the status to show "Ready"
- This usually takes 2-5 minutes

### 6️⃣ Test Your Login

Once deployment is complete:

1. Go to: https://campushub-sepia-eta.vercel.app/superadmin
2. Use these credentials:
   - **Email:** `superadmin@campushub.com`
   - **Password:** `SuperAdmin@123`
3. Click "Access Super Admin"

## ✅ Will This Work?

**YES!** Here's why I'm confident:

✅ The super admin user exists in your Turso database (verified)
✅ The password hash is correct (tested and verified)
✅ The role is set to "SuperAdmin" (verified)
✅ The user is active (verified)
✅ Your app code is correct and working
✅ The only missing piece was the environment variables in Vercel

Once you add the environment variables and redeploy, your deployed app will:
1. Connect to the Turso production database (instead of trying to use a local SQLite file)
2. Find the super admin user we created
3. Validate the password correctly
4. Grant you access to the super admin panel

## 🔐 Super Admin Credentials

```
Email: superadmin@campushub.com
Password: SuperAdmin@123
```

**⚠️ IMPORTANT:** Change this password immediately after your first login!

## 🆘 Troubleshooting

If it still doesn't work after following these steps:

1. **Check Environment Variables Are Set:**
   - Go to Vercel Settings → Environment Variables
   - Verify all 4 variables are listed
   - Make sure they're enabled for "Production"

2. **Check Deployment Logs:**
   - Go to Deployments tab
   - Click on the latest deployment
   - Check for any errors in the build or runtime logs

3. **Clear Browser Cache:**
   - Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
   - Or try in an incognito/private window

4. **Verify Database Connection:**
   - The deployment logs should show successful database connection
   - Look for any Prisma or database-related errors

## 📝 Additional Notes

- Your `.env` file is safely ignored by Git (`.env*` is in `.gitignore`)
- Never commit sensitive credentials to your repository
- Always use Vercel's Environment Variables feature for production secrets
- You can also use Vercel CLI: `vercel env pull` to sync env vars locally

## 🎯 Next Steps After Successful Login

1. Change your super admin password
2. Create your institute
3. Set up branches and departments
4. Create additional admin users
5. Configure your system settings

---

**Need Help?** If you encounter any issues, check the deployment logs in Vercel or let me know!
