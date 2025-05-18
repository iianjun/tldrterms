import { useCallback, useEffect, useRef } from "react";

export function useTimeout(callback: () => void, delay: number) {
  const cb = useRef(callback);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    cb.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      cb.current();
    }, delay);
  }, [delay]);

  const cancel = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  return {
    start,
    cancel,
  };
}
