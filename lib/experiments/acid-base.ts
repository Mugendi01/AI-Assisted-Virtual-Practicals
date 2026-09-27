import {
  AssessmentCriterion,
  Experiment,
  ExperimentCombination,
  ExperimentDefinition,
  Indicator,
  IndicatorProfile,
  InquiryQuestion,
  LearningObjective,
  Material,
  Observation,
  SafetyRule,
  Substance,
  UNSUPPORTED_EXPERIMENT,
  UnsupportedExperimentResult,
} from "./types";

/**
 * Contextual educational note:
 * Household materials are context-appropriate learning materials for demonstrating
 * the underlying concept, not exact chemical equivalents of laboratory reagents.
 */
export const PEDAGOGICAL_CLARIFICATION =
  "Household materials (lemon juice, vinegar, baking soda solution, turmeric extract, hibiscus tea) are context-appropriate learning materials used to demonstrate fundamental chemical principles like acidity, basicity, and neutralization in accessible settings. They are NOT exact chemical equivalents of standardized laboratory reagents (such as concentrated reagent-grade citric acid, glacial acetic acid, or 1.0 M sodium hydroxide), but function effectively as educational analogues for hands-on inquiry.";

// ============================================================================
// SUPPORTED DEMONSTRATION MATERIALS
// ============================================================================

export const ACID_BASE_MATERIALS: Material[] = [
  {
    id: "lemon_juice",
    name: "Lemon Juice",
    category: "acid",
    description:
      "Natural citrus fruit juice containing organic citric and ascorbic acids, used as an accessible learning substance to demonstrate acidic properties.",
    role: "acidic_sample",
    supported: true,
    pedagogicalNote:
      "Context-appropriate learning material representing acidic properties. Not an exact chemical equivalent of pure laboratory citric acid.",
    householdContext: "Freshly squeezed lemon juice or bottled lemon juice.",
    approximatePh: 2.2,
    state: "liquid",
  },
  {
    id: "vinegar",
    name: "Household Vinegar",
    category: "acid",
    description:
      "Dilute aqueous acetic acid (~5%) produced through fermentation, serving as an accessible learning material to explore acidic behavior.",
    role: "acidic_sample",
    supported: true,
    pedagogicalNote:
      "Context-appropriate household sample for demonstrating acidity safely without handling concentrated laboratory acids.",
    householdContext: "Standard white vinegar or distilled cane vinegar.",
    approximatePh: 2.5,
    state: "liquid",
  },
  {
    id: "baking_soda_solution",
    name: "Baking Soda Solution",
    category: "base",
    description:
      "Mild aqueous alkaline solution prepared by dissolving sodium bicarbonate in water, used to safely demonstrate basic behavior and effervescence.",
    role: "basic_sample",
    supported: true,
    pedagogicalNote:
      "Context-appropriate household alkaline substance used to demonstrate weak basic properties and neutralization safely.",
    householdContext: "1 teaspoon of baking soda powder thoroughly dissolved in 100ml of water.",
    approximatePh: 8.4,
    state: "solution",
  },
  {
    id: "turmeric_indicator",
    name: "Turmeric Indicator",
    category: "indicator",
    description:
      "Natural plant indicator derived from Curcuma longa containing the curcumin pigment, which remains bright yellow in acid and neutral solutions and turns deep reddish-brown in basic solutions.",
    role: "indicator",
    supported: true,
    pedagogicalNote:
      "Context-appropriate natural indicator for identifying alkaline solutions via a single distinct color transition. Demonstrates indicator chemistry using kitchen spices.",
    householdContext:
      "Half a teaspoon of ground turmeric powder stirred into 2 tablespoons of warm water or rubbing alcohol and filtered.",
    approximatePh: 7.0,
    state: "solution",
  },
  {
    id: "hibiscus_indicator",
    name: "Hibiscus Indicator",
    category: "indicator",
    description:
      "Natural botanical indicator extracted from dried roselle / hibiscus calyces containing anthocyanins, which turn vibrant magenta-red in acidic solutions and dark green to olive-brown in basic solutions.",
    role: "indicator",
    supported: true,
    pedagogicalNote:
      "Context-appropriate botanical pH indicator providing clear two-way color contrast between acidic and basic environments through natural plant pigments.",
    householdContext:
      "Dried hibiscus calyces (roselle/karkadeh) or a hibiscus tea bag steeped in warm water for 5 minutes and filtered.",
    approximatePh: 7.0,
    state: "solution",
  },
];

// ============================================================================
// STRUCTURED INDICATORS
// ============================================================================

