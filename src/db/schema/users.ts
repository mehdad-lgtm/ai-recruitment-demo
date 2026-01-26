import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums";

// ================================================
// USERS TABLE (Core user accounts for all roles)
// Better Auth compatible schema
// ================================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("recruiter"),
  
  // Additional profile info
  phone: varchar("phone", { length: 20 }),
  department: varchar("department", { length: 100 }),
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// SESSIONS TABLE (Better Auth sessions)
// ================================================

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// ACCOUNTS TABLE (OAuth/Social login - Better Auth)
// ================================================

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: varchar("provider_id", { length: 50 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"), // Hashed with Argon2
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// VERIFICATION TABLE (Email verification - Better Auth)
// ================================================

export const verifications = pgTable("verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// RECRUITERS TABLE (Field recruiters with QR codes)
// ================================================

export const recruiters = pgTable("recruiters", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  
  // Recruiter specific info
  recruiterId: varchar("recruiter_id", { length: 50 }).notNull().unique(), // Unique ID for QR generation
  qrCode: text("qr_code"), // Generated QR code data/URL
  qrCodeGeneratedAt: timestamp("qr_code_generated_at", { withTimezone: true }),
  
  // Performance metrics
  totalCandidates: integer("total_candidates").default(0),
  successfulPlacements: integer("successful_placements").default(0),
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// INTERVIEWERS TABLE
// ================================================

export const interviewers = pgTable("interviewers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  
  // Calendar integration
  calendarId: varchar("calendar_id", { length: 255 }), // Google Calendar ID
  calendarSyncEnabled: boolean("calendar_sync_enabled").default(true),
  lastCalendarSync: timestamp("last_calendar_sync", { withTimezone: true }),
  
  // Availability settings
  maxCandidatesPerSession: integer("max_candidates_per_session").default(10),
  defaultSessionDuration: integer("default_session_duration").default(60), // in minutes
  
  // Preferences
  preferredLanguages: jsonb("preferred_languages").$type<string[]>().default(["english"]),
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// Need to import integer
// ================================================

// ================================================
// RELATIONS
// ================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  recruiter: one(recruiters, {
    fields: [users.id],
    references: [recruiters.userId],
  }),
  interviewer: one(interviewers, {
    fields: [users.id],
    references: [interviewers.userId],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const recruitersRelations = relations(recruiters, ({ one }) => ({
  user: one(users, {
    fields: [recruiters.userId],
    references: [users.id],
  }),
}));

export const interviewersRelations = relations(interviewers, ({ one }) => ({
  user: one(users, {
    fields: [interviewers.userId],
    references: [users.id],
  }),
}));
