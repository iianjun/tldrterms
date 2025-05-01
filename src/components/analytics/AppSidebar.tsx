"use client";
import DeleteRoomModal from "@/components/analytics/DeleteRoomModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { useQuery } from "@tanstack/react-query";
import { groupBy } from "lodash";
import { MoreHorizontalIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function AppSidebar() {
  const { data } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
  const rooms = data?.data || [];

  const params = useParams();
  const roomId = params.roomId;

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteRoom = useMemo(() => {
    if (!deleteId) return null;
    return rooms.find((room) => room.id === deleteId);
  }, [deleteId, rooms]);

  const grouped = useMemo(() => {
    return groupBy(rooms, (room) => room.created_at.split("T")[0]);
  }, [rooms]);
  return (
    <>
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          {Object.entries(grouped).map(([date, rooms]) => (
            <SidebarGroup key={date}>
              <SidebarGroupLabel>{date}</SidebarGroupLabel>
              <SidebarGroupContent>
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
          ))}
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <DeleteRoomModal
        open={typeof deleteId === "number"}
        onOpenChange={() => setDeleteId(null)}
        room={deleteRoom}
      />
    </>
  );
}
