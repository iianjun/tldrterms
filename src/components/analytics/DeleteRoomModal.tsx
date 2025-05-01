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
import { ApiResponse } from "@/types/api";
import { AnalyticRoom } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        (oldData: ApiResponse<AnalyticRoom[]>) => {
          const ret = {
            ...oldData,
            data: oldData.data?.filter(
              (oldRoom) => oldRoom.id !== selectedRoom?.id
            ),
          };
          return ret;
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
