"use client";
import InitialAnimation from "@/components/analytics/InitialAnimation";
import { ApiResponse } from "@/types/api";
import { AIStatus, Analytic, OpenAIAnalayzedResponse } from "@/types/openai";
import { useEffect, useState } from "react";

interface Props {
  initialAnalytic?: Analytic | null;
  roomId: string;
}

export default function AnalyticRoom({
  initialAnalytic,
  roomId,
}: Readonly<Props>) {
  const [status, setStatus] = useState<AIStatus>(
    initialAnalytic ? "done" : "fetching"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const es = new EventSource(`/api/v1/analytics/${roomId}/stream`);
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
  }, [roomId]);

  if (!initialAnalytic && status !== "done") {
    return <InitialAnimation status={status} errorMsg={errorMsg} />;
  }
  //   TODO: show analytic result ui
  return <></>;
}
