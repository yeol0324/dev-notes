"use client";

import {
  Box,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import CLCustomDataGrid from "./CLCustomDataGrid";
import {
  SAMPLE_PAD_RULE,
  type SamplePadRule,
  getSamplePage,
  PAGE_SIZE,
  TOTAL_COUNT,
} from "./sample-data";
import { rootSx } from "./style";
import { Loading } from "@/shared/ui/loading";

const App = () => {
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<SamplePadRule[]>(() => SAMPLE_PAD_RULE);
  const [offset, setOffset] = useState<number>(() => SAMPLE_PAD_RULE.length);
  const loadingRef = useRef(false);
  const updateModifyType = (rowIndex: number, value: "반영" | "미반영") => {
    setData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, modifyType: value } : row
      )
    );
  };
  const updateMemo = (rowIndex: number, value: string) => {
    setData((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, memo: value } : row))
    );
  };
  // (기존 로직 그대로)
  const sampleArray: string[] = Array(20).fill("1");
  const allCheckedHandle = (checked: boolean) => {
    if (checked) setCheckedList(sampleArray.map((_, idx) => idx));
    else setCheckedList([]);
  };
  const checkHandle = (idx: number, checked: boolean) => {
    if (checked) setCheckedList((p) => [...p, idx]);
    else setCheckedList((p) => p.filter((el) => el !== idx));
  };

  const defaultColumns: ColumnDef<SamplePadRule>[] = useMemo(
    () => [
      {
        header: "카드번호",
        isResizing: true,
        size: 100,
        accessorKey: "cardNum",
        cell: (d) => (
          <Typography sx={{ textAlign: "center" }}>
            {String(d.getValue() ?? "")}
          </Typography>
        ),
      },
      {
        isResizing: true,
        size: 100,
        header: "국내외여부",
        accessorKey: "koreanType",
        cell: (d) => (
          <Typography sx={{ textAlign: "center" }}>
            {String(d.getValue() ?? "")}
          </Typography>
        ),
      },
      {
        header: "승인금액",
        isResizing: true,
        size: 100,
        accessorKey: "money",
        cell: (d) => (
          <Typography sx={{ textAlign: "right" }}>
            {String(d.getValue() ?? "")}
          </Typography>
        ),
      },
      {
        header: "종료일",
        accessorKey: "endDate",
        isResizing: true,
        size: 100,
        cell: (d) => (
          <Typography sx={{ textAlign: "center" }}>
            {String(d.getValue() ?? "")}
          </Typography>
        ),
      },
      {
        header: "적용여부",
        accessorKey: "commitType",
        isResizing: true,
        size: 100,
        cell: (d) => (
          <Typography sx={{ textAlign: "center" }}>
            {String(d.getValue() ?? "")}
          </Typography>
        ),
      },
      {
        header: "수정반영여부",
        accessorKey: "modifyType",
        cell: ({ row, getValue }) => (
          <Select
            size="small"
            value={String(getValue() ?? "") as "반영" | "미반영"}
            onChange={(e) =>
              updateModifyType(row.index, e.target.value as "반영" | "미반영")
            }
            sx={{ width: "100%", height: 32 }}
          >
            <MenuItem value="반영">반영</MenuItem>
            <MenuItem value="미반영">미반영</MenuItem>
          </Select>
        ),
      },
      {
        header: "메모",
        accessorKey: "memo",
        cell: ({ row, getValue }) => (
          <TextField
            size="small"
            value={String(getValue() ?? "")}
            onChange={(e) => updateMemo(row.index, e.target.value)}
            placeholder="메모 입력"
            sx={{
              width: "100%",
              "& .MuiInputBase-root": { height: 32 },
            }}
          />
        ),
      },

      {
        header: "수정일자",
        accessorKey: "modifyDate",
        isResizing: true,
        size: 100,
        cell: (d) => (
          <Typography sx={{ textAlign: "center" }}>
            {String(d.getValue() ?? "")}
          </Typography>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    const el = document.querySelector<HTMLDivElement>(".CLCustomDataGrid-root");
    if (!el) return;

    const onScroll = async () => {
      if (loadingRef.current) return;
      if (offset >= TOTAL_COUNT) return;

      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 200;
      if (!nearBottom) return;

      loadingRef.current = true;
      setIsLoading(true);

      // (선택) 로딩이 눈에 보이게
      await new Promise((r) => window.setTimeout(r, 80));

      const next = getSamplePage(offset, PAGE_SIZE);

      setData((prev) => prev.concat(next));
      setOffset((prev) => prev + next.length);

      // ✅ DOM 반영(스크롤 높이 증가)까지 기다렸다가 잠금 해제
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsLoading(false);
          loadingRef.current = false;
        });
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [offset]);

  return (
    <Box sx={rootSx} className="CmpDocSortTable-root">
      <Box className="CmpDocSortTable-container">
        <Stack spacing={3} sx={{ ml: 3, my: 4 }}>
          <Typography variant="h6">HEAD 부분 클릭시 정렬가능합니다.</Typography>
          <Typography variant="caption">
            loaded: {data.length.toLocaleString()} /{" "}
            {TOTAL_COUNT.toLocaleString()}
          </Typography>

          <CLCustomDataGrid
            sx={{ height: 300 }}
            tableCellMinWidth="50px"
            defaultColumns={defaultColumns}
            defaultData={data}
          />
        </Stack>
      </Box>
      {isLoading && <Loading />}
    </Box>
  );
};

export default App;
