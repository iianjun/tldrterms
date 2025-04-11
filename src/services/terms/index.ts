import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { OpenAIAnalayzedResponse } from "@/types/openai";

export function getAnalyzeResult(data: { url: string }): Promise<
  ApiResponse<OpenAIAnalayzedResponse>
> {
  return apiClient("/terms/analyze", {
    method: "POST",
    body: data,
  });
}
