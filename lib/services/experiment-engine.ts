import { randomUUID } from "crypto";
import {
  ACID_BASE_EXPERIMENT,
  ACID_BASE_INDICATORS,
  ACID_BASE_SUBSTANCES,
  findExperimentCombination,
} from "@/lib/experiments/acid-base";
import { UNSUPPORTED_EXPERIMENT } from "@/lib/experiments/types";
import {
  AcidBaseReactionOutcome,
  ContainerContentItem,
  ContainerState,
  ExperimentSessionState,
  LabActionLog,
  LabMode,
  StudentObservation,
  Substance,
} from "@/types/experiment";
import { SafetyEngine } from "./safety-engine";
import { SafetyViolationError } from "@/lib/utils/api-response";

// In-memory session store for hackathon MVP (can be backed by Redis / DB later)
const sessionStore = new Map<string, ExperimentSessionState>();

export class ExperimentEngine {
  /**
   * Retrieves all available experiments metadata
   */
  public static listExperiments(mode?: LabMode) {
    const experiment = ACID_BASE_EXPERIMENT;
    if (mode && experiment.modesSupported && !experiment.modesSupported.includes(mode)) {
      return [];
    }
    return [
      {
        id: experiment.id,
        title: experiment.title,
        description: experiment.description || "",
        curriculumStandard: experiment.curriculumStandard || "",
        targetGradeLevels: experiment.targetGradeLevels || [experiment.level],
        learningObjectives: experiment.learningObjectives.map((obj) =>
          typeof obj === "string" ? obj : obj.description
        ),
        primaryObjective: experiment.primaryObjective,
        modesSupported: experiment.modesSupported || ["LOCAL_LAB", "VIRTUAL_LAB"],
        estimatedDurationMinutes: experiment.estimatedDurationMinutes || 30,
        substanceCount: experiment.materials.length,
        indicatorCount: experiment.indicators.length,
        stepsCount: {
          localLab: experiment.steps?.localLab.length ?? 0,
          virtualLab: experiment.steps?.virtualLab.length ?? 0,
        },
      },
    ];
  }

  /**
   * Retrieves detailed experiment definition by ID
   */
  public static getExperimentById(id: string) {
    if (id !== ACID_BASE_EXPERIMENT.id && id !== "acid-base" && id !== "acid-base-testing") {
      return null;
    }
    return ACID_BASE_EXPERIMENT;
  }

