import { CustomResponse } from "@/lib/response";

export async function GET() {
  return CustomResponse.success({
    data: "OK",
  });
}
