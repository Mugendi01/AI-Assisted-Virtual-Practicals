import { NextRequest } from "next/server";
import { SafetyCheckSchema } from "@/lib/validation/schemas";
import { SafetyEngine } from "@/lib/services/safety-engine";
import { createSuccessResponse, handleApiError } from "@/lib/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validated = SafetyCheckSchema.parse(rawBody);

    const checkResult = SafetyEngine.checkCombination(
      validated.substances,
      validated.mode,
      validated.actionProposed
    );

    return createSuccessResponse(checkResult, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
