export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full mx-auto max-w-5xl px-4 md:px-6 py-12 md:py-20">
      {children}
    </main>
  );
}
