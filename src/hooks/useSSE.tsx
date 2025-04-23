"use client";
import { useMounted } from "@/hooks/useMounted";
import {} from "@/types/openai";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseSSEResult<T> {
  data: T | null;
  error: string | null;
  readyState: EventSource["readyState"];
  close: () => void;
}

export interface Params {
  url: string;
  enabled?: boolean;
}
export function useSSE<T = any>({
  url,
  enabled = true,
}: Params): UseSSEResult<T> {
  const mounted = useMounted();

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [readyState, setReadyState] = useState<EventSource["readyState"]>(
    mounted ? EventSource.CLOSED : 2
  );
  const esRef = useRef<EventSource | null>(null);

  const close = useCallback(() => {
    esRef.current?.close();
    setReadyState(EventSource.CLOSED);
  }, []);

  useEffect(() => {
    if (!enabled || !mounted) {
      close();
      return;
    }

    const es = new EventSource(url);
    esRef.current = es;
    setReadyState(es.readyState);
    es.onopen = () => {
      setReadyState(es.readyState);
    };
    es.onmessage = (e: MessageEvent) => {
      try {
        setData(JSON.parse(e.data));
      } catch (e) {
        console.error(e);
      }
    };
    es.onerror = () => {
      setError("SSE connection error");
      setReadyState(es.readyState);
      es.close();
    };

    return () => {
      close();
    };
  }, [url, enabled, close, mounted]);

  return { data, error, readyState, close };
}
