import { User } from "@supabase/supabase-js";
import { createStore } from "zustand";

type UserState = {
  user?: User | null;
};
type UserActions = {
  setUser: (user: User) => void;
};

export type UserStore = UserState & UserActions;

export const defaultUserState: UserState = {
  user: null,
};
export const createUserStore = (initialState: UserState = defaultUserState) => {
  return createStore<UserStore>()((set) => ({
    ...initialState,
    setUser: (user: User) => set({ user }),
  }));
};
