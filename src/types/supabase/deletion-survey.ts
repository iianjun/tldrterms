import { Database } from "@/types/supabase/database";

export type DeletionSurvey =
  Database["public"]["Tables"]["deletion_survey"]["Row"];
export type DeletionSurveyReason =
  Database["public"]["Enums"]["deletion_survey_reason"];