export const ACID_BASE_INDICATORS: (Indicator & IndicatorProfile)[] = [
  {
    id: "turmeric_indicator",
    substanceId: "turmeric_indicator",
    name: "Turmeric Indicator",
    indicatorName: "Turmeric Extract (Curcumin)",
    category: "indicator",
    role: "indicator",
    supported: true,
    isNatural: true,
    source: "Turmeric rhizome / ground spice (Curcuma longa - Curcumin)",
    description:
      "Natural plant-based polyphenol indicator that stays bright yellow under acidic and neutral conditions and shifts to deep brick-red / reddish-brown in alkaline environments.",
    preparationGuide:
      "Mix 1/2 teaspoon of ground turmeric powder with 2 tablespoons of warm water or rubbing alcohol. Stir thoroughly and filter through a coffee filter or clean cloth.",
    preparationGuideLocal:
      "Mix 1/2 teaspoon of ground turmeric powder with 2 tablespoons of rubbing alcohol or warm water. Filter through a coffee filter or clean cloth.",
    pedagogicalNote:
      "Context-appropriate natural indicator for identifying alkaline substances through a single distinct color transition.",
    colorResponses: [
      {
        condition: "acidic",
        colorName: "Bright Golden Yellow",
        colorHex: "#EAB308",
        description: "Curcumin remains protonated and neutral yellow in acidic solutions (pH < 7.4).",
        minPh: 0,
        maxPh: 7.4,
      },
      {
        condition: "neutral",
        colorName: "Bright Golden Yellow",
        colorHex: "#EAB308",
        description: "Curcumin retains its natural yellow hue in neutral solutions.",
        minPh: 7.0,
        maxPh: 7.4,
      },
      {
        condition: "basic",
        colorName: "Deep Reddish-Brown / Rusty Red",
        colorHex: "#991B1B",
        description: "Under basic conditions (pH > 7.5), curcumin deprotonates and turns deep brick-red.",
        minPh: 7.5,
        maxPh: 14.0,
      },
    ],
    colorRules: [
      {
        minPh: 0,
        maxPh: 7.4,
        colorName: "Bright Golden Yellow",
        colorHex: "#EAB308",
        description: "Curcumin remains intensely yellow in neutral and acidic solutions.",
      },
      {
        minPh: 7.5,
        maxPh: 14.0,
        colorName: "Deep Rusty Red / Brown",
        colorHex: "#991B1B",
        description: "Under alkaline conditions, curcumin deprotonates and turns deep brick-red.",
      },
    ],
  },
  {
    id: "hibiscus_indicator",
    substanceId: "hibiscus_indicator",
    name: "Hibiscus Indicator",
    indicatorName: "Hibiscus / Roselle Flower Extract",
    category: "indicator",
    role: "indicator",
    supported: true,
    isNatural: true,
    source: "Dried Hibiscus sabdariffa (Roselle / Karkadeh) calyces (Anthocyanins)",
    description:
      "Natural plant extract containing anthocyanin pigments that exhibit distinct color shifts across the pH spectrum: bright magenta-red in acid, violet at neutral, and dark green/olive-brown in base.",
    preparationGuide:
      "Steep 3-4 dried hibiscus petals or a hibiscus tea bag in warm water for 5 minutes until deep ruby red. Strain and cool before use.",
    preparationGuideLocal:
      "Steep dried hibiscus petals (roselle or karkadeh) or a hibiscus tea bag in warm water for 5 minutes until deep ruby red. Strain and cool.",
    pedagogicalNote:
      "Context-appropriate botanical pH indicator providing clear two-way color contrast between acidic and basic environments.",
    colorResponses: [
      {
        condition: "acidic",
        colorName: "Bright Magenta / Scarlet Red",
        colorHex: "#F43F5E",
        description: "Anthocyanins form red flavylium cations in acidic solutions (pH < 3.5).",
        minPh: 0,
        maxPh: 3.5,
      },
      {
        condition: "neutral",
        colorName: "Dark Violet / Gray-Purple",
        colorHex: "#4C1D95",
        description: "At neutral pH (6.9 - 7.5), anthocyanins exist in a balanced violet state.",
        minPh: 6.9,
        maxPh: 7.5,
      },
      {
        condition: "basic",
        colorName: "Dark Bottle Green / Olive Brown",
        colorHex: "#14532D",
        description: "Basic conditions (pH > 7.6) shift anthocyanins to deep green or olive-brown.",
        minPh: 7.6,
        maxPh: 14.0,
      },
    ],
    colorRules: [
      {
        minPh: 0,
        maxPh: 3.5,
        colorName: "Bright Magenta / Scarlet Red",
        colorHex: "#F43F5E",
        description: "Acidic condition produces a bright ruby or magenta tone.",
      },
      {
        minPh: 3.6,
        maxPh: 6.8,
        colorName: "Deep Pinkish Purple",
        colorHex: "#A21CAF",
        description: "Slightly acidic to near-neutral.",
      },
      {
        minPh: 6.9,
        maxPh: 7.5,
        colorName: "Dark Violet / Gray-Purple",
        colorHex: "#4C1D95",
        description: "Neutral balance.",
      },
      {
        minPh: 7.6,
        maxPh: 14.0,
        colorName: "Dark Bottle Green / Olive Brown",
        colorHex: "#14532D",
        description: "Basic condition shifts anthocyanin pigments to deep forest green or olive brown.",
      },
    ],
  },
];

// ============================================================================
// LEARNING OBJECTIVES
// ============================================================================

export const PRIMARY_LEARNING_OBJECTIVE =
  "Identify acidic and basic substances using indicators and explain the observed changes.";

export const LEARNING_OBJECTIVES: LearningObjective[] = [
  {
    id: "lo_identify_acid_base",
    description: PRIMARY_LEARNING_OBJECTIVE,
    domain: "knowledge",
    bloomTaxonomyLevel: "understand",
  },
  {
    id: "lo_use_indicators",
    description:
      "Use plant-based indicators (turmeric, hibiscus) to observe distinct color transitions corresponding to chemical properties.",
    domain: "skill",
    bloomTaxonomyLevel: "apply",
  },
  {
    id: "lo_distinguish_materials",
    description:
      "Classify common context-appropriate materials (lemon juice, vinegar, baking soda solution) into acidic or basic groups based on empirical evidence.",
    domain: "inquiry",
    bloomTaxonomyLevel: "analyze",
  },
  {
    id: "lo_explain_neutralization",
    description:
      "Explain the phenomenon of acid-base neutralization as a reaction producing observable gas evolution (effervescence) and an indicator color shift towards neutral.",
    domain: "knowledge",
    bloomTaxonomyLevel: "understand",
  },
  {
    id: "lo_safety_habits",
    description:
      "Practice safe laboratory inquiry by refraining from tasting materials and managing reaction rates when mixing substances.",
    domain: "safety",
    bloomTaxonomyLevel: "apply",
  },
];

// ============================================================================
// SAFETY RULES
// ============================================================================

