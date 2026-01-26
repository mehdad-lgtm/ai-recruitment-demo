import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Users & Auth
import { accounts, interviewers, recruiters, sessions, users, verifications } from "./users";

// Candidates
import { candidateMemories, candidateProfiles, candidates, candidateStateHistory } from "./candidates";

// Communications
import { communicationAttempts, emails, voiceCalls, whatsappMessages } from "./communications";

// Scheduling
import {
  interviewAssignments,
  interviewerAvailability,
  interviewerBlockedTimes,
  interviewSessions,
  schedulingHistory,
  standardTimeSlots
} from "./scheduling";

// Events
import { auditLogs, calendarChangeEvents, notifications, systemEvents, timelineEvents } from "./events";

// AI
import {
  aiInteractionLogs,
  aiPromptTemplates,
  aiTrainingCallRecordings,
  aiTrainingWhatsappChats,
  cvParsingResults,
  jobCriteria
} from "./ai";

// QR
import { qrCodes, qrScans, whatsappDeepLinks } from "./qr";

// Knowledge Base
import {
  knowledgeAttachments,
  knowledgeBase,
  knowledgeFeedback,
  knowledgeRelations,
  knowledgeUsageLog,
} from "./knowledge";

// ================================================
// USER SCHEMAS
// ================================================

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email("Invalid email address"),
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  phone: (schema) => schema.regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
});
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;

export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);
export type InsertSession = InferInsertModel<typeof sessions>;
export type SelectSession = InferSelectModel<typeof sessions>;

export const insertAccountSchema = createInsertSchema(accounts);
export const selectAccountSchema = createSelectSchema(accounts);
export type InsertAccount = InferInsertModel<typeof accounts>;
export type SelectAccount = InferSelectModel<typeof accounts>;

export const insertVerificationSchema = createInsertSchema(verifications);
export const selectVerificationSchema = createSelectSchema(verifications);
export type InsertVerification = InferInsertModel<typeof verifications>;
export type SelectVerification = InferSelectModel<typeof verifications>;

export const insertRecruiterSchema = createInsertSchema(recruiters, {
  recruiterId: (schema) => schema.min(3, "Recruiter ID must be at least 3 characters"),
});
export const selectRecruiterSchema = createSelectSchema(recruiters);
export type InsertRecruiter = InferInsertModel<typeof recruiters>;
export type SelectRecruiter = InferSelectModel<typeof recruiters>;

export const insertInterviewerSchema = createInsertSchema(interviewers, {
  calendarId: (schema) => schema.optional(),
  maxCandidatesPerSession: (schema) => schema.min(1).max(20).optional(),
});
export const selectInterviewerSchema = createSelectSchema(interviewers);
export type InsertInterviewer = InferInsertModel<typeof interviewers>;
export type SelectInterviewer = InferSelectModel<typeof interviewers>;

// ================================================
// CANDIDATE SCHEMAS
// ================================================

export const insertCandidateSchema = createInsertSchema(candidates, {
  phone: (schema) => schema.regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
  email: (schema) => schema.email("Invalid email address").optional(),
  name: (schema) => schema.min(1).optional(),
});
export const selectCandidateSchema = createSelectSchema(candidates);
export type InsertCandidate = InferInsertModel<typeof candidates>;
export type SelectCandidate = InferSelectModel<typeof candidates>;

export const insertCandidateProfileSchema = createInsertSchema(candidateProfiles, {
  yearsOfExperience: (schema) => schema.min(0).max(50).optional(),
  profileCompleteness: (schema) => schema.min(0).max(100).optional(),
});
export const selectCandidateProfileSchema = createSelectSchema(candidateProfiles);
export type InsertCandidateProfile = InferInsertModel<typeof candidateProfiles>;
export type SelectCandidateProfile = InferSelectModel<typeof candidateProfiles>;

export const insertCandidateMemorySchema = createInsertSchema(candidateMemories);
export const selectCandidateMemorySchema = createSelectSchema(candidateMemories);
export type InsertCandidateMemory = InferInsertModel<typeof candidateMemories>;
export type SelectCandidateMemory = InferSelectModel<typeof candidateMemories>;

