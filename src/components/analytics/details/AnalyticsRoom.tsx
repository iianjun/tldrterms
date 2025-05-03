"use client";
import AnalyticsResult from "@/components/analytics/details/AnalyticsResult";
import FetchError from "@/components/analytics/details/FetchError";
import InitialAnimation from "@/components/analytics/details/InitialAnimation";
import { useSSE } from "@/hooks/useSSE";
import { getAnalyticsRoomById } from "@/services/analytics";
import { ApiResponse } from "@/types/api";
import { SSEResponse, SSEStatus } from "@/types/openai";
import { Analytic, AnalyticRoom } from "@/types/supabase";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface Props {
  roomId: string;
}
export default function AnalyticsRoom({ roomId }: Readonly<Props>) {
  const queryClient = useQueryClient();
  const { data: room } = useSuspenseQuery({
    queryKey: ["rooms", roomId],
    queryFn: () => getAnalyticsRoomById({ roomId }),
    select: (res) => {
      if (!res.data) throw new Error("Failed to fetch room");
      return res.data;
    },
  });
  const [analytic, setAnalytic] = useState<Analytic | null>(
    room.analytics ?? null
  );
  const [status, setStatus] = useState<SSEStatus>(() => {
    if (room?.analytic_status === "error") return "error";
    if (room?.analytic_status === "completed") return "done";
    return "fetching";
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(
    room?.error_msg ?? null
  );

  const { data, close } = useSSE<ApiResponse<SSEResponse>>({
    url: `/api/v1/analytics/${room?.id}/stream`,
    enabled: room?.analytic_status === "idle",
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
      const { status, analytic, room } = result;
      setStatus(status);
      setErrorMsg(null);
      if (status === "done") close();
      if (analytic) setAnalytic(analytic);
      if (room) {
        queryClient.setQueryData(
          ["rooms"],
          (oldData: ApiResponse<AnalyticRoom[]>) => ({
            ...oldData,
            data: [
              room,
              ...(oldData.data || []).filter((r) => r.id !== room.id),
            ],
          })
        );
        queryClient.setQueryData(
          ["rooms", room.id.toString()],
          (oldData: ApiResponse<AnalyticRoom>) => ({
            ...oldData,
            data: {
              ...oldData.data,
              analytic_status: room.analytic_status,
              error_msg: room.error_msg,
            },
          })
        );
      }
    }
  }, [data, close, queryClient]);
  if (status === "error") return <FetchError errorMsg={errorMsg} />;
  if (status !== "done" || !analytic) {
    return (
      <InitialAnimation
        status={status as Exclude<SSEStatus, "done" | "error">}
      />
    );
  }
  return <AnalyticsResult analytic={analytic} url={room?.url || ""} />;
}
