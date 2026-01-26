import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar
} from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import { recruiters } from "./users";

// ================================================
// QR CODES TABLE (Dynamic QR codes for BAs)
// ================================================

export const qrCodes = pgTable("qr_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  recruiterId: uuid("recruiter_id")
    .notNull()
    .references(() => recruiters.id, { onDelete: "cascade" }),
  
  // QR Code data
  code: varchar("code", { length: 100 }).notNull().unique(), // Unique code identifier
  qrImageUrl: text("qr_image_url"), // Generated QR code image URL
  
  // Landing page URL
  landingUrl: text("landing_url").notNull(),
  
  // Campaign/tracking
  campaignName: varchar("campaign_name", { length: 255 }),
  campaignSource: varchar("campaign_source", { length: 100 }),
  
  // Usage stats
  totalScans: integer("total_scans").default(0),
  uniqueScans: integer("unique_scans").default(0),
  lastScannedAt: timestamp("last_scanned_at", { withTimezone: true }),
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// QR SCANS TABLE (Tracking individual scans)
// ================================================

export const qrScans = pgTable("qr_scans", {
  id: uuid("id").primaryKey().defaultRandom(),
  qrCodeId: uuid("qr_code_id")
    .notNull()
    .references(() => qrCodes.id, { onDelete: "cascade" }),
  candidateId: uuid("candidate_id")
    .references(() => candidates.id, { onDelete: "set null" }),
  
  // Scan metadata
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  deviceType: varchar("device_type", { length: 50 }), // mobile, tablet, desktop
  
  // Location (if available)
  location: jsonb("location").$type<{
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }>(),
  
  // Conversion tracking
  convertedToCandidate: boolean("converted_to_candidate").default(false),
  convertedAt: timestamp("converted_at", { withTimezone: true }),
  
  // Timestamps
  scannedAt: timestamp("scanned_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// WHATSAPP DEEP LINKS TABLE
// ================================================

export const whatsappDeepLinks = pgTable("whatsapp_deep_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  qrCodeId: uuid("qr_code_id")
    .references(() => qrCodes.id, { onDelete: "set null" }),
  candidateId: uuid("candidate_id")
    .references(() => candidates.id, { onDelete: "cascade" }),
  
  // Deep link data
  deepLinkUrl: text("deep_link_url").notNull(),
  prefilledMessage: text("prefilled_message"),
  
  // Language
  language: varchar("language", { length: 50 }).default("english"),
  
  // Usage tracking
  clicked: boolean("clicked").default(false),
  clickedAt: timestamp("clicked_at", { withTimezone: true }),
  messageSent: boolean("message_sent").default(false),
  messageSentAt: timestamp("message_sent_at", { withTimezone: true }),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// RELATIONS
// ================================================

export const qrCodesRelations = relations(qrCodes, ({ one, many }) => ({
  recruiter: one(recruiters, {
    fields: [qrCodes.recruiterId],
    references: [recruiters.id],
  }),
  scans: many(qrScans),
  deepLinks: many(whatsappDeepLinks),
}));

export const qrScansRelations = relations(qrScans, ({ one }) => ({
  qrCode: one(qrCodes, {
    fields: [qrScans.qrCodeId],
    references: [qrCodes.id],
  }),
  candidate: one(candidates, {
    fields: [qrScans.candidateId],
    references: [candidates.id],
  }),
}));

export const whatsappDeepLinksRelations = relations(whatsappDeepLinks, ({ one }) => ({
  qrCode: one(qrCodes, {
    fields: [whatsappDeepLinks.qrCodeId],
    references: [qrCodes.id],
  }),
  candidate: one(candidates, {
    fields: [whatsappDeepLinks.candidateId],
    references: [candidates.id],
  }),
}));