export const SAFETY_RULES: SafetyRule[] = [
  {
    id: "sr_never_taste",
    rule: "Never taste any material during a science practical, even common household substances like lemon juice, vinegar, or baking soda.",
    severity: "critical",
    rationale:
      "Tasting laboratory or experimental samples fosters unsafe laboratory habits and risks chemical contamination or irritation.",
  },
  {
    id: "sr_eye_protection",
    rule: "Avoid touching your face or eyes during experiments. If citrus juice or vinegar splashes into eyes, immediately rinse with clean water.",
    severity: "warning",
    rationale:
      "Mild acids and alkaline powders cause irritation and burning sensations to sensitive ocular tissues.",
  },
  {
    id: "sr_no_toxic_mixtures",
    rule: "Never mix household bleach, disinfectants, or unknown cleaning chemicals with vinegar, lemon juice, or acids.",
    severity: "critical",
    rationale:
      "Mixing sodium hypochlorite (bleach) with acids produces deadly, choking chlorine gas (Cl2).",
  },
  {
    id: "sr_gradual_mixing",
    rule: "When mixing baking soda solution with acidic liquids, pour gradually and observe foaming to prevent vigorous overflowing.",
    severity: "info",
    rationale:
      "Rapid release of carbon dioxide gas creates rapid effervescence and frothing.",
  },
];

// ============================================================================
// INQUIRY QUESTIONS
// ============================================================================

export const INQUIRY_QUESTIONS: InquiryQuestion[] = [
  {
    id: "iq_observe_change",
    question: "What do you observe when the indicator is added to the substance?",
    type: "observation",
    promptHint:
      "Describe the starting color, the color shift after mixing, and whether any bubbles or temperature changes occurred.",
    expectedConcept:
      "Objective physical description of the color transition and appearance without premature conclusion.",
  },
  {
    id: "iq_indicator_suggests",
    question: "What does the indicator response suggest about the nature of the tested substance?",
    type: "inference",
    promptHint:
      "Compare the observed color against the known response of the indicator in acidic versus basic solutions.",
    expectedConcept:
      "Correct deduction that the substance is an acid or base based on empirical indicator evidence.",
  },
  {
    id: "iq_why_indicators_help",
    question: "Why do indicators help us distinguish different substances?",
    type: "explanation",
    promptHint:
      "Think about liquids like vinegar and pure water that appear completely identical to the eye.",
    expectedConcept:
      "Indicators undergo reversible chemical reactions with hydrogen (H+) or hydroxide (OH-) ions, revealing invisible chemical properties safely without tasting.",
  },
  {
    id: "iq_predict_reaction",
    question: "What do you predict will happen when you mix baking soda solution with an acidic liquid?",
    type: "prediction",
    promptHint:
      "Recall whether baking soda is an acid or base, and think about what happens when opposite chemical types interact.",
    expectedConcept:
      "Formulating a reasoned hypothesis predicting neutralization, effervescence (bubbles), and indicator color shift.",
  },
  {
    id: "iq_neutralization_evidence",
    question: "What observable evidence proves that a chemical reaction took place during neutralization?",
    type: "explanation",
    promptHint:
      "Look for indicators such as gas formation (effervescence), slight warming, and shifting indicator hues.",
    expectedConcept:
      "Effervescence of carbon dioxide gas, slight temperature changes, and color transition toward neutral confirm a chemical reaction.",
  },
];

// ============================================================================
// ASSESSMENT SCORING CRITERIA
// ============================================================================

export const ASSESSMENT_CRITERIA: AssessmentCriterion[] = [
  {
    id: "crit_prediction",
    dimension: "Prediction",
    title: "Scientific Prediction & Hypothesizing",
    description:
      "Evaluates the learner's ability to formulate reasoned, testable predictions about indicator responses or chemical interactions before testing.",
    maxPoints: 10,
    rubricLevels: [
      {
        level: "Proficient",
        score: 10,
        description:
          "States a clear, scientifically reasoned prediction specifying expected color change or reaction behavior based on prior knowledge of acids and bases.",
        exampleIndicators: [
          "Predicts turmeric will turn reddish-brown in baking soda because baking soda is a base.",
          "Predicts effervescence and color shift when vinegar is combined with baking soda solution.",
        ],
      },
      {
        level: "Developing",
        score: 6,
        description:
          "Makes an outcome prediction but provides partial, incomplete, or partially flawed scientific reasoning.",
        exampleIndicators: [
          "Predicts a color change will occur but cannot explain why the substance causes it.",
          "Predicts bubbles will form but attributes them simply to mixing rather than an acid-base reaction.",
        ],
      },
      {
        level: "Beginning",
        score: 2,
        description:
          "States a guess with no scientific reasoning, or leaves the prediction unsupported.",
        exampleIndicators: [
          "Makes a guess without connecting it to acids, bases, or indicators.",
          "Simply restates the prompt without a hypothesis.",
        ],
      },
    ],
  },
  {
    id: "crit_observation",
    dimension: "Observation",
    title: "Accurate & Detailed Observation",
    description:
      "Evaluates the learner's ability to record objective, precise visual and physical changes without confusing observations with conclusions.",
    maxPoints: 10,
    rubricLevels: [
      {
        level: "Proficient",
        score: 10,
        description:
          "Records precise color descriptions, visual changes, and presence/absence of effervescence, clearly separating evidence from inference.",
        exampleIndicators: [
          "Identifies that turmeric turned deep reddish-brown in baking soda solution.",
          "Notices that hibiscus turned bright magenta-red in lemon juice and notes the lack of bubbles.",
          "Documents rapid bubbling (effervescence) when mixing baking soda with vinegar.",
        ],
      },
      {
        level: "Developing",
        score: 6,
        description:
          "Records basic color changes but misses nuance, details, or prematurely conflates observation with conclusion.",
        exampleIndicators: [
          "Writes 'it turned dark' instead of noting the specific green or red-brown hue.",
          "Records 'it became an acid' instead of stating the observed color change first.",
        ],
      },
      {
        level: "Beginning",
        score: 2,
        description:
          "Provides vague, inaccurate, or missing observations with key visual evidence omitted.",
        exampleIndicators: [
          "States 'nothing happened' or gives an incorrect color.",
          "Fails to record any observation for the test.",
        ],
      },
    ],
  },
  {
    id: "crit_explanation",
    dimension: "Explanation",
    title: "Scientific Explanation & Conceptual Understanding",
    description:
      "Evaluates the learner's ability to explain the underlying science (acidity, basicity, indicator pigment changes, neutralization) using observed evidence.",
    maxPoints: 10,
    rubricLevels: [
      {
        level: "Proficient",
        score: 10,
        description:
          "Provides a scientifically sound explanation connecting the observed indicator color to acidic or basic properties and explains the underlying concept clearly.",
        exampleIndicators: [
          "Explains that lemon juice contains citric acid which keeps turmeric yellow, confirming its acidic nature.",
          "Explains that baking soda solution is alkaline, deprotonating curcumin in turmeric to turn it reddish-brown.",
          "Explains that neutralization between vinegar and baking soda releases carbon dioxide gas and drives pH towards neutral.",
        ],
      },
      {
        level: "Developing",
        score: 6,
        description:
          "Correctly classifies the substance as an acid or base but reasoning is incomplete or contains minor misconceptions.",
        exampleIndicators: [
          "States baking soda is a base because it turned red with turmeric, but cannot explain what an indicator does.",
          "Mentions that an acid and base neutralize but cannot identify the gas produced.",
        ],
      },
      {
        level: "Beginning",
        score: 2,
        description:
          "Provides an incorrect explanation, confuses acids and bases, or attributes the outcome to incorrect scientific causes.",
        exampleIndicators: [
          "Claims lemon juice is a base or that indicators create acidity.",
          "Offers unrelated explanations unrelated to chemical properties.",
        ],
      },
    ],
  },
];

