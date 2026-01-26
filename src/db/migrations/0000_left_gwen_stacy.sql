CREATE TYPE "public"."audit_action" AS ENUM('create', 'update', 'delete', 'takeover', 'override', 'reassign', 'login', 'logout');--> statement-breakpoint
CREATE TYPE "public"."call_status" AS ENUM('initiated', 'ringing', 'answered', 'no_answer', 'busy', 'failed', 'completed', 'voicemail');--> statement-breakpoint
CREATE TYPE "public"."candidate_source" AS ENUM('qr_scan', 'cv_upload', 'social_media', 'referral', 'walk_in', 'other');--> statement-breakpoint
CREATE TYPE "public"."candidate_state" AS ENUM('new', 'contacted', 'profiling', 'profile_complete', 'scheduling', 'scheduled', 'pending_scheduling', 'reschedule_required', 'interview_completed', 'accepted', 'rejected', 'withdrawn', 'no_response', 'blacklisted');--> statement-breakpoint
CREATE TYPE "public"."communication_channel" AS ENUM('whatsapp', 'voice_call', 'email', 'sms');--> statement-breakpoint
CREATE TYPE "public"."communication_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."communication_status" AS ENUM('pending', 'sent', 'delivered', 'read', 'answered', 'no_answer', 'failed', 'bounced');--> statement-breakpoint
CREATE TYPE "public"."cv_classification" AS ENUM('qualified', 'unqualified', 'pending');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('candidate_created', 'candidate_state_changed', 'candidate_profile_updated', 'whatsapp_message_sent', 'whatsapp_message_received', 'voice_call_initiated', 'voice_call_completed', 'email_sent', 'email_received', 'interview_scheduled', 'interview_rescheduled', 'interview_cancelled', 'interview_completed', 'ai_profiling_started', 'ai_profiling_completed', 'ai_salary_deflected', 'ai_scheduling_initiated', 'admin_takeover', 'admin_override', 'admin_reassignment', 'calendar_change_detected', 'notification_sent', 'cv_parsed', 'cv_classified');--> statement-breakpoint
CREATE TYPE "public"."interview_outcome" AS ENUM('pending', 'passed', 'failed', 'no_show', 'rescheduled');--> statement-breakpoint
CREATE TYPE "public"."interview_session_status" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled');--> statement-breakpoint
CREATE TYPE "public"."language_preference" AS ENUM('english', 'chinese', 'malay');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('pending', 'sent', 'read', 'failed');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('interview_scheduled', 'interview_cancelled', 'session_cancelled', 'session_changed', 'no_slots_available', 'reschedule_required', 'candidate_assigned', 'candidate_no_show', 'system_alert');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'interviewer', 'recruiter');--> statement-breakpoint
CREATE TYPE "public"."whatsapp_agent_type" AS ENUM('new_candidate', 'follow_up');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" varchar(50) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviewers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"calendar_id" varchar(255),
	"calendar_sync_enabled" boolean DEFAULT true,
	"last_calendar_sync" timestamp with time zone,
	"max_candidates_per_session" integer DEFAULT 10,
	"default_session_duration" integer DEFAULT 60,
	"preferred_languages" jsonb DEFAULT '["english"]'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "interviewers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "recruiters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"recruiter_id" varchar(50) NOT NULL,
	"qr_code" text,
	"qr_code_generated_at" timestamp with time zone,
	"total_candidates" integer DEFAULT 0,
	"successful_placements" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recruiters_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "recruiters_recruiter_id_unique" UNIQUE("recruiter_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'recruiter' NOT NULL,
	"phone" varchar(20),
	"department" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidate_memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"conversation_summary" text,
	"last_context" text,
	"key_points" jsonb,
	"objections" jsonb,
	"overall_sentiment" varchar(50),
	"engagement_level" varchar(50),
	"interview_brief" text,
	"chat_insights" jsonb,
	"step_two_form_data" jsonb,
	"last_interaction_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidate_memories_candidate_id_unique" UNIQUE("candidate_id")
);
--> statement-breakpoint
CREATE TABLE "candidate_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"full_name" varchar(255),
	"date_of_birth" timestamp with time zone,
	"gender" varchar(20),
	"nationality" varchar(100),
	"current_location" varchar(255),
	"preferred_work_location" varchar(255),
	"address" text,
	"current_role" varchar(255),
	"current_company" varchar(255),
	"years_of_experience" integer,
	"past_jobs" jsonb,
	"skills" jsonb,
	"education_level" varchar(100),
	"certifications" jsonb,
	"aspirations" text,
	"income_goal_bracket" varchar(100),
	"availability_to_start" varchar(100),
	"additional_info" jsonb,
	"profile_completeness" integer DEFAULT 0,
	"last_profiled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidate_profiles_candidate_id_unique" UNIQUE("candidate_id")
);
--> statement-breakpoint
CREATE TABLE "candidate_state_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"from_state" "candidate_state",
	"to_state" "candidate_state" NOT NULL,
	"reason" text,
	"triggered_by" varchar(100),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(20),
	"email" varchar(255),
	"name" varchar(255),
	"source" "candidate_source" NOT NULL,
	"recruiter_id" uuid,
	"cv_classification" "cv_classification" DEFAULT 'pending',
	"cv_url" text,
	"cv_parsed_at" timestamp with time zone,
	"state" "candidate_state" DEFAULT 'new' NOT NULL,
	"previous_state" "candidate_state",
	"state_changed_at" timestamp with time zone DEFAULT now(),
	"language_preference" "language_preference" DEFAULT 'english',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidates_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "communication_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"current_channel" "communication_channel",
	"voice_call_attempts" integer DEFAULT 0,
	"whatsapp_attempts" integer DEFAULT 0,
	"email_attempts" integer DEFAULT 0,
	"last_voice_call_at" timestamp with time zone,
	"last_whatsapp_at" timestamp with time zone,
	"last_email_at" timestamp with time zone,
	"next_attempt_channel" "communication_channel",
	"next_attempt_at" timestamp with time zone,
	"has_exhausted_attempts" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"direction" "communication_direction" NOT NULL,
	"status" "communication_status" DEFAULT 'pending' NOT NULL,
	"from_address" varchar(255),
	"to_address" varchar(255),
	"reply_to_address" varchar(255),
	"subject" varchar(500),
	"body_html" text,
	"body_text" text,
	"attachments" jsonb,
	"external_message_id" varchar(255),
	"thread_id" varchar(255),
	"is_ai_generated" boolean DEFAULT true,
	"email_summary" text,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"opened_at" timestamp with time zone,
	"bounced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"direction" "communication_direction" NOT NULL,
	"status" "call_status" DEFAULT 'initiated' NOT NULL,
	"from_number" varchar(20),
	"to_number" varchar(20),
	"duration_seconds" integer,
	"ring_duration_seconds" integer,
	"external_call_id" varchar(255),
	"recording_url" text,
	"transcript_url" text,
	"call_summary" text,
	"call_outcome" varchar(100),
	"extracted_data" jsonb,
	"attempt_number" integer DEFAULT 1,
	"next_attempt_at" timestamp with time zone,
	"taken_over_by" uuid,
	"taken_over_at" timestamp with time zone,
	"initiated_at" timestamp with time zone,
	"answered_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whatsapp_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"direction" "communication_direction" NOT NULL,
	"status" "communication_status" DEFAULT 'pending' NOT NULL,
	"agent_type" "whatsapp_agent_type",
	"message_content" text NOT NULL,
	"message_type" varchar(50) DEFAULT 'text',
	"media_url" text,
	"wa_message_id" varchar(255),
	"wa_phone_number_id" varchar(100),
	"is_ai_generated" boolean DEFAULT true,
	"ai_confidence" integer,
	"taken_over_by" uuid,
	"taken_over_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"outcome" "interview_outcome" DEFAULT 'pending' NOT NULL,
	"slot_number" integer,
	"scheduled_time" timestamp with time zone,
	"actual_start_time" timestamp with time zone,
	"actual_end_time" timestamp with time zone,
	"did_attend" boolean,
	"attendance_notes" text,
	"interviewer_notes" text,
	"interviewer_rating" integer,
	"outcome_notes" text,
	"outcome_decided_at" timestamp with time zone,
	"outcome_decided_by" uuid,
	"confirmation_sent_at" timestamp with time zone,
	"reminder_sent_at" timestamp with time zone,
	"candidate_confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interviewer_id" uuid NOT NULL,
	"session_date" timestamp with time zone NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"max_capacity" integer DEFAULT 10 NOT NULL,
	"current_count" integer DEFAULT 0 NOT NULL,
	"status" "interview_session_status" DEFAULT 'scheduled' NOT NULL,
	"location" varchar(255),
	"location_details" jsonb,
	"google_calendar_event_id" varchar(255),
	"last_synced_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviewer_availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interviewer_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"is_recurring" boolean DEFAULT true,
	"valid_from" timestamp with time zone,
	"valid_until" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviewer_blocked_times" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interviewer_id" uuid NOT NULL,
	"start_date_time" timestamp with time zone NOT NULL,
	"end_date_time" timestamp with time zone NOT NULL,
	"reason" varchar(255),
	"google_calendar_event_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduling_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"previous_session_id" uuid,
	"previous_scheduled_time" timestamp with time zone,
	"new_session_id" uuid,
	"new_scheduled_time" timestamp with time zone,
	"reason" varchar(255) NOT NULL,
	"initiated_by" varchar(100),
	"notifications_sent" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "standard_time_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"applicable_days" jsonb DEFAULT '[1,2,3,4,5]'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action" "audit_action" NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" uuid,
	"previous_value" jsonb,
	"new_value" jsonb,
	"reason" text,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calendar_change_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interviewer_id" uuid,
	"google_calendar_event_id" varchar(255),
	"change_type" varchar(50) NOT NULL,
	"previous_data" jsonb,
	"new_data" jsonb,
	"processed" boolean DEFAULT false,
	"processed_at" timestamp with time zone,
	"processing_result" text,
	"affected_candidate_ids" jsonb,
	"rescheduling_status" varchar(50),
	"detected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"status" "notification_status" DEFAULT 'pending' NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"channel" varchar(50) NOT NULL,
	"related_entity_type" varchar(50),
	"related_entity_id" uuid,
	"metadata" jsonb,
	"sent_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"severity" varchar(20) DEFAULT 'info',
	"metadata" jsonb,
	"related_entity_type" varchar(50),
	"related_entity_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timeline_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"event_type" "event_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"metadata" jsonb,
	"source" varchar(100),
	"source_id" uuid,
	"actor_type" varchar(50),
	"actor_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_interaction_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid,
	"interaction_type" varchar(100) NOT NULL,
	"channel" varchar(50),
	"input_prompt" text,
	"output_response" text,
	"structured_output" jsonb,
	"model_used" varchar(100),
	"tokens_used" integer,
	"latency_ms" integer,
	"was_successful" boolean DEFAULT true,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_prompt_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"prompt_template" text NOT NULL,
	"system_prompt" text,
	"variables" jsonb,
	"language" varchar(50) DEFAULT 'english',
	"version" integer DEFAULT 1,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_training_call_recordings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recording_url" text NOT NULL,
	"transcript_url" text,
	"transcript" text,
	"duration_seconds" integer,
	"is_successful_call" boolean DEFAULT false,
	"outcome_type" varchar(100),
	"extracted_tactics" jsonb,
	"processed" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_training_whatsapp_chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" varchar(255),
	"messages" jsonb,
	"is_successful_conversation" boolean DEFAULT false,
	"outcome_type" varchar(100),
	"processed" boolean DEFAULT false,
	"extracted_patterns" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_parsing_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid,
	"source_url" text NOT NULL,
	"source_platform" varchar(100),
	"raw_text" text,
	"extracted_data" jsonb,
	"classification_score" integer,
	"classification_reason" text,
	"matched_criteria" jsonb,
	"processing_status" varchar(50) DEFAULT 'pending',
	"processed_at" timestamp with time zone,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_criteria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"rules" jsonb,
	"minimum_score" integer DEFAULT 70,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qr_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recruiter_id" uuid NOT NULL,
	"code" varchar(100) NOT NULL,
	"qr_image_url" text,
	"landing_url" text NOT NULL,
	"campaign_name" varchar(255),
	"campaign_source" varchar(100),
	"total_scans" integer DEFAULT 0,
	"unique_scans" integer DEFAULT 0,
	"last_scanned_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "qr_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "qr_scans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"qr_code_id" uuid NOT NULL,
	"candidate_id" uuid,
	"ip_address" varchar(45),
	"user_agent" text,
	"device_type" varchar(50),
	"location" jsonb,
	"converted_to_candidate" boolean DEFAULT false,
	"converted_at" timestamp with time zone,
	"scanned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whatsapp_deep_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"qr_code_id" uuid,
	"candidate_id" uuid,
	"deep_link_url" text NOT NULL,
	"prefilled_message" text,
	"language" varchar(50) DEFAULT 'english',
	"clicked" boolean DEFAULT false,
	"clicked_at" timestamp with time zone,
	"message_sent" boolean DEFAULT false,
	"message_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviewers" ADD CONSTRAINT "interviewers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruiters" ADD CONSTRAINT "recruiters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_memories" ADD CONSTRAINT "candidate_memories_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_profiles" ADD CONSTRAINT "candidate_profiles_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_state_history" ADD CONSTRAINT "candidate_state_history_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_recruiter_id_recruiters_id_fk" FOREIGN KEY ("recruiter_id") REFERENCES "public"."recruiters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communication_attempts" ADD CONSTRAINT "communication_attempts_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_calls" ADD CONSTRAINT "voice_calls_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_calls" ADD CONSTRAINT "voice_calls_taken_over_by_users_id_fk" FOREIGN KEY ("taken_over_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_taken_over_by_users_id_fk" FOREIGN KEY ("taken_over_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_assignments" ADD CONSTRAINT "interview_assignments_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_assignments" ADD CONSTRAINT "interview_assignments_session_id_interview_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."interview_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_interviewer_id_interviewers_id_fk" FOREIGN KEY ("interviewer_id") REFERENCES "public"."interviewers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviewer_availability" ADD CONSTRAINT "interviewer_availability_interviewer_id_interviewers_id_fk" FOREIGN KEY ("interviewer_id") REFERENCES "public"."interviewers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviewer_blocked_times" ADD CONSTRAINT "interviewer_blocked_times_interviewer_id_interviewers_id_fk" FOREIGN KEY ("interviewer_id") REFERENCES "public"."interviewers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduling_history" ADD CONSTRAINT "scheduling_history_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduling_history" ADD CONSTRAINT "scheduling_history_previous_session_id_interview_sessions_id_fk" FOREIGN KEY ("previous_session_id") REFERENCES "public"."interview_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduling_history" ADD CONSTRAINT "scheduling_history_new_session_id_interview_sessions_id_fk" FOREIGN KEY ("new_session_id") REFERENCES "public"."interview_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_interaction_logs" ADD CONSTRAINT "ai_interaction_logs_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_parsing_results" ADD CONSTRAINT "cv_parsing_results_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_recruiter_id_recruiters_id_fk" FOREIGN KEY ("recruiter_id") REFERENCES "public"."recruiters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_qr_code_id_qr_codes_id_fk" FOREIGN KEY ("qr_code_id") REFERENCES "public"."qr_codes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_deep_links" ADD CONSTRAINT "whatsapp_deep_links_qr_code_id_qr_codes_id_fk" FOREIGN KEY ("qr_code_id") REFERENCES "public"."qr_codes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_deep_links" ADD CONSTRAINT "whatsapp_deep_links_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;