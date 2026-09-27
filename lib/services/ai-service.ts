import { ExplainRequestInput, FeedbackRequestInput } from "@/lib/validation/schemas";
import { ACID_BASE_EXPERIMENT, ACID_BASE_INDICATORS, ACID_BASE_SUBSTANCES } from "@/lib/experiments/acid-base";

export interface AiExplanationResult {
  topic: string;
  explanation: string;
  keyConcepts: string[];
  realWorldApplication: string;
  followUpQuestion: string;
  lowResourceNote?: string;
  provider: "gemini" | "openai" | "pedagogical_engine";
}

export interface AiFeedbackResult {
  feedbackType: string;
  feedback: string;
  praise: string;
  constructiveGuidance: string;
  scientificAccuracyScore: number; // 0 - 100
  provider: "gemini" | "openai" | "pedagogical_engine";
}

export class AiService {
  /**
   * Generates a pedagogical explanation for a reaction, color change, or chemical concept.
   */
  public static async explain(input: ExplainRequestInput): Promise<AiExplanationResult> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_PROVIDER_API_KEY;

    if (apiKey) {
      try {
        return await this.callGeminiExplain(input, apiKey);
      } catch (err) {
        console.warn("AI Provider call failed, falling back to pedagogical engine:", err);
      }
    }

