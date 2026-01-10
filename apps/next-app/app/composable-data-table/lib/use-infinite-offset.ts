import { useCallback, useEffect, useRef, useState } from "react";

export type OffsetPageResponseType<TItem> = {
  items: TItem[];
  total: number;
  nextOffset: number | null;
};

type FetchPageType<TItem, TParams> = (args: {
  offset: number;
  limit: number;
  params: TParams;
}) => Promise<OffsetPageResponseType<TItem>>;

type UseInfiniteOffsetParamsType<TItem, TParams> = {
  pageSize: number;
  initialOffset?: number;
  params: TParams;
  depsKey: string; // params 변경 시 리셋 트리거
  fetchPage: FetchPageType<TItem, TParams>;
};

type UseInfiniteOffsetReturnType<TItem> = {
  items: TItem[];
  total: number;
  offset: number;
  isInitialLoading: boolean;
  isFetchingNext: boolean;
  hasNext: boolean;
  canFetchNext: boolean;
  fetchNext: () => void;
  setItems: React.Dispatch<React.SetStateAction<TItem[]>>;
  reset: () => void;
};

export const useInfiniteOffset = <TItem, TParams>({
  pageSize,
  fetchPage,
  initialOffset = 0,
  params,
  depsKey,
}: UseInfiniteOffsetParamsType<
  TItem,
  TParams
>): UseInfiniteOffsetReturnType<TItem> => {
  const [items, setItems] = useState<TItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(initialOffset);
  const [nextOffset, setNextOffset] = useState<number | null>(initialOffset);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const hasNext = nextOffset !== null;
  const canFetchNext = hasNext && !isInitialLoading && !isFetchingNext;

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setItems([]);
    setTotal(0);
    setOffset(initialOffset);
    setNextOffset(initialOffset);
  }, [initialOffset]);

  // depsKey 바뀌면 reset + 첫 페이지 로드
  useEffect(() => {
    reset();
  }, [depsKey, reset]);

  const loadPage = useCallback(
    async (targetOffset: number, mode: "initial" | "next") => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      if (mode === "initial") setIsInitialLoading(true);
      else setIsFetchingNext(true);

      try {
        const res = await fetchPage({
          offset: targetOffset,
          limit: pageSize,
          params,
        });

        setTotal(res.total);
        setOffset(targetOffset);
        setNextOffset(res.nextOffset);

        setItems((prev) =>
          mode === "initial" ? res.items : [...prev, ...res.items],
        );
      } finally {
        if (mode === "initial") setIsInitialLoading(false);
        else setIsFetchingNext(false);
      }
    },
    [fetchPage, pageSize, params],
  );

  // 첫 로드: reset 직후 nextOffset == initialOffset 상태면 initial 로딩
  useEffect(() => {
    if (items.length === 0 && nextOffset === initialOffset) {
      void loadPage(initialOffset, "initial");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey]);

  const fetchNext = useCallback(() => {
    if (!canFetchNext || nextOffset === null) return;
    void loadPage(nextOffset, "next");
  }, [canFetchNext, loadPage, nextOffset]);

  return {
    items,
    total,
    offset,
    isInitialLoading,
    isFetchingNext,
    hasNext,
    canFetchNext,
    fetchNext,
    setItems,
    reset,
  };
};
