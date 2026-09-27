import { NextRequest } from "next/server";
import { AssessmentSubmissionSchema } from "@/lib/validation/schemas";
import { AssessmentEngine } from "@/lib/services/assessment-engine";
import { createSuccessResponse, handleApiError } from "@/lib/utils/api-response";

export async function GET() {
  try {
    const questions = AssessmentEngine.getAssessmentQuestions();
    return createSuccessResponse({ questions }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validated = AssessmentSubmissionSchema.parse(rawBody);

    const evaluation = AssessmentEngine.evaluate(validated);
    return createSuccessResponse(evaluation, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
