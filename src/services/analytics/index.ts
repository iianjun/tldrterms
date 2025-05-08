import { apiClient } from "@/lib/api";
import { ApiResponse, Pagination } from "@/types/api";
import { AnalyticRoom } from "@/types/supabase";
import { getQueryString } from "@/utils/query-string";

export function getAnalyticsRoomById(data: { roomId: string }): Promise<
  ApiResponse<AnalyticRoom>
> {
  return apiClient(`/analytics/${data.roomId}`, {
    method: "GET",
  });
}

export function updateRoom(data: { roomId: number; text: string }): Promise<
  ApiResponse<AnalyticRoom>
> {
  return apiClient(`/analytics/${data.roomId}`, {
    method: "PATCH",
    body: {
      text: data.text,
    },
  });
}
export function deleteRoom(data: { roomId: number }): Promise<
  ApiResponse<void>
> {
  return apiClient(`/analytics/${data.roomId}`, {
    method: "DELETE",
  });
}

export function createRoom(data: { url: string }): Promise<
  ApiResponse<number>
> {
  return apiClient("/rooms", {
    method: "POST",
    body: data,
  });
}

export function getRooms({
  offset,
  limit,
  search = "",
}: { offset: number; limit: number; search?: string }): Promise<
  Pagination<AnalyticRoom[]>
> {
  const qs = getQueryString({
    offset: String(offset),
    limit: String(limit),
    search,
  });
  return apiClient(`/rooms?${qs}`, {
    method: "GET",
  });
}
