import { NextRequest } from "next/server";
import { ExperimentEngine } from "@/lib/services/experiment-engine";
import { createSuccessResponse, handleApiError } from "@/lib/utils/api-response";
import { LabModeSchema } from "@/lib/validation/schemas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modeParam = searchParams.get("mode");

    let modeFilter = undefined;
    if (modeParam) {
      const parsed = LabModeSchema.safeParse(modeParam);
      if (parsed.success) {
        modeFilter = parsed.data;
      }
    }

    const experiments = ExperimentEngine.listExperiments(modeFilter);
    return createSuccessResponse(experiments, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
