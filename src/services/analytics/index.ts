import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { AnalyticRoom } from "@/types/supabase";

export function getAnalyticsRoomById(data: { roomId: string }): Promise<
  ApiResponse<AnalyticRoom>
> {
  return apiClient(`/analytics/${data.roomId}`, {
    method: "GET",
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
