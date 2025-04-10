"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { urlSchema } from "@/validations/url";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof urlSchema>;
export default function LandingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(urlSchema),
  });
  const onSubmit = (_: FormData) => {
    // TODO: Handle form submission
    // console.log(values);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
    >
      <div className="relative flex-1">
        <Input
          className={cn("ps-15 text-sm", {
            "border-red-400": errors.url && touchedFields.url,
          })}
          error={Boolean(errors.url && touchedFields.url)}
          placeholder="google.com"
          type="text"
          {...register("url")}
        />
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground text-sm peer-disabled:opacity-50">
          https://
        </span>
      </div>
      <Button type="submit">Analyze</Button>
    </form>
  );
}
