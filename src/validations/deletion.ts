import { z } from "zod";
import { DELETION_REASONS } from "@/constants/deletion";
import { DeletionSurveyReason } from "@/types/supabase";

const values: DeletionSurveyReason[] = [
  DELETION_REASONS[0].value,
  ...DELETION_REASONS.slice(1).map((p) => p.value),
];
export const deletionSchema = z.object({
  reasons: z.array(z.enum(values)),
  otherReason: z.string().optional(),
});
