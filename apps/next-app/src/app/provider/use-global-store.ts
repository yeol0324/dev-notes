import { create } from "zustand";

interface GlobalStore {
  count: number;
  increment: () => void;
  reset: () => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
