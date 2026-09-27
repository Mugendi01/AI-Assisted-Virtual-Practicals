export type AIMessageType = 'guidance' | 'hint' | 'observation' | 'feedback' | 'safety' | 'success';

export interface AIMessage {
  id: string;
  type: AIMessageType;
  content: string;
  timestamp: Date;
}

export class AIService {
  private static messages: AIMessage[] = [];

  static getGuidanceMessage(context: string): AIMessage {
    const messages: Record<string, string> = {
      'start': "Let's start by making a prediction. Scientists don't just observe results — they make predictions and test them.",
      'prediction': "Good prediction. Now let's test it by running the experiment.",
      'experiment': "Watch carefully as the experiment runs. Pay attention to how the indicator responds.",
      'observation': "Look at the indicator carefully. What changed? What does this tell you about the substance?",
      'explanation': "Excellent observation. Let's think about what this means scientifically.",
      'complete': "Excellent! You've completed the practical. You've learned how to identify acids and bases using indicators."
    };

    return {
      id: Date.now().toString(),
      type: 'guidance',
      content: messages[context] || "Let's continue with the next step.",
      timestamp: new Date()
    };
  }

  static getHintMessage(topic: string): AIMessage {
    const hints: Record<string, string> = {
      'indicators': "Think about what indicators tell us about substances. They change color based on pH levels.",
      'acids': "Acids typically have a sour taste and turn certain indicators specific colors.",
      'bases': "Bases often feel slippery and can turn indicators different colors than acids do.",
      'prediction': "Consider what you know about the substances you're testing before making your prediction."
    };

    return {
      id: Date.now().toString(),
      type: 'hint',
      content: hints[topic] || "Think about the properties of the substances you're working with.",
      timestamp: new Date()
    };
  }

  static getObservationMessage(observation: string): AIMessage {
    return {
      id: Date.now().toString(),
      type: 'observation',
      content: `Observation: ${observation}. What does this tell you about the substance?`,
      timestamp: new Date()
    };
  }

  static getFeedbackMessage(score: number): AIMessage {
    let content = "";
    if (score >= 8) {
      content = "Excellent work! You demonstrated strong understanding of the concepts.";
    } else if (score >= 6) {
      content = "Good work! You're on the right track. Keep practicing your observations.";
    } else {
      content = "Keep practicing! Try to focus on the key changes you observed.";
    }

    return {
      id: Date.now().toString(),
      type: 'feedback',
      content,
      timestamp: new Date()
    };
  }

  static getSafetyMessage(scenario: string): AIMessage {
    return {
      id: Date.now().toString(),
      type: 'safety',
      content: "Safety first: AI Lab only permits supported learning scenarios. Never experiment with unknown chemical combinations outside a supervised learning environment.",
      timestamp: new Date()
    };
  }

  static getSuccessMessage(): AIMessage {
    return {
      id: Date.now().toString(),
      type: 'success',
      content: "🎉 Congratulations! You've successfully completed the practical. You've learned valuable skills in scientific observation and analysis.",
      timestamp: new Date()
    };
  }

  static getExperimentExplanation(substanceA: string, substanceB: string, indicator: string): string {
    // Mock explanation - in production this would use AI
    const explanations: Record<string, string> = {
      'lemon-juice-baking-soda-turmeric': "When lemon juice (acidic) mixes with baking soda (basic), a neutralization reaction occurs. Turmeric, which is yellow in neutral conditions, turns red in basic environments. This reaction produces carbon dioxide bubbles.",
      'vinegar-baking-soda-hibiscus': "Vinegar (acidic) reacts with baking soda (basic) in a classic acid-base reaction. Hibiscus contains anthocyanins that change color based on pH - red in acidic conditions, green in basic conditions.",
      'default': "The indicator changes color based on the pH of the solution. Acidic substances typically turn indicators one color, while basic substances turn them another color."
    };

    const key = `${substanceA}-${substanceB}-${indicator}`.toLowerCase();
    return explanations[key] || explanations['default'];
  }
}
