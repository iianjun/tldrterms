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
import { AnalyticRoom } from "@/types/supabase";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: AnalyticRoom | null;
}
function DeleteRoomModal({ open, onOpenChange, room }: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: (roomId: number) => deleteRoom({ roomId }),
    onSuccess: () => {
      onOpenChange(false);
      if (Number(roomId) === room?.id) {
        router.push("/analytics");
      }
    },
  });
  const params = useParams();
  const roomId = params.roomId;
  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete terms?</AlertDialogTitle>
          <p>
            This will delete <strong>{room?.title ?? room?.url}</strong> terms.
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
              if (!room?.id) return;
              mutate(room.id);
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
