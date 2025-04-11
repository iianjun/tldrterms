import type { ApiResponse } from "@/types/api";
import { NextResponse } from "next/server";

export class CustomResponse {
  static success<T>({ data, status = 200 }: { data: T; status?: number }) {
    const body: ApiResponse<T> = {
      success: true,
      data,
    };
    return NextResponse.json(body, { status });
  }
  static error({ message, status = 400 }: { message: string; status: number }) {
    const body: ApiResponse = {
      success: false,
      error: message,
      statusCode: status,
    };
    return NextResponse.json(body, { status });
  }
}