  /**
   * Starts a new experiment session
   */
  public static startSession(
    experimentId: string,
    mode: LabMode,
    studentName?: string,
    containerCount = 3
  ): ExperimentSessionState {
    const experiment = this.getExperimentById(experimentId);
    if (!experiment) {
      throw new Error(`Experiment with ID '${experimentId}' not found.`);
    }

    const sessionId = randomUUID();
    const now = new Date().toISOString();
    const containers: Record<string, ContainerState> = {};

    const count = Math.max(1, Math.min(containerCount, 8));
    for (let i = 1; i <= count; i++) {
      const containerId = `container_${i}`;
      containers[containerId] = {
        containerId,
        containerType: mode === "LOCAL_LAB" ? "cup" : "test_tube",
        contents: [],
        activeIndicatorId: undefined,
        currentPh: 7.0,
        currentColorName: "Clear / Colorless",
        currentColorHex: "#FFFFFF",
        effervescence: false,
        temperatureChange: "none",
        reactionDescription: "Container is clean and empty.",
      };
    }

    const steps =
      mode === "LOCAL_LAB"
        ? experiment.steps?.localLab ?? []
        : experiment.steps?.virtualLab ?? [];

    const initialSession: ExperimentSessionState = {
      sessionId,
      experimentId,
      mode,
      studentName: studentName || "Curious Scientist",
      currentStepIndex: 1,
      totalSteps: steps.length,
      containers,
      observations: [],
      safetyAlerts: [],
      actionHistory: [
        {
          actionId: randomUUID(),
          actionType: "ADVANCE_STEP",
          details: { step: 1, description: "Session started" },
          timestamp: now,
          outcomeSummary: `Initialized ${mode} session with ${count} containers.`,
        },
      ],
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    sessionStore.set(sessionId, initialSession);
    return initialSession;
  }

  /**
   * Retrieves an existing session
   */
  public static getSession(sessionId: string): ExperimentSessionState | null {
    return sessionStore.get(sessionId) || null;
  }

  /**
   * Saves updated session state
   */
  public static saveSession(session: ExperimentSessionState): void {
    session.updatedAt = new Date().toISOString();
    sessionStore.set(session.sessionId, session);
  }

  /**
   * Performs an action within a session
   */
  public static executeAction(
    sessionId: string,
    actionType: LabActionLog["actionType"],
    params: {
      containerId?: string;
      substanceId?: string;
      volumeMl?: number;
      indicatorId?: string;
      observation?: Omit<StudentObservation, "id" | "timestamp">;
      stepNumber?: number;
    }
  ): {
    session: ExperimentSessionState;
    outcome?: AcidBaseReactionOutcome;
    actionLog: LabActionLog;
  } {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session '${sessionId}' not found or has expired.`);
    }

    const containerId = params.containerId || "container_1";
    const container = session.containers[containerId];

    if (!container && actionType !== "ADVANCE_STEP") {
      throw new Error(`Container '${containerId}' does not exist in this session.`);
    }

    const now = new Date().toISOString();
    let outcome: AcidBaseReactionOutcome | undefined;
    let outcomeSummary = "";

    switch (actionType) {
      case "ADD_SUBSTANCE": {
        if (!params.substanceId) {
          throw new Error("substanceId is required for ADD_SUBSTANCE action.");
        }
        const substance = ACID_BASE_SUBSTANCES.find((s) => s.id === params.substanceId);
        if (!substance) {
          throw new Error(`Substance '${params.substanceId}' is not supported.`);
        }

        const volume = params.volumeMl && params.volumeMl > 0 ? params.volumeMl : 5;

        // Safety Pre-Check
        const currentSubstanceIds = container.contents.map((c) => c.substanceId);
        const safetyResult = SafetyEngine.checkCombination(
          [...currentSubstanceIds, substance.id],
          session.mode,
          "add substance"
        );

        if (safetyResult.alerts.length > 0) {
          session.safetyAlerts.push(...safetyResult.alerts);
        }

        if (safetyResult.blocked) {
          const fatalAlert = safetyResult.alerts.find((a) => a.level === "PROHIBITED");
          throw new SafetyViolationError(
            fatalAlert?.message || "Action blocked due to safety hazard.",
            safetyResult.alerts
          );
        }

        const previousPh = container.currentPh;
        const previousColor = container.currentColorName;

        const newContentItem: ContainerContentItem = {
          substanceId: substance.id,
          substanceName: substance.name,
          volumeMl: volume,
          category: substance.category,
          approximatePh: substance.approximatePh,
          addedAt: now,
        };

        container.contents.push(newContentItem);

        // Calculate mixture chemistry
        outcome = this.calculateMixtureState(container, previousPh, previousColor);
        outcomeSummary = `Added ${volume}ml of ${substance.name}. pH shifted from ${previousPh.toFixed(1)} to ${outcome.newPh.toFixed(1)}.`;
        break;
      }

      case "ADD_INDICATOR": {
        if (!params.indicatorId) {
          throw new Error("indicatorId is required for ADD_INDICATOR action.");
        }
        const indicator = ACID_BASE_INDICATORS.find((i) => i.substanceId === params.indicatorId);
        if (!indicator) {
          throw new Error(`Indicator '${params.indicatorId}' is not recognized.`);
        }

        container.activeIndicatorId = indicator.substanceId;
        const previousColor = container.currentColorName;
        const previousPh = container.currentPh;

        outcome = this.calculateMixtureState(container, previousPh, previousColor);
        outcomeSummary = `Added indicator ${indicator.indicatorName}. Solution color is now ${outcome.newColor} (pH ${outcome.newPh.toFixed(1)}).`;
        break;
      }

      case "MIX": {
        const previousPh = container.currentPh;
        const previousColor = container.currentColorName;
        outcome = this.calculateMixtureState(container, previousPh, previousColor, true);
        outcomeSummary = `Mixed solution in ${containerId}. Color is ${outcome.newColor}, pH is ${outcome.newPh.toFixed(1)}.`;
        break;
      }

      case "MEASURE_PH": {
        outcomeSummary = `Measured container ${containerId}: pH is ${container.currentPh.toFixed(2)}. Color: ${container.currentColorName}.`;
        break;
      }

      case "RECORD_OBSERVATION": {
        if (!params.observation) {
          throw new Error("observation data is required for RECORD_OBSERVATION action.");
        }
        const observationRecord: StudentObservation = {
          id: randomUUID(),
          stepNumber: session.currentStepIndex,
          ...params.observation,
          timestamp: now,
        };
        session.observations.push(observationRecord);
        outcomeSummary = `Recorded observation for ${params.observation.substanceTested}: observed ${params.observation.observedColor}, categorized as ${params.observation.inferredCategory}.`;
        break;
      }

      case "RESET_CONTAINER": {
        container.contents = [];
        container.activeIndicatorId = undefined;
        container.currentPh = 7.0;
        container.currentColorName = "Clear / Colorless";
        container.currentColorHex = "#FFFFFF";
        container.effervescence = false;
        container.temperatureChange = "none";
        container.reactionDescription = "Container has been emptied and rinsed clean.";
        outcomeSummary = `Reset and cleaned ${containerId}.`;
        break;
      }

      case "ADVANCE_STEP": {
        const targetStep = params.stepNumber ?? session.currentStepIndex + 1;
        session.currentStepIndex = Math.min(targetStep, session.totalSteps);
        if (session.currentStepIndex >= session.totalSteps) {
          session.completed = true;
        }
        outcomeSummary = `Advanced to step ${session.currentStepIndex} of ${session.totalSteps}.`;
        break;
      }

      default:
        throw new Error(`Unsupported action type '${actionType}'.`);
    }

    const actionLog: LabActionLog = {
      actionId: randomUUID(),
      actionType,
      containerId,
      details: params,
      timestamp: now,
      outcomeSummary,
    };

    session.actionHistory.push(actionLog);
    this.saveSession(session);

    return {
      session,
      outcome,
      actionLog,
    };
  }

  /**
   * Calculates realistic chemical state for a container
   */
  private static calculateMixtureState(
    container: ContainerState,
    previousPh: number,
    previousColor: string,
    forceMix = false
  ): AcidBaseReactionOutcome {
    if (container.contents.length === 0) {
      container.currentPh = 7.0;
      container.currentColorName = "Clear / Colorless";
      container.currentColorHex = "#FFFFFF";
      container.effervescence = false;
      container.temperatureChange = "none";
      container.reactionDescription = "Container is empty.";

      return {
        containerId: container.containerId,
        previousPh,
        newPh: 7.0,
        previousColor,
        newColor: "Clear / Colorless",
        newColorHex: "#FFFFFF",
        effervescence: false,
        temperatureChange: "none",
        reactionDescription: "Container is clean and empty.",
        neutralizationOccurred: false,
        scientificExplanation: "Empty vessel.",
      };
    }

    // Chemical pH & neutralization calculation
    let totalVolumeMl = 0;
    let totalHMoles = 0;
    let totalOHMoles = 0;
    let hasCarbonateBase = false;
    let hasAcid = false;

    for (const item of container.contents) {
      totalVolumeMl += item.volumeMl;
      const volumeL = item.volumeMl / 1000;

      if (item.category === "acid") {
        hasAcid = true;
        const hConc = Math.pow(10, -item.approximatePh);
        totalHMoles += hConc * volumeL;
      } else if (item.category === "base") {
        if (
          item.substanceId === "baking_soda_solution" ||
          item.substanceId === "wood_ash_solution"
        ) {
          hasCarbonateBase = true;
        }
        const poh = 14 - item.approximatePh;
        const ohConc = Math.pow(10, -poh);
        totalOHMoles += ohConc * volumeL;
      } else {
        // neutral solvent (water)
        const neutralMoles = Math.pow(10, -7) * volumeL;
        totalHMoles += neutralMoles;
        totalOHMoles += neutralMoles;
      }
    }

    let calculatedPh = 7.0;
    let neutralizationOccurred = false;
    let effervescence = false;
    let temperatureChange: ContainerState["temperatureChange"] = "none";
    let reactionDescription = "";
    let scientificExplanation = "";

    const totalVolumeL = totalVolumeMl / 1000;

    if (totalHMoles > totalOHMoles) {
      const netH = totalHMoles - totalOHMoles;
      const concH = netH / totalVolumeL;
      calculatedPh = -Math.log10(concH);
      calculatedPh = Math.max(1.0, Math.min(calculatedPh, 6.95));
    } else if (totalOHMoles > totalHMoles) {
      const netOH = totalOHMoles - totalHMoles;
      const concOH = netOH / totalVolumeL;
      const pOh = -Math.log10(concOH);
      calculatedPh = 14 - pOh;
      calculatedPh = Math.max(7.05, Math.min(calculatedPh, 13.5));
    } else {
      calculatedPh = 7.0;
    }

    // Check neutralization condition
    if (hasAcid && (totalOHMoles > 0 || container.contents.some((c) => c.category === "base"))) {
      neutralizationOccurred = true;
      temperatureChange = "slight_warmth";

      if (hasCarbonateBase) {
        effervescence = true;
        reactionDescription =
          "Active fizzing and bubbling observed! Carbon dioxide gas (CO2) is rapidly being released as the acid reacts with bicarbonate/carbonate.";
        scientificExplanation =
          "H+(aq) from the acid reacts with HCO3-(aq) from baking soda to form H2CO3, which decomposes into water (H2O) and gaseous carbon dioxide (CO2 ↑).";
      } else {
        reactionDescription =
          "Acid-base neutralization in progress. Hydrogen ions (H+) and hydroxide ions (OH-) are combining to form neutral water molecules.";
        scientificExplanation = "H+(aq) + OH-(aq) -> H2O(l) + energy (exothermic enthalpy of neutralization).";
      }
    } else if (hasAcid) {
      reactionDescription = "Acidic solution. High concentration of hydronium ions (H3O+ / H+).";
      scientificExplanation = "The dissolved acid donates protons to water, lowering the pH below 7.0.";
    } else if (container.contents.some((c) => c.category === "base")) {
      reactionDescription = "Alkaline solution. High concentration of hydroxide ions (OH-).";
      scientificExplanation = "The dissolved base generates hydroxide ions (OH-), raising the pH above 7.0.";
    } else {
      reactionDescription = "Neutral solution with balanced H+ and OH- ions.";
      scientificExplanation = "In pure water or neutral salts, [H+] equals [OH-] at approximately 10^-7 M.";
    }

    // Indicator color shift
    let currentColorName = "Clear Pale Mixture";
    let currentColorHex = "#F3F4F6";

    if (container.activeIndicatorId) {
      const indicator = ACID_BASE_INDICATORS.find(
        (i) => i.substanceId === container.activeIndicatorId || i.id === container.activeIndicatorId
      );
      if (indicator && indicator.colorRules) {
        const matchedRule = indicator.colorRules.find(
          (rule) => calculatedPh >= rule.minPh && calculatedPh <= rule.maxPh
        );
        if (matchedRule) {
          currentColorName = matchedRule.colorName;
          currentColorHex = matchedRule.colorHex;
        } else if (indicator.colorRules.length > 0) {
          currentColorName = indicator.colorRules[0].colorName;
          currentColorHex = indicator.colorRules[0].colorHex;
        }
      }

      // Consult deterministic experimental knowledge base
      const currentSubstanceIds = container.contents.map((c) => c.substanceId);
      const deterministicOutcome = findExperimentCombination(
        currentSubstanceIds,
        container.activeIndicatorId
      );
      if (deterministicOutcome !== UNSUPPORTED_EXPERIMENT) {
        currentColorName = deterministicOutcome.expectedEducationalObservation.appearance;
        if (deterministicOutcome.expectedEducationalObservation.colorHex) {
          currentColorHex = deterministicOutcome.expectedEducationalObservation.colorHex;
        }
        effervescence = deterministicOutcome.expectedEducationalObservation.effervescence;
        temperatureChange =
          deterministicOutcome.expectedEducationalObservation.temperatureChange as ContainerState["temperatureChange"];
        reactionDescription = deterministicOutcome.expectedEducationalObservation.summary;
        scientificExplanation = deterministicOutcome.explanation;
      }
    } else {
      // Natural appearance without indicator
      const lastAdded = container.contents[container.contents.length - 1];
      const substance = ACID_BASE_SUBSTANCES.find((s) => s.id === lastAdded.substanceId);
      if (substance) {
        currentColorName = substance.naturalColor;
        currentColorHex = substance.colorHex;
      }
    }

    container.currentPh = Number(calculatedPh.toFixed(2));
    container.currentColorName = currentColorName;
    container.currentColorHex = currentColorHex;
    container.effervescence = effervescence;
    container.temperatureChange = temperatureChange;
    container.reactionDescription = reactionDescription;

    return {
      containerId: container.containerId,
      previousPh,
      newPh: container.currentPh,
      previousColor,
      newColor: currentColorName,
      newColorHex: currentColorHex,
      effervescence,
      temperatureChange,
      reactionDescription,
      neutralizationOccurred,
      scientificExplanation,
    };
  }
}