export const insertCandidateStateHistorySchema = createInsertSchema(candidateStateHistory);
export const selectCandidateStateHistorySchema = createSelectSchema(candidateStateHistory);
export type InsertCandidateStateHistory = InferInsertModel<typeof candidateStateHistory>;
export type SelectCandidateStateHistory = InferSelectModel<typeof candidateStateHistory>;

// ================================================
// COMMUNICATION SCHEMAS
// ================================================

export const insertWhatsappMessageSchema = createInsertSchema(whatsappMessages, {
  messageContent: (schema) => schema.min(1, "Message content is required"),
});
export const selectWhatsappMessageSchema = createSelectSchema(whatsappMessages);
export type InsertWhatsappMessage = InferInsertModel<typeof whatsappMessages>;
export type SelectWhatsappMessage = InferSelectModel<typeof whatsappMessages>;

export const insertVoiceCallSchema = createInsertSchema(voiceCalls, {
  fromNumber: (schema) => schema.regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
  toNumber: (schema) => schema.regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
});
export const selectVoiceCallSchema = createSelectSchema(voiceCalls);
export type InsertVoiceCall = InferInsertModel<typeof voiceCalls>;
export type SelectVoiceCall = InferSelectModel<typeof voiceCalls>;

export const insertEmailSchema = createInsertSchema(emails, {
  fromAddress: (schema) => schema.email("Invalid email address").optional(),
  toAddress: (schema) => schema.email("Invalid email address").optional(),
});
export const selectEmailSchema = createSelectSchema(emails);
export type InsertEmail = InferInsertModel<typeof emails>;
export type SelectEmail = InferSelectModel<typeof emails>;

export const insertCommunicationAttemptSchema = createInsertSchema(communicationAttempts);
export const selectCommunicationAttemptSchema = createSelectSchema(communicationAttempts);
export type InsertCommunicationAttempt = InferInsertModel<typeof communicationAttempts>;
export type SelectCommunicationAttempt = InferSelectModel<typeof communicationAttempts>;

// ================================================
// SCHEDULING SCHEMAS
// ================================================

export const insertInterviewSessionSchema = createInsertSchema(interviewSessions, {
  maxCapacity: (schema) => schema.min(1).max(20).optional(),
});
export const selectInterviewSessionSchema = createSelectSchema(interviewSessions);
export type InsertInterviewSession = InferInsertModel<typeof interviewSessions>;
export type SelectInterviewSession = InferSelectModel<typeof interviewSessions>;

export const insertInterviewAssignmentSchema = createInsertSchema(interviewAssignments, {
  slotNumber: (schema) => schema.min(1).max(10).optional(),
  interviewerRating: (schema) => schema.min(1).max(5).optional(),
});
export const selectInterviewAssignmentSchema = createSelectSchema(interviewAssignments);
export type InsertInterviewAssignment = InferInsertModel<typeof interviewAssignments>;
export type SelectInterviewAssignment = InferSelectModel<typeof interviewAssignments>;

export const insertInterviewerAvailabilitySchema = createInsertSchema(interviewerAvailability, {
  dayOfWeek: (schema) => schema.min(0).max(6),
});
export const selectInterviewerAvailabilitySchema = createSelectSchema(interviewerAvailability);
export type InsertInterviewerAvailability = InferInsertModel<typeof interviewerAvailability>;
export type SelectInterviewerAvailability = InferSelectModel<typeof interviewerAvailability>;

export const insertInterviewerBlockedTimeSchema = createInsertSchema(interviewerBlockedTimes);
export const selectInterviewerBlockedTimeSchema = createSelectSchema(interviewerBlockedTimes);
export type InsertInterviewerBlockedTime = InferInsertModel<typeof interviewerBlockedTimes>;
export type SelectInterviewerBlockedTime = InferSelectModel<typeof interviewerBlockedTimes>;

export const insertStandardTimeSlotSchema = createInsertSchema(standardTimeSlots);
export const selectStandardTimeSlotSchema = createSelectSchema(standardTimeSlots);
export type InsertStandardTimeSlot = InferInsertModel<typeof standardTimeSlots>;
export type SelectStandardTimeSlot = InferSelectModel<typeof standardTimeSlots>;

