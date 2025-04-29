import type { Database } from "@/types/supabase";

export type AnalyticPointCategory =
  Database["public"]["Enums"]["analytic_point_category"];

export type AnalyticPoint =
  Database["public"]["Tables"]["analytic_points"]["Row"];
