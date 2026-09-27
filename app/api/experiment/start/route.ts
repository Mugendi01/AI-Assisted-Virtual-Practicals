import { NextRequest } from "next/server";
import { StartExperimentSchema } from "@/lib/validation/schemas";
import { ExperimentEngine } from "@/lib/services/experiment-engine";
import { createSuccessResponse, handleApiError } from "@/lib/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validated = StartExperimentSchema.parse(rawBody);

    const session = ExperimentEngine.startSession(
      validated.experimentId,
      validated.mode,
      validated.studentName,
      validated.containerCount
    );

    return createSuccessResponse(session, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
