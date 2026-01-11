import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../../prisma";
import { sendResetPassword, sendVerificationEmail, type User } from "./mailer";
import { lastLoginMethod } from "better-auth/plugins"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.CORS_ORIGIN!, process.env.BETTER_AUTH_URL!],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }: { user: User, url: string, token: string }, request: any) => {
      await sendResetPassword({ user, url, token });
    },
  },
  user: {
    deleteUser: {
      enabled: true
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url, token }) => {
      await sendVerificationEmail({ user, url })
    },

  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${process.env.CORS_ORIGIN!}/api/auth/callback/google`,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      domain: ".onrender.com",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    },
    trustProxy: true,
  },
  plugins: [
    lastLoginMethod()
  ]
});