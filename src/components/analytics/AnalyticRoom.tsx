"use client";
import AnalyticsResult from "@/components/analytics/AnalyticsResult";
import InitialAnimation from "@/components/analytics/InitialAnimation";
import { useSSE } from "@/hooks/useSSE";
import { ApiResponse } from "@/types/api";
import { SSEStatus } from "@/types/openai";
import { Analytic, AnalyticRoom as AnalyticRoomType } from "@/types/supabase";
import { useEffect, useState } from "react";

interface Props {
  room: AnalyticRoomType;
}

export default function AnalyticRoom({ room }: Readonly<Props>) {
  const [analytic, setAnalytic] = useState<Analytic | null>(
    room.analytics ?? null
  );
  const [status, setStatus] = useState<SSEStatus>(() => {
    if (room.analytic_status === "error") return "error";
    if (room.analytic_status === "completed") return "done";
    return "fetching";
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data, close } = useSSE<ApiResponse<{ status: SSEStatus } & Analytic>>(
    {
      url: `/api/v1/analytics/${room.id}/stream`,
      enabled: room.analytic_status === "idle",
    }
  );

  useEffect(() => {
    if (!data) return;
    const { success, statusCode, error, data: result } = data;
    if (!result?.status) return;
    if (result.status === "error" || !success || statusCode !== 200 || error) {
      setStatus("error");
      setErrorMsg(error || "An error occurred");
      close();
    } else {
      const { status, ...analytic } = result;
      setStatus(status);
      setAnalytic(analytic);
      setErrorMsg(null);
      if (status === "done") {
        close();
      }
    }
  }, [data, close]);

  if (status !== "done" || !analytic) {
    return (
      <InitialAnimation
        status={status as Exclude<SSEStatus, "done">}
        errorMsg={errorMsg}
      />
    );
  }
  //   TODO: show analytic result ui
  return <AnalyticsResult analytic={analytic} url={room.url} />;
}
