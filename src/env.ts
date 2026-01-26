import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema
   */
  server: {
    // Database URLs - Supabase uses two different poolers
    // DATABASE_URL (port 6543): Transaction pooler for Next.js app runtime
    DATABASE_URL: z.string().url().optional(),
    // DATABASE_URL_MIGRATIONS (port 5432): Session pooler for Drizzle migrations
    DATABASE_URL_MIGRATIONS: z.string().url().optional(),
    
    // Supabase - optional for now
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    
    // Better Auth
    BETTER_AUTH_SECRET: z.string().min(32).default("development-secret-key-change-in-prod-32chars"),
    BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
    
    // WhatsApp Business API
    WHATSAPP_API_URL: z.string().url().optional(),
    WHATSAPP_API_TOKEN: z.string().optional(),
    WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
    
    // Voice AI Service
    VOICE_AI_API_URL: z.string().url().optional(),
    VOICE_AI_API_KEY: z.string().optional(),
    
    // Email Provider
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    EMAIL_FROM: z.string().email().optional(),
    
    // AI/LLM Orchestrator
    OPENAI_API_KEY: z.string().optional(),
    LLM_MODEL: z.string().default("gpt-4-turbo"),
    
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },

  /**
   * Client-side environment variables schema
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  },

  /**
   * Runtime environment variables
   */
  runtimeEnv: {
    // Server
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_MIGRATIONS: process.env.DATABASE_URL_MIGRATIONS,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL,
    WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    VOICE_AI_API_URL: process.env.VOICE_AI_API_URL,
    VOICE_AI_API_KEY: process.env.VOICE_AI_API_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    LLM_MODEL: process.env.LLM_MODEL,
    NODE_ENV: process.env.NODE_ENV,
    
    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  /**
   * Skip validation only if explicitly set
   */
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",

  /**
   * Allow empty strings for optional variables
   */
  emptyStringAsUndefined: true,
});
