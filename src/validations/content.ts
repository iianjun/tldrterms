import { z } from "zod";

export const contentSchema = z.object({
  text: z.string().min(1, {
    message: "Content is required.",
  }),
});
