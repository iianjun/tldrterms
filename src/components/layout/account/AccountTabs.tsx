"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const TABS = [{ id: "general", label: "General" }];
export default function AccountTabs() {
  const { tab } = useParams<{ tab: string }>();
  return (
    <div className="mt-2 overflow-auto">
      <div className="flex">
        <ul role="menu" className="flex gap-5">
          {TABS.map((ele) => (
            <li
              aria-selected={tab === ele.id}
              data-state={tab === ele.id ? "active" : "inactive"}
              key={ele.id}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground data-[state=active]:border-foreground border-b-2 border-transparent *:py-1.5 font-medium"
            >
              <Link href={`/account/${ele.id}`}>{ele.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
