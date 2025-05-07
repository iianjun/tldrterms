"use client";
import DeleteRoomModal from "@/components/analytics/DeleteRoomModal";
import SearchModal from "@/components/analytics/SearchModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getRooms } from "@/services/analytics";
import { AnalyticRoom } from "@/types/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { groupBy } from "lodash";
import { MoreHorizontalIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function AppSidebar() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["rooms"],
      queryFn: ({ pageParam = 0 }) =>
        getRooms({ offset: pageParam, limit: 10 }),
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
  const params = useParams();
  const roomId = params.roomId;

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openSearch, setOpenSearch] = useState(false);

  const deleteRoom = useMemo(() => {
    if (!deleteId) return null;
    return rooms.find((room) => room.id === deleteId);
  }, [deleteId, rooms]);

  const grouped = useMemo(() => {
    return Object.entries(
      groupBy(rooms, (room) => room.created_at.split("T")[0])
    );
  }, [rooms]);
  return (
    <>
      <Sidebar>
        <SidebarHeader onOpenSearch={() => setOpenSearch(true)} />
        <InfiniteScroll
          data-slot="sidebar-content"
          data-sidebar="content"
          className={
            "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden"
          }
          style={{ height: "100%" }}
          initialItemCount={grouped.length}
          data={grouped}
          onLoadMore={() => {
            if (!hasNextPage || isFetchingNextPage) return;
            fetchNextPage();
          }}
          loading={isFetchingNextPage}
          itemContent={(_, [date, rooms]) => (
            <SidebarGroup key={date}>
              <SidebarGroupLabel>{date}</SidebarGroupLabel>
              <SidebarGroupContent id="sidebarGroupContent">
                <SidebarMenu>
                  {rooms.map((room) => {
                    return (
                      <SidebarMenuItem key={room.id}>
                        <SidebarMenuButton
                          className={cn({
                            "bg-sidebar-focused": String(room.id) === roomId,
                          })}
                          asChild
                        >
                          <Link href={`/analytics/${room.id}`}>
                            <span>{room.title ?? room.url}</span>
                          </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                              <MoreHorizontalIcon />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side="right"
                            align="start"
                            className="w-56"
                          >
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleteId(room.id)}
                            >
                              <TrashIcon size={16} strokeWidth={2} />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        />
      </Sidebar>
      <DeleteRoomModal
        open={typeof deleteId === "number"}
        onOpenChange={() => setDeleteId(null)}
        room={deleteRoom}
      />
      <SearchModal open={openSearch} onOpenChange={setOpenSearch} />
    </>
  );
}
