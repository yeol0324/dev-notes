import { TextField, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";

import { TableSelectCell } from "./ui/table-select-cell";
import type { ModifyType, PadRuleType } from "./model/sample-data";
import { TableMemoCell } from "./ui/table-memo-cell";

type CreatePadRuleColumnsParamsType = {
  isPending: (id: string) => boolean;
  onChangeModifyType: (args: { id: string; value: ModifyType }) => void;
  onChangeMemo: (args: { id: string; value: string }) => void;
};

export const createPadRuleColumns = ({
  isPending,
  onChangeModifyType,
  onChangeMemo,
}: CreatePadRuleColumnsParamsType): ColumnDef<PadRuleType>[] => {
  return [
    {
      accessorKey: "modifyType",
      header: "상태",
      size: 160,
      cell: ({ row, getValue }) => {
        const id = row.original.id;
        return (
          <TableSelectCell<ModifyType>
            id={`modifyType-${id}`}
            value={String(getValue() ?? "미반영") as ModifyType}
            options={[
              { value: "반영", label: "반영" },
              { value: "미반영", label: "미반영" },
            ]}
            disabled={isPending(id)}
            onChange={(next) => onChangeModifyType({ id, value: next })}
          />
        );
      },
    },
    {
      header: "메모",
      accessorKey: "memo",
      size: 260,
      cell: ({ row, getValue }) => {
        const id = row.original.id;
        return (
          <TableMemoCell
            id={id}
            value={String(getValue() ?? "")}
            onCommit={(value) => onChangeMemo({ id, value })}
          />
        );
      },
    },

    {
      header: "수정일자",
      accessorKey: "modifyDate",
      size: 140,
      cell: (d) => (
        <Typography sx={{ textAlign: "center", width: "100%" }}>
          {String(d.getValue() ?? "")}
        </Typography>
      ),
    },
  ];
};
