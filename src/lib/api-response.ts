import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function apiSuccess<T>(data: T, status = 200) {
  const body: ApiResponse<T> = { success: true, data };
  return NextResponse.json(body, { status });
}

export function apiError(message: string, errorCode: string, status = 400) {
  const body: ApiResponse = { success: false, message, errorCode };
  return NextResponse.json(body, { status });
}
