"use client";

import { Box, Stack, Typography } from "@mui/material";
import type { HeaderGroup } from "@tanstack/react-table";

type TableHeadPropsType<TRow> = {
  headerGroups: HeaderGroup<TRow>[];
};

export const TableHead = <TRow,>({
  headerGroups,
}: TableHeadPropsType<TRow>) => {
  return (
    <Stack sx={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      {headerGroups.map((headerGroup) => (
        <Stack
          key={headerGroup.id}
          direction="row"
          sx={{
            height: 44,
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.02)",
          }}
        >
          {headerGroup.headers.map((header) => {
            const size = header.getSize();
            const canResize = header.column.getCanResize();
            const isResizing = header.column.getIsResizing();

            return (
              <Box
                key={header.id}
                sx={{
                  position: "relative",
                  width: size,
                  minWidth: size,
                  maxWidth: size,
                  px: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === "string"
                      ? header.column.columnDef.header
                      : null}
                </Typography>

                {canResize && (
                  <Box
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      height: "100%",
                      width: 8,
                      cursor: "col-resize",
                      touchAction: "none",
                      backgroundColor: isResizing
                        ? "rgba(0,0,0,0.12)"
                        : "transparent",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      ))}
    </Stack>
  );
};
