"use client";

import { useParams } from "next/navigation";

export default function TabContentPage() {
  const { tab } = useParams();

  return <div>{tab}</div>;
}