    return this.generateOfflineExplanation(input);
  }

  /**
   * Generates feedback on student hypotheses, observations, or conclusions.
   */
  public static async provideFeedback(input: FeedbackRequestInput): Promise<AiFeedbackResult> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_PROVIDER_API_KEY;

    if (apiKey) {
      try {
        return await this.callGeminiFeedback(input, apiKey);
      } catch (err) {
        console.warn("AI Provider call failed, falling back to pedagogical engine:", err);
      }
    }

    return this.generateOfflineFeedback(input);
  }

  // --- Real AI Provider Integration (Server-Side Only) ---

  private static async callGeminiExplain(
    input: ExplainRequestInput,
    apiKey: string
  ): Promise<AiExplanationResult> {
    const systemPrompt = `You are a supportive, inspiring science teacher assisting students in a low-resource laboratory called "AI Lab".
Explain scientific concepts clearly, using simple analogies and connecting everyday household items to chemistry.
Return a valid JSON object matching this schema:
{
  "explanation": "concise, engaging explanation",
  "keyConcepts": ["concept1", "concept2"],
  "realWorldApplication": "how this applies in daily life or low-resource communities",
  "followUpQuestion": "a thought-provoking question to test understanding",
  "lowResourceNote": "practical advice for students using household items"
}`;

    const userPrompt = `Student context:
Mode: ${input.mode}
Topic: ${input.topic}
Substance A: ${input.substanceA || "None"}
Substance B: ${input.substanceB || "None"}
Indicator Used: ${input.indicatorUsed || "None"}
Observed Color: ${input.observedColor || "None"}
Student Question: ${input.studentQuestion || "Explain what happened here."}
Target Level: ${input.gradeLevel}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty AI response");

    const parsed = JSON.parse(text);
    return {
      topic: input.topic,
      explanation: parsed.explanation || "No explanation provided.",
      keyConcepts: Array.isArray(parsed.keyConcepts) ? parsed.keyConcepts : ["pH", "Acids & Bases"],
      realWorldApplication: parsed.realWorldApplication || "Common in daily food preparation and cleaning.",
      followUpQuestion: parsed.followUpQuestion || "What would happen if you added more water?",
      lowResourceNote: parsed.lowResourceNote,
      provider: "gemini",
    };
  }

  private static async callGeminiFeedback(
    input: FeedbackRequestInput,
    apiKey: string
  ): Promise<AiFeedbackResult> {
    const systemPrompt = `You are a warm, encouraging science educator. Review a student's chemistry practical work and provide constructive feedback.
Return a valid JSON object matching:
{
  "feedback": "overall assessment paragraph",
  "praise": "specific praise for what the student observed or thought correctly",
  "constructiveGuidance": "gentle correction or hint for deeper understanding",
  "scientificAccuracyScore": 85
}`;

    const userPrompt = `Mode: ${input.mode}
Type: ${input.feedbackType}
Student's input: "${input.studentInput}"
Substance Tested: ${input.substanceTested || "Unknown"}
Actual Outcome: ${input.actualOutcome || "Standard expected outcome"}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty AI response");

    const parsed = JSON.parse(text);
    return {
      feedbackType: input.feedbackType,
      feedback: parsed.feedback,
      praise: parsed.praise,
      constructiveGuidance: parsed.constructiveGuidance,
      scientificAccuracyScore: parsed.scientificAccuracyScore ?? 80,
      provider: "gemini",
    };
  }

  // --- Offline Fallback Pedagogical Engine (Deterministic & Fast for Demo / No API Key) ---

  private static generateOfflineExplanation(input: ExplainRequestInput): AiExplanationResult {
    const subA = ACID_BASE_SUBSTANCES.find((s) => s.id === input.substanceA);
    const subB = ACID_BASE_SUBSTANCES.find((s) => s.id === input.substanceB);
    const ind = ACID_BASE_INDICATORS.find((i) => i.substanceId === input.indicatorUsed);

    if (input.topic === "NEUTRALIZATION" || (subA && subB && subA.category !== subB.category)) {
      return {
        topic: "NEUTRALIZATION",
        explanation:
          "When an acid (rich in hydrogen ions H+) and a base (rich in hydroxide ions OH-) mix, they react to neutralize each other, forming water (H2O) and a dissolved salt. If you used baking soda, the fizzing is carbon dioxide gas (CO2) escaping as the acid breaks down the bicarbonate ions.",
        keyConcepts: [
          "Neutralization reaction (Acid + Base -> Salt + Water)",
          "Effervescence: formation of CO2 gas bubbles",
          "pH shift towards 7.0 (neutral)",
        ],
        realWorldApplication:
          "This is how antacid tablets relieve heartburn by neutralizing excess hydrochloric acid in your stomach, or how farmers add agricultural lime (calcium carbonate/ash) to acidic soil so crops can grow.",
        followUpQuestion:
          "If you keep adding vinegar after the fizzing stops, will the liquid stay neutral or turn acidic again?",
        lowResourceNote:
          "In a kitchen or village lab, you can observe this dramatic reaction safely with just lemon juice or vinegar mixed with baking soda or filtered wood ash water.",
        provider: "pedagogical_engine",
      };
    }

    if (input.topic === "COLOR_CHANGE" || ind) {
      const indicatorName = ind?.indicatorName || "natural plant indicator";
      return {
        topic: "COLOR_CHANGE",
        explanation: `${indicatorName} contains natural pigment molecules called anthocyanins. In acidic environments (low pH), these pigments take on extra protons (H+), turning red or pink. In basic or alkaline environments (high pH), they lose protons, shifting their chemical shape to absorb different wavelengths of light and turning teal, blue-green, or yellow!`,
        keyConcepts: [
          "Anthocyanin pigment molecular transitions",
          "Protonation (acidic) vs Deprotonation (basic)",
          "Visual detection of pH",
        ],
        realWorldApplication:
          "Hydrangea flowers in gardens naturally change color between pink and blue depending on the acidity of the soil they grow in!",
        followUpQuestion:
          "Why did pure water keep the indicator purple while vinegar turned it bright pink?",
        lowResourceNote:
          "You can make this indicator anywhere in the world using red cabbage leaves, purple hibiscus petals, or even vibrant red bougainvillea flowers soaked in hot water.",
        provider: "pedagogical_engine",
      };
    }

    // Default pH scale explanation
    return {
      topic: input.topic,
      explanation:
        "The pH scale runs from 0 to 14. Pure neutral water sits right at pH 7. Any substance with a pH below 7 is an acid (like lemon juice at ~2.2 or vinegar at ~2.5), while any substance with a pH above 7 is a base or alkaline (like baking soda at ~8.4 or soap water at ~9.2).",
      keyConcepts: [
        "pH scale from 0 to 14",
        "Acids: pH < 7, donate H+ ions",
        "Bases: pH > 7, donate OH- or accept H+ ions",
        "Neutral: pH = 7",
      ],
      realWorldApplication:
        "Soap feels slippery because bases react with natural oils on your skin; acids taste sour like lemons and unripe fruit.",
      followUpQuestion: "Can you name three common substances in your home that are acidic?",
      lowResourceNote:
        "Testing with natural indicators lets learners measure chemical properties without expensive electronic meters.",
      provider: "pedagogical_engine",
    };
  }

  private static generateOfflineFeedback(input: FeedbackRequestInput): AiFeedbackResult {
    const text = input.studentInput.toLowerCase();

    if (input.feedbackType === "HYPOTHESIS") {
      const mentionsColorOrPh =
        text.includes("turn") ||
        text.includes("color") ||
        text.includes("red") ||
        text.includes("pink") ||
        text.includes("blue") ||
        text.includes("green") ||
        text.includes("ph") ||
        text.includes("acid");

      if (mentionsColorOrPh) {
        return {
          feedbackType: "HYPOTHESIS",
          feedback:
            "Excellent scientific hypothesis! You formulated a clear, testable prediction with an expected cause and visual effect.",
          praise:
            "Great job specifying the expected change (color/pH shift) before carrying out the experiment.",
          constructiveGuidance:
            "As you carry out the test, note the exact speed and shade of the color transition to see if your prediction matches the real chemical equilibrium.",
          scientificAccuracyScore: 92,
          provider: "pedagogical_engine",
        };
      }

      return {
        feedbackType: "HYPOTHESIS",
        feedback:
          "Good start! A strong scientific hypothesis is an 'If... then...' statement predicting what will happen when you mix the substances.",
        praise: "You are actively thinking about the experimental setup.",
        constructiveGuidance:
          "Try including what indicator you are using and what color you expect to observe (e.g. 'If I add red cabbage juice to vinegar, then it will turn pink because vinegar is an acid').",
        scientificAccuracyScore: 75,
        provider: "pedagogical_engine",
      };
    }

    if (input.feedbackType === "OBSERVATION") {
      const isDetailed = text.length > 25;
      return {
        feedbackType: "OBSERVATION",
        feedback: isDetailed
          ? "Detailed and accurate lab notes! You documented the sensory changes clearly."
          : "Observation noted. Try recording more details about the shade of color, bubbling (effervescence), or temperature change.",
        praise: "Recording exact empirical observations is the hallmark of great scientific discovery.",
        constructiveGuidance:
          "Remember to record both the initial color and the final equilibrated color after swirling.",
        scientificAccuracyScore: isDetailed ? 90 : 78,
        provider: "pedagogical_engine",
      };
    }

    // CONCLUSION
    const mentionsNeutralization =
      text.includes("neutral") || text.includes("salt") || text.includes("water") || text.includes("cancel");
    return {
      feedbackType: "CONCLUSION",
      feedback: mentionsNeutralization
        ? "Outstanding conclusion! You recognized that the acid and base reacted together to form a neutral solution."
        : "Good conclusion. To make it even stronger, connect your observed color change back to the chemical neutralization between H+ and OH- ions.",
      praise: "You successfully synthesized your experimental data into a scientific conclusion.",
      constructiveGuidance:
        "Consider explaining why effervescence occurred if baking soda was involved (formation of carbon dioxide gas).",
      scientificAccuracyScore: mentionsNeutralization ? 95 : 82,
      provider: "pedagogical_engine",
    };
  }
}
