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

// ================================================
// AI TRAINING DATA - WHATSAPP CHAT HISTORY
// ================================================

export const aiTrainingWhatsappChats = pgTable("ai_training_whatsapp_chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Chat content
  conversationId: varchar("conversation_id", { length: 255 }),
  messages: jsonb("messages").$type<{
    role: "recruiter" | "candidate";
    content: string;
    timestamp: string;
  }[]>(),
  
  // Training metadata
  isSuccessfulConversation: boolean("is_successful_conversation").default(false),
  outcomeType: varchar("outcome_type", { length: 100 }), // scheduled, rejected, no_response
  
  // Processing status
  processed: boolean("processed").default(false),
  extractedPatterns: jsonb("extracted_patterns").$type<string[]>(),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// AI TRAINING DATA - CALL RECORDINGS
// ================================================

export const aiTrainingCallRecordings = pgTable("ai_training_call_recordings", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Recording details
  recordingUrl: text("recording_url").notNull(),
  transcriptUrl: text("transcript_url"),
  transcript: text("transcript"),
  
  // Duration
  durationSeconds: integer("duration_seconds"),
  
  // Training metadata
  isSuccessfulCall: boolean("is_successful_call").default(false),
  outcomeType: varchar("outcome_type", { length: 100 }),
  
  // Extracted tactics
  extractedTactics: jsonb("extracted_tactics").$type<{
    tactic: string;
    timestamp: string;
    effectiveness: string;
  }[]>(),
  
  // Processing status
  processed: boolean("processed").default(false),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// CV PARSING RESULTS TABLE
// ================================================

export const cvParsingResults = pgTable("cv_parsing_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .references(() => candidates.id, { onDelete: "cascade" }),
  
  // Source
  sourceUrl: text("source_url").notNull(),
  sourcePlatform: varchar("source_platform", { length: 100 }), // jobstreet, indeed, etc.
  
  // Raw content
  rawText: text("raw_text"),
  
  // Extracted data
  extractedData: jsonb("extracted_data").$type<{
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    experience?: {
      title: string;
      company: string;
      duration: string;
      description?: string;
    }[];
    education?: {
      degree: string;
      institution: string;
      year?: string;
    }[];
    summary?: string;
  }>(),
  
  // Classification
  classificationScore: integer("classification_score"), // 0-100
  classificationReason: text("classification_reason"),
  
  // Filter criteria matched
  matchedCriteria: jsonb("matched_criteria").$type<{
    criterion: string;
    matched: boolean;
    score: number;
  }[]>(),
  
  // Processing status
  processingStatus: varchar("processing_status", { length: 50 }).default("pending"),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  errorMessage: text("error_message"),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// JOB CRITERIA TABLE (For CV filtering)
// ================================================

export const jobCriteria = pgTable("job_criteria", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Criteria details
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Rules
  rules: jsonb("rules").$type<{
    field: string;
    operator: "contains" | "equals" | "greater_than" | "less_than" | "in";
    value: unknown;
    weight: number;
  }[]>(),
  
  // Thresholds
  minimumScore: integer("minimum_score").default(70), // Minimum score to be "qualified"
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// AI PROMPTS/TEMPLATES TABLE
// ================================================

export const aiPromptTemplates = pgTable("ai_prompt_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Template details
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // whatsapp, voice, email, profiling, etc.
  
  // Content
  promptTemplate: text("prompt_template").notNull(),
  systemPrompt: text("system_prompt"),
  
  // Variables
  variables: jsonb("variables").$type<string[]>(),
  
  // Language
  language: varchar("language", { length: 50 }).default("english"),
  
  // Version control
  version: integer("version").default(1),
  isActive: boolean("is_active").default(true).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// AI INTERACTION LOGS TABLE (LLM calls)
// ================================================

export const aiInteractionLogs = pgTable("ai_interaction_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Related candidate
  candidateId: uuid("candidate_id")
    .references(() => candidates.id, { onDelete: "set null" }),
  
  // Interaction type
  interactionType: varchar("interaction_type", { length: 100 }).notNull(), // reply_generation, extraction, summary, etc.
  channel: varchar("channel", { length: 50 }), // whatsapp, voice, email
  
  // Input/Output
  inputPrompt: text("input_prompt"),
  outputResponse: text("output_response"),
  
  // Structured output
  structuredOutput: jsonb("structured_output").$type<Record<string, unknown>>(),
  
  // Model info
  modelUsed: varchar("model_used", { length: 100 }),
  tokensUsed: integer("tokens_used"),
  latencyMs: integer("latency_ms"),
  
  // Success tracking
  wasSuccessful: boolean("was_successful").default(true),
  errorMessage: text("error_message"),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// RELATIONS
// ================================================

export const cvParsingResultsRelations = relations(cvParsingResults, ({ one }) => ({
  candidate: one(candidates, {
    fields: [cvParsingResults.candidateId],
    references: [candidates.id],
  }),
}));

export const aiInteractionLogsRelations = relations(aiInteractionLogs, ({ one }) => ({
  candidate: one(candidates, {
    fields: [aiInteractionLogs.candidateId],
    references: [candidates.id],
  }),
}));
