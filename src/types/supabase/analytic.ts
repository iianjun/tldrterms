import { AnalyticPoint, Database } from "@/types/supabase";

export type Analytic = Database["public"]["Tables"]["analytics"]["Row"] & {
  analytic_points?: AnalyticPoint[];
};
export type DocumentType =
  Database["public"]["Enums"]["analytic_document_type"];

export type ScoreCategory = Database["public"]["Enums"]["score_category"];
