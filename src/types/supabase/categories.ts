import { Database } from "@/types/supabase/database";

export type Criteria = Database["public"]["Tables"]["criteria"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"] & {
  criteria?: Criteria[];
};
