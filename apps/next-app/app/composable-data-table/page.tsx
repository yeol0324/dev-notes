"use client";

import { Box, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { DataTable } from "./ui/data-table";

import type { ModifyType, PadRuleType } from "./model/sample-data";
import { usePadRuleTable } from "./use-pad-rule-table";
import { createPadRuleColumns } from "./create-pad-rule-columns";
import { useOptimisticRow } from "./lib/use-optimistic-row";

type PadRulePatchType = Partial<Pick<PadRuleType, "memo" | "modifyType">>;

export default function App() {
  const {
    rows,
    total,
    offset,
    q,
    setQ,
    sorting,
    onSortingChange,
    hasNext,
    fetchNext,
    updateMemo,
    applyPatch,
    getPatch,
    setPatch,
    isFetching,
  } = usePadRuleTable();

  const { isPending, update } = useOptimisticRow<PadRulePatchType>({
    applyPatch,
    getPatch,
    setPatch,
    requestUpdate: async ({ id, patch }) => {
      // ✅ 실제 서버 업데이트로 교체
      // const res = await fetch(`/api/pad-rules/${id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(patch),
      // });
      // if (!res.ok) throw new Error("Failed to update");

      await new Promise((r) => window.setTimeout(r, 300));
      void id;
      void patch;
    },
  });

  const handleModifyType = useCallback(
    ({ id, value }: { id: string; value: ModifyType }) => {
      update({ id, patch: { modifyType: value } });
    },
    [update],
  );

  const handleMemo = useCallback(
    ({ id, value }: { id: string; value: string }) => {
      updateMemo({ id, memo: value });
    },
    [updateMemo],
  );

  const columns = useMemo(
    () =>
      createPadRuleColumns({
        isPending,
        onChangeModifyType: handleModifyType,
        onChangeMemo: handleMemo,
      }),
    [isPending, handleModifyType, handleMemo],
  );
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    onSortingChange,
    manualSorting: true,
  });

  return (
    <Box sx={{ px: 3, py: 4 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption">
            loaded: {rows.length.toLocaleString()} / {total.toLocaleString()}
          </Typography>
          <Typography variant="caption">
            offset: {offset.toLocaleString()}
          </Typography>

          <TextField
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색어"
            sx={{ ml: "auto", width: 240 }}
          />
        </Stack>

        <DataTable<PadRuleType>
          table={table}
          isLoading={isFetching}
          hasNext={hasNext}
          onReachEnd={fetchNext}
          getRowId={(row) => row.original.id}
        />
      </Stack>
    </Box>
  );
}
