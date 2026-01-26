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
import {
    callStatusEnum,
    communicationChannelEnum,
    communicationDirectionEnum,
    communicationStatusEnum,
    whatsappAgentTypeEnum
} from "./enums";
import { users } from "./users";

// ================================================
// WHATSAPP MESSAGES TABLE
// ================================================

export const whatsappMessages = pgTable("whatsapp_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  
  // Message details
  direction: communicationDirectionEnum("direction").notNull(),
  status: communicationStatusEnum("status").notNull().default("pending"),
  agentType: whatsappAgentTypeEnum("agent_type"), // new_candidate or follow_up
  
  // Content
  messageContent: text("message_content").notNull(),
  messageType: varchar("message_type", { length: 50 }).default("text"), // text, image, document, etc.
  mediaUrl: text("media_url"),
  
  // WhatsApp API references
  waMessageId: varchar("wa_message_id", { length: 255 }), // WhatsApp message ID
  waPhoneNumberId: varchar("wa_phone_number_id", { length: 100 }),
  
  // AI processing
  isAiGenerated: boolean("is_ai_generated").default(true),
  aiConfidence: integer("ai_confidence"), // 0-100
  
  // Admin takeover
  takenOverBy: uuid("taken_over_by").references(() => users.id),
  takenOverAt: timestamp("taken_over_at", { withTimezone: true }),
  
  // Delivery timestamps
  sentAt: timestamp("sent_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  readAt: timestamp("read_at", { withTimezone: true }),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// VOICE CALLS TABLE
// ================================================

export const voiceCalls = pgTable("voice_calls", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  
  // Call details
  direction: communicationDirectionEnum("direction").notNull(),
  status: callStatusEnum("status").notNull().default("initiated"),
  
  // Phone numbers
  fromNumber: varchar("from_number", { length: 20 }),
  toNumber: varchar("to_number", { length: 20 }),
  
  // Call metrics
  durationSeconds: integer("duration_seconds"),
  ringDurationSeconds: integer("ring_duration_seconds"),
  
  // AI Voice platform references
  externalCallId: varchar("external_call_id", { length: 255 }), // ID from voice AI provider
  recordingUrl: text("recording_url"),
  transcriptUrl: text("transcript_url"),
  
  // Call summary (AI-generated)
  callSummary: text("call_summary"),
  callOutcome: varchar("call_outcome", { length: 100 }),
  extractedData: jsonb("extracted_data").$type<Record<string, unknown>>(),
  
  // Follow-up tracking
  attemptNumber: integer("attempt_number").default(1),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }),
  
  // Admin takeover
  takenOverBy: uuid("taken_over_by").references(() => users.id),
  takenOverAt: timestamp("taken_over_at", { withTimezone: true }),
  
  // Timestamps
  initiatedAt: timestamp("initiated_at", { withTimezone: true }),
  answeredAt: timestamp("answered_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// EMAILS TABLE
// ================================================

export const emails = pgTable("emails", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  
  // Email details
  direction: communicationDirectionEnum("direction").notNull(),
  status: communicationStatusEnum("status").notNull().default("pending"),
  
  // Addresses
  fromAddress: varchar("from_address", { length: 255 }),
  toAddress: varchar("to_address", { length: 255 }),
  replyToAddress: varchar("reply_to_address", { length: 255 }),
  
  // Content
  subject: varchar("subject", { length: 500 }),
  bodyHtml: text("body_html"),
  bodyText: text("body_text"),
  
  // Attachments
  attachments: jsonb("attachments").$type<{
    filename: string;
    url: string;
    contentType: string;
    size: number;
  }[]>(),
  
  // Email provider references
  externalMessageId: varchar("external_message_id", { length: 255 }),
  threadId: varchar("thread_id", { length: 255 }), // For threading
  
  // AI processing
  isAiGenerated: boolean("is_ai_generated").default(true),
  emailSummary: text("email_summary"),
  
  // Timestamps
  sentAt: timestamp("sent_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  openedAt: timestamp("opened_at", { withTimezone: true }),
  bouncedAt: timestamp("bounced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// COMMUNICATION ATTEMPTS TABLE (tracks fallback sequence)
// ================================================

export const communicationAttempts = pgTable("communication_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  
  // Current outreach state
  currentChannel: communicationChannelEnum("current_channel"),
  
  // Attempt counts
  voiceCallAttempts: integer("voice_call_attempts").default(0),
  whatsappAttempts: integer("whatsapp_attempts").default(0),
  emailAttempts: integer("email_attempts").default(0),
  
  // Last attempt timestamps
  lastVoiceCallAt: timestamp("last_voice_call_at", { withTimezone: true }),
  lastWhatsappAt: timestamp("last_whatsapp_at", { withTimezone: true }),
  lastEmailAt: timestamp("last_email_at", { withTimezone: true }),
  
  // Next scheduled attempt
  nextAttemptChannel: communicationChannelEnum("next_attempt_channel"),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }),
  
  // Fallback status
  hasExhaustedAttempts: boolean("has_exhausted_attempts").default(false),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// RELATIONS
// ================================================

export const whatsappMessagesRelations = relations(whatsappMessages, ({ one }) => ({
  candidate: one(candidates, {
    fields: [whatsappMessages.candidateId],
    references: [candidates.id],
  }),
  takenOverByUser: one(users, {
    fields: [whatsappMessages.takenOverBy],
    references: [users.id],
  }),
}));

export const voiceCallsRelations = relations(voiceCalls, ({ one }) => ({
  candidate: one(candidates, {
    fields: [voiceCalls.candidateId],
    references: [candidates.id],
  }),
  takenOverByUser: one(users, {
    fields: [voiceCalls.takenOverBy],
    references: [users.id],
  }),
}));

export const emailsRelations = relations(emails, ({ one }) => ({
  candidate: one(candidates, {
    fields: [emails.candidateId],
    references: [candidates.id],
  }),
}));

export const communicationAttemptsRelations = relations(communicationAttempts, ({ one }) => ({
  candidate: one(candidates, {
    fields: [communicationAttempts.candidateId],
    references: [candidates.id],
  }),
}));
