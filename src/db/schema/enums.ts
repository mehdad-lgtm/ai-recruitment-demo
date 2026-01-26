import { pgEnum } from "drizzle-orm/pg-core";

// ================================================
// USER & ROLE ENUMS
// ================================================

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "interviewer", 
  "recruiter", // Field Recruiter
]);

// ================================================
// CANDIDATE ENUMS
// ================================================

export const candidateSourceEnum = pgEnum("candidate_source", [
  "qr_scan",      // QR code scan from Recruiter badge
  "cv_upload",    // Resume uploaded from job portals
  "social_media", // Social media ads
  "referral",     // Referral from existing candidates
  "walk_in",      // Walk-in candidates
  "other",
]);

export const candidateStateEnum = pgEnum("candidate_state", [
  "new",                    // Just created
  "contacted",              // Initial contact made
  "profiling",              // AI is asking profiling questions
  "profile_complete",       // Profile information captured
  "scheduling",             // In scheduling process
  "scheduled",              // Interview scheduled
  "pending_scheduling",     // Waiting for available slot
  "reschedule_required",    // Needs rescheduling
  "interview_completed",    // Interview done
  "accepted",               // Candidate accepted
  "rejected",               // Candidate rejected
  "withdrawn",              // Candidate withdrew
  "no_response",            // No response after attempts
  "blacklisted",            // Candidate blacklisted
]);

export const cvClassificationEnum = pgEnum("cv_classification", [
  "qualified",   // Good candidate - triggers outreach
  "unqualified", // Bad candidate - no outreach
  "pending",     // Not yet classified
]);

export const languagePreferenceEnum = pgEnum("language_preference", [
  "english",
  "chinese",
  "malay",
]);

// ================================================
// COMMUNICATION ENUMS
// ================================================

export const communicationChannelEnum = pgEnum("communication_channel", [
  "whatsapp",
  "voice_call",
  "email",
  "sms",
]);

export const communicationDirectionEnum = pgEnum("communication_direction", [
  "inbound",
  "outbound",
]);

export const communicationStatusEnum = pgEnum("communication_status", [
  "pending",
  "sent",
  "delivered",
  "read",
  "answered",
  "no_answer",
  "failed",
  "bounced",
]);

export const callStatusEnum = pgEnum("call_status", [
  "initiated",
  "ringing",
  "answered",
  "no_answer",
  "busy",
  "failed",
  "completed",
  "voicemail",
]);

export const whatsappAgentTypeEnum = pgEnum("whatsapp_agent_type", [
  "new_candidate",  // Handles first-timers
  "follow_up",      // Handles re-engagement
]);

// ================================================
// INTERVIEW & SCHEDULING ENUMS
// ================================================

export const interviewSessionStatusEnum = pgEnum("interview_session_status", [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "rescheduled",
]);

export const interviewOutcomeEnum = pgEnum("interview_outcome", [
  "pending",
  "passed",
  "failed",
  "no_show",
  "rescheduled",
]);

// ================================================
// EVENT & TIMELINE ENUMS
// ================================================

export const eventTypeEnum = pgEnum("event_type", [
  // Candidate lifecycle
  "candidate_created",
  "candidate_state_changed",
  "candidate_profile_updated",
  
  // Communication events
  "whatsapp_message_sent",
  "whatsapp_message_received",
  "voice_call_initiated",
  "voice_call_completed",
  "email_sent",
  "email_received",
  
  // Scheduling events
  "interview_scheduled",
  "interview_rescheduled",
  "interview_cancelled",
  "interview_completed",
  
  // AI events
  "ai_profiling_started",
  "ai_profiling_completed",
  "ai_salary_deflected",
  "ai_scheduling_initiated",
  
  // Admin events
  "admin_takeover",
  "admin_override",
  "admin_reassignment",
  
  // System events
  "calendar_change_detected",
  "notification_sent",
  "cv_parsed",
  "cv_classified",
]);

// ================================================
// NOTIFICATION ENUMS
// ================================================

export const notificationTypeEnum = pgEnum("notification_type", [
  "interview_scheduled",
  "interview_cancelled",
  "session_cancelled",
  "session_changed",
  "no_slots_available",
  "reschedule_required",
  "candidate_assigned",
  "candidate_no_show",
  "system_alert",
]);

export const notificationStatusEnum = pgEnum("notification_status", [
  "pending",
  "sent",
  "read",
  "failed",
]);

// ================================================
// AUDIT ENUMS
// ================================================

export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "takeover",
  "override",
  "reassign",
  "login",
  "logout",
]);
