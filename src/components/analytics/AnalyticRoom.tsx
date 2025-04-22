"use client";
import InitialAnimation from "@/components/analytics/InitialAnimation";
import { Analytic } from "@/types/openai";
import { useEffect, useState } from "react";

interface Props {
  initialAnalytic?: Analytic | null;
  roomId: string;
}

type Status = "fetching" | "analyzing" | "done";
export default function AnalyticRoom({
  initialAnalytic,
  roomId,
}: Readonly<Props>) {
  const [status, setStatus] = useState<Status>(
    initialAnalytic ? "done" : "fetching"
  );

  useEffect(() => {
    const eventSource = new EventSource(`/api/v1/analytics/${roomId}/stream`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status) setStatus(data.status);
      if (data.done) eventSource.close();
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [roomId]);

  if (!initialAnalytic && ["fetching", "analyzing"].includes(status)) {
    return <InitialAnimation status={status as "fetching" | "analyzing"} />;
  }
  //   TODO: show analytic result ui
  return <></>;
}