// ============================================================================
// DETERMINISTIC SUPPORTED EXPERIMENTAL SCENARIOS
// ============================================================================

export const ACID_BASE_COMBINATIONS: ExperimentCombination[] = [
  // 1. Lemon Juice + Turmeric Indicator
  {
    id: "scen_lemon_turmeric",
    inputSubstances: ["lemon_juice"],
    indicator: "turmeric_indicator",
    expectedEducationalObservation: {
      appearance: "Bright golden yellow solution",
      visualChange: "The solution remains vibrant yellow; no color transition to red occurs.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Turmeric indicator stays bright golden yellow in lemon juice.",
      colorHex: "#EAB308",
      inferredPhRange: "pH 2.0 - 3.0",
    },
    expectedObservation: {
      appearance: "Bright golden yellow solution",
      visualChange: "The solution remains vibrant yellow; no color transition to red occurs.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Turmeric indicator stays bright golden yellow in lemon juice.",
      colorHex: "#EAB308",
      inferredPhRange: "pH 2.0 - 3.0",
    },
    explanation:
      "Lemon juice contains natural citric acid. Curcumin, the active pigment in turmeric, is chemically stable in acidic environments (pH < 7.4) and remains in its neutral, yellow-colored keto-enol form. Because no deprotonation occurs, the solution remains bright yellow.",
    learningConcept:
      "Turmeric indicator remains yellow in acidic solutions, confirming that lemon juice is an acid.",
    safetyStatus: "SAFE",
    notes: "Context-appropriate demonstration of acid behavior using kitchen materials.",
  },

  // 2. Vinegar + Turmeric Indicator
  {
    id: "scen_vinegar_turmeric",
    inputSubstances: ["vinegar"],
    indicator: "turmeric_indicator",
    expectedEducationalObservation: {
      appearance: "Clear golden yellow solution",
      visualChange: "The turmeric retains its original bright yellow color; no color change to red is observed.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Turmeric indicator remains bright yellow in vinegar.",
      colorHex: "#EAB308",
      inferredPhRange: "pH 2.4 - 3.0",
    },
    expectedObservation: {
      appearance: "Clear golden yellow solution",
      visualChange: "The turmeric retains its original bright yellow color; no color change to red is observed.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Turmeric indicator remains bright yellow in vinegar.",
      colorHex: "#EAB308",
      inferredPhRange: "pH 2.4 - 3.0",
    },
    explanation:
      "Household vinegar is dilute acetic acid. Because the solution is acidic (pH ~2.5), curcumin molecules do not lose protons, preserving their natural yellow absorption spectrum.",
    learningConcept:
      "Turmeric indicator stays yellow in acidic environments, identifying vinegar as an acidic substance.",
    safetyStatus: "SAFE",
    notes: "Vinegar is a safe, accessible household acid for demonstration.",
  },

  // 3. Baking Soda Solution + Turmeric Indicator
  {
    id: "scen_baking_soda_turmeric",
    inputSubstances: ["baking_soda_solution"],
    indicator: "turmeric_indicator",
    expectedEducationalObservation: {
      appearance: "Deep reddish-brown / rusty red solution",
      visualChange:
        "Immediate and distinct color transformation from bright yellow to deep brick-red or reddish-brown.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Turmeric indicator immediately turns deep reddish-brown in baking soda solution.",
      colorHex: "#991B1B",
      inferredPhRange: "pH 8.0 - 9.0",
    },
    expectedObservation: {
      appearance: "Deep reddish-brown / rusty red solution",
      visualChange:
        "Immediate and distinct color transformation from bright yellow to deep brick-red or reddish-brown.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Turmeric indicator immediately turns deep reddish-brown in baking soda solution.",
      colorHex: "#991B1B",
      inferredPhRange: "pH 8.0 - 9.0",
    },
    explanation:
      "Baking soda (sodium bicarbonate) forms a mildly alkaline aqueous solution (pH ~8.4). In alkaline conditions, hydroxide ions deprotonate the phenolic groups on curcumin molecules. This extends the conjugated double-bond system, causing the molecule to absorb light differently and shift from yellow to deep reddish-brown.",
    learningConcept:
      "Turmeric indicator undergoes a distinct color shift to deep reddish-brown in basic solutions, identifying baking soda solution as a base.",
    safetyStatus: "SAFE",
    notes:
      "Turmeric is an effective single-transition indicator specifically responsive to alkaline/basic solutions.",
  },

  // 4. Lemon Juice + Hibiscus Indicator
  {
    id: "scen_lemon_hibiscus",
    inputSubstances: ["lemon_juice"],
    indicator: "hibiscus_indicator",
    expectedEducationalObservation: {
      appearance: "Vibrant bright magenta / ruby pink-red solution",
      visualChange:
        "The dark reddish-purple extract turns into a vivid, intense bright pink-red / magenta.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Hibiscus indicator shifts to a vivid bright pink-red in lemon juice.",
      colorHex: "#F43F5E",
      inferredPhRange: "pH 2.0 - 3.0",
    },
    expectedObservation: {
      appearance: "Vibrant bright magenta / ruby pink-red solution",
      visualChange:
        "The dark reddish-purple extract turns into a vivid, intense bright pink-red / magenta.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Hibiscus indicator shifts to a vivid bright pink-red in lemon juice.",
      colorHex: "#F43F5E",
      inferredPhRange: "pH 2.0 - 3.0",
    },
    explanation:
      "Hibiscus calyx extract contains natural anthocyanin pigments. In an acidic solution (pH < 3.5) provided by citric acid, anthocyanins exist in their flavylium cation (AH+) form, which absorbs green wavelengths and strongly transmits bright magenta-red light.",
    learningConcept:
      "Anthocyanins in hibiscus extract turn bright magenta-red in acidic solutions, demonstrating that lemon juice is an acid.",
    safetyStatus: "SAFE",
    notes: "Provides strong visual evidence of acidity using local plant materials.",
  },

  // 5. Vinegar + Hibiscus Indicator
  {
    id: "scen_vinegar_hibiscus",
    inputSubstances: ["vinegar"],
    indicator: "hibiscus_indicator",
    expectedEducationalObservation: {
      appearance: "Vivid bright pink-red solution",
      visualChange: "The extract brightens noticeably from dark purple to clear vivid pink-red.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Hibiscus indicator turns bright pink-red in vinegar.",
      colorHex: "#F43F5E",
      inferredPhRange: "pH 2.4 - 3.2",
    },
    expectedObservation: {
      appearance: "Vivid bright pink-red solution",
      visualChange: "The extract brightens noticeably from dark purple to clear vivid pink-red.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Hibiscus indicator turns bright pink-red in vinegar.",
      colorHex: "#F43F5E",
      inferredPhRange: "pH 2.4 - 3.2",
    },
    explanation:
      "Acetic acid in vinegar dissociates in water, donating hydrogen ions (H+). These protons shift anthocyanin molecules in the hibiscus extract into the red flavylium cation state.",
    learningConcept:
      "Hibiscus indicator displays distinct bright pink-red coloration in vinegar, confirming its acidic classification.",
    safetyStatus: "SAFE",
    notes: "Direct demonstration of indicator response in dilute household acetic acid.",
  },

  // 6. Baking Soda Solution + Hibiscus Indicator
  {
    id: "scen_baking_soda_hibiscus",
    inputSubstances: ["baking_soda_solution"],
    indicator: "hibiscus_indicator",
    expectedEducationalObservation: {
      appearance: "Dark bottle-green to olive-brown solution",
      visualChange:
        "Dramatic color transformation from reddish-purple to deep forest green or dark olive-brown.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Hibiscus indicator turns dark green or olive-brown in baking soda solution.",
      colorHex: "#14532D",
      inferredPhRange: "pH 8.0 - 9.0",
    },
    expectedObservation: {
      appearance: "Dark bottle-green to olive-brown solution",
      visualChange:
        "Dramatic color transformation from reddish-purple to deep forest green or dark olive-brown.",
      effervescence: false,
      temperatureChange: "none",
      summary: "Hibiscus indicator turns dark green or olive-brown in baking soda solution.",
      colorHex: "#14532D",
      inferredPhRange: "pH 8.0 - 9.0",
    },
    explanation:
      "Baking soda solution creates an alkaline environment (pH ~8.4). In basic conditions, anthocyanin molecules lose protons and convert into quinoidal anhydrobase forms, which absorb light in the red spectrum and appear dark green to olive.",
    learningConcept:
      "Hibiscus indicator turns dark green/olive in basic solutions, creating clear contrast against the pink-red color in acids.",
    safetyStatus: "SAFE",
    notes: "Demonstrates two-way indicator sensitivity (red in acid, green in base).",
  },

  // 7. Neutralization: Lemon Juice + Baking Soda Solution + Turmeric Indicator
  {
    id: "scen_neutralization_lemon_baking_soda_turmeric",
    inputSubstances: ["baking_soda_solution", "lemon_juice"],
    indicator: "turmeric_indicator",
    expectedEducationalObservation: {
      appearance: "Effervescent foaming mixture; color reflects pH balance (yellow if acid dominates)",
      visualChange:
        "Vigorous fizzing and foaming (effervescence) as carbon dioxide gas bubbles escape. Solution warms slightly.",
      effervescence: true,
      temperatureChange: "slight_warmth",
      summary:
        "Active bubbling (effervescence) occurs upon mixing. Turmeric monitors the changing acid-base balance.",
      colorHex: "#EAB308",
      inferredPhRange: "pH 5.0 - 7.5",
    },
    expectedObservation: {
      appearance: "Effervescent foaming mixture; color reflects pH balance (yellow if acid dominates)",
      visualChange:
        "Vigorous fizzing and foaming (effervescence) as carbon dioxide gas bubbles escape. Solution warms slightly.",
      effervescence: true,
      temperatureChange: "slight_warmth",
      summary:
        "Active bubbling (effervescence) occurs upon mixing. Turmeric monitors the changing acid-base balance.",
      colorHex: "#EAB308",
      inferredPhRange: "pH 5.0 - 7.5",
    },
    explanation:
      "Citric acid reacts with sodium bicarbonate in an acid-base neutralization reaction: Citric acid + Sodium bicarbonate -> Sodium citrate + Water + Carbon dioxide gas (C6H8O7 + 3 NaHCO3 -> Na3C6H5O7 + 3 H2O + 3 CO2 ↑). Escaping carbon dioxide gas produces visible effervescence.",
    learningConcept:
      "Acid-base neutralization produces carbon dioxide gas (effervescence), water, and a salt, with indicators revealing changes in acidity/basicity.",
    safetyStatus: "SAFE",
    notes: "Pour baking soda solution gradually to prevent overflow from foaming.",
  },

  // 8. Neutralization: Lemon Juice + Baking Soda Solution + Hibiscus Indicator
  {
    id: "scen_neutralization_lemon_baking_soda_hibiscus",
    inputSubstances: ["baking_soda_solution", "lemon_juice"],
    indicator: "hibiscus_indicator",
    expectedEducationalObservation: {
      appearance: "Active effervescent bubbling; color shifts from bright red towards neutral purple",
      visualChange:
        "Bubbles rise rapidly throughout the mixture. The initial bright pink-red color transitions toward neutral violet/purple as the acid is consumed.",
      effervescence: true,
      temperatureChange: "slight_warmth",
      summary:
        "Rapid effervescence with indicator transitioning from acidic pink-red toward neutral violet.",
      colorHex: "#6366F1",
      inferredPhRange: "pH 6.0 - 7.5",
    },
    expectedObservation: {
      appearance: "Active effervescent bubbling; color shifts from bright red towards neutral purple",
      visualChange:
        "Bubbles rise rapidly throughout the mixture. The initial bright pink-red color transitions toward neutral violet/purple as the acid is consumed.",
      effervescence: true,
      temperatureChange: "slight_warmth",
      summary:
        "Rapid effervescence with indicator transitioning from acidic pink-red toward neutral violet.",
      colorHex: "#6366F1",
      inferredPhRange: "pH 6.0 - 7.5",
    },
    explanation:
      "The neutralization of citric acid by sodium bicarbonate consumes hydronium ions, shifting the solution pH from strongly acidic (pH ~2.2) towards neutral (pH ~7.0). As a result, anthocyanins return toward their neutral violet/purple state while CO2 bubbles evolve.",
    learningConcept:
      "Neutralization between acid and base changes the pH toward neutral, visible through both gas formation and indicator color transition.",
    safetyStatus: "SAFE",
    notes: "Demonstrates dual evidence of a chemical reaction: gas evolution and color shift.",
  },

  // 9. Neutralization: Vinegar + Baking Soda Solution + Turmeric Indicator
  {
    id: "scen_neutralization_vinegar_baking_soda_turmeric",
    inputSubstances: ["baking_soda_solution", "vinegar"],
    indicator: "turmeric_indicator",
    expectedEducationalObservation: {
      appearance: "Effervescent bubbling liquid; color remains yellow or shifts depending on proportions",
      visualChange:
        "Immediate fizzing and bubbling with gas release. Liquid warms slightly during reaction.",
      effervescence: true,
      temperatureChange: "slight_warmth",
      summary:
        "Vigorous fizzing from CO2 generation with turmeric color reflecting the final acid-base balance.",
      colorHex: "#EAB308",
      inferredPhRange: "pH 5.0 - 7.5",
    },
    expectedObservation: {
      appearance: "Effervescent bubbling liquid; color remains yellow or shifts depending on proportions",
      visualChange:
        "Immediate fizzing and bubbling with gas release. Liquid warms slightly during reaction.",
      effervescence: true,
      temperatureChange: "slight_warmth",
      summary:
        "Vigorous fizzing from CO2 generation with turmeric color reflecting the final acid-base balance.",
      colorHex: "#EAB308",
      inferredPhRange: "pH 5.0 - 7.5",
    },
    explanation:
      "Acetic acid reacts with sodium bicarbonate: CH3COOH + NaHCO3 -> CH3COONa + H2O + CO2(g). The effervescence is gaseous carbon dioxide escaping. While acid remains in excess, turmeric remains yellow; if excess baking soda is added, it turns reddish.",
    learningConcept:
      "Neutralization between vinegar and baking soda produces salt (sodium acetate), water, and carbon dioxide gas.",
    safetyStatus: "SAFE",
    notes: "Classic accessible neutralization reaction using kitchen materials.",
  },

  // 10. Neutralization: Vinegar + Baking Soda Solution + Hibiscus Indicator
  {
    id: "scen_neutralization_vinegar_baking_soda_hibiscus",
    inputSubstances: ["baking_soda_solution", "vinegar"],
    indicator: "hibiscus_indicator",
    expectedEducationalObservation: {
      appearance: "Active effervescence with color shifting from bright pink-red toward violet",
      visualChange:
        "Rapid fizzing and bubbling. The bright scarlet-pink color shifts toward neutral violet as the acid is neutralized.",
      effervescence: true,
      temperatureChange: "slight_warmth",
      summary:
        "Fizzy effervescence with indicator transitioning from acidic pink-red toward neutral violet.",
      colorHex: "#6366F1",
      inferredPhRange: "pH 6.0 - 7.5",
    },
    expectedObservation: {
      appearance: "Active effervescence with color shifting from bright pink-red toward violet",
      visualChange:
        "Rapid fizzing and bubbling. The bright scarlet-pink color shifts toward neutral violet as the acid is neutralized.",
      effervescence: true,
      temperatureChange: "slight_warmth",
      summary:
        "Fizzy effervescence with indicator transitioning from acidic pink-red toward neutral violet.",
      colorHex: "#6366F1",
      inferredPhRange: "pH 6.0 - 7.5",
    },
    explanation:
      "Neutralization between acetic acid and sodium bicarbonate consumes free H+ ions, raising the pH toward neutral. This causes anthocyanin molecules to transition from red flavylium cations back to their neutral purple equilibrium.",
    learningConcept:
      "Neutralization consumes reactants and drives pH toward neutral, proven by gas production and indicator color transition.",
    safetyStatus: "SAFE",
    notes: "Provides unmistakable physical and visual evidence of chemical change.",
  },
];

