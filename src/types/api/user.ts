import { profileSchema } from "@/validations/account";
import { z } from "zod";

export type UpdateUserValues = z.infer<typeof profileSchema>;
