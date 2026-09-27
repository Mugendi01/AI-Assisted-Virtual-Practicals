import { NextRequest } from "next/server";
import { ExperimentActionSchema } from "@/lib/validation/schemas";
import { ExperimentEngine } from "@/lib/services/experiment-engine";
import { createSuccessResponse, handleApiError } from "@/lib/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validated = ExperimentActionSchema.parse(rawBody);

    const result = ExperimentEngine.executeAction(
      validated.sessionId,
      validated.actionType,
      {
        containerId: validated.containerId,
        substanceId: validated.substanceId,
        volumeMl: validated.volumeMl,
        indicatorId: validated.indicatorId,
        observation: validated.observation,
        stepNumber: validated.stepNumber,
      }
    );

    return createSuccessResponse(result, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