// ============================================================================
// DETERMINISTIC LOOKUP ENGINE
// ============================================================================

/**
 * Normalizes an array of substance identifiers for deterministic combination matching.
 */
export function normalizeSubstanceKey(substances: string[]): string {
  const aliasMap: Record<string, string> = {
    lemon_juice: "lemon_juice",
    "lemon juice": "lemon_juice",
    vinegar: "vinegar",
    "household vinegar": "vinegar",
    baking_soda: "baking_soda_solution",
    baking_soda_solution: "baking_soda_solution",
    "baking soda solution": "baking_soda_solution",
    "baking soda": "baking_soda_solution",
  };

  const normalized = substances
    .map((s) => s.trim().toLowerCase())
    .map((s) => aliasMap[s] || s);

  return [...normalized].sort().join("+");
}

/**
 * Normalizes indicator identifier.
 */
export function normalizeIndicatorKey(indicator: string): string {
  const aliasMap: Record<string, string> = {
    turmeric: "turmeric_indicator",
    turmeric_indicator: "turmeric_indicator",
    "turmeric indicator": "turmeric_indicator",
    turmeric_solution: "turmeric_indicator",
    hibiscus: "hibiscus_indicator",
    hibiscus_indicator: "hibiscus_indicator",
    "hibiscus indicator": "hibiscus_indicator",
    hibiscus_tea_extract: "hibiscus_indicator",
  };

  const lower = indicator.trim().toLowerCase();
  return aliasMap[lower] || lower;
}

