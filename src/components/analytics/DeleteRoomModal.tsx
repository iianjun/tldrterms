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
import { Loader2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: AnalyticRoom | null;
}
function DeleteRoomModal({ open, onOpenChange, room }: Props) {
  const params = useParams();
  const roomId = params.roomId;
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleDeleteRoom = async () => {
    if (!room) return;
    setLoading(true);
    await deleteRoom({ roomId: room.id });
    setLoading(false);
    onOpenChange(false);
    if (Number(roomId) === room.id) {
      router.push("/analytics");
    }
  };
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
              handleDeleteRoom();
            }}
            variant="destructive"
          >
            {loading && <Loader2Icon className="animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteRoomModal;
