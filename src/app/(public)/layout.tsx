import PublicHeader from "@/components/layout/header/PublicHeader";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicHeader />
      <main className="@container relative flex h-svh pt-header-h">
        {children}
      </main>
    </>
  );
}
