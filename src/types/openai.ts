import { Database } from "@/types/database.types";
export interface OpenAIValidationResponse {
  language: "EN" | "KO" | "ETC";
  document_type: "terms" | "privacy" | "unknown";
}

export type AnalyticPointCategory =
  Database["public"]["Enums"]["analytic_point_category"];
export type AnalyticPointCaseId =
  Database["public"]["Enums"]["analytic_point_case_id"];

export type AnalyticRoom =
  Database["public"]["Tables"]["analytic_rooms"]["Row"];
export type AnalyticPoint =
  Database["public"]["Tables"]["analytic_points"]["Row"];
export type Analytic = Database["public"]["Tables"]["analytics"]["Row"];

export interface AnalysisResultRes<T> {
  isSuccess: boolean;
  message: string;
  result?: T;
}

export interface OpenAIAnalayzedResponse {
  score: number;
  points: AnalyticPoint[];
  china_data_processing_details?: string | null;
}

export type AIStatus = "fetching" | "analyzing" | "done" | "error";
