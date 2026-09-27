export interface Experiment {
  id: string;
  title: string;
  category: string;
  level: string;
  objective: string;
  difficulty: string;
  status: "available" | "coming-soon";
  estimatedTime: string;
  whatYoullLearn: string[];
  description: string;
}

export interface Material {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

export interface ExperimentStep {
  id: string;
  title: string;
  description: string;
}

export interface ExperimentResult {
  prediction: number;
  observation: number;
  explanation: number;
  overall: number;
  feedback: string;
  reflection: string;
}

export const experiments: Experiment[] = [
  {
    id: "acids-bases",
    title: "Acids & Bases",
    category: "Chemistry",
    level: "Grade 7",
    objective: "Identify acidic and basic substances using indicators.",
    difficulty: "Beginner",
    status: "available",
    estimatedTime: "10 minutes",
    whatYoullLearn: [
      "Identify acids and bases",
      "Use indicators",
      "Make observations",
      "Explain results"
    ],
    description: "Learn how to identify acidic and basic substances using natural indicators like turmeric and hibiscus."
  },
  {
    id: "food-tests",
    title: "Food Tests",
    category: "Biology",
    level: "Grade 8",
    objective: "Test for the presence of starch, proteins, and fats in food samples.",
    difficulty: "Intermediate",
    status: "coming-soon",
    estimatedTime: "15 minutes",
    whatYoullLearn: [
      "Test for starch",
      "Test for proteins",
      "Test for fats",
      "Analyze food composition"
    ],
    description: "Identify different nutrients in common food items using simple chemical tests."
  },
  {
    id: "photosynthesis",
    title: "Photosynthesis",
    category: "Biology",
    level: "Grade 7",
    objective: "Understand how plants convert light energy into chemical energy.",
    difficulty: "Intermediate",
    status: "coming-soon",
    estimatedTime: "20 minutes",
    whatYoullLearn: [
      "Plant anatomy",
      "Light absorption",
      "Gas exchange",
      "Energy conversion"
    ],
    description: "Explore how plants make their own food using sunlight, water, and carbon dioxide."
  },
  {
    id: "water-testing",
    title: "Water Testing",
    category: "Environmental Science",
    level: "Grade 8",
    objective: "Test water samples for purity and contamination.",
    difficulty: "Intermediate",
    status: "coming-soon",
    estimatedTime: "15 minutes",
    whatYoullLearn: [
      "Water quality indicators",
      "Contamination testing",
      "pH measurement",
      "Safety standards"
    ],
    description: "Learn to assess water quality using simple testing methods and indicators."
  },
  {
    id: "electric-circuits",
    title: "Electric Circuits",
    category: "Physics",
    level: "Grade 7",
    objective: "Build and understand basic electric circuits.",
    difficulty: "Beginner",
    status: "coming-soon",
    estimatedTime: "15 minutes",
    whatYoullLearn: [
      "Circuit components",
      "Current flow",
      "Series vs parallel",
      "Safety precautions"
    ],
    description: "Construct simple circuits and understand how electricity flows through different configurations."
  }
];

export const availableMaterials: Material[] = [
  { id: "lemon-juice", name: "Lemon Juice", icon: "🍋", available: true },
  { id: "vinegar", name: "Vinegar", icon: "🫗", available: true },
  { id: "baking-soda", name: "Baking Soda", icon: "🧂", available: true },
  { id: "turmeric", name: "Turmeric", icon: "🟡", available: true },
  { id: "hibiscus", name: "Hibiscus", icon: "🌺", available: true }
];

export const labMaterials: Material[] = [
  { id: "litmus-paper", name: "Litmus Paper", icon: "📄", available: false },
  { id: "lab-acid", name: "Laboratory Acid", icon: "⚗️", available: false },
  { id: "lab-base", name: "Laboratory Base", icon: "🧪", available: false }
];

export const localLabSteps: ExperimentStep[] = [
  { id: "1", title: "Prepare", description: "Gather your selected materials" },
  { id: "2", title: "Observe", description: "Note the initial appearance" },
  { id: "3", title: "Test", description: "Perform the guided activity" },
  { id: "4", title: "Record", description: "Document your observations" },
  { id: "5", title: "Explain", description: "Understand what happened" }
];

export const virtualLabSteps: ExperimentStep[] = [
  { id: "1", title: "Prepare", description: "Select substances and indicator" },
  { id: "2", title: "Predict", description: "Make a prediction" },
  { id: "3", title: "Experiment", description: "Run the simulation" },
  { id: "4", title: "Observe", description: "Watch the results" },
  { id: "5", title: "Explain", description: "Understand the science" }
];
