"use client";

import { Stack } from "@mui/material";
import type { Row, Table as TanTable } from "@tanstack/react-table";

import { TableHead } from "./table-head";
import { TableBody } from "./table-body";

type DataTablePropsType<TRow> = {
  table: TanTable<TRow>;
  isLoading: boolean;
  hasNext: boolean;
  onReachEnd: () => void;
  getRowId: (row: Row<TRow>) => string;
};

export const DataTable = <TRow,>({
  table,
  isLoading,
  hasNext,
  onReachEnd,
  getRowId,
}: DataTablePropsType<TRow>) => {
  return (
    <Stack spacing={0}>
      <TableHead headerGroups={table.getHeaderGroups()} />
      <TableBody<TRow>
        rows={table.getRowModel().rows}
        isLoading={isLoading}
        hasNext={hasNext}
        onReachEnd={onReachEnd}
        getRowId={getRowId}
      />
    </Stack>
  );
};
