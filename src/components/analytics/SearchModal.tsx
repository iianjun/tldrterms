import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { getRooms } from "@/services/analytics";
import { AnalyticRoom } from "@/types/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { groupBy } from "lodash";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["rooms", debouncedSearch],
      queryFn: ({ pageParam = 0 }) =>
        getRooms({ offset: pageParam, limit: 10, search: debouncedSearch }),
      getNextPageParam: (lastPage) =>
        lastPage.pagination.hasNext
          ? lastPage.pagination.offset + 1
          : undefined,
      initialPageParam: 0,
    });
  const rooms = useMemo(() => {
    return (
      (data?.pages
        .flatMap((page) => page.data)
        .filter(Boolean) as AnalyticRoom[]) ?? []
    );
  }, [data]);
  const grouped = useMemo(() => {
    return Object.entries(
      groupBy(rooms, (room) => room.created_at.split("T")[0])
    );
  }, [rooms]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type to search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList
        className="h-full"
        onScroll={(e) => {
          const list = e.currentTarget;
          if (
            list.scrollTop + list.clientHeight >= list.scrollHeight &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
            fetchNextPage();
          }
        }}
      >
        {isLoading && (
          <div>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="py-3 px-2 flex items-center gap-2">
                <Skeleton className="size-4 rounded-md" />
                <Skeleton className="h-4 w-full flex-1" />
              </div>
            ))}
          </div>
        )}
        {!isLoading && !grouped.length && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {grouped.map(([date, rooms]) => (
          <CommandGroup key={date} heading={date} forceMount>
            {rooms.map((room) => (
              <CommandItem
                key={room.id}
                value={room.id.toString()}
                onSelect={() => onOpenChange(false)}
                asChild
              >
                <Link href={`/analytics/${room.id}`}>
                  <span>{room.title ?? room.url}</span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        {isFetchingNextPage && (
          <div className="py-2 flex justify-center">
            <Loader2Icon size={30} className="animate-spin" />
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
