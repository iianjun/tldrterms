import { Category } from "@/types/supabase";
import { createStore } from "zustand";

type CategoryState = {
  categories: Category[];
};

export type CategoryStore = CategoryState;

export const defaultCategoryState: CategoryState = {
  categories: [],
};
export const createCategoryStore = (
  initialState: CategoryState = defaultCategoryState
) => {
  return createStore<CategoryStore>()(() => ({
    ...initialState,
  }));
};
