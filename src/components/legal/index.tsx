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

interface TableProps {
  columns: {
    title: string;
    key: string;
    className?: string;
  }[];
  data: {
    [key: string]: string | string[];
  }[];
  className?: string;
}
export function Table({ columns, data, className }: TableProps) {
  return (
    <table className={cn("w-full", className)}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              className={cn(
                "bg-muted p-2 text-left border border-muted-foreground",
                column.className
              )}
              key={column.key}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td
                className="p-2 border text-left border-muted-foreground text-muted-foreground"
                key={column.key}
              >
                {Array.isArray(row[column.key]) ? (
                  <List className="!ps-0" type="disc">
                    {(row[column.key] as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </List>
                ) : (
                  row[column.key]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
