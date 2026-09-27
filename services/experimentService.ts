import { experiments, availableMaterials, labMaterials, localLabSteps, virtualLabSteps, type Experiment, type Material, type ExperimentStep, type ExperimentResult } from '@/data/experiments';

export class ExperimentService {
  static getAllExperiments(): Experiment[] {
    return experiments;
  }

  static getExperimentById(id: string): Experiment | undefined {
    return experiments.find(exp => exp.id === id);
  }

  static getAvailableMaterials(): Material[] {
    return availableMaterials;
  }

  static getLabMaterials(): Material[] {
    return labMaterials;
  }

  static getLocalLabSteps(): ExperimentStep[] {
    return localLabSteps;
  }

  static getVirtualLabSteps(): ExperimentStep[] {
    return virtualLabSteps;
  }

  static generateLocalLabPathway(selectedMaterials: string[]): string {
    const materialCount = selectedMaterials.length;
    if (materialCount === 0) {
      return "Please select at least one material to begin.";
    }
    
    const hasAcid = selectedMaterials.some(m => m === 'lemon-juice' || m === 'vinegar');
    const hasBase = selectedMaterials.some(m => m === 'baking-soda');
    const hasIndicator = selectedMaterials.some(m => m === 'turmeric' || m === 'hibiscus');

    if (hasAcid && hasBase && hasIndicator) {
      return "Based on the materials you've selected, AI Lab can guide you through a complete acids and bases learning activity. You'll observe how indicators change color when they interact with acidic and basic substances.";
    } else if (hasAcid && hasIndicator) {
      return "Based on the materials you've selected, AI Lab can guide you through an acid testing activity. You'll observe how indicators respond to acidic substances.";
    } else if (hasBase && hasIndicator) {
      return "Based on the materials you've selected, AI Lab can guide you through a base testing activity. You'll observe how indicators respond to basic substances.";
    } else {
      return "Based on the materials you've selected, AI Lab can guide you through a basic exploration of acids and bases. Consider adding an indicator (turmeric or hibiscus) for the best learning experience.";
    }
  }

  static calculateExperimentResult(
    prediction: string,
    observation: string,
    explanation: string
  ): ExperimentResult {
    // Mock scoring - in production this would use AI or rubric-based evaluation
    const predictionScore = Math.floor(Math.random() * 3) + 7; // 7-9
    const observationScore = Math.floor(Math.random() * 3) + 7; // 7-9
    const explanationScore = Math.floor(Math.random() * 3) + 7; // 7-9
    const overall = ((predictionScore + observationScore + explanationScore) / 3).toFixed(1);

    return {
      prediction: predictionScore,
      observation: observationScore,
      explanation: explanationScore,
      overall: parseFloat(overall),
      feedback: "Great work! You've successfully identified the acidic and basic properties of the substances. Your observations showed clear understanding of how indicators work.",
      reflection: "Think about how this experiment could be applied in real life. Where else might you use pH indicators in everyday situations?"
    };
  }
}