export const insertSchedulingHistorySchema = createInsertSchema(schedulingHistory);
export const selectSchedulingHistorySchema = createSelectSchema(schedulingHistory);
export type InsertSchedulingHistory = InferInsertModel<typeof schedulingHistory>;
export type SelectSchedulingHistory = InferSelectModel<typeof schedulingHistory>;

// ================================================
// EVENT SCHEMAS
// ================================================

export const insertTimelineEventSchema = createInsertSchema(timelineEvents, {
  title: (schema) => schema.min(1, "Title is required"),
});
export const selectTimelineEventSchema = createSelectSchema(timelineEvents);
export type InsertTimelineEvent = InferInsertModel<typeof timelineEvents>;
export type SelectTimelineEvent = InferSelectModel<typeof timelineEvents>;

export const insertSystemEventSchema = createInsertSchema(systemEvents);
export const selectSystemEventSchema = createSelectSchema(systemEvents);
export type InsertSystemEvent = InferInsertModel<typeof systemEvents>;
export type SelectSystemEvent = InferSelectModel<typeof systemEvents>;

export const insertNotificationSchema = createInsertSchema(notifications, {
  title: (schema) => schema.min(1, "Title is required"),
  message: (schema) => schema.min(1, "Message is required"),
});
export const selectNotificationSchema = createSelectSchema(notifications);
export type InsertNotification = InferInsertModel<typeof notifications>;
export type SelectNotification = InferSelectModel<typeof notifications>;

export const insertAuditLogSchema = createInsertSchema(auditLogs);
export const selectAuditLogSchema = createSelectSchema(auditLogs);
export type InsertAuditLog = InferInsertModel<typeof auditLogs>;
export type SelectAuditLog = InferSelectModel<typeof auditLogs>;

export const insertCalendarChangeEventSchema = createInsertSchema(calendarChangeEvents);
export const selectCalendarChangeEventSchema = createSelectSchema(calendarChangeEvents);
export type InsertCalendarChangeEvent = InferInsertModel<typeof calendarChangeEvents>;
export type SelectCalendarChangeEvent = InferSelectModel<typeof calendarChangeEvents>;

// ================================================
// AI SCHEMAS
// ================================================

export const insertAiTrainingWhatsappChatSchema = createInsertSchema(aiTrainingWhatsappChats);
export const selectAiTrainingWhatsappChatSchema = createSelectSchema(aiTrainingWhatsappChats);
export type InsertAiTrainingWhatsappChat = InferInsertModel<typeof aiTrainingWhatsappChats>;
export type SelectAiTrainingWhatsappChat = InferSelectModel<typeof aiTrainingWhatsappChats>;

export const insertAiTrainingCallRecordingSchema = createInsertSchema(aiTrainingCallRecordings, {
  recordingUrl: (schema) => schema.url("Invalid URL"),
});
export const selectAiTrainingCallRecordingSchema = createSelectSchema(aiTrainingCallRecordings);
export type InsertAiTrainingCallRecording = InferInsertModel<typeof aiTrainingCallRecordings>;
export type SelectAiTrainingCallRecording = InferSelectModel<typeof aiTrainingCallRecordings>;

export const insertCvParsingResultSchema = createInsertSchema(cvParsingResults, {
  sourceUrl: (schema) => schema.url("Invalid URL"),
});
export const selectCvParsingResultSchema = createSelectSchema(cvParsingResults);
export type InsertCvParsingResult = InferInsertModel<typeof cvParsingResults>;
export type SelectCvParsingResult = InferSelectModel<typeof cvParsingResults>;

export const insertJobCriteriaSchema = createInsertSchema(jobCriteria, {
  name: (schema) => schema.min(1, "Name is required"),
  minimumScore: (schema) => schema.min(0).max(100).optional(),
});
export const selectJobCriteriaSchema = createSelectSchema(jobCriteria);
export type InsertJobCriteria = InferInsertModel<typeof jobCriteria>;
export type SelectJobCriteria = InferSelectModel<typeof jobCriteria>;

