# Vercel Deployment Steps for CampusHub

## ✅ Issues Fixed

1. **Removed `output: "standalone"`** from `next.config.ts` - This was causing the middleware build error
2. **Added Prisma generation** to build script - Ensures Prisma Client is generated before build
3. **Added `postinstall` script** - Automatically generates Prisma Client after npm install
4. **Removed `.env` from git** - Security fix to prevent exposing credentials
5. **Added deployment documentation** - Complete guides for deployment
6. **Added `vercel.json`** - Vercel-specific configuration
7. **Updated Prisma schema** - Added `previewFeatures = ["driverAdapters"]` for Turso support

## 🚀 Deploy to Vercel - Step by Step

### Step 1: Set Up Turso Database (Production Database)

1. **Install Turso CLI** (if not already installed):
   ```bash
   # On Windows (PowerShell as Administrator)
   irm https://get.tur.so/install.ps1 | iex
   
   # Or download from: https://docs.turso.tech/cli/installation
   ```

2. **Login to Turso**:
   ```bash
   turso auth login
   ```

3. **Create a new database**:
   ```bash
   turso db create campushub-prod
   ```

4. **Get your database URL**:
   ```bash
   turso db show campushub-prod --url
   ```
   Copy this URL - you'll need it for Vercel environment variables.

5. **Create an auth token**:
   ```bash
   turso db tokens create campushub-prod
   ```
   Copy this token - you'll need it for Vercel environment variables.

6. **Push your schema to Turso**:
   ```bash
   # Set environment variables temporarily
   $env:TURSO_DATABASE_URL="your_turso_url_here"
   $env:TURSO_AUTH_TOKEN="your_turso_token_here"
   
   # Push the schema
   npx prisma db push
   ```

### Step 2: Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output - you'll need it for `NEXTAUTH_SECRET`.

### Step 3: Deploy to Vercel

1. **Go to Vercel Dashboard**:
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"

2. **Import Repository**:
   - Select "Import Git Repository"
   - Choose your GitHub account
   - Select the `campushub` repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `.next` (should be auto-detected)

4. **Add Environment Variables**:
   Click "Environment Variables" and add the following:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `TURSO_DATABASE_URL` | Your Turso database URL from Step 1 | Production, Preview, Development |
   | `TURSO_AUTH_TOKEN` | Your Turso auth token from Step 1 | Production, Preview, Development |
   | `NEXTAUTH_SECRET` | Your generated secret from Step 2 | Production, Preview, Development |
   | `NEXTAUTH_URL` | `https://your-project.vercel.app` | Production |
   | `NEXTAUTH_URL` | `https://your-project-preview.vercel.app` | Preview |
   | `NEXTAUTH_URL` | `http://localhost:3000` | Development |

   **Important Notes:**
   - For `NEXTAUTH_URL` in Production, use your actual Vercel domain (you'll get this after first deployment)
   - You can update `NEXTAUTH_URL` after the first deployment
   - Make sure to add variables to all three environments (Production, Preview, Development)

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Once deployed, you'll get a URL like `https://campushub-xyz.vercel.app`

6. **Update NEXTAUTH_URL**:
   - After first deployment, go to Project Settings → Environment Variables
   - Update `NEXTAUTH_URL` for Production to your actual Vercel URL
   - Redeploy the project

### Step 4: Create Super Admin User

After deployment, you need to create a super admin user in your Turso database:

**Option 1: Using Turso CLI**
```bash
turso db shell campushub-prod

-- Then run this SQL:
INSERT INTO User (id, email, password, name, role, createdAt, updatedAt)
VALUES (
  'superadmin-001',
  'admin@campushub.com',
  '$2a$10$YourHashedPasswordHere',
  'Super Admin',
  'SuperAdmin',
  datetime('now'),
  datetime('now')
);
```

**Option 2: Using Prisma Studio**
```bash
# Set environment variables
$env:TURSO_DATABASE_URL="your_turso_url"
$env:TURSO_AUTH_TOKEN="your_turso_token"

# Open Prisma Studio
npx prisma studio
```

**Option 3: Create a deployment script**
You can create a script that runs after deployment to seed the super admin.

### Step 5: Verify Deployment

1. Visit your deployed URL
2. Try accessing `/superadmin` route
3. Sign in with your super admin credentials
4. Verify all features are working

## 🔧 Troubleshooting

### Build Fails with "middleware.js.nft.json not found"
✅ **Fixed!** This was caused by `output: "standalone"` in next.config.ts. It has been removed.

### Database Connection Errors
- Verify your Turso credentials are correct in Vercel environment variables
- Make sure the database URL starts with `libsql://`
- Check that the auth token is valid and has the correct permissions

### NextAuth Errors
- Ensure `NEXTAUTH_SECRET` is set and is a long random string
- Verify `NEXTAUTH_URL` matches your actual deployment URL
- Check that all environment variables are set for the correct environment

### Prisma Client Not Generated
✅ **Fixed!** Added `postinstall` script that automatically generates Prisma Client.

### Environment Variables Not Working
- Make sure you've added them to the correct environment (Production/Preview/Development)
- After adding/updating environment variables, you need to redeploy
- Go to Deployments → Click the three dots → Redeploy

## 📝 Post-Deployment Checklist

- [ ] Turso database created and schema pushed
- [ ] All environment variables set in Vercel
- [ ] Application deployed successfully
- [ ] Super admin user created
- [ ] Can access the application at the Vercel URL
- [ ] Can sign in as super admin
- [ ] All API routes working correctly
- [ ] Middleware protecting routes properly

## 🔐 Security Notes

1. **Never commit `.env` file** - It has been removed from git tracking
2. **Use strong secrets** - Generate random strings for `NEXTAUTH_SECRET`
3. **Rotate credentials** - Periodically update your Turso auth tokens
4. **Monitor access logs** - Check Vercel logs for suspicious activity
5. **Use environment-specific URLs** - Different URLs for production/preview/development

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Turso Documentation](https://docs.turso.tech/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 Need Help?

If you encounter any issues:
1. Check the Vercel build logs
2. Check the Vercel runtime logs
3. Verify all environment variables are set correctly
4. Make sure your Turso database is accessible
5. Open an issue on GitHub with error details

---

**Your repository is now ready for deployment!** 🎉

The fixes have been pushed to: https://github.com/faisukhan01/campushub

You can now deploy to Vercel following the steps above.
