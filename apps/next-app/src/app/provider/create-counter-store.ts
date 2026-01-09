"use client";

import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

type CounterState = {
  count: number;
};

type CounterActions = {
  increment: () => void;
  reset: () => void;
};

export type CounterStore = CounterState & CounterActions;

export const defaultInitState: CounterState = {
  count: 0,
};

export const createCounterStore = (
  initState: CounterState = defaultInitState
) =>
  createStore<CounterStore, [["zustand/persist", CounterStore]]>(
    persist<CounterStore>(
      (set) => ({
        ...initState,
        increment: () => set((s) => ({ count: s.count + 1 })),
        reset: () => set({ count: defaultInitState.count }),
      }),
      { name: "counter-store" }
    )
  );
