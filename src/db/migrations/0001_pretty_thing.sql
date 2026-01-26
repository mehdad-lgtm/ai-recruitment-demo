CREATE TYPE "public"."knowledge_category" AS ENUM('recruitment', 'screening', 'scheduling', 'communication', 'negotiation', 'onboarding', 'compliance', 'technology', 'general');--> statement-breakpoint
CREATE TYPE "public"."knowledge_status" AS ENUM('draft', 'review', 'published', 'archived', 'deprecated');--> statement-breakpoint
CREATE TYPE "public"."knowledge_type" AS ENUM('faq', 'objection_handling', 'communication_template', 'best_practice', 'process_guide', 'candidate_insight', 'industry_knowledge', 'company_policy', 'ai_prompt', 'troubleshooting');--> statement-breakpoint
CREATE TABLE "knowledge_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"knowledge_id" uuid NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_url" text NOT NULL,
	"file_type" varchar(100),
	"file_size" integer,
	"description" text,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_base" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "knowledge_type" NOT NULL,
	"category" "knowledge_category" NOT NULL,
	"status" "knowledge_status" DEFAULT 'draft' NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"summary" text,
	"keywords" jsonb,
	"tags" jsonb,
	"language" varchar(50) DEFAULT 'english',
	"metadata" jsonb,
	"created_by" uuid,
	"updated_by" uuid,
	"related_candidate_id" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"previous_version_id" uuid,
	"view_count" integer DEFAULT 0,
	"use_count" integer DEFAULT 0,
	"last_used_at" timestamp with time zone,
	"rating" integer,
	"rating_count" integer DEFAULT 0,
	"is_public" boolean DEFAULT false,
	"required_role" varchar(50),
	"published_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"knowledge_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer,
	"comment" text,
	"suggestions" text,
	"is_reviewed" boolean DEFAULT false,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_relations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_knowledge_id" uuid NOT NULL,
	"target_knowledge_id" uuid NOT NULL,
	"relation_type" varchar(50) NOT NULL,
	"strength" integer DEFAULT 1,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_usage_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"knowledge_id" uuid NOT NULL,
	"user_id" uuid,
	"candidate_id" uuid,
	"usage_type" varchar(50) NOT NULL,
	"channel" varchar(50),
	"was_helpful" boolean,
	"feedback_notes" text,
	"used_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "knowledge_attachments" ADD CONSTRAINT "knowledge_attachments_knowledge_id_knowledge_base_id_fk" FOREIGN KEY ("knowledge_id") REFERENCES "public"."knowledge_base"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_related_candidate_id_candidates_id_fk" FOREIGN KEY ("related_candidate_id") REFERENCES "public"."candidates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_previous_version_id_knowledge_base_id_fk" FOREIGN KEY ("previous_version_id") REFERENCES "public"."knowledge_base"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_feedback" ADD CONSTRAINT "knowledge_feedback_knowledge_id_knowledge_base_id_fk" FOREIGN KEY ("knowledge_id") REFERENCES "public"."knowledge_base"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_feedback" ADD CONSTRAINT "knowledge_feedback_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_feedback" ADD CONSTRAINT "knowledge_feedback_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_relations" ADD CONSTRAINT "knowledge_relations_source_knowledge_id_knowledge_base_id_fk" FOREIGN KEY ("source_knowledge_id") REFERENCES "public"."knowledge_base"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_relations" ADD CONSTRAINT "knowledge_relations_target_knowledge_id_knowledge_base_id_fk" FOREIGN KEY ("target_knowledge_id") REFERENCES "public"."knowledge_base"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_usage_log" ADD CONSTRAINT "knowledge_usage_log_knowledge_id_knowledge_base_id_fk" FOREIGN KEY ("knowledge_id") REFERENCES "public"."knowledge_base"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_usage_log" ADD CONSTRAINT "knowledge_usage_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_usage_log" ADD CONSTRAINT "knowledge_usage_log_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE set null ON UPDATE no action;