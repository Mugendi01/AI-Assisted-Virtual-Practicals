import { z } from "zod";

export const LabModeSchema = z.enum(["LOCAL_LAB", "VIRTUAL_LAB"]);

export const StartExperimentSchema = z.object({
  experimentId: z.string().default("acid-base-testing"),
  mode: LabModeSchema,
  studentName: z.string().trim().min(1).max(100).optional(),
  containerCount: z.number().int().min(1).max(8).optional().default(3),
});

export type StartExperimentInput = z.infer<typeof StartExperimentSchema>;

export const ActionTypeSchema = z.enum([
  "ADD_SUBSTANCE",
  "ADD_INDICATOR",
  "MIX",
  "MEASURE_PH",
  "RECORD_OBSERVATION",
  "RESET_CONTAINER",
  "ADVANCE_STEP",
]);

export const ObservationItemSchema = z.object({
  substanceTested: z.string().min(1),
  indicatorUsed: z.string().min(1),
  observedColor: z.string().min(1),
  inferredPh: z.number().min(0).max(14).optional(),
  inferredCategory: z.enum(["acid", "base", "neutral"]),
  notes: z.string().max(500).optional(),
});

export const ExperimentActionSchema = z.object({
  sessionId: z.string().uuid(),
  actionType: ActionTypeSchema,
  containerId: z.string().optional().default("container_1"),
  substanceId: z.string().optional(),
  volumeMl: z.number().positive().max(500).optional().default(5),
  indicatorId: z.string().optional(),
  observation: ObservationItemSchema.optional(),
  stepNumber: z.number().int().positive().optional(),
});

export type ExperimentActionInput = z.infer<typeof ExperimentActionSchema>;

export const SafetyCheckSchema = z.object({
  substances: z.array(z.string().min(1)).min(1),
  mode: LabModeSchema,
  actionProposed: z.string().optional(),
  targetContainer: z.string().optional(),
});

export type SafetyCheckInput = z.infer<typeof SafetyCheckSchema>;

export const ExplainRequestSchema = z.object({
  experimentId: z.string().default("acid-base-testing"),
  mode: LabModeSchema,
  topic: z.enum([
    "COLOR_CHANGE",
    "NEUTRALIZATION",
    "PH_SCALE",
    "INDICATOR_CHEMISTRY",
    "GENERAL_QUERY",
  ]),
  substanceA: z.string().optional(),
  substanceB: z.string().optional(),
  indicatorUsed: z.string().optional(),
  observedColor: z.string().optional(),
  studentQuestion: z.string().max(1000).optional(),
  gradeLevel: z.string().optional().default("Middle School / Intro Chemistry"),
});

export type ExplainRequestInput = z.infer<typeof ExplainRequestSchema>;

export const FeedbackRequestSchema = z.object({
  experimentId: z.string().default("acid-base-testing"),
  mode: LabModeSchema,
  feedbackType: z.enum(["HYPOTHESIS", "OBSERVATION", "CONCLUSION"]),
  studentInput: z.string().min(2).max(1500),
  substanceTested: z.string().optional(),
  actualOutcome: z.string().optional(),
});

export type FeedbackRequestInput = z.infer<typeof FeedbackRequestSchema>;

export const AssessmentSubmissionSchema = z.object({
  sessionId: z.string().uuid(),
  experimentId: z.string().default("acid-base-testing"),
  mode: LabModeSchema,
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      studentAnswer: z.string().min(1),
    })
  ).default([]),
  observations: z.array(
    z.object({
      substanceId: z.string().min(1),
      observedColor: z.string().min(1),
      classifiedAs: z.enum(["acid", "base", "neutral"]),
    })
  ).default([]),
  reflection: z.string().max(2000).optional(),
});

export type AssessmentSubmissionInput = z.infer<typeof AssessmentSubmissionSchema>;
