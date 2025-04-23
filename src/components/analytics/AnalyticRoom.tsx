"use client";
import InitialAnimation from "@/components/analytics/InitialAnimation";
import { useSSE } from "@/hooks/useSSE";
import { ApiResponse } from "@/types/api";
import {
  AIStatus,
  AnalyticRoom as AnalyticRoomType,
  OpenAIAnalayzedResponse,
} from "@/types/openai";
import { useEffect, useState } from "react";

interface Props {
  room: AnalyticRoomType;
}

export default function AnalyticRoom({ room }: Readonly<Props>) {
  const [status, setStatus] = useState<AIStatus>(() => {
    if (room.analytic_status === "error") return "error";
    if (room.analytic_status === "completed") return "done";
    return "fetching";
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { data, close } = useSSE<
    ApiResponse<{ status: AIStatus } & OpenAIAnalayzedResponse>
  >({
    url: `/api/v1/analytics/${room.id}/stream`,
    enabled: room.analytic_status === "idle",
  });

  useEffect(() => {
    if (!data) return;
    const { success, statusCode, error, data: result } = data;
    if (!result?.status) return;
    if (result.status === "error" || !success || statusCode !== 200 || error) {
      setStatus("error");
      setErrorMsg(error || "An error occurred");
      close();
    } else {
      setStatus(result.status);
      setErrorMsg(null);
    }
  }, [data, close]);

  if (status !== "done") {
    return <InitialAnimation status={status} errorMsg={errorMsg} />;
  }
  //   TODO: show analytic result ui
  return <></>;
}
