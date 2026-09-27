import { NextRequest } from "next/server";
import { ExperimentEngine } from "@/lib/services/experiment-engine";
import { createErrorResponse, createSuccessResponse, handleApiError } from "@/lib/utils/api-response";
import { ApiErrorCode } from "@/types/api";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const experiment = ExperimentEngine.getExperimentById(id);

    if (!experiment) {
      return createErrorResponse(
        ApiErrorCode.NOT_FOUND,
        `Experiment with ID '${id}' not found.`,
        404
      );
    }

    return createSuccessResponse(experiment, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
