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
import { createClient } from "@/lib/supabase/client";
import { profileSchema } from "@/validations/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormData = z.infer<typeof profileSchema>;
export default function ProfileInformation() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const { register, reset, watch, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.user_metadata.name || "",
    },
  });
  const name = watch("name");
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          data: {
            name: data.name,
            full_name: data.name,
          },
        });
        if (error) {
          return toast.error(error.message);
        }
        toast.success("Profile updated successfully!");
        if (user) {
          setUser({
            ...user,
            user_metadata: {
              ...user.user_metadata,
              full_name: data.name,
              name: data.name,
            },
          });
        }
        setLoading(false);
      })}
    >
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
          <Button disabled={!name || loading} type="submit">
            {loading && <Loader2Icon className="animate-spin" />}
            Save
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