/**
 * Deterministically finds a supported experimental combination.
 * The experiment engine must NEVER invent an outcome.
 * If a combination is not defined in the experiment data, returns UNSUPPORTED_EXPERIMENT.
 */
export function findExperimentCombination(
  substances: string[],
  indicator: string
): ExperimentCombination | typeof UNSUPPORTED_EXPERIMENT {
  if (!substances || substances.length === 0 || !indicator) {
    return UNSUPPORTED_EXPERIMENT;
  }

  const querySubKey = normalizeSubstanceKey(substances);
  const queryIndKey = normalizeIndicatorKey(indicator);

  for (const combination of ACID_BASE_COMBINATIONS) {
    const combSubKey = normalizeSubstanceKey(combination.inputSubstances);
    const combIndKey = normalizeIndicatorKey(combination.indicator);

    if (combSubKey === querySubKey && combIndKey === queryIndKey) {
      return combination;
    }
  }

  return UNSUPPORTED_EXPERIMENT;
}

/**
 * Evaluates an experimental scenario deterministically.
 * Returns either the exact ExperimentCombination or a structured UnsupportedExperimentResult.
 */
export function evaluateExperimentScenario(
  substances: string[],
  indicator: string
): ExperimentCombination | UnsupportedExperimentResult {
  const combination = findExperimentCombination(substances, indicator);
  if (combination === UNSUPPORTED_EXPERIMENT) {
    return {
      status: UNSUPPORTED_EXPERIMENT,
      message:
        "This combination is not defined in the deterministic experiment knowledge base. The AI Lab engine does not invent experimental outcomes.",
      inputSubstances: substances,
      indicator,
    };
  }
  return combination;
}

