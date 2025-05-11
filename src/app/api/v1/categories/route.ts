import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { isInvalid } = await getAuthentication();
    if (isInvalid) {
      return CustomResponse.error({
        errorCode: "UNAUTHORIZED",
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
    if (!data || !data.length) {
      console.error(error?.message);
      return CustomResponse.customError({
        errorCode: "CATEGORY_NOT_FOUND",
        message: "Categories were not found",
        status: 404,
      });
    }
    return CustomResponse.success({
      data,
    });
  } catch (e) {
    console.error(e);
    return CustomResponse.error({
      errorCode: "INTERNAL_SERVER_ERROR",
      status: 500,
    });
  }
}
