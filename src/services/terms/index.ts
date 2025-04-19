import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { OpenAIAnalayzedResponse } from "@/types/openai";

export function getAnalyzeResult(data: { url: string }): Promise<
  ApiResponse<OpenAIAnalayzedResponse>
> {
  return apiClient("/terms/analytics", {
    method: "POST",
    body: data,
  });
}

export function getAnalyticsByRoomId(data: { roomId: string }): Promise<
  ApiResponse<OpenAIAnalayzedResponse>
> {
  return apiClient(`/terms/analytics/${data.roomId}`, {
    method: "GET",
  });
}

export function createRoom(data: { url: string }): Promise<
  ApiResponse<number>
> {
  return apiClient("/terms/rooms", {
    method: "POST",
    body: data,
  });
}
