"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteRoom } from "@/services/analytics";
import { Pagination } from "@/types/api";
import { AnalyticRoom } from "@/types/supabase";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: AnalyticRoom | null;
}
function DeleteRoomModal({ open, onOpenChange, room: selectedRoom }: Props) {
  const params = useParams();
  const currentRoomId = params.roomId;
  const router = useRouter();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (roomId: number) => deleteRoom({ roomId }),
    onSuccess: () => {
      onOpenChange(false);
      queryClient.setQueryData(
        ["rooms"],
        (oldData: InfiniteData<Pagination<AnalyticRoom[]>>) => {
          if (!oldData) {
            return { pages: [], pageParams: [] };
          }
          const allPages = oldData.pages
            .flatMap((page) => page.data || [])
            .filter((room) => room.id !== selectedRoom?.id);
          const limit = oldData.pages[0].pagination.limit;
          const ret: Pagination<AnalyticRoom[]>[] = [];
          const total = allPages.length - 1;
          for (let i = 0; i < Math.ceil(allPages.length / limit); i++) {
            const offset = i * limit;
            ret.push({
              ...oldData.pages[i],
              data: allPages.slice(offset, offset + limit),
              pagination: {
                offset,
                limit,
                total,
                hasNext: offset + 1 < Math.ceil((total || 0) / limit),
              },
            });
          }
          return {
            ...oldData,
            pages: ret,
          };
        }
      );
      if (Number(currentRoomId) === selectedRoom?.id) {
        router.push("/analytics");
      }
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete terms?</AlertDialogTitle>
          <p>
            This will delete{" "}
            <strong>{selectedRoom?.title ?? selectedRoom?.url}</strong> terms.
          </p>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (!selectedRoom?.id) return;
              mutate(selectedRoom.id);
            }}
            variant="destructive"
          >
            {isPending && <Loader2Icon className="animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteRoomModal;