// ============================================================================
// BACKWARD COMPATIBILITY SUBSTANCES (FOR EXISTING LAB WORKFLOWS)
// ============================================================================

export const ACID_BASE_SUBSTANCES: Substance[] = [
  {
    id: "lemon_juice",
    name: "Lemon Juice",
    formula: "C6H8O7 (Citric acid)",
    category: "acid",
    approximatePh: 2.2,
    concentration: "Natural fresh juice (~5% citric acid)",
    naturalColor: "Pale cloudy yellow",
    colorHex: "#F7EE94",
    state: "liquid",
    availability: "household",
    householdAlternative: "Lime juice or citric acid powder dissolved in water",
    description: "Common citrus fruit juice containing natural citric acid and ascorbic acid (vitamin C).",
    safetyNotes: "Food grade. Avoid eye contact; rinse with water if splashed.",
    hazardLevel: "SAFE",
  },
  {
    id: "vinegar",
    name: "Household Vinegar",
    formula: "CH3COOH (Acetic acid)",
    category: "acid",
    approximatePh: 2.5,
    concentration: "5% acetic acid solution",
    naturalColor: "Clear colorless",
    colorHex: "#F9FAFB",
    state: "liquid",
    availability: "household",
    householdAlternative: "White vinegar, cane vinegar, or apple cider vinegar",
    description: "Dilute acetic acid produced by fermentation of ethanol.",
    safetyNotes: "Mild acid. Pungent vapor. Do not mix with household bleach (generates chlorine gas).",
    hazardLevel: "SAFE",
  },
  {
    id: "baking_soda_solution",
    name: "Baking Soda Solution",
    formula: "NaHCO3",
    category: "base",
    approximatePh: 8.4,
    concentration: "1 tbsp in 100ml water",
    naturalColor: "Clear to slightly cloudy",
    colorHex: "#F8FAFC",
    state: "solution",
    availability: "household",
    householdAlternative: "Sodium bicarbonate from grocery shop or kitchen",
    description: "Mild amphoteric base that acts as an effective proton acceptor and neutralizer.",
    safetyNotes: "Safe household ingredient. Avoid eye contact.",
    hazardLevel: "SAFE",
  },
  {
    id: "distilled_water",
    name: "Distilled / Pure Water",
    formula: "H2O",
    category: "neutral",
    approximatePh: 7.0,
    concentration: "Pure",
    naturalColor: "Clear colorless",
    colorHex: "#FFFFFF",
    state: "liquid",
    availability: "household",
    householdAlternative: "Boiled and cooled tap water or bottled pure drinking water",
    description: "Pure neutral solvent with equal concentrations of H+ and OH- ions.",
    safetyNotes: "Completely safe.",
    hazardLevel: "SAFE",
  },
  {
    id: "household_bleach",
    name: "Household Bleach (Sodium Hypochlorite)",
    formula: "NaOCl",
    category: "base",
    approximatePh: 11.5,
    concentration: "3-6% NaOCl",
    naturalColor: "Pale yellow-greenish clear liquid",
    colorHex: "#FEF9C3",
    state: "liquid",
    availability: "household",
    householdAlternative: "Laundry bleach",
    description: "Strong oxidizing bleach. Strictly prohibited from mixing with any acids!",
    safetyNotes:
      "DANGER: Mixing with any acid releases deadly chlorine gas (Cl2). Mixing with ammonia releases toxic chloramines.",
    hazardLevel: "DANGEROUS",
  },
];

// ============================================================================
// EXPERIMENT DEFINITION
// ============================================================================

