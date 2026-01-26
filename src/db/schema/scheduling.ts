import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    jsonb,
    pgTable,
    text,
    time,
    timestamp,
    uuid,
    varchar
} from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import {
    interviewOutcomeEnum,
    interviewSessionStatusEnum
} from "./enums";
import { interviewers } from "./users";

// ================================================
// INTERVIEW SESSIONS TABLE (Time-range blocks)
// Capacity = 10 candidates per session
// ================================================

export const interviewSessions = pgTable("interview_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  interviewerId: uuid("interviewer_id")
    .notNull()
    .references(() => interviewers.id, { onDelete: "cascade" }),
  
  // Session timing
  sessionDate: timestamp("session_date", { withTimezone: true }).notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  
  // Capacity
  maxCapacity: integer("max_capacity").default(10).notNull(),
  currentCount: integer("current_count").default(0).notNull(),
  
  // Status
  status: interviewSessionStatusEnum("status").notNull().default("scheduled"),
  
  // Location details
  location: varchar("location", { length: 255 }),
  locationDetails: jsonb("location_details").$type<{
    address: string;
    parkingInfo?: string;
    publicTransportInfo?: string;
    mapUrl?: string;
  }>(),
  
  // Google Calendar integration
  googleCalendarEventId: varchar("google_calendar_event_id", { length: 255 }),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  
  // Notes
  notes: text("notes"),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// INTERVIEW ASSIGNMENTS TABLE (Candidate -> Session)
// ================================================

export const interviewAssignments = pgTable("interview_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => interviewSessions.id, { onDelete: "cascade" }),
  
  // Assignment status
  outcome: interviewOutcomeEnum("outcome").notNull().default("pending"),
  
  // Slot number within session (1-10)
  slotNumber: integer("slot_number"),
  
  // Interview specifics
  scheduledTime: timestamp("scheduled_time", { withTimezone: true }),
  actualStartTime: timestamp("actual_start_time", { withTimezone: true }),
  actualEndTime: timestamp("actual_end_time", { withTimezone: true }),
  
  // Attendance
  didAttend: boolean("did_attend"),
  attendanceNotes: text("attendance_notes"),
  
  // Interviewer feedback
  interviewerNotes: text("interviewer_notes"),
  interviewerRating: integer("interviewer_rating"), // 1-5 scale
  
  // Outcome details
  outcomeNotes: text("outcome_notes"),
  outcomeDecidedAt: timestamp("outcome_decided_at", { withTimezone: true }),
  outcomeDecidedBy: uuid("outcome_decided_by"),
  
  // Confirmation tracking
  confirmationSentAt: timestamp("confirmation_sent_at", { withTimezone: true }),
  reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
  candidateConfirmedAt: timestamp("candidate_confirmed_at", { withTimezone: true }),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// INTERVIEWER AVAILABILITY TABLE
// ================================================

export const interviewerAvailability = pgTable("interviewer_availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  interviewerId: uuid("interviewer_id")
    .notNull()
    .references(() => interviewers.id, { onDelete: "cascade" }),
  
  // Availability window
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 6 = Saturday
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  
  // Recurrence
  isRecurring: boolean("is_recurring").default(true),
  validFrom: timestamp("valid_from", { withTimezone: true }),
  validUntil: timestamp("valid_until", { withTimezone: true }),
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// INTERVIEWER BLOCKED TIMES TABLE (Exceptions)
// ================================================

export const interviewerBlockedTimes = pgTable("interviewer_blocked_times", {
  id: uuid("id").primaryKey().defaultRandom(),
  interviewerId: uuid("interviewer_id")
    .notNull()
    .references(() => interviewers.id, { onDelete: "cascade" }),
  
  // Blocked period
  startDateTime: timestamp("start_date_time", { withTimezone: true }).notNull(),
  endDateTime: timestamp("end_date_time", { withTimezone: true }).notNull(),
  
  // Reason
  reason: varchar("reason", { length: 255 }),
  
  // Google Calendar sync
  googleCalendarEventId: varchar("google_calendar_event_id", { length: 255 }),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// STANDARD TIME SLOTS TABLE (Pre-approved slots)
// ================================================

export const standardTimeSlots = pgTable("standard_time_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Slot definition
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Morning Session"
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  
  // Days this slot applies to
  applicableDays: jsonb("applicable_days").$type<number[]>().default([1, 2, 3, 4, 5]), // Mon-Fri
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// SCHEDULING HISTORY TABLE (For rescheduling tracking)
// ================================================

export const schedulingHistory = pgTable("scheduling_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  
  // Previous assignment
  previousSessionId: uuid("previous_session_id").references(() => interviewSessions.id),
  previousScheduledTime: timestamp("previous_scheduled_time", { withTimezone: true }),
  
  // New assignment
  newSessionId: uuid("new_session_id").references(() => interviewSessions.id),
  newScheduledTime: timestamp("new_scheduled_time", { withTimezone: true }),
  
  // Reason for change
  reason: varchar("reason", { length: 255 }).notNull(),
  initiatedBy: varchar("initiated_by", { length: 100 }), // system, interviewer, candidate, admin
  
  // Notifications sent
  notificationsSent: jsonb("notifications_sent").$type<{
    channel: string;
    recipient: string;
    sentAt: string;
  }[]>(),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// RELATIONS
// ================================================

export const interviewSessionsRelations = relations(interviewSessions, ({ one, many }) => ({
  interviewer: one(interviewers, {
    fields: [interviewSessions.interviewerId],
    references: [interviewers.id],
  }),
  assignments: many(interviewAssignments),
}));

export const interviewAssignmentsRelations = relations(interviewAssignments, ({ one }) => ({
  candidate: one(candidates, {
    fields: [interviewAssignments.candidateId],
    references: [candidates.id],
  }),
  session: one(interviewSessions, {
    fields: [interviewAssignments.sessionId],
    references: [interviewSessions.id],
  }),
}));

export const interviewerAvailabilityRelations = relations(interviewerAvailability, ({ one }) => ({
  interviewer: one(interviewers, {
    fields: [interviewerAvailability.interviewerId],
    references: [interviewers.id],
  }),
}));

export const interviewerBlockedTimesRelations = relations(interviewerBlockedTimes, ({ one }) => ({
  interviewer: one(interviewers, {
    fields: [interviewerBlockedTimes.interviewerId],
    references: [interviewers.id],
  }),
}));

export const schedulingHistoryRelations = relations(schedulingHistory, ({ one }) => ({
  candidate: one(candidates, {
    fields: [schedulingHistory.candidateId],
    references: [candidates.id],
  }),
  previousSession: one(interviewSessions, {
    fields: [schedulingHistory.previousSessionId],
    references: [interviewSessions.id],
  }),
  newSession: one(interviewSessions, {
    fields: [schedulingHistory.newSessionId],
    references: [interviewSessions.id],
  }),
}));
