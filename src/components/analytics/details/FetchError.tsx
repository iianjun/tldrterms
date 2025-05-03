import { ErrorAnimation } from "@/components/animations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { updateRoom } from "@/services/analytics";
import { ApiResponse } from "@/types/api";
import { AnalyticRoom } from "@/types/supabase";
import { contentSchema } from "@/validations/content";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  errorMsg?: string | null;
};

type FormData = z.infer<typeof contentSchema>;
export default function FetchError({ errorMsg }: Props) {
  const params = useParams();
  const roomId = params.roomId;

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      text: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (text: string) => updateRoom({ roomId: Number(roomId), text }),
    onSuccess: ({ data }) => {
      if (!data) return;
      queryClient.setQueryData(
        ["rooms", roomId],
        (oldData: ApiResponse<AnalyticRoom>) => ({
          ...oldData,
          data,
        })
      );
    },
  });
  return (
    <div className="p-4 md:p-24 w-full max-w-3xl mx-auto flex flex-col items-center animate-in fade-in duration-300">
      <Alert variant="destructive" className="mb-6">
        <ErrorAnimation
          id="animation"
          className="absolute ml-4 mt-3 size-10"
          loop={false}
          autoplay
        />
        <AlertTitle className="pl-12">Error</AlertTitle>
        <AlertDescription className="pl-12">{errorMsg}</AlertDescription>
      </Alert>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Enter text directly instead
        </h2>
        <p className="text-muted-foreground">
          You can paste the terms and conditions or privacy policy text directly
          for analysis.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(({ text }) => mutate(text))}
        className="w-full"
      >
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <PromptInput
              value={field.value}
              onValueChange={(value) => {
                field.onChange({
                  target: { value },
                } as React.ChangeEvent<HTMLTextAreaElement>);
              }}
              maxHeight={250}
              isLoading={isPending}
              error={Boolean(errors.text)}
            >
              <PromptInputTextarea placeholder="Paste the terms of service here..." />
              <PromptInputActions className="justify-end pt-2">
                <PromptInputAction tooltip={"Analyze"}>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={isPending}
                    type="submit"
                  >
                    {isPending ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <ArrowUpIcon className="size-5" />
                    )}
                  </Button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>
          )}
        ></Controller>
      </form>
    </div>
  );
}
