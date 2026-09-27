export type LabMode = "LOCAL_LAB" | "VIRTUAL_LAB";

export type SubstanceCategory = "acid" | "base" | "neutral" | "indicator";

export type HazardLevel = "SAFE" | "CAUTION" | "DANGEROUS" | "PROHIBITED";

export type SubstanceAvailability = "household" | "lab_reagent" | "natural_local";

export interface Substance {
  id: string;
  name: string;
  formula?: string;
  category: SubstanceCategory;
  approximatePh: number;
  concentration?: string;
  naturalColor: string;
  colorHex: string;
  state: "liquid" | "powder" | "solution" | "strip";
  availability: SubstanceAvailability;
  householdAlternative?: string;
  description: string;
  safetyNotes: string;
  hazardLevel: HazardLevel;
}

export interface IndicatorColorRule {
  minPh: number;
  maxPh: number;
  colorName: string;
  colorHex: string;
  description: string;
}

export interface IndicatorProfile {
  substanceId: string;
  indicatorName: string;
  isNatural: boolean;
  preparationGuideLocal?: string;
  colorRules: IndicatorColorRule[];
}

export interface ExperimentStep {
  stepNumber: number;
  title: string;
  mode: LabMode | "BOTH";
  instructions: string;
  expectedObservation: string;
  safetyCaution?: string;
  hint?: string;
}

export interface ExperimentDefinition {
  id: string;
  title: string;
  description: string;
  curriculumStandard: string;
  targetGradeLevels: string[];
  learningObjectives: string[];
  modesSupported: LabMode[];
  estimatedDurationMinutes: number;
  substances: Substance[];
  indicators: IndicatorProfile[];
  steps: {
    localLab: ExperimentStep[];
    virtualLab: ExperimentStep[];
  };
  generalSafetyRules: string[];
  lowResourceTips: string[];
}

export interface ContainerContentItem {
  substanceId: string;
  substanceName: string;
  volumeMl: number;
  category: SubstanceCategory;
  approximatePh: number;
  addedAt: string;
}

export interface ContainerState {
  containerId: string;
  containerType: "test_tube" | "beaker" | "spot_plate_well" | "cup";
  contents: ContainerContentItem[];
  activeIndicatorId?: string;
  currentPh: number;
  currentColorName: string;
  currentColorHex: string;
  effervescence: boolean;
  temperatureChange: "none" | "slight_warmth" | "noticeable_heat";
  reactionDescription: string;
}

export interface SafetyAlert {
  level: HazardLevel;
  title: string;
  message: string;
  recommendation: string;
  timestamp: string;
}

export interface LabActionLog {
  actionId: string;
  actionType:
    | "ADD_SUBSTANCE"
    | "ADD_INDICATOR"
    | "MIX"
    | "MEASURE_PH"
    | "RECORD_OBSERVATION"
    | "RESET_CONTAINER"
    | "ADVANCE_STEP";
  containerId?: string;
  details: Record<string, unknown>;
  timestamp: string;
  outcomeSummary?: string;
}

export interface StudentObservation {
  id: string;
  stepNumber?: number;
  substanceTested: string;
  indicatorUsed: string;
  observedColor: string;
  inferredPh?: number;
  inferredCategory: SubstanceCategory;
  notes?: string;
  timestamp: string;
}

export interface ExperimentSessionState {
  sessionId: string;
  experimentId: string;
  mode: LabMode;
  studentName?: string;
  currentStepIndex: number;
  totalSteps: number;
  containers: Record<string, ContainerState>;
  observations: StudentObservation[];
  safetyAlerts: SafetyAlert[];
  actionHistory: LabActionLog[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcidBaseReactionOutcome {
  containerId: string;
  previousPh: number;
  newPh: number;
  previousColor: string;
  newColor: string;
  newColorHex: string;
  effervescence: boolean;
  temperatureChange: "none" | "slight_warmth" | "noticeable_heat";
  reactionDescription: string;
  neutralizationOccurred: boolean;
  scientificExplanation: string;
}

export interface AssessmentSubmission {
  sessionId: string;
  experimentId: string;
  mode: "LOCAL_LAB" | "VIRTUAL_LAB";
  answers: {
    questionId: string;
    studentAnswer: string;
  }[];
  observations: {
    substanceId: string;
    observedColor: string;
    classifiedAs: "acid" | "base" | "neutral";
  }[];
  reflection?: string;
}

export interface AssessmentResult {
  score: number;
  maxScore: number;
  percentage: number;
  grade: "Distinction" | "Proficient" | "Developing" | "Needs Review";
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback: string;
  questionBreakdown: {
    questionId: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  practicalProficiencyRating: string;
}
