"use client";

import { Box } from "@mui/material";
import { flexRender, type Row } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";

type TableBodyPropsType<TRow> = {
  rows: Row<TRow>[];
  isLoading: boolean;
  hasNext: boolean;
  onReachEnd: () => void;
  getRowId: (row: Row<TRow>) => string;

  rowHeight?: number;
  height?: number;
};

export const TableBody = <TRow,>({
  rows,
  isLoading,
  hasNext,
  onReachEnd,
  getRowId,
  rowHeight = 44,
  height = 520,
}: TableBodyPropsType<TRow>) => {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
    // ✅ 핵심: id 기반 키로 안정화 (입력 포커스 유지에 결정적)
    getItemKey: (index) => getRowId(rows[index] as Row<TRow>),
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // 무한 로드 트리거
  useEffect(() => {
    if (!hasNext) return;
    if (isLoading) return;

    const last = virtualItems[virtualItems.length - 1];
    if (!last) return;

    const threshold = 10;
    if (last.index >= rows.length - 1 - threshold) {
      onReachEnd();
    }
  }, [virtualItems, rows.length, hasNext, isLoading, onReachEnd]);

  return (
    <Box
      ref={parentRef}
      sx={{
        height,
        overflow: "auto",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Box sx={{ height: totalSize, position: "relative" }}>
        {virtualItems.map((vRow) => {
          const row = rows[vRow.index];
          if (!row) return null;

          return (
            <Box
              key={vRow.key}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vRow.start}px)`,
                height: rowHeight,
                display: "flex",
                alignItems: "center",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                boxSizing: "border-box",
              }}
            >
              {row.getVisibleCells().map((cell) => {
                const size = cell.column.getSize();
                return (
                  <Box
                    key={cell.id}
                    sx={{
                      width: size,
                      minWidth: size,
                      maxWidth: size,
                      flexShrink: 0,
                      px: 1.5,
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
