"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { urlSchema } from "@/validations/url";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof urlSchema>;
export default function AnalyzeForm() {
  // const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });
  const onSubmit = async ({}: FormData) => {
    try {
      // setLoading(true);
      // await getAnalyzeResult({ url });
    } finally {
      // setLoading(false);
    }
  };
  return (
    <div className="h-full flex-center">
      <div className="flex @md:h-auto h-full w-full flex-col items-center gap-6">
        <h1 className="flex w-full flex-1 flex-col items-center justify-center text-center @md:text-3xl text-2xl text-primary tracking-tight">
          Got a terms page?
          <TextShimmer as="span">I’ll make sense of it.</TextShimmer>
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative @md:mb-0 mb-4 flex w-full max-w-[36rem]"
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
          >
            <ArrowUpIcon className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
