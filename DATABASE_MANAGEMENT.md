# Database Management Guide

This guide explains how to manage your database, including clearing dummy data and starting fresh with real data.

## 🗄️ Database Overview

The system uses **SQLite** for local development and **Turso** (LibSQL) for production. The database schema supports:

- **Multi-tenancy**: SuperAdmin → Institutes → Branches
- **User Roles**: SuperAdmin, Institute Admin, Branch Admin, Teacher, Student, Parent
- **Academic Management**: Departments, Programs, Batches, Courses, Enrollments
- **Learning Features**: Assignments, Assessments, Attendance, Grades
- **Administrative**: Fees, Announcements, Messages, Support Tickets

---

## 🧹 Clearing Dummy Data

### Why Clear Dummy Data?

The seed file (`prisma/seed.ts`) creates demo data for testing:
- 1 Institute (Greenfield University)
- 2 Branches
- 15 Users (admins, teachers, students, parents)
- 8 Courses with enrollments
- Sample attendance, assignments, grades, etc.

**This dummy data should be removed before using the system with real users.**

### How to Clear Dummy Data

Run the following command:

```bash
npm run db:clear
```

Or directly:

```bash
node scripts/clear-dummy-data.mjs
```

### What Gets Preserved?

The clear script **preserves**:
- ✅ **SuperAdmin users** (if any exist)
- ✅ **Database schema** (all tables remain intact)

The clear script **removes**:
- ❌ All institutes, branches, departments
- ❌ All programs, batches, courses
- ❌ All non-SuperAdmin users (teachers, students, parents, admins)
- ❌ All academic data (enrollments, attendance, assignments, grades)
- ❌ All fees, announcements, messages, notifications

---

## 👤 Managing SuperAdmin Users

### Check for SuperAdmin

After clearing data, verify if a SuperAdmin exists:

```bash
# Using Prisma Studio
npx prisma studio

# Or check the database directly
```

### Create a SuperAdmin

If no SuperAdmin exists, create one:

```bash
node scripts/seed-superadmin.mjs
```

Or update an existing user to SuperAdmin:

```bash
node scripts/update-superadmin.mjs
```

---

## 🔄 Database Commands Reference

### Development Commands

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema changes to database (no migrations)
npm run db:push

# Create and apply migrations
npm run db:migrate

# Reset database (⚠️ deletes all data)
npm run db:reset

# Clear dummy data only (preserves SuperAdmin)
npm run db:clear

# Seed dummy data (for testing)
npm run db:seed
```

### Production Commands

For production (Turso), update your `.env`:

```env
DATABASE_URL="file:./dev.db"                    # Local development
TURSO_DATABASE_URL="libsql://your-db.turso.io"  # Production
TURSO_AUTH_TOKEN="your-token-here"              # Production auth
```

---

## 📋 Workflow for Going Live

### Step 1: Clear Dummy Data

```bash
npm run db:clear
```

### Step 2: Verify SuperAdmin

Check that at least one SuperAdmin user exists. If not, create one:

```bash
node scripts/seed-superadmin.mjs
```

### Step 3: Login as SuperAdmin

1. Start the application: `npm run dev`
2. Navigate to: `http://localhost:3000`
3. Login with SuperAdmin credentials
4. Select "Super Admin" role

### Step 4: Create Real Data

As SuperAdmin, you can now:

1. **Create Institutes** - Add your actual educational institutions
2. **Create Institute Admins** - Assign admins to manage each institute
3. **Let Institute Admins create**:
   - Branches
   - Departments
   - Programs
   - Branch Admins
4. **Let Branch Admins create**:
   - Batches
   - Courses
   - Teachers
   - Students

---

## 🔐 User Role Hierarchy

```
SuperAdmin (Platform Owner)
    ↓
Institute Admin (Per Institute)
    ↓
Branch Admin (Per Branch)
    ↓
Teachers & Students (Per Branch)
```

### Role Permissions

| Role | Can Create | Can Manage |
|------|-----------|------------|
| **SuperAdmin** | Institutes, Institute Admins | All institutes, all data |
| **Institute Admin** | Branches, Departments, Programs, Branch Admins | Own institute data |
| **Branch Admin** | Batches, Courses, Teachers, Students | Own branch data |
| **Teacher** | Assignments, Attendance, Grades | Own courses |
| **Student** | Submissions | Own enrollments |
| **Parent** | - | View child's data |

---

## 🚨 Important Notes

### ⚠️ Before Running db:clear

- **Backup your database** if you have any data you want to keep
- Ensure you have SuperAdmin credentials saved
- Inform all users that the system will be reset

### ⚠️ Never Run db:seed in Production

The seed script is **only for development/testing**. It will:
- Delete all existing data
- Create fake "Greenfield University" data
- Use dummy passwords and emails

### ⚠️ Database Backups

For SQLite (development):
```bash
cp dev.db dev.db.backup
```

For Turso (production):
```bash
# Use Turso CLI to create backups
turso db shell your-db --dump > backup.sql
```

---

## 🐛 Troubleshooting

### "No SuperAdmin users found" after clearing

**Solution**: Create a SuperAdmin user:
```bash
node scripts/seed-superadmin.mjs
```

### "Cannot find module '@prisma/client'"

**Solution**: Generate Prisma Client:
```bash
npm run db:generate
```

### Schema changes not reflected

**Solution**: Push schema changes:
```bash
npm run db:push
```

### Need to start completely fresh

**Solution**: Reset everything (⚠️ deletes all data):
```bash
npm run db:reset
```

---

## 📞 Support

For issues or questions:
1. Check the [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
2. Review the [PORTAL_OVERVIEW.md](./PORTAL_OVERVIEW.md)
3. Inspect the database schema: `prisma/schema.prisma`
4. Use Prisma Studio to inspect data: `npx prisma studio`

---

## 📝 Quick Reference

| Task | Command |
|------|---------|
| Clear dummy data | `npm run db:clear` |
| Create SuperAdmin | `node scripts/seed-superadmin.mjs` |
| Seed dummy data | `npm run db:seed` |
| View database | `npx prisma studio` |
| Generate client | `npm run db:generate` |
| Push schema | `npm run db:push` |
| Reset everything | `npm run db:reset` |

---

**Last Updated**: May 4, 2026
