import { relations } from "drizzle-orm";
import {
    boolean,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar
} from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import {
    auditActionEnum,
    eventTypeEnum,
    notificationStatusEnum,
    notificationTypeEnum
} from "./enums";
import { users } from "./users";

// ================================================
// TIMELINE EVENTS TABLE (Immutable event log)
// ================================================

export const timelineEvents = pgTable("timeline_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  
  // Event type
  eventType: eventTypeEnum("event_type").notNull(),
  
  // Event data
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Event metadata
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  
  // Source tracking
  source: varchar("source", { length: 100 }), // ai_whatsapp, ai_voice, ai_email, admin, system
  sourceId: uuid("source_id"), // Reference to related record
  
  // Actor (who triggered this event)
  actorType: varchar("actor_type", { length: 50 }), // system, ai, user
  actorId: uuid("actor_id"),
  
  // Immutable timestamp
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// SYSTEM EVENTS TABLE (General system events)
// ================================================

export const systemEvents = pgTable("system_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Event type
  eventType: varchar("event_type", { length: 100 }).notNull(),
  
  // Event data
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  severity: varchar("severity", { length: 20 }).default("info"), // info, warning, error, critical
  
  // Event metadata
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  
  // Related entities
  relatedEntityType: varchar("related_entity_type", { length: 50 }),
  relatedEntityId: uuid("related_entity_id"),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// NOTIFICATIONS TABLE
// ================================================

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Recipient
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Notification details
  type: notificationTypeEnum("type").notNull(),
  status: notificationStatusEnum("status").notNull().default("pending"),
  
  // Content
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  
  // Delivery channel
  channel: varchar("channel", { length: 50 }).notNull(), // email, in_app, sms
  
  // Related entity
  relatedEntityType: varchar("related_entity_type", { length: 50 }),
  relatedEntityId: uuid("related_entity_id"),
  
  // Metadata
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  
  // Delivery tracking
  sentAt: timestamp("sent_at", { withTimezone: true }),
  readAt: timestamp("read_at", { withTimezone: true }),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// AUDIT LOGS TABLE (Admin actions)
// ================================================

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Actor
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  
  // Action
  action: auditActionEnum("action").notNull(),
  
  // Target entity
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: uuid("entity_id"),
  
  // Change details
  previousValue: jsonb("previous_value").$type<Record<string, unknown>>(),
  newValue: jsonb("new_value").$type<Record<string, unknown>>(),
  
  // Context
  reason: text("reason"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// CALENDAR CHANGE EVENTS TABLE (Monitor changes)
// ================================================

export const calendarChangeEvents = pgTable("calendar_change_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Related interviewer
  interviewerId: uuid("interviewer_id"),
  
  // Google Calendar event reference
  googleCalendarEventId: varchar("google_calendar_event_id", { length: 255 }),
  
  // Change type
  changeType: varchar("change_type", { length: 50 }).notNull(), // created, updated, deleted, cancelled
  
  // Change details
  previousData: jsonb("previous_data").$type<Record<string, unknown>>(),
  newData: jsonb("new_data").$type<Record<string, unknown>>(),
  
  // Processing status
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  processingResult: text("processing_result"),
  
  // Auto-reschedule tracking
  affectedCandidateIds: jsonb("affected_candidate_ids").$type<string[]>(),
  reschedulingStatus: varchar("rescheduling_status", { length: 50 }), // pending, success, failed, manual_required
  
  // Timestamps
  detectedAt: timestamp("detected_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// RELATIONS
// ================================================

export const timelineEventsRelations = relations(timelineEvents, ({ one }) => ({
  candidate: one(candidates, {
    fields: [timelineEvents.candidateId],
    references: [candidates.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
