import pluralize from "pluralize";
import { useMemo } from "react";

export function usePluralize({
  word,
  count,
  inclusive = false,
}: { word: string; count: number; inclusive?: boolean }): string {
  return useMemo(() => {
    const result = pluralize(word, count);
    return inclusive ? `${count} ${result}` : result;
  }, [word, count, inclusive]);
}
