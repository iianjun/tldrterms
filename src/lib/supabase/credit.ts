import { createClient } from "@/lib/supabase/server";
import dayjs from "dayjs";

export async function getRemainingCounts({ userId }: { userId: string }) {
  const supabase = await createClient();
  const startOfMonth = dayjs().startOf("month").toISOString();
  const { count: freeCount } = await supabase
    .from("usage_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_paid", false)
    .gte("created_at", startOfMonth);
  return {
    free: 10 - (freeCount || 0),
  };
}

export async function spendCredit({
  userId,
}: {
  userId: string;
}): Promise<boolean> {
  const supabase = await createClient();
  await supabase.from("usage_logs").insert({
    user_id: userId,
    is_paid: false,
  });
  return false;
}
