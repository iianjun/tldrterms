"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAnalyzeResult } from "@/services/terms";
import { urlSchema } from "@/validations/url";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
type FormData = z.infer<typeof urlSchema>;
export default function LandingForm() {
  const [loading, setLoading] = useState(false);
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
  const onSubmit = async ({ url }: FormData) => {
    try {
      setLoading(true);
      await getAnalyzeResult({ url });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-80 flex-col gap-2 sm:w-auto sm:min-w-80 sm:flex-row"
    >
      <Input
        className={"text-sm"}
        type="url"
        error={Boolean(errors.url && touchedFields.url)}
        placeholder="https://google.com"
        {...register("url")}
      />
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Analyze"}
      </Button>
    </form>
  );
}

// "### 📌 Key Points
// - Recraft Inc. provides services through its website, requiring user registration.
// - Users must comply with the Terms of Service and the Privacy Policy.
// - Services include a Free Tier (limited access) and a paid subscription model.
// - Users are responsible for their account security and any activity conducted on their accounts.
// - Disputes are to be resolved through arbitration, with a class action waiver.

// ### 👤 Data Collected
// - Personal information such as username, email, and any additional information users choose to provide during registration.
// - User-generated content, including prompts and Assets created using the Services.

// ### 🕒 Retention Period
// - User data may be retained as long as the user maintains an account, but may be deleted upon account termination.
// - No specific retention period is mentioned for user data after account deletion.

// ### 🚫 Risks
// - Users may face termination of service for violations of the Terms.
// - There is no guarantee of uptime or availability of the Services.
// - Users are liable for any legal claims arising from their use of the Services or Assets.

// ### Additional Notes
// - Users must not use the Services for illegal activities or to infringe on others' rights.
// - All intellectual property rights in the Services and generated Assets are owned by Recraft, with specific licensing terms for Free Tier and paid users."
