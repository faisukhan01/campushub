# CampusHub - Educational Management System

A comprehensive educational management system built with Next.js, Prisma, and NextAuth.

## Features

- 🏫 **Multi-tenant Architecture** - Support for multiple institutes and branches
- 👥 **Role-based Access Control** - SuperAdmin, InstituteAdmin, BranchAdmin, Teacher, Student, Parent
- 📚 **Course Management** - Manage courses, batches, and enrollments
- 📊 **Dashboard Analytics** - Role-specific dashboards with insights
- 🔐 **Secure Authentication** - NextAuth with session management
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and Shadcn UI components
- 🌙 **Dark Mode** - Full dark mode support

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite (local) / Turso (production)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **UI Components:** Shadcn UI
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **Data Fetching:** TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/faisukhan01/campushub.git
   cd campushub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your environment variables:
   ```env
   DATABASE_URL=file:./dev.db
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

5. **Push database schema**
   ```bash
   npm run db:push
   ```

6. **Create super admin user**
   ```bash
   npm run create:superadmin
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
campushub/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── public/                # Static assets
├── scripts/               # Utility scripts
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API routes
│   │   ├── superadmin/   # Super admin pages
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── pages/        # Page components
│   │   └── ui/           # UI components
│   ├── lib/              # Utility functions
│   │   ├── auth.ts       # Authentication config
│   │   ├── db.ts         # Database client
│   │   └── utils.ts      # Helper functions
│   └── store/            # Zustand stores
├── middleware.ts         # Next.js middleware
└── next.config.ts        # Next.js configuration
```

## User Roles

### SuperAdmin
- Full system access
- Manage institutes and subscriptions
- View all data across institutes

### InstituteAdmin
- Manage institute settings
- Create and manage branches
- Manage users within institute

### BranchAdmin
- Manage branch settings
- Manage courses and batches
- Manage teachers and students

### Teacher
- View assigned courses
- Manage attendance and grades
- Communicate with students

### Student
- View enrolled courses
- Access learning materials
- Track academic progress

### Parent
- Monitor child's progress
- View attendance and grades
- Communicate with teachers

## API Routes

All API routes are protected with authentication and role-based access control:

- `/api/auth/*` - Authentication endpoints
- `/api/institutes` - Institute management (SuperAdmin only)
- `/api/branches` - Branch management (Admin roles)
- `/api/users` - User management
- `/api/courses` - Course management
- `/api/attendance` - Attendance tracking
- `/api/grades` - Grade management
- And many more...

## Database Schema

The system uses a multi-tenant architecture with the following main entities:

- **Institute** - Top-level organization
- **Branch** - Sub-organization within an institute
- **User** - System users with different roles
- **Course** - Academic courses
- **Batch** - Student groups
- **Enrollment** - Student-course relationships
- **Attendance** - Attendance records
- **Grade** - Academic grades

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/faisukhan01/campushub)

**Important:** Make sure to set the following environment variables in Vercel:

- `TURSO_DATABASE_URL` - Your Turso database URL
- `TURSO_AUTH_TOKEN` - Your Turso auth token
- `NEXTAUTH_SECRET` - A random secret for NextAuth
- `NEXTAUTH_URL` - Your production URL

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:generate` - Generate Prisma Client
- `npm run create:superadmin` - Create super admin user
- `npm run create:testusers` - Create test users

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the maintainers.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Database powered by [Turso](https://turso.tech/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
