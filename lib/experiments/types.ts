import { Substance, ExperimentStep } from "@/types/experiment";
export * from "@/types/experiment";

/**
 * Sentinel constant returned when an experimental combination or scenario
 * is not defined in the deterministic experiment knowledge base.
 * The experiment engine must NEVER invent an outcome.
 */
export const UNSUPPORTED_EXPERIMENT = "UNSUPPORTED_EXPERIMENT" as const;
export type UnsupportedExperiment = typeof UNSUPPORTED_EXPERIMENT;

/**
 * Result object returned when an experimental scenario is unsupported.
 */
export interface UnsupportedExperimentResult {
  status: typeof UNSUPPORTED_EXPERIMENT;
  message: string;
  inputSubstances: string[];
  indicator: string;
}

/**
 * Educational role of a material within a practical inquiry.
 */
export type MaterialRole =
  | "acidic_sample"
  | "basic_sample"
  | "neutral_sample"
  | "indicator"
  | "reactant"
  | "solvent"
  | "control";

/**
 * Category classification for science practical materials.
 */
export type MaterialCategory = "acid" | "base" | "neutral" | "indicator";

/**
 * Structured metadata for each demonstration material.
 * Note: Household materials are context-appropriate learning materials for
 * demonstrating the underlying concept, not exact chemical equivalents of laboratory reagents.
 */
export interface Material {
  id: string;
  name: string;
  category: MaterialCategory | string;
  description: string;
  role: MaterialRole | string;
  supported: boolean;
  pedagogicalNote?: string;
  householdContext?: string;
  approximatePh?: number;
  state?: "liquid" | "solution" | "powder" | "solid" | "strip";
}

/**
 * Color response rule for an indicator under specific pH or chemical conditions.
 */
export interface IndicatorColorResponse {
  condition: "acidic" | "neutral" | "basic" | string;
  colorName: string;
  colorHex: string;
  description: string;
  minPh?: number;
  maxPh?: number;
}

/**
 * Structured indicator definition for educational practicals.
 */
export interface Indicator {
  id: string;
  name: string;
  category: "indicator" | string;
  description: string;
  role: string;
  supported: boolean;
  source: string;
  preparationGuide?: string;
  pedagogicalNote?: string;
  colorResponses?: IndicatorColorResponse[];
  substanceId?: string;
  indicatorName?: string;
  isNatural?: boolean;
  preparationGuideLocal?: string;
  colorRules?: Array<{
    minPh: number;
    maxPh: number;
    colorName: string;
    colorHex: string;
    description: string;
  }>;
}

/**
 * Expected educational observation for a deterministic reaction.
 */
export interface Observation {
  appearance: string;
  visualChange: string;
  effervescence: boolean;
  temperatureChange: "none" | "slight_warmth" | "noticeable_heat" | string;
  summary: string;
  colorHex?: string;
  inferredPhRange?: string;
}

/**
 * Safety status classification for experimental combinations.
 */
export type SafetyStatus = "SAFE" | "CAUTION" | "HAZARDOUS" | "PROHIBITED";

/**
 * Explicit safety rule guiding classroom or virtual science investigations.
 */
export interface SafetyRule {
  id: string;
  rule: string;
  severity: "info" | "warning" | "danger" | "critical";
  rationale: string;
  applicableSubstanceIds?: string[];
}

/**
 * Structured learning objective aligned to curriculum frameworks.
 */
export interface LearningObjective {
  id: string;
  description: string;
  domain?: "knowledge" | "skill" | "inquiry" | "safety";
  bloomTaxonomyLevel?: "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
}

/**
 * Pedagogical inquiry question to prompt student dialogue and reflection.
 */
export type InquiryQuestionType = "observation" | "inference" | "explanation" | "prediction";

export interface InquiryQuestion {
  id: string;
  question: string;
  type: InquiryQuestionType;
  promptHint?: string;
  expectedConcept?: string;
}

/**
 * Rubric performance tier for assessment scoring.
 */
export interface RubricLevel {
  level: "Proficient" | "Developing" | "Beginning";
  score: number;
  description: string;
  exampleIndicators: string[];
}

/**
 * Scoring criterion for evaluating student predictions, observations, and explanations.
 */
export type AssessmentDimension = "Prediction" | "Observation" | "Explanation";

export interface AssessmentCriterion {
  id: string;
  dimension: AssessmentDimension;
  title: string;
  description: string;
  maxPoints: number;
  rubricLevels: RubricLevel[];
}

/**
 * Deterministic combination definition.
 * The experiment engine must NEVER invent an outcome.
 * If a combination is not defined in the experiment data, the engine returns UNSUPPORTED_EXPERIMENT.
 */
export interface ExperimentCombination {
  id: string;
  inputSubstances: string[];
  indicator: string;
  expectedEducationalObservation: Observation;
  expectedObservation?: Observation;
  explanation: string;
  learningConcept: string;
  safetyStatus: SafetyStatus;
  notes?: string;
}

/**
 * Top-level structured Experiment model.
 * Easy to extend for future experiments.
 */
export interface Experiment {
  id: string;
  title: string;
  level: string;
  subject: string;
  learningObjectives: LearningObjective[];
  primaryObjective: string;
  pedagogicalClarification: string;
  contextClarification: string;
  materials: Material[];
  indicators: Indicator[];
  supportedCombinations: ExperimentCombination[];
  safetyRules: SafetyRule[];
  inquiryQuestions: InquiryQuestion[];
  assessmentCriteria: AssessmentCriterion[];

  // Optional contextual/UI metadata for multi-mode lab execution
  description?: string;
  curriculumStandard?: string;
  targetGradeLevels?: string[];
  modesSupported?: ("LOCAL_LAB" | "VIRTUAL_LAB")[];
  estimatedDurationMinutes?: number;
  substances?: Substance[];
  steps?: {
    localLab: ExperimentStep[];
    virtualLab: ExperimentStep[];
  };
  generalSafetyRules?: string[];
  lowResourceTips?: string[];
}
