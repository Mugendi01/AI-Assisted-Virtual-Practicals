import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiErrorCode, ApiResponse } from "@/types/api";

export function createSuccessResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function createErrorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status }
  );
}

export class SafetyViolationError extends Error {
  public code: string;
  public details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "SafetyViolationError";
    this.code = ApiErrorCode.SAFETY_VIOLATION;
    this.details = details;
  }
}

export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof ZodError) {
    const errorDetails = error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return createErrorResponse(
      ApiErrorCode.VALIDATION_ERROR,
      `Request validation failed: ${errorDetails.map((e) => `${e.field}: ${e.message}`).join(", ")}`,
      400,
      errorDetails
    );
  }

  if (error instanceof SafetyViolationError) {
    return createErrorResponse(
      error.code,
      error.message,
      403,
      error.details
    );
  }

  if (error instanceof Error) {
    return createErrorResponse(
      ApiErrorCode.BAD_REQUEST,
      error.message,
      400
    );
  }

  return createErrorResponse(
    ApiErrorCode.INTERNAL_SERVER_ERROR,
    "An unexpected error occurred while processing the request.",
    500
  );
}