export const ACID_BASE_EXPERIMENT: Experiment = {
  id: "acid-base",
  title: "Testing Acids and Bases",
  level: "Grade 7",
  subject: "Science",
  primaryObjective: PRIMARY_LEARNING_OBJECTIVE,
  learningObjectives: LEARNING_OBJECTIVES,
  contextClarification: PEDAGOGICAL_CLARIFICATION,
  pedagogicalClarification: PEDAGOGICAL_CLARIFICATION,
  description:
    "Identify acidic and basic substances using indicators and explain the observed changes. Household demonstration materials provide context-appropriate learning materials for demonstrating fundamental chemical principles without claiming exact equivalence to pure laboratory reagents.",
  materials: ACID_BASE_MATERIALS,
  indicators: ACID_BASE_INDICATORS,
  supportedCombinations: ACID_BASE_COMBINATIONS,
  safetyRules: SAFETY_RULES,
  inquiryQuestions: INQUIRY_QUESTIONS,
  assessmentCriteria: ASSESSMENT_CRITERIA,

  // Compatibility fields for existing services:
  curriculumStandard: "UNESCO / Cambridge IGCSE / NGSS MS-PS1-2 (Chemical Reactions and Properties)",
  targetGradeLevels: ["Grade 7"],
  modesSupported: ["LOCAL_LAB", "VIRTUAL_LAB"],
  estimatedDurationMinutes: 30,
  substances: ACID_BASE_SUBSTANCES,
  steps: {
    localLab: [
      {
        stepNumber: 1,
        title: "Prepare Your Natural Indicator",
        mode: "LOCAL_LAB",
        instructions:
          "Prepare turmeric indicator solution (1/2 tsp turmeric powder in 2 tbsp warm water) or steep dried hibiscus petals in warm water until deeply colored. Filter into clean containers.",
        expectedObservation: "A brightly colored natural indicator ready for pH sensing.",
        hint: "Turmeric produces a yellow solution; hibiscus produces a deep ruby-red extract.",
      },
      {
        stepNumber: 2,
        title: "Set Up Household Demonstration Samples",
        mode: "LOCAL_LAB",
        instructions:
          "Place 2 tablespoons each of lemon juice, household vinegar, and baking soda solution in separate clean, clear cups. Label each cup.",
        expectedObservation: "Three organized sample cups ready for testing.",
        safetyCaution: "Never taste any sample. Keep samples clearly labeled.",
      },
      {
        stepNumber: 3,
        title: "Test Acids with Indicators",
        mode: "LOCAL_LAB",
        instructions:
          "Add 5-10 drops of turmeric indicator to a sample of lemon juice and to vinegar. In fresh cups of lemon juice and vinegar, add hibiscus indicator.",
        expectedObservation:
          "Turmeric remains bright yellow in both acids. Hibiscus indicator turns bright magenta-red.",
      },
      {
        stepNumber: 4,
        title: "Test Base with Indicators",
        mode: "LOCAL_LAB",
        instructions:
          "Add 5-10 drops of turmeric indicator to baking soda solution. In a separate cup of baking soda solution, add hibiscus indicator.",
        expectedObservation:
          "Turmeric immediately turns deep reddish-brown. Hibiscus indicator turns dark bottle green or olive-brown.",
      },
      {
        stepNumber: 5,
        title: "Observe Neutralization",
        mode: "LOCAL_LAB",
        instructions:
          "Gradually pour baking soda solution into lemon juice or vinegar containing indicator. Observe bubbling and color transitions.",
        expectedObservation:
          "Vigorous effervescence (bubbles of carbon dioxide gas). Indicator color shifts toward neutral.",
        safetyCaution: "Pour slowly to avoid foam overflowing.",
      },
    ],
    virtualLab: [
      {
        stepNumber: 1,
        title: "Select Demonstration Material & Indicator",
        mode: "VIRTUAL_LAB",
        instructions:
          "Choose a test vessel, select a demonstration substance (lemon juice, vinegar, or baking soda solution), and choose your indicator (turmeric or hibiscus).",
        expectedObservation: "Prepared digital container with selected materials.",
      },
      {
        stepNumber: 2,
        title: "Dispense Acidic Material & Add Indicator",
        mode: "VIRTUAL_LAB",
        instructions:
          "Add 5 ml of lemon juice or vinegar to the container. Add turmeric indicator, then repeat with hibiscus indicator.",
        expectedObservation:
          "Turmeric remains bright yellow; hibiscus shifts to bright magenta-red.",
      },
      {
        stepNumber: 3,
        title: "Dispense Alkaline Material & Add Indicator",
        mode: "VIRTUAL_LAB",
        instructions:
          "Add 5 ml of baking soda solution to a fresh container. Add turmeric indicator, then repeat with hibiscus indicator.",
        expectedObservation:
          "Turmeric turns deep reddish-brown; hibiscus turns dark bottle green.",
      },
      {
        stepNumber: 4,
        title: "Simulate Neutralization",
        mode: "VIRTUAL_LAB",
        instructions:
          "Add baking soda solution into the acidic container. Observe gas evolution and indicator response.",
        expectedObservation:
          "Effervescence occurs as CO2 gas is released. Indicator shifts toward neutral.",
      },
      {
        stepNumber: 5,
        title: "Record Observations & Complete Assessment",
        mode: "VIRTUAL_LAB",
        instructions:
          "Record observations into your digital lab notebook. Answer inquiry questions addressing prediction, observation, and explanation.",
        expectedObservation: "Completed structured practical record.",
      },
    ],
  },
  generalSafetyRules: [
    "Never taste any chemical or household sample during a science practical.",
    "Rinse eyes immediately with clean water if lemon juice or vinegar splashes.",
    "Never mix household bleach with acids or cleaning chemicals.",
    "Pour baking soda solution gradually into acids to manage effervescence.",
  ],
  lowResourceTips: [
    "Use clean clear plastic cups or halved water bottles as beakers.",
    "Use plastic drinking straws as droppers by covering the top opening with a fingertip.",
    "Turmeric kitchen powder and hibiscus herbal tea provide reliable, natural pH indicators.",
  ],
};
