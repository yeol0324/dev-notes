import { useCallback, useMemo, useState } from "react";

type IdType = string;

export type RowPatchMapType<TPatch> = Record<IdType, TPatch>;

type UseRowPatchParamsType<
  TRow extends { id: IdType },
  TPatch extends Partial<TRow>,
> = {
  rows: TRow[];
};

type UseRowPatchReturnType<
  TRow extends { id: IdType },
  TPatch extends Partial<TRow>,
> = {
  viewRows: TRow[];
  applyPatch: (args: { id: IdType; patch: TPatch }) => void;
  getPatch: (id: IdType) => TPatch | undefined;
  setPatch: (args: { id: IdType; patch: TPatch | undefined }) => void;
  clearPatch: (id: IdType) => void;
};

export const useRowPatch = <
  TRow extends { id: IdType },
  TPatch extends Partial<TRow>,
>({
  rows,
}: UseRowPatchParamsType<TRow, TPatch>): UseRowPatchReturnType<
  TRow,
  TPatch
> => {
  const [patchMap, setPatchMap] = useState<RowPatchMapType<TPatch>>({});

  const applyPatch = useCallback((args: { id: IdType; patch: TPatch }) => {
    setPatchMap((prev) => ({
      ...prev,
      [args.id]: { ...(prev[args.id] ?? ({} as TPatch)), ...args.patch },
    }));
  }, []);

  const getPatch = useCallback((id: IdType) => patchMap[id], [patchMap]);

  const setPatch = useCallback(
    (args: { id: IdType; patch: TPatch | undefined }) => {
      setPatchMap((prev) => {
        const next = { ...prev };
        if (!args.patch) {
          delete next[args.id];
          return next;
        }
        next[args.id] = args.patch;
        return next;
      });
    },
    [],
  );

  const clearPatch = useCallback((id: IdType) => {
    setPatchMap((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const viewRows = useMemo(() => {
    if (Object.keys(patchMap).length === 0) return rows;

    return rows.map((r) => {
      const p = patchMap[r.id];
      return p ? ({ ...r, ...p } as TRow) : r;
    });
  }, [rows, patchMap]);

  return { viewRows, applyPatch, getPatch, setPatch, clearPatch };
};
