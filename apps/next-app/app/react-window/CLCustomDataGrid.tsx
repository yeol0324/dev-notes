"use client";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  type SxProps,
} from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnResizeMode,
  type SortingState,
} from "@tanstack/react-table";
import React from "react";
import { Theme } from "@mui/material/styles";
import { tableSx } from "./style";

type Props<T> = {
  defaultData: T[];
  defaultColumns: ColumnDef<T>[];
  tableCellMinWidth?: number | string;
  sx?: SxProps;
};
function flatSx<T extends Theme = Theme>(
  ...sxArray: Array<SxProps<T> | undefined | null | false>
): SxProps<T> {
  return sxArray
    .filter((it) => !!it) // filter undefined
    .flatMap((sx) => (Array.isArray(sx) ? sx : [sx ?? false]))
    .filter((it) => it !== false);
}

const CLCustomDataGrid = <T,>(props: Props<T>) => {
  const { tableCellMinWidth, defaultColumns, defaultData, sx } = props;

  const [columns] = React.useState<Props<T>["defaultColumns"]>(() => [
    ...defaultColumns,
  ]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnResizeMode] = React.useState<ColumnResizeMode>("onChange");

  const table = useReactTable({
    data: defaultData,
    columns,
    columnResizeMode,
    state: { sorting },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer
      sx={flatSx(
        tableSx,
        {
          width: "100%",
        },
        sx
      )}
      className="CLCustomDataGrid-root"
    >
      <Table
        size="small"
        sx={{
          tableLayout: "fixed",
          "& .MuiTableCell-root": {
            minWidth: tableCellMinWidth,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      >
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() }}
                >
                  {/* resize handle (CSS로 resizer 스타일 잡아줘야 함) */}
                  <Box
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
                    sx={{
                      display: "inline-block",
                      width: 8,
                      height: "100%",
                      cursor: "col-resize",
                      userSelect: "none",
                      touchAction: "none",
                      position: "absolute",
                      right: 0,
                      top: 0,
                    }}
                    style={{
                      transform:
                        columnResizeMode === "onEnd" &&
                        header.column.getIsResizing()
                          ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
                          : undefined,
                    }}
                  />

                  {/* header content */}
                  <Box
                    sx={{
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      userSelect: "none",
                      position: "relative",
                      pr: 1,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {({ asc: " ⬆", desc: " ⬇" } as const)[
                      header.column.getIsSorted() as "asc" | "desc"
                    ] ?? null}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} hover>
              {row.getVisibleCells().map((cell) => {
                const valueText = String(cell.getValue() ?? "");
                const needTooltip = valueText.length > 20;

                return (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {needTooltip ? (
                      <Tooltip arrow title={valueText}>
                        {/* Tooltip은 TableCell 밖으로 나가면 테이블 구조 깨짐 → 내부 콘텐츠에만 적용 */}
                        <Box
                          component="span"
                          sx={{ display: "inline-block", width: "100%" }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Box>
                      </Tooltip>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CLCustomDataGrid;