export const insertAiPromptTemplateSchema = createInsertSchema(aiPromptTemplates, {
  name: (schema) => schema.min(1, "Name is required"),
  promptTemplate: (schema) => schema.min(1, "Template is required"),
});
export const selectAiPromptTemplateSchema = createSelectSchema(aiPromptTemplates);
export type InsertAiPromptTemplate = InferInsertModel<typeof aiPromptTemplates>;
export type SelectAiPromptTemplate = InferSelectModel<typeof aiPromptTemplates>;

export const insertAiInteractionLogSchema = createInsertSchema(aiInteractionLogs);
export const selectAiInteractionLogSchema = createSelectSchema(aiInteractionLogs);
export type InsertAiInteractionLog = InferInsertModel<typeof aiInteractionLogs>;
export type SelectAiInteractionLog = InferSelectModel<typeof aiInteractionLogs>;

// ================================================
// QR SCHEMAS
// ================================================

export const insertQrCodeSchema = createInsertSchema(qrCodes, {
  code: (schema) => schema.min(3, "Code must be at least 3 characters"),
  landingUrl: (schema) => schema.url("Invalid URL"),
});
export const selectQrCodeSchema = createSelectSchema(qrCodes);
export type InsertQrCode = InferInsertModel<typeof qrCodes>;
export type SelectQrCode = InferSelectModel<typeof qrCodes>;

export const insertQrScanSchema = createInsertSchema(qrScans);
export const selectQrScanSchema = createSelectSchema(qrScans);
export type InsertQrScan = InferInsertModel<typeof qrScans>;
export type SelectQrScan = InferSelectModel<typeof qrScans>;

export const insertWhatsappDeepLinkSchema = createInsertSchema(whatsappDeepLinks, {
  deepLinkUrl: (schema) => schema.url("Invalid URL"),
});
export const selectWhatsappDeepLinkSchema = createSelectSchema(whatsappDeepLinks);
export type InsertWhatsappDeepLink = InferInsertModel<typeof whatsappDeepLinks>;
export type SelectWhatsappDeepLink = InferSelectModel<typeof whatsappDeepLinks>;

// ================================================
// KNOWLEDGE BASE SCHEMAS
// ================================================

export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase);
export const selectKnowledgeBaseSchema = createSelectSchema(knowledgeBase);
export type InsertKnowledgeBase = InferInsertModel<typeof knowledgeBase>;
export type SelectKnowledgeBase = InferSelectModel<typeof knowledgeBase>;

export const insertKnowledgeRelationsSchema = createInsertSchema(knowledgeRelations);
export const selectKnowledgeRelationsSchema = createSelectSchema(knowledgeRelations);
export type InsertKnowledgeRelations = InferInsertModel<typeof knowledgeRelations>;
export type SelectKnowledgeRelations = InferSelectModel<typeof knowledgeRelations>;

export const insertKnowledgeUsageLogSchema = createInsertSchema(knowledgeUsageLog);
export const selectKnowledgeUsageLogSchema = createSelectSchema(knowledgeUsageLog);
export type InsertKnowledgeUsageLog = InferInsertModel<typeof knowledgeUsageLog>;
export type SelectKnowledgeUsageLog = InferSelectModel<typeof knowledgeUsageLog>;

export const insertKnowledgeAttachmentsSchema = createInsertSchema(knowledgeAttachments);
export const selectKnowledgeAttachmentsSchema = createSelectSchema(knowledgeAttachments);
export type InsertKnowledgeAttachments = InferInsertModel<typeof knowledgeAttachments>;
export type SelectKnowledgeAttachments = InferSelectModel<typeof knowledgeAttachments>;

export const insertKnowledgeFeedbackSchema = createInsertSchema(knowledgeFeedback);
export const selectKnowledgeFeedbackSchema = createSelectSchema(knowledgeFeedback);
export type InsertKnowledgeFeedback = InferInsertModel<typeof knowledgeFeedback>;
export type SelectKnowledgeFeedback = InferSelectModel<typeof knowledgeFeedback>;
