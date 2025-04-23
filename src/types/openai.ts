import { Database } from "@/types/database.types";
export interface OpenAIValidationResponse {
  language: "EN" | "KO" | "ETC";
  isTermsOrPrivacy: boolean;
}

export type AnalyticPointCategory =
  Database["public"]["Enums"]["analytic_point_category"];
export type AnalyticPointImportance =
  Database["public"]["Enums"]["analytic_point_importance"];
export type AnalyticPointRating =
  Database["public"]["Enums"]["analytic_point_rating"];

export type AnalyticRoom =
  Database["public"]["Tables"]["analytic_rooms"]["Row"];
export type AnalyticPoint =
  Database["public"]["Tables"]["analytic_points"]["Row"];
export type Analytic = Database["public"]["Tables"]["analytics"]["Row"];

export interface OpenAIAnalayzedResponse {
  score: number;
  points: AnalyticPoint[];
  triggered_geopolitical_risk: boolean;
}

export type AIStatus = "fetching" | "analyzing" | "done" | "error";
