import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      instituteId?: string | null
      branchId?: string | null
      classLevel?: string | null
      section?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    instituteId?: string | null
    branchId?: string | null
    classLevel?: string | null
    section?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    role: string
    instituteId?: string | null
    branchId?: string | null
    classLevel?: string | null
    section?: string | null
  }
}
