import { CustomResponse } from "@/lib/response";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  await supabase.from("keep_alive").insert({
    random_text: result,
  });
  return CustomResponse.success({
    data: {
      message: "OK",
      random_text: result,
    },
  });
}
