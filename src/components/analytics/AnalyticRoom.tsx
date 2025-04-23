"use client";
import InitialAnimation from "@/components/analytics/InitialAnimation";
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

  useEffect(() => {
    if (room.analytic_status !== "idle") return;
    const es = new EventSource(`/api/v1/analytics/${room.id}/stream`);
    es.onmessage = (e) => {
      const { success, statusCode, error, data } = JSON.parse(
        e.data
      ) as ApiResponse<{ status: AIStatus } & OpenAIAnalayzedResponse>;
      if (!data?.status) return;
      if (data?.status === "error" || !success || statusCode !== 200 || error) {
        setStatus("error");
        setErrorMsg(error || "An error occurred");
        es.close();
      } else {
        setStatus(data.status);
        setErrorMsg(null);
      }
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [room]);

  if (status !== "done") {
    return <InitialAnimation status={status} errorMsg={errorMsg} />;
  }
  //   TODO: show analytic result ui
  return <></>;
}
