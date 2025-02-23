'use client';

import {
  Box,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';

import type { ModifyType, PadRuleType } from './model/sample-data';
import { usePadRuleTable } from './use-pad-rule-table';
import { createPadRuleColumns } from './create-pad-rule-columns';
import { useOptimisticRow } from './lib/use-optimistic-row';

type PadRulePatchType = Partial<Pick<PadRuleType, 'memo' | 'modifyType'>>;

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
            sx={{ ml: 'auto', width: 240 }}
          />
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: header.column.getCanSort()
                              ? 'pointer'
                              : 'default',
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Infinite Scroll Sentinel */}
        <Box
          ref={(node: HTMLDivElement | null) => {
            if (!node || isFetching || !hasNext) return;
            const observer = new IntersectionObserver(
              (entries) => {
                if (entries[0].isIntersecting) {
                  fetchNext();
                }
              },
              { threshold: 1.0 },
            );
            observer.observe(node);
            return () => observer.disconnect();
          }}
          sx={{ height: 20, textAlign: 'center', py: 2 }}
        >
          {isFetching ? <Typography>Loading...</Typography> : null}
        </Box>
      </Stack>
    </Box>
  );
}
