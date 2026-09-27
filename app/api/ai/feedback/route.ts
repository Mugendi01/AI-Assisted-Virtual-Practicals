import { NextRequest } from "next/server";
import { FeedbackRequestSchema } from "@/lib/validation/schemas";
import { AiService } from "@/lib/services/ai-service";
import { createSuccessResponse, handleApiError } from "@/lib/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validated = FeedbackRequestSchema.parse(rawBody);

    const feedback = await AiService.provideFeedback(validated);
    return createSuccessResponse(feedback, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
