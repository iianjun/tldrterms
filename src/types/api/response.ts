export type ErrorCode =
  | "NO_CREDIT"
  | "UNAUTHORIZED"
  | "ROOM_NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "UPDATE_ROOM_ERROR"
  | "DELETE_ROOM_ERROR"
  | "URL_BAD_REQUEST"
  | "CATEGORY_NOT_FOUND"
  | "ROOM_CREATE_ERROR"
  | "CREDIT_USAGE_ERROR";
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: ErrorCode;
  statusCode?: number;
}
