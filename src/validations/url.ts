import { z } from "zod";

export const urlSchema = z.object({
  url: z
    .string()
    .regex(/^(?!https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, {
      message: "Invalid URL",
    }),
});
