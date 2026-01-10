import { useCallback, useRef, useState } from "react";

type IdType = string;

type UseOptimisticRowParamsType<TPatch> = {
  applyPatch: (args: { id: IdType; patch: TPatch }) => void;
  getPatch: (id: IdType) => TPatch | undefined;
  setPatch: (args: { id: IdType; patch: TPatch | undefined }) => void;

  requestUpdate: (args: { id: IdType; patch: TPatch }) => Promise<void>;
};

type UseOptimisticRowReturnType<TPatch> = {
  isPending: (id: IdType) => boolean;
  update: (args: { id: IdType; patch: TPatch }) => void;
};

export const useOptimisticRow = <TPatch>({
  applyPatch,
  getPatch,
  setPatch,
  requestUpdate,
}: UseOptimisticRowParamsType<TPatch>): UseOptimisticRowReturnType<TPatch> => {
  const [pendingMap, setPendingMap] = useState<Record<IdType, boolean>>({});
  const inflightTokenRef = useRef<Record<IdType, number>>({});

  const isPending = useCallback(
    (id: IdType) => Boolean(pendingMap[id]),
    [pendingMap],
  );

  const update = useCallback(
    (args: { id: IdType; patch: TPatch }) => {
      const { id, patch } = args;

      const token = (inflightTokenRef.current[id] ?? 0) + 1;
      inflightTokenRef.current[id] = token;

      const prevPatch = getPatch(id);

      // optimistic apply
      applyPatch({ id, patch });

      // pending on
      setPendingMap((prev) => ({ ...prev, [id]: true }));

      void (async () => {
        try {
          await requestUpdate({ id, patch });

          // ignore stale
          if (inflightTokenRef.current[id] !== token) return;

          setPendingMap((prev) => ({ ...prev, [id]: false }));
        } catch {
          if (inflightTokenRef.current[id] !== token) return;

          // rollback to previous patch snapshot
          setPatch({ id, patch: prevPatch });

          setPendingMap((prev) => ({ ...prev, [id]: false }));
        }
      })();
    },
    [applyPatch, getPatch, requestUpdate, setPatch],
  );

  return { isPending, update };
};
