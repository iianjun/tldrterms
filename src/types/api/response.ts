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
  | "CREDIT_USAGE_ERROR"
  | "AUTH_ERROR"
  | "AUTH_BAD_REQUEST"
  | "FORGOT_BAD_REQUEST";
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: ErrorCode;
  statusCode?: number;
}

export interface Pagination<T = unknown> extends ApiResponse<T> {
  pagination: {
    offset: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}
