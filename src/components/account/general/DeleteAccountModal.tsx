import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DELETION_REASONS } from "@/constants/deletion";
import { useTimeout } from "@/hooks/useTimeout";
import { deleteAccount } from "@/services/users";
import { deletionSchema } from "@/validations/deletion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof deletionSchema>;

export default function DeleteAccountModal() {
  const [showOtherReason, setShowOtherReason] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => deleteAccount(data),
    onSuccess: () => {
      setIsDeleted(true);
      redirect();
    },
  });

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(deletionSchema),
    defaultValues: {
      reasons: [],
      otherReason: "",
    },
  });
  const { start: resetForm } = useTimeout(() => {
    reset({
      reasons: [],
      otherReason: "",
    });
    setShowOtherReason(false);
  }, 200);

  const { start: redirect } = useTimeout(() => {
    window.location.href = "/login";
  }, 2000);

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">I want to delete my account</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} hideClose>
        {isDeleted ? (
          <>
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2Icon className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-xl mb-2">
                We're sorry to see you go
              </DialogTitle>
              <DialogDescription className="text-center mb-4">
                Your account has been deleted
              </DialogDescription>
              <div className="space-y-4">
                <p>
                  Thank you for being with us. Your account and all associated
                  data have been permanently removed.
                </p>
                <p className="text-sm text-muted-foreground">
                  If you'd like to use our services again in the future, you're
                  always welcome to create a new account.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Help us improve</DialogTitle>
              <DialogDescription>
                We value your feedback and are committed to providing the best
                possible experience. Please let us know how we can improve.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={onSubmit}
              className="space-y-4"
              id="delete-account-form"
            >
              <Controller
                name="reasons"
                control={control}
                render={({ field }) => (
                  <CheckboxGroup
                    items={DELETION_REASONS}
                    values={field.value}
                    onValueChange={(values) => {
                      field.onChange(values);
                      setShowOtherReason(values.includes("other"));
                    }}
                  />
                )}
              />
              {showOtherReason && (
                <div className="space-y-2">
                  <Label htmlFor="other-reason">Please specify:</Label>
                  <Textarea
                    id="other-reason"
                    placeholder="Tell us more..."
                    error={Boolean(errors.otherReason)}
                    {...register("otherReason")}
                  />
                </div>
              )}
            </form>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                type="submit"
                form="delete-account-form"
                disabled={isPending}
              >
                {isPending && <Loader2Icon className="animate-spin" />}
                Delete account
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
