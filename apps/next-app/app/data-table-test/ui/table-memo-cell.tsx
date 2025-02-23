"use client";

import { TextField } from "@mui/material";
import { useEffect, useRef } from "react";

type TableMemoCellPropsType = {
  id: string;
  value: string;
  onCommit: (value: string) => void;
  debounceMs?: number;
};

export const TableMemoCell = ({
  id,
  value,
  onCommit,
  debounceMs = 300,
}: TableMemoCellPropsType) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const lastCommittedRef = useRef<string>(value);

  const clearTimer = () => {
    if (timerRef.current == null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const commit = (next: string) => {
    if (lastCommittedRef.current === next) return;
    lastCommittedRef.current = next;
    onCommit(next);
  };

  const scheduleCommit = (next: string) => {
    clearTimer();
    timerRef.current = window.setTimeout(() => commit(next), debounceMs);
  };

  // ✅ props 변경 시 state가 아니라 "DOM"을 갱신 (effect의 올바른 사용)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const isFocused = document.activeElement === el;
    if (isFocused) return; // 포커스 중이면 건드리지 말기

    el.value = value;
    lastCommittedRef.current = value;
  }, [id, value]);

  useEffect(() => {
    console.log("[memo mount]", id);
    return () => console.log("[memo unmount]", id);
  }, [id]);

  return (
    <TextField
      size="small"
      defaultValue={value} // ✅ uncontrolled 시작값
      inputRef={(node) => {
        inputRef.current = node;
      }}
      onChange={(e) => {
        scheduleCommit(e.target.value);
      }}
      onBlur={() => {
        clearTimer();
        const current = inputRef.current?.value ?? "";
        commit(current); // ✅ blur 시 flush
      }}
      placeholder="메모 입력"
      sx={{ width: "100%", "& .MuiInputBase-root": { height: 32 } }}
    />
  );
};
