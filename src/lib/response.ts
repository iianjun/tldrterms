import type { ApiResponse, CommonErrorCode, Pagination } from "@/types/api";
import { NextResponse } from "next/server";

const MESSAGE_SOURCE_MAP: Record<CommonErrorCode, string> = {
  UNAUTHORIZED: "Unauthorized",
  NO_CREDIT: "No credits available",
  ROOM_NOT_FOUND: "Room not found",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  AUTH_BAD_REQUEST: "Email and password are required",
};
export class CustomResponse {
  static success<T>({ data, status = 200 }: { data: T; status?: number }) {
    const body: ApiResponse<T> = {
      success: true,
      data,
    };
    return NextResponse.json(body, { status });
  }
  static pagination<T>({
    data,
    pagination,
    status = 200,
  }: {
    data: T;
    pagination: Pagination<T>["pagination"];
    status?: number;
  }) {
    const body: Pagination<T> = {
      success: true,
      data,
      pagination,
    };
    return NextResponse.json(body, { status });
  }
  static error({
    errorCode,
    status = 400,
    ignoreToast = false,
  }: {
    errorCode: CommonErrorCode;
    status: number;
    ignoreToast?: boolean;
  }) {
    const body: ApiResponse = {
      success: false,
      errorCode,
      error: MESSAGE_SOURCE_MAP[errorCode],
      statusCode: status,
      ignoreToast,
    };
    return NextResponse.json(body, { status });
  }
  static customError({
    errorCode,
    status = 400,
    message,
    ignoreToast = false,
  }: {
    errorCode: string;
    status: number;
    message: string;
    ignoreToast?: boolean;
  }) {
    const body: ApiResponse = {
      success: false,
      errorCode,
      error: message,
      statusCode: status,
      ignoreToast,
    };
    return NextResponse.json(body, { status });
  }
}
