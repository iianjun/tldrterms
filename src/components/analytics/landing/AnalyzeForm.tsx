"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { createRoom } from "@/services/analytics";
import { urlSchema } from "@/validations/url";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof urlSchema>;
export default function AnalyzeForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "https://hellohealthgroup.com/terms-of-service/",
    },
  });
  const onSubmit = async ({ url }: FormData) => {
    try {
      setLoading(true);
      const { data } = await createRoom({ url });
      if (!data) return;
      router.push(`/analytics/${data}`);
    } catch {
      setLoading(false);
    }
  };
  return (
    <div className="h-full flex-center">
      <div className="flex h-full w-full flex-col items-center gap-6 md:h-auto">
        <h1 className="flex w-full flex-1 flex-col items-center justify-center text-center text-2xl text-primary tracking-tight md:text-3xl">
          Got a terms page?
          <TextShimmer as="span">We’ll make sense of it.</TextShimmer>
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative mb-4 flex w-full max-w-[36rem] md:mb-0"
        >
          <Input
            className={"h-auto py-3 pe-12"}
            type="url"
            error={Boolean(errors.url && touchedFields.url)}
            placeholder="https://example.com/terms"
            {...register("url")}
          />
          <Button
            className="-translate-y-1/2 absolute top-1/2 right-2 size-9 rounded-full"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <ArrowUpIcon className="size-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
