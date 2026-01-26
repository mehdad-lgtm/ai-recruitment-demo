import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
    type PgTableWithColumns,
} from "drizzle-orm/pg-core";
import { candidates } from "./candidates";
import {
    knowledgeCategoryEnum,
    knowledgeStatusEnum,
    knowledgeTypeEnum,
} from "./enums";
import { users } from "./users";

// ================================================
// KNOWLEDGE BASE TABLE
// ================================================

export const knowledgeBase: PgTableWithColumns<any> = pgTable("knowledge_base", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Classification
  type: knowledgeTypeEnum("type").notNull(),
  category: knowledgeCategoryEnum("category").notNull(),
  status: knowledgeStatusEnum("status").notNull().default("draft"),
  
  // Content
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  summary: text("summary"), // Short summary for quick reference
  
  // Keywords and tags
  keywords: jsonb("keywords").$type<string[]>(),
  tags: jsonb("tags").$type<string[]>(),
  
  // Language support
  language: varchar("language", { length: 50 }).default("english"),
  
  // Structured data for specific types
  metadata: jsonb("metadata").$type<{
    // For FAQs
    question?: string;
    answer?: string;
    relatedQuestions?: string[];
    
    // For objection handling
    objection?: string;
    response?: string;
    alternativeResponses?: string[];
    
    // For communication templates
    templateVariables?: string[];
    channel?: "whatsapp" | "voice" | "email";
    tone?: string;
    
    // For AI prompts
    systemPrompt?: string;
    userPromptTemplate?: string;
    expectedOutput?: string;
    
    // General metadata
    difficulty?: "beginner" | "intermediate" | "advanced";
    estimatedReadTime?: number; // minutes
    prerequisites?: string[];
  }>(),
  
  // Relationships
  createdBy: uuid("created_by")
    .references(() => users.id, { onDelete: "set null" }),
  updatedBy: uuid("updated_by")
    .references(() => users.id, { onDelete: "set null" }),
  
  // Related entities
  relatedCandidateId: uuid("related_candidate_id")
    .references(() => candidates.id, { onDelete: "set null" }),
  
  // Versioning
  version: integer("version").default(1).notNull(),
  previousVersionId: uuid("previous_version_id")
    .references(() => knowledgeBase.id, { onDelete: "set null" }),
  
  // Usage tracking
  viewCount: integer("view_count").default(0),
  useCount: integer("use_count").default(0),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  
  // Quality metrics
  rating: integer("rating"), // 1-5 stars
  ratingCount: integer("rating_count").default(0),
  
  // Visibility and access
  isPublic: boolean("is_public").default(false),
  requiredRole: varchar("required_role", { length: 50 }), // admin, recruiter, interviewer
  
  // Publishing
  publishedAt: timestamp("published_at", { withTimezone: true }),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// KNOWLEDGE BASE RELATIONS (Many-to-Many)
// ================================================

export const knowledgeRelations = pgTable("knowledge_relations", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Source and target knowledge
  sourceKnowledgeId: uuid("source_knowledge_id")
    .notNull()
    .references(() => knowledgeBase.id, { onDelete: "cascade" }),
  targetKnowledgeId: uuid("target_knowledge_id")
    .notNull()
    .references(() => knowledgeBase.id, { onDelete: "cascade" }),
  
  // Relationship type
  relationType: varchar("relation_type", { length: 50 }).notNull(), // related_to, prerequisite, alternative, supersedes
  
  // Relationship strength
  strength: integer("strength").default(1), // 1-10
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// KNOWLEDGE USAGE LOG
// ================================================

export const knowledgeUsageLog = pgTable("knowledge_usage_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Knowledge used
  knowledgeId: uuid("knowledge_id")
    .notNull()
    .references(() => knowledgeBase.id, { onDelete: "cascade" }),
  
  // Who used it
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "set null" }),
  
  // Context of usage
  candidateId: uuid("candidate_id")
    .references(() => candidates.id, { onDelete: "set null" }),
  
  // Usage details
  usageType: varchar("usage_type", { length: 50 }).notNull(), // viewed, applied, copied, shared
  channel: varchar("channel", { length: 50 }), // whatsapp, voice, email, web_interface
  
  // Feedback
  wasHelpful: boolean("was_helpful"),
  feedbackNotes: text("feedback_notes"),
  
  // Timestamps
  usedAt: timestamp("used_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// KNOWLEDGE BASE ATTACHMENTS
// ================================================

export const knowledgeAttachments = pgTable("knowledge_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Knowledge reference
  knowledgeId: uuid("knowledge_id")
    .notNull()
    .references(() => knowledgeBase.id, { onDelete: "cascade" }),
  
  // File details
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 100 }), // pdf, image, audio, video, document
  fileSize: integer("file_size"), // in bytes
  
  // Description
  description: text("description"),
  
  // Ordering
  displayOrder: integer("display_order").default(0),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// KNOWLEDGE BASE COMMENTS/FEEDBACK
// ================================================

export const knowledgeFeedback = pgTable("knowledge_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Knowledge reference
  knowledgeId: uuid("knowledge_id")
    .notNull()
    .references(() => knowledgeBase.id, { onDelete: "cascade" }),
  
  // Feedback from user
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  // Rating
  rating: integer("rating"), // 1-5
  
  // Feedback content
  comment: text("comment"),
  suggestions: text("suggestions"),
  
  // Status
  isReviewed: boolean("is_reviewed").default(false),
  reviewedBy: uuid("reviewed_by")
    .references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ================================================
// RELATIONS
// ================================================

export const knowledgeBaseRelations = relations(knowledgeBase, ({ one, many }) => ({
  creator: one(users, {
    fields: [knowledgeBase.createdBy],
    references: [users.id],
    relationName: "creator",
  }),
  updater: one(users, {
    fields: [knowledgeBase.updatedBy],
    references: [users.id],
    relationName: "updater",
  }),
  relatedCandidate: one(candidates, {
    fields: [knowledgeBase.relatedCandidateId],
    references: [candidates.id],
  }),
  previousVersion: one(knowledgeBase, {
    fields: [knowledgeBase.previousVersionId],
    references: [knowledgeBase.id],
  }),
  usageLogs: many(knowledgeUsageLog),
  attachments: many(knowledgeAttachments),
  feedback: many(knowledgeFeedback),
  sourceRelations: many(knowledgeRelations, { relationName: "source" }),
  targetRelations: many(knowledgeRelations, { relationName: "target" }),
}));

export const knowledgeRelationsRelations = relations(knowledgeRelations, ({ one }) => ({
  sourceKnowledge: one(knowledgeBase, {
    fields: [knowledgeRelations.sourceKnowledgeId],
    references: [knowledgeBase.id],
    relationName: "source",
  }),
  targetKnowledge: one(knowledgeBase, {
    fields: [knowledgeRelations.targetKnowledgeId],
    references: [knowledgeBase.id],
    relationName: "target",
  }),
}));

export const knowledgeUsageLogRelations = relations(knowledgeUsageLog, ({ one }) => ({
  knowledge: one(knowledgeBase, {
    fields: [knowledgeUsageLog.knowledgeId],
    references: [knowledgeBase.id],
  }),
  user: one(users, {
    fields: [knowledgeUsageLog.userId],
    references: [users.id],
  }),
  candidate: one(candidates, {
    fields: [knowledgeUsageLog.candidateId],
    references: [candidates.id],
  }),
}));

export const knowledgeAttachmentsRelations = relations(knowledgeAttachments, ({ one }) => ({
  knowledge: one(knowledgeBase, {
    fields: [knowledgeAttachments.knowledgeId],
    references: [knowledgeBase.id],
  }),
}));

export const knowledgeFeedbackRelations = relations(knowledgeFeedback, ({ one }) => ({
  knowledge: one(knowledgeBase, {
    fields: [knowledgeFeedback.knowledgeId],
    references: [knowledgeBase.id],
  }),
  user: one(users, {
    fields: [knowledgeFeedback.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [knowledgeFeedback.reviewedBy],
    references: [users.id],
  }),
}));
