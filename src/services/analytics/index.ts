import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Analytic, OpenAIAnalayzedResponse } from "@/types/openai";

export function streamAnalytics(data: { roomId: string }): Promise<
  ApiResponse<OpenAIAnalayzedResponse>
> {
  return apiClient(`/analytics/${data.roomId}/stream`, {
    method: "GET",
  });
}

export function getAnalyticsByRoomId(data: { roomId: string }): Promise<
  ApiResponse<Analytic>
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
