import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import { updateProfile } from "@/services/users";
import { UpdateUserValues } from "@/types/api/user";
import { profileSchema } from "@/validations/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfileInformation() {
  const { user, updateUser } = useUser();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateUserValues) => updateProfile(data),
    onSuccess: ({ data }) => {
      toast.success("Profile updated successfully!");
      updateUser({
        user_metadata: {
          full_name: data?.name,
          name: data?.name,
        },
      });
    },
  });
  const { register, reset, watch, handleSubmit } = useForm<UpdateUserValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.user_metadata.name || "",
    },
  });
  const name = watch("name");
  return (
    <form onSubmit={handleSubmit((data) => mutate(data))}>
      <Card className="bg-muted py-4 gap-4">
        <CardHeader className="border-b pb-4">
          <CardTitle variant="h2">Profile information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid md:grid-cols-12 space-y-0">
            <Label className="col-span-4 text-muted-foreground" htmlFor="name">
              Name
            </Label>
            <Input className="col-span-8" {...register("name")} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            disabled={!name}
            variant="outline"
            type="button"
            onClick={() =>
              reset({
                name: user?.user_metadata.name || "",
              })
            }
          >
            Cancel
          </Button>
          <Button disabled={!name || isPending} type="submit">
            {isPending && <Loader2Icon className="animate-spin" />}
            Save
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
