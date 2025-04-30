"use client";

import { CategoryStore, createCategoryStore } from "@/stores/category-store";
import { Category } from "@/types/supabase";
import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export type CategoryStoreApi = ReturnType<typeof createCategoryStore>;

export const CategoryStoreContext = createContext<CategoryStoreApi | undefined>(
  undefined
);

export interface CategoryStoreProviderProps {
  children: ReactNode;
  categories?: Category[] | null;
}

export const CategoryStoreProvider = ({
  children,
  categories,
}: CategoryStoreProviderProps) => {
  const storeRef = useRef<CategoryStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createCategoryStore({ categories: categories ?? [] });
  }

  return (
    <CategoryStoreContext.Provider value={storeRef.current}>
      {children}
    </CategoryStoreContext.Provider>
  );
};

export const useCategoryStore = <T,>(
  selector: (store: CategoryStore) => T
): T => {
  const userStoreContext = useContext(CategoryStoreContext);

  if (!userStoreContext) {
    throw new Error(`useUserStore must be used within UserStoreProvider`);
  }

  return useStore(userStoreContext, selector);
};
