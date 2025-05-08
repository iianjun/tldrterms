import { getCategories } from "@/services/categories";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (res) => res.data,
  });
  return categories || [];
}
