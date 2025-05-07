import { debounce } from "lodash";
import { Loader2Icon } from "lucide-react";
import { useMemo } from "react";
import { Virtuoso, VirtuosoProps } from "react-virtuoso";

interface Props<D, C> extends Omit<VirtuosoProps<D, C>, "endReached"> {
  onLoadMore?: () => void;
  loading?: boolean;
}
export default function InfiniteScroll<D = any, C = any>({
  onLoadMore,
  components,
  loading,
  ...rest
}: Props<D, C>) {
  const debouncedLog = useMemo(
    () =>
      debounce((container: HTMLDivElement) => {
        if (
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - 100
        ) {
          onLoadMore?.();
        }
      }, 500),
    [onLoadMore]
  );

  return (
    <Virtuoso
      {...rest}
      onScroll={(e) => debouncedLog(e.currentTarget)}
      components={{
        Footer: () =>
          loading && (
            <div className="py-2 flex justify-center">
              <Loader2Icon size={30} className="animate-spin" />
            </div>
          ),
      }}
    />
  );
}
