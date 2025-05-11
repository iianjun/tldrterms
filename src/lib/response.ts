import type { ApiResponse, ErrorCode, Pagination } from "@/types/api";
import { NextResponse } from "next/server";

type MESSAGE_MAP_ERROR_CODE = Exclude<
  ErrorCode,
  "AUTH_ERROR" | "RESET_AUTH_ERROR" | "LOGOUT_ERROR"
>;
const MESSAGE_SOURCE_MAP: Record<MESSAGE_MAP_ERROR_CODE, string> = {
  UNAUTHORIZED: "Unauthorized",
  NO_CREDIT: "No credits available",
  ROOM_NOT_FOUND: "Room not found",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  UPDATE_ROOM_ERROR: "Error on updating room",
  DELETE_ROOM_ERROR: "Error on deleting room",
  URL_BAD_REQUEST: "URL is missing",
  CATEGORY_NOT_FOUND: "Categories not found",
  ROOM_CREATE_ERROR: "Error on creating room",
  CREDIT_USAGE_ERROR: "Error on using credit",
  AUTH_BAD_REQUEST: "Email and password are required",
  FORGOT_BAD_REQUEST: "Email is required",
  RESET_BAD_REQUEST: "Password is required",
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
    message,
    ignoreToast = false,
  }: {
    errorCode: ErrorCode;
    status: number;
    message?: string;
    ignoreToast?: boolean;
  }) {
    const body: ApiResponse = {
      success: false,
      errorCode,
      error: message || MESSAGE_SOURCE_MAP[errorCode as MESSAGE_MAP_ERROR_CODE],
      statusCode: status,
      ignoreToast,
    };
    return NextResponse.json(body, { status });
  }
}
