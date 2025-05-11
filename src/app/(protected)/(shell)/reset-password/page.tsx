import AuthLayout from "@/components/auth/Layout";
import ResetForm from "@/components/auth/ResetForm";

export default async function ResetPasswordPage() {
  return (
    <main className="@container relative flex h-svh pt-header-h">
      <AuthLayout>
        <ResetForm />
      </AuthLayout>
    </main>
  );
}
