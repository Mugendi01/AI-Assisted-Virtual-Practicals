import { ACID_BASE_SUBSTANCES, ACID_BASE_EXPERIMENT } from "@/lib/experiments/acid-base";
import { HazardLevel, LabMode, SafetyAlert } from "@/types/experiment";

export interface SafetyCheckResult {
  isSafe: boolean;
  hazardLevel: HazardLevel;
  alerts: SafetyAlert[];
  blocked: boolean;
  guidance: string[];
}

export class SafetyEngine {
  /**
   * Evaluates a combination of substances in a container or an upcoming action.
   */
  public static checkCombination(
    substanceIds: string[],
    mode: LabMode,
    actionProposed?: string
  ): SafetyCheckResult {
    const alerts: SafetyAlert[] = [];
    let highestHazard: HazardLevel = "SAFE";
    let blocked = false;

    const lowerIds = substanceIds.map((id) => id.toLowerCase());
    const substances = substanceIds
      .map((id) => ACID_BASE_SUBSTANCES.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined);

    // Rule 1: Bleach + Acid = TOXIC CHLORINE GAS (CRITICAL)
    const hasBleach = lowerIds.some((id) => id.includes("bleach"));
    const hasAcid = substances.some((s) => s.category === "acid");

    if (hasBleach && hasAcid) {
      alerts.push({
        level: "PROHIBITED",
        title: "TOXIC CHLORINE GAS HAZARD",
        message:
          "Mixing sodium hypochlorite (bleach) with any acid produces deadly chlorine gas (Cl2). This reaction is strictly prohibited.",
        recommendation:
          "Never mix household bleach with vinegar, lemon juice, or acids. In case of accidental exposure in a physical lab, evacuate the room and seek fresh air immediately.",
        timestamp: new Date().toISOString(),
      });
      highestHazard = "PROHIBITED";
      blocked = true;
    }

    // Rule 2: Strong Acid + Strong Base = RAPID EXOTHERMIC HEATING
    const hasStrongAcid = lowerIds.includes("hydrochloric_acid");
    const hasStrongBase = lowerIds.includes("sodium_hydroxide");

    if (hasStrongAcid && hasStrongBase) {
      alerts.push({
        level: "CAUTION",
        title: "Exothermic Neutralization Warning",
        message:
          "Mixing concentrated strong acid (HCl) with strong base (NaOH) releases significant heat (exothermic). Rapid addition can cause boiling and splashing.",
        recommendation:
          "Use dilute solutions (0.1M or less). Add dropwise with gentle swirling while wearing goggles.",
        timestamp: new Date().toISOString(),
      });
      if (highestHazard !== "PROHIBITED") {
        highestHazard = "CAUTION";
      }
    }

    // Rule 3: Lab Reagents in LOCAL_LAB mode
    if (mode === "LOCAL_LAB") {
      const labReagents = substances.filter((s) => s.availability === "lab_reagent");
      if (labReagents.length > 0) {
        alerts.push({
          level: "CAUTION",
          title: "Laboratory Chemical in Household Lab",
          message: `Substance(s) [${labReagents.map((r) => r.name).join(", ")}] are laboratory-grade reagents requiring specialized chemical disposal and PPE.`,
          recommendation:
            "For home or low-resource setups, replace with household alternatives (e.g., vinegar instead of HCl, baking soda instead of NaOH).",
          timestamp: new Date().toISOString(),
        });
        if (highestHazard === "SAFE") highestHazard = "CAUTION";
      }
    }

    // Rule 4: Corrosive substances caution
    const corrosiveSubstances = substances.filter((s) => s.hazardLevel === "CAUTION");
    if (corrosiveSubstances.length > 0 && !hasStrongAcid && !hasStrongBase) {
      alerts.push({
        level: "CAUTION",
        title: "Chemical Handling Caution",
        message: `${corrosiveSubstances.map((s) => s.name).join(", ")} can irritate sensitive skin or eyes.`,
        recommendation: "Avoid touching eyes or face. Rinse skin with cool water if contact occurs.",
        timestamp: new Date().toISOString(),
      });
      if (highestHazard === "SAFE") highestHazard = "CAUTION";
    }

    // Rule 5: Tasting / Ingestion warning
    if (actionProposed && actionProposed.toLowerCase().includes("taste")) {
      alerts.push({
        level: "PROHIBITED",
        title: "Never Taste Chemicals",
        message: "Never taste substances in a chemistry practical, even common foods like vinegar or baking soda.",
        recommendation: "Chemical contamination can cause acute irritation or toxicity. Always use indicators to test pH.",
        timestamp: new Date().toISOString(),
      });
      highestHazard = "PROHIBITED";
      blocked = true;
    }

    const guidance = this.getStandardGuidance(mode);

    return {
      isSafe: !blocked,
      hazardLevel: highestHazard,
      alerts,
      blocked,
      guidance,
    };
  }

  public static getStandardGuidance(mode: LabMode): string[] {
    const baseRules = ACID_BASE_EXPERIMENT.generalSafetyRules
      ? [...ACID_BASE_EXPERIMENT.generalSafetyRules]
      : ACID_BASE_EXPERIMENT.safetyRules.map((r) => r.rule);
    if (mode === "LOCAL_LAB") {
      return [
        ...baseRules,
        ...(ACID_BASE_EXPERIMENT.lowResourceTips || []),
        "Ensure good ventilation if working in a home kitchen or standard classroom.",
        "Keep a supply of clean tap water nearby for emergency rinsing.",
      ];
    }
    return [
      ...baseRules,
      "Virtual simulation mode enables safe exploration of chemical behaviors before hands-on wet labs.",
    ];
  }
}
