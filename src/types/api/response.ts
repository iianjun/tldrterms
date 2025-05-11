export type CommonErrorCode =
  | "NO_CREDIT"
  | "UNAUTHORIZED"
  | "ROOM_NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "AUTH_BAD_REQUEST";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: CommonErrorCode | string;
  statusCode?: number;
  ignoreToast?: boolean;
}

export interface Pagination<T = unknown> extends ApiResponse<T> {
  pagination: {
    offset: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}
