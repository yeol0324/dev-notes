import { useCallback, useMemo, useState } from "react";

import { useInfiniteOffset } from "./lib/use-infinite-offset";
import { useServerSorting } from "./lib/use-sorting";

import { fetchPadRules } from "./model/fetch-pad-rules";
import type { PadRuleType } from "./model/sample-data";
import { useRowPatch } from "./lib/use-row-patch";

const PAGE_SIZE = 50;

type PadRulePatchType = Partial<Pick<PadRuleType, "memo" | "modifyType">>;

type UsePadRuleTableReturnType = {
  rows: PadRuleType[];
  total: number;
  offset: number;

  q: string;
  setQ: (next: string) => void;

  sorting: ReturnType<typeof useServerSorting>["sorting"];
  onSortingChange: ReturnType<typeof useServerSorting>["onSortingChange"];

  isLoading: boolean;
  hasNext: boolean;
  fetchNext: () => void;

  // local patch
  updateMemo: (args: { id: string; memo: string }) => void;

  // expose for optimistic
  applyPatch: (args: { id: string; patch: PadRulePatchType }) => void;
  getPatch: (id: string) => PadRulePatchType | undefined;
  setPatch: (args: { id: string; patch: PadRulePatchType | undefined }) => void;

  isFetching: boolean;
};

export const usePadRuleTable = (): UsePadRuleTableReturnType => {
  const [q, setQ] = useState("");

  const sortingHook = useServerSorting({ initial: [] });

  const params = useMemo(
    () => ({
      q,
      sort: sortingHook.sortParam,
    }),
    [q, sortingHook.sortParam],
  );

  const depsKey = useMemo(() => JSON.stringify(params), [params]);

  const {
    items,
    setItems,
    total,
    offset,
    hasNext,
    fetchNext,
    isInitialLoading,
    isFetchingNext,
  } = useInfiniteOffset<PadRuleType, typeof params>({
    pageSize: PAGE_SIZE,
    fetchPage: fetchPadRules, // ✅ 그대로 사용
    initialOffset: 0,
    params,
    depsKey,
  });

  // ✅ patch layer
  const patch = useRowPatch<PadRuleType, PadRulePatchType>({
    rows: items,
  });

  const updateMemo = useCallback(
    (args: { id: string; memo: string }) => {
      setItems((prev) =>
        prev.map((r) => (r.id === args.id ? { ...r, memo: args.memo } : r)),
      );
    },
    [setItems],
  );
  const isFetching = isInitialLoading || isFetchingNext;

  return {
    rows: patch.viewRows,
    total: total,
    offset: offset,
    q,
    setQ,
    sorting: sortingHook.sorting,
    onSortingChange: sortingHook.onSortingChange,
    isLoading: isInitialLoading || isFetchingNext,
    hasNext: hasNext,
    fetchNext: fetchNext,
    updateMemo,

    applyPatch: patch.applyPatch,
    getPatch: patch.getPatch,
    setPatch: patch.setPatch,

    isFetching,
  };
};
