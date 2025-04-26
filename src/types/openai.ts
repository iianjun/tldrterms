import { Database } from "@/types/database.types";
export interface OpenAIValidationResponse {
  language: "EN" | "KO" | "ETC";
  document_type: "terms" | "privacy" | "unknown";
}

export type AnalyticPointCategory =
  Database["public"]["Enums"]["analytic_point_category"];

export type AnalyticRoom =
  Database["public"]["Tables"]["analytic_rooms"]["Row"];
export type AnalyticPoint =
  Database["public"]["Tables"]["analytic_points"]["Row"];
export type Analytic = Database["public"]["Tables"]["analytics"]["Row"];

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Criterion = Database["public"]["Tables"]["criteria"]["Row"];

export type AssessmentCategory =
  | "excellent"
  | "good"
  | "neutral"
  | "concerning_minor"
  | "concerning_major"
  | "potentially_harmful"
  | "incomplete_potentially_risky";

export interface AnalysisResultRes<T> {
  isSuccess: boolean;
  message: string;
  result?: T;
}

export interface OpenAIAnalayzedResponse {
  score: number;
  category: AssessmentCategory;
  points: AnalyticPoint[];
  china_data_processing_details?: string | null;
}

export type AIStatus = "fetching" | "analyzing" | "done" | "error";
