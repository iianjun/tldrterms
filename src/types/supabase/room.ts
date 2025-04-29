import type { Analytic, Database } from "@/types/supabase";

export type AnalyticRoom =
  Database["public"]["Tables"]["analytic_rooms"]["Row"] & {
    analytics?: Analytic;
  };
