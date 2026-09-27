import { NextRequest } from "next/server";
import { ExplainRequestSchema } from "@/lib/validation/schemas";
import { AiService } from "@/lib/services/ai-service";
import { createSuccessResponse, handleApiError } from "@/lib/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validated = ExplainRequestSchema.parse(rawBody);

    const explanation = await AiService.explain(validated);
    return createSuccessResponse(explanation, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
