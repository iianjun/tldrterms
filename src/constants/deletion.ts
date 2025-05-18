import { DeletionSurveyReason } from "@/types/supabase";

export const DELETION_REASONS: {
  value: DeletionSurveyReason;
  label: string;
}[] = [
  { value: "not-useful", label: "I don't find the service useful" },
  { value: "hard-to-use", label: "The service is difficult to use" },
  { value: "found-alternative", label: "I found a better alternative" },
  { value: "privacy-concerns", label: "I have privacy concerns" },
  { value: "too-many-emails", label: "I receive too many emails" },
  { value: "other", label: "Other reason" },
];
