import { db } from "@/db";
import * as schema from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  // Email & Password Authentication
  emailAndPassword: {
    enabled: true,
    // Use Argon2 for password hashing
    password: {
      hash: async (password: string) => {
        const a = await import("argon2");
        return await a.hash(password, {
          type: a.argon2id,
          memoryCost: 65536, // 64 MB
          timeCost: 3,
          parallelism: 4,
        });
      },
      verify: async ({ hash, password }: { hash: string; password: string }) => {
        const a = await import("argon2");
        return await a.verify(hash, password);
      },
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // User configuration
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "recruiter",
        input: false, // Don't allow setting role on signup
      },
      phone: {
        type: "string",
        required: false,
      },
      department: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: false,
      },
    },
  },

  // Account linking
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "microsoft"],
    },
  },

  // Rate limiting
  rateLimit: {
    window: 60, // 1 minute
    max: 100, // 100 requests per minute
  },

  // Advanced security
  advanced: {
    database: {
      generateId: "uuid", // Use UUID for all tables
    },
    cookiePrefix: "ai_recruit",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});

// Export auth types
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
