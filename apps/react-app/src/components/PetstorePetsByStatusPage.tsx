import { useEffect, useMemo, useState } from "react";

import type { operations } from "../../generated/openapi";

type FindPetsByStatusOp = operations["findPetsByStatus"];
type PetList =
  FindPetsByStatusOp["responses"][200]["content"]["application/json"];
type Pet = PetList[number];
type PetStatus = FindPetsByStatusOp["parameters"]["query"]["status"];

type LoadStateType =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; data: PetList }
  | { type: "error"; message: string };

const PETSTORE_BASE_URL = "https://petstore.swagger.io/v2";

export const PetstorePetsByStatusPage = () => {
  const statuses = useMemo<readonly PetStatus[]>(
    () => ["available", "pending", "sold"],
    []
  );

  const [status, setStatus] = useState<PetStatus>("available");
  const [state, setState] = useState<LoadStateType>({ type: "idle" });

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      setState({ type: "loading" });

      try {
        const url = new URL(`${PETSTORE_BASE_URL}/pet/findByStatus`);
        url.searchParams.set("status", status);

        const res = await fetch(url.toString(), {
          method: "GET",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          setState({ type: "error", message: `HTTP ${res.status}` });
          return;
        }

        const json: unknown = await res.json();

        // 런타임 검증은 없지만, 스펙 기반 타입으로 "사용하는 쪽"을 강제
        setState({ type: "success", data: json as PetList });
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setState({ type: "error", message: "네트워크 오류" });
      }
    };

    void run();
    return () => controller.abort();
  }, [status]);

  return (
    <main className="p-6 space-y-4">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold">Petstore - Pets by Status</h1>

        <label className="flex items-center gap-2">
          <span className="text-sm">status</span>
          <select
            className="border rounded px-2 py-1"
            value={status}
            onChange={(e) => setStatus(e.target.value as PetStatus)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </header>

      {state.type === "loading" && <p>불러오는 중...</p>}
      {state.type === "error" && (
        <p className="text-red-600">{state.message}</p>
      )}

      {state.type === "success" && (
        <section className="space-y-2">
          <p className="text-sm text-gray-600">총 {state.data.length}건</p>

          <ul className="space-y-2">
            {state.data.map((pet: Pet) => (
              <li
                key={pet.id ?? `${pet.name}-${Math.random()}`}
                className="border rounded p-3"
              >
                <div className="font-medium">{pet.name}</div>
                <div className="text-sm text-gray-600">
                  id: {pet.id ?? "-"} / status: {pet.status ?? "-"}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};
