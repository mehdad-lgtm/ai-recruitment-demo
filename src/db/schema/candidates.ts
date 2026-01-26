import { relations } from "drizzle-orm";
import {
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar
} from "drizzle-orm/pg-core";
import {
    candidateSourceEnum,
    candidateStateEnum,
    cvClassificationEnum,
    languagePreferenceEnum
} from "./enums";
import { recruiters } from "./users";

// ================================================
// CANDIDATES TABLE (Central source of truth)
// ================================================

export const candidates = pgTable("candidates", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Identity
  phone: varchar("phone", { length: 20 }).unique(), // Primary identifier
  email: varchar("email", { length: 255 }),
  name: varchar("name", { length: 255 }),
  
  // Source tracking
  source: candidateSourceEnum("source").notNull(),
  recruiterId: uuid("recruiter_id").references(() => recruiters.id), // Recruiter attribution
  
  // CV classification (for CV flow)
  cvClassification: cvClassificationEnum("cv_classification").default("pending"),
  cvUrl: text("cv_url"),
  cvParsedAt: timestamp("cv_parsed_at", { withTimezone: true }),
  
  // State machine
  state: candidateStateEnum("state").notNull().default("new"),
  previousState: candidateStateEnum("previous_state"),
  stateChangedAt: timestamp("state_changed_at", { withTimezone: true }).defaultNow(),
  
  // Language preference
  languagePreference: languagePreferenceEnum("language_preference").default("english"),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// CANDIDATE PROFILES TABLE (Captured information)
// ================================================

export const candidateProfiles = pgTable("candidate_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" })
    .unique(),
  
  // Personal Info
  fullName: varchar("full_name", { length: 255 }),
  dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
  gender: varchar("gender", { length: 20 }),
  nationality: varchar("nationality", { length: 100 }),
  
  // Location
  currentLocation: varchar("current_location", { length: 255 }),
  preferredWorkLocation: varchar("preferred_work_location", { length: 255 }),
  address: text("address"),
  
  // Professional Info (captured during profiling)
  currentRole: varchar("current_role", { length: 255 }),
  currentCompany: varchar("current_company", { length: 255 }),
  yearsOfExperience: integer("years_of_experience"),
  pastJobs: jsonb("past_jobs").$type<{
    title: string;
    company: string;
    duration: string;
  }[]>(),
  
  // Skills and qualifications
  skills: jsonb("skills").$type<string[]>(),
  educationLevel: varchar("education_level", { length: 100 }),
  certifications: jsonb("certifications").$type<string[]>(),
  
  // Aspirations (captured during AI profiling)
  aspirations: text("aspirations"),
  incomeGoalBracket: varchar("income_goal_bracket", { length: 100 }),
  availabilityToStart: varchar("availability_to_start", { length: 100 }),
  
  // Additional structured data
  additionalInfo: jsonb("additional_info").$type<Record<string, unknown>>(),
  
  // Profile completion tracking
  profileCompleteness: integer("profile_completeness").default(0), // Percentage
  lastProfiledAt: timestamp("last_profiled_at", { withTimezone: true }),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// CANDIDATE MEMORY TABLE (AI context/summaries)
// ================================================

export const candidateMemories = pgTable("candidate_memories", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" })
    .unique(),
  
  // AI Memory
  conversationSummary: text("conversation_summary"), // AI-generated summary
  lastContext: text("last_context"), // Last conversation context
  keyPoints: jsonb("key_points").$type<string[]>(), // Important points to remember
  
  // Objections and concerns raised
  objections: jsonb("objections").$type<{
    type: string;
    content: string;
    handled: boolean;
    timestamp: string;
  }[]>(),
  
  // Sentiment analysis
  overallSentiment: varchar("overall_sentiment", { length: 50 }),
  engagementLevel: varchar("engagement_level", { length: 50 }),
  
  // Interview brief (AI-generated for interviewer)
  interviewBrief: text("interview_brief"),
  chatInsights: jsonb("chat_insights").$type<{
    topic: string;
    insight: string;
  }[]>(),
  
  // Step-Two Form data (auto-filled by AI)
  stepTwoFormData: jsonb("step_two_form_data").$type<Record<string, unknown>>(),
  
  // Timestamps
  lastInteractionAt: timestamp("last_interaction_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// CANDIDATE STATE HISTORY TABLE
// ================================================

export const candidateStateHistory = pgTable("candidate_state_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  
  fromState: candidateStateEnum("from_state"),
  toState: candidateStateEnum("to_state").notNull(),
  reason: text("reason"),
  triggeredBy: varchar("triggered_by", { length: 100 }), // system, ai, admin, etc.
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// RELATIONS
// ================================================

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
  recruiter: one(recruiters, {
    fields: [candidates.recruiterId],
    references: [recruiters.id],
  }),
  profile: one(candidateProfiles, {
    fields: [candidates.id],
    references: [candidateProfiles.candidateId],
  }),
  memory: one(candidateMemories, {
    fields: [candidates.id],
    references: [candidateMemories.candidateId],
  }),
  stateHistory: many(candidateStateHistory),
}));

export const candidateProfilesRelations = relations(candidateProfiles, ({ one }) => ({
  candidate: one(candidates, {
    fields: [candidateProfiles.candidateId],
    references: [candidates.id],
  }),
}));

export const candidateMemoriesRelations = relations(candidateMemories, ({ one }) => ({
  candidate: one(candidates, {
    fields: [candidateMemories.candidateId],
    references: [candidates.id],
  }),
}));

export const candidateStateHistoryRelations = relations(candidateStateHistory, ({ one }) => ({
  candidate: one(candidates, {
    fields: [candidateStateHistory.candidateId],
    references: [candidates.id],
  }),
}));
