import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";

type UseServerSortingParamsType = {
  initial?: SortingState;
};

export type ApiSortType = {
  field: string;
  direction: "asc" | "desc";
} | null;

type UseServerSortingReturnType = {
  sorting: SortingState;
  onSortingChange: (
    updater: SortingState | ((prev: SortingState) => SortingState),
  ) => void;
  sortParam: ApiSortType;
};

export const useServerSorting = ({
  initial = [],
}: UseServerSortingParamsType = {}): UseServerSortingReturnType => {
  const [sorting, setSorting] = useState<SortingState>(initial);

  const onSortingChange: UseServerSortingReturnType["onSortingChange"] = (
    updater,
  ) => {
    setSorting((prev) =>
      typeof updater === "function" ? updater(prev) : updater,
    );
  };

  const sortParam: ApiSortType =
    sorting.length === 0
      ? null
      : {
          field: sorting[0]?.id ?? "",
          direction: sorting[0]?.desc ? "desc" : "asc",
        };

  return { sorting, onSortingChange, sortParam };
};
