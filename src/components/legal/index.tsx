import { cn } from "@/lib/utils";

export function Paragraph({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-muted-foreground leading-7", className)}>
      {children}
    </p>
  );
}

export function SectionHeader({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "text-2xl font-semibold tracking-tight text-foreground",
        className
      )}
    >
      {children}
    </h2>
  );
}
export function List({
  children,
  type,
  className,
}: {
  children: React.ReactNode;
  type: "decimal" | "disc";
  className?: string;
}) {
  const $Element = type === "decimal" ? "ol" : "ul";
  return (
    <$Element
      className={cn(
        "list-inside md:ps-10 text-muted-foreground [&>li]:leading-7",
        className,
        {
          "list-decimal": type === "decimal",
          "list-disc": type === "disc",
        }
      )}
    >
      {children}
    </$Element>
  );
}

export function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4 md:space-y-6", className)}>
      {children}
    </section>
  );
}
