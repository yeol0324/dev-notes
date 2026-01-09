"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand";
import type { CounterStore } from "./create-counter-store";
import { createCounterStore } from "./create-counter-store";

export type CounterStoreApi = StoreApi<CounterStore>;

export const CounterStoreContext = createContext<CounterStoreApi | null>(null);

export const CounterStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [store] = useState<CounterStoreApi>(() => createCounterStore());

  return (
    <CounterStoreContext.Provider value={store}>
      {children}
    </CounterStoreContext.Provider>
  );
};

export const useCounterStore = <T,>(selector: (s: CounterStore) => T): T => {
  const store = useContext(CounterStoreContext);
  if (!store) {
    throw new Error("useCounterStore must be used within CounterStoreProvider");
  }
  return useStore(store, selector);
};
