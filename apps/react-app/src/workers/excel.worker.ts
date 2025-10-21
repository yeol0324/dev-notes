/// <reference lib="webworker" />
import * as XLSX from "xlsx";

interface GeneratePayload {
  rowsPerSheet: number;
  sheetCount: number;
}

type ToWorkerMessage = {
  type: "GENERATE";
  payload: GeneratePayload;
};

interface DonePayload {
  buffer: ArrayBuffer;
  rowsPerSheet: number;
  sheetCount: number;
  durationMs: number;
}

type FromWorkerMessage = {
  type: "DONE";
  payload: DonePayload;
};

function isGenerateMessage(data: unknown): data is ToWorkerMessage {
  if (typeof data !== "object" || data === null) return false;
  const d = data as { type?: unknown; payload?: unknown };
  if (d.type !== "GENERATE") return false;
  const p = d.payload as Partial<GeneratePayload> | undefined;
  return (
    !!p &&
    typeof p.rowsPerSheet === "number" &&
    typeof p.sheetCount === "number"
  );
}

self.addEventListener("message", (event: MessageEvent<unknown>) => {
  if (!isGenerateMessage(event.data)) return;
  console.log("[Worker] received message");

  const { rowsPerSheet, sheetCount } = event.data.payload;

  const startedAt = performance.now();
  const workbook = XLSX.utils.book_new();

  for (let monthIndex = 0; monthIndex < sheetCount; monthIndex++) {
    const month = monthIndex + 1;
    const rows: (string | number)[][] = [
      ["정산월", "순번", "유저 ID", "금액", "수수료", "정산 후 금액"],
    ];

    for (let i = 0; i < rowsPerSheet; i++) {
      const amount = 1000 + (i % 1000);
      const fee = Math.floor(amount * 0.1);
      const finalAmount = amount - fee;

      rows.push([
        `${month}월`,
        i + 1,
        `user_${month}_${i + 1}`,
        amount,
        fee,
        finalAmount,
      ]);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, `${month}월 정산`);
  }

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  }) as ArrayBuffer;

  const durationMs = performance.now() - startedAt;

  const message: FromWorkerMessage = {
    type: "DONE",
    payload: {
      buffer,
      rowsPerSheet,
      sheetCount,
      durationMs,
    },
  };

  (self as DedicatedWorkerGlobalScope).postMessage(message, [buffer]);
});
