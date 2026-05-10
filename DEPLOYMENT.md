# CampusHub Deployment Guide

## Deploying to Vercel

### Prerequisites
1. A Vercel account
2. A Turso database (for production)
3. GitHub repository connected to Vercel

### Environment Variables

You need to set the following environment variables in your Vercel project settings:

```bash
# Database Configuration (Turso)
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Steps to Deploy

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - In your Vercel project settings, go to "Environment Variables"
   - Add all the required environment variables listed above
   - Make sure to add them for Production, Preview, and Development environments

3. **Deploy**
   - Vercel will automatically deploy your application
   - The build process will:
     - Install dependencies
     - Generate Prisma Client
     - Build the Next.js application
     - Deploy to Vercel's edge network

### Database Setup (Turso)

1. **Create a Turso Database**
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Login to Turso
   turso auth login
   
   # Create a new database
   turso db create campus-prod
   
   # Get the database URL
   turso db show campus-prod --url
   
   # Create an auth token
   turso db tokens create campus-prod
   ```

2. **Push Schema to Turso**
   ```bash
   # Set environment variables locally
   export TURSO_DATABASE_URL="your_turso_url"
   export TURSO_AUTH_TOKEN="your_turso_token"
   
   # Push the schema
   npx prisma db push
   ```

### Post-Deployment

1. **Create Super Admin**
   - After deployment, you'll need to create a super admin user
   - You can do this by running the seed script or manually in your database

2. **Verify Deployment**
   - Visit your deployed URL
   - Try logging in with your super admin credentials
   - Check that all features are working correctly

### Troubleshooting

**Build Errors:**
- Make sure all environment variables are set correctly
- Check that Prisma schema is valid
- Verify that all dependencies are installed

**Database Connection Issues:**
- Verify Turso credentials are correct
- Check that the database URL is accessible
- Ensure the auth token has the correct permissions

**Middleware Issues:**
- The middleware is configured to work with Vercel's edge runtime
- Make sure `output: "standalone"` is NOT in next.config.ts for Vercel deployments

### Local Development

For local development, you can use SQLite:

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to local database
npm run db:push

# Run development server
npm run dev
```

### Support

For issues or questions, please open an issue on the GitHub repository.
