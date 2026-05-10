import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null

          const identifier = credentials.email.trim()
          const providedName = credentials.name?.trim()
          
          // Try to find user by email first (for Admins)
          let user = await db.user.findUnique({
            where: { email: identifier },
          })

          // If not found, try rollNumber (for Students)
          if (!user) {
            user = await db.user.findFirst({
              where: { rollNumber: identifier, isActive: true },
            })
          }

          // If still not found, try employeeId (for Teachers)
          if (!user) {
            user = await db.user.findFirst({
              where: { employeeId: identifier, isActive: true },
            })
          }

          if (!user || !user.passwordHash || !user.isActive) return null

          // For Teachers and Students, verify the name matches
          // This adds an extra layer of security for non-email based logins
          if ((user.role === 'Teacher' || user.role === 'Student') && providedName) {
            // Case-insensitive name comparison
            const userNameLower = user.name.toLowerCase().trim()
            const providedNameLower = providedName.toLowerCase()
            
            if (userNameLower !== providedNameLower) {
              console.log(`Name mismatch for ${user.role} ${identifier}: expected "${user.name}", got "${providedName}"`)
              return null
            }
          }

          const valid = await bcrypt.compare(credentials.password, user.passwordHash)
          if (!valid) return null

          await db.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            instituteId: user.instituteId,
            branchId: user.branchId,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
        token.instituteId = user.instituteId
        token.branchId = user.branchId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId
        session.user.role = token.role
        session.user.instituteId = token.instituteId
        session.user.branchId = token.branchId
      }
      return session
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 0, // Disable session update on every request
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  debug: false,

  // Disable cross-tab session synchronization
  events: {
    async signIn() {
      // Prevent broadcasting sign-in event to other tabs
    },
    async signOut() {
      // Prevent broadcasting sign-out event to other tabs
    },
  },
}
