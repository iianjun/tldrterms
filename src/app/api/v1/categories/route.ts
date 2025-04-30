import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { isInvalid } = await getAuthentication();
    if (isInvalid) {
      return CustomResponse.error({
        message: "Unauthorized",
        status: 401,
      });
    }
    const { data, error } = await supabase
      .from("categories")
      .select(`
          id,
          title,
          category_id,
          criteria (
            id,
            title,
            case_id
          )
        `)
      .order("id", { ascending: true });
    if (error) {
      console.error(error.message);
      return CustomResponse.error({
        message: error.message,
        status: 400,
      });
    }
    return CustomResponse.success({
      data,
    });
  } catch (e) {
    console.error(e);
    return CustomResponse.error({
      message: "Internal Server Error",
      status: 500,
    });
  }
}
