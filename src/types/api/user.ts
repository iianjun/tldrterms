import { profileSchema } from "@/validations/account";
import { deletionSchema } from "@/validations/deletion";
import { z } from "zod";

export type UpdateUserValues = z.infer<typeof profileSchema>;
export type DeleteAccountSurveyValues = z.infer<typeof deletionSchema>;
