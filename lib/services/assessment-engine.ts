import { AssessmentSubmissionInput } from "@/lib/validation/schemas";
import { ACID_BASE_SUBSTANCES } from "@/lib/experiments/acid-base";
import { AssessmentResult } from "@/lib/experiments/types";

interface StandardQuestionRubric {
  questionId: string;
  prompt: string;
  expectedKeywords: string[];
  explanation: string;
  points: number;
}

const ASSESSMENT_RUBRIC_QUESTIONS: StandardQuestionRubric[] = [
  {
    questionId: "q1_acidity_ion",
    prompt: "Which ion is primarily responsible for making a solution acidic?",
    expectedKeywords: ["h+", "hydrogen", "hydronium", "h3o+"],
    explanation:
      "Hydrogen ions (H+) or hydronium ions (H3O+) are donated by acids into aqueous solutions, increasing acidity.",
    points: 15,
  },
  {
    questionId: "q2_indicator_color",
    prompt: "What color shift does red cabbage extract exhibit when added to an alkaline/basic solution like baking soda?",
    expectedKeywords: ["green", "blue", "teal", "cyan", "blue-green"],
    explanation:
      "Anthocyanins in red cabbage turn teal/greenish-blue in mild bases and bright green/yellow in strong bases as they lose protons.",
    points: 15,
  },
  {
    questionId: "q3_neutralization_products",
    prompt: "What two main substances are formed when an acid reacts with a base in a neutralization reaction?",
    expectedKeywords: ["water", "salt", "h2o"],
    explanation:
      "Acid + Base -> Water + Salt. Neutralization combines H+ and OH- to form pure water (H2O) and a dissolved mineral salt.",
    points: 15,
  },
  {
    questionId: "q4_bleach_safety",
    prompt: "Why is it strictly hazardous to ever mix household bleach with vinegar or any acid?",
    expectedKeywords: ["chlorine", "gas", "toxic", "poisonous", "deadly", "fumes"],
    explanation:
      "Bleach (sodium hypochlorite NaOCl) reacts violently with acids to liberate toxic, choking chlorine gas (Cl2).",
    points: 15,
  },
];

export class AssessmentEngine {
  /**
   * Retrieves the standard assessment questions for the experiment
   */
  public static getAssessmentQuestions() {
    return ASSESSMENT_RUBRIC_QUESTIONS.map((q) => ({
      questionId: q.questionId,
      prompt: q.prompt,
      points: q.points,
    }));
  }

  /**
   * Evaluates a student's practical submission
   */
  public static evaluate(submission: AssessmentSubmissionInput): AssessmentResult {
    let earnedPoints = 0;
    let maxPoints = 0;
    const strengths: string[] = [];
    const areasForImprovement: string[] = [];
    const questionBreakdown: AssessmentResult["questionBreakdown"] = [];

    // 1. Evaluate Concept Questions (60 points total)
    for (const rubric of ASSESSMENT_RUBRIC_QUESTIONS) {
      maxPoints += rubric.points;
      const studentAnswerObj = submission.answers.find((a) => a.questionId === rubric.questionId);
      const studentAnswer = (studentAnswerObj?.studentAnswer || "").toLowerCase().trim();

      const isMatch = rubric.expectedKeywords.some((keyword) =>
        studentAnswer.includes(keyword)
      );

      if (isMatch) {
        earnedPoints += rubric.points;
        questionBreakdown.push({
          questionId: rubric.questionId,
          isCorrect: true,
          feedback: `Correct! ${rubric.explanation}`,
        });
      } else {
        questionBreakdown.push({
          questionId: rubric.questionId,
          isCorrect: false,
          feedback: `Not quite. Expected concepts: ${rubric.expectedKeywords.join(" or ")}. ${rubric.explanation}`,
        });
      }
    }

    // 2. Evaluate Empirical Observations (30 points total)
    const observationWeight = submission.observations.length > 0
      ? Math.floor(30 / submission.observations.length)
      : 30;

    let correctObservationCount = 0;
    for (const obs of submission.observations) {
      maxPoints += observationWeight;
      const substance = ACID_BASE_SUBSTANCES.find((s) => s.id === obs.substanceId);

      if (substance && substance.category === obs.classifiedAs) {
        earnedPoints += observationWeight;
        correctObservationCount++;
      } else {
        areasForImprovement.push(
          `Substance '${substance?.name || obs.substanceId}' was classified as ${obs.classifiedAs}, but is actually a ${substance?.category || "different category"}.`
        );
      }
    }

    if (submission.observations.length > 0 && correctObservationCount === submission.observations.length) {
      strengths.push("Accurate empirical substance identification across all tested samples.");
    }

    // 3. Evaluate Reflection (10 points)
    maxPoints += 10;
    const reflectionText = (submission.reflection || "").trim();
    if (reflectionText.length >= 30) {
      earnedPoints += 10;
      strengths.push("Reflective scientific journal entry connecting practical lab observations to everyday phenomena.");
    } else if (reflectionText.length > 0) {
      earnedPoints += 5;
      areasForImprovement.push("Expand your experimental reflection to include what surprised you and how this applies outside the lab.");
    } else {
      areasForImprovement.push("Include a personal reflection on what you learned during the practical.");
    }

    // Calculate percentage and grade
    const percentage = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;
    let grade: AssessmentResult["grade"] = "Needs Review";
    let proficiencyRating = "Beginner Practical Investigator";

    if (percentage >= 85) {
      grade = "Distinction";
      proficiencyRating = "Master Practical Chemist";
      strengths.push("Demonstrated strong mastery of acid-base concepts, pH scale, and indicator science.");
    } else if (percentage >= 70) {
      grade = "Proficient";
      proficiencyRating = "Competent Practical Investigator";
      strengths.push("Solid understanding of chemical classifications and indicator behavior.");
    } else if (percentage >= 50) {
      grade = "Developing";
      proficiencyRating = "Developing Lab Scientist";
    }

    const detailedFeedback =
      percentage >= 70
        ? `Congratulations! You scored ${percentage}% on your ${submission.mode.replace("_", " ")} assessment. You clearly grasp how hydrogen and hydroxide ions interact with plant indicators and chemical reagents.`
        : `You scored ${percentage}%. Review the differences between acidic solutions (vinegar, lemon juice) and alkaline solutions (baking soda, soap water) and try testing with red cabbage juice again.`;

    return {
      score: earnedPoints,
      maxScore: maxPoints,
      percentage,
      grade,
      strengths: strengths.length > 0 ? strengths : ["Completed full experimental protocol."],
      areasForImprovement:
        areasForImprovement.length > 0
          ? areasForImprovement
          : ["Keep experimenting with other local plant dyes like beetroot or flower petals!"],
      detailedFeedback,
      questionBreakdown,
      practicalProficiencyRating: proficiencyRating,
    };
  }
}
