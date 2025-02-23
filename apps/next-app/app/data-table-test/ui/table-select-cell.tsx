"use client";

import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { useId, useMemo } from "react";

type SelectOptionType<TValue extends string> = {
  value: TValue;
  label: string;
};

type TableSelectCellPropsType<TValue extends string> = {
  id?: string;
  value: TValue;
  options: ReadonlyArray<SelectOptionType<TValue>>;
  disabled?: boolean;
  onChange: (next: TValue) => void;
};

export const TableSelectCell = <TValue extends string>({
  id,
  value,
  options,
  disabled = false,
  onChange,
}: TableSelectCellPropsType<TValue>) => {
  const autoId = useId();
  const selectId = useMemo(() => id ?? `table-select-${autoId}`, [autoId, id]);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const next = e.target.value;

    // 방어: options에 없는 값이 들어오면 무시
    const exists = options.some((opt) => opt.value === next);
    if (!exists) return;

    onChange(next as TValue);
  };

  return (
    <Select
      id={selectId}
      size="small"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      fullWidth
      sx={{
        height: 32,
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          py: 0,
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: { maxHeight: 320 },
        },
      }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
};
