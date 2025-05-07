import type { ApiResponse, ErrorCode, Pagination } from "@/types/api";
import { NextResponse } from "next/server";

const MESSAGE_SOURCE_MAP: Record<ErrorCode, string> = {
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
  }: { errorCode: ErrorCode; status: number }) {
    const body: ApiResponse = {
      success: false,
      errorCode,
      error: MESSAGE_SOURCE_MAP[errorCode],
      statusCode: status,
    };
    return NextResponse.json(body, { status });
  }
}
