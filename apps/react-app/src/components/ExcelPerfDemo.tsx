import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import ExcelWorker from "../workers/excel.worker?worker";

type Status = "idle" | "running" | "done" | "error";

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

const DEFAULT_ROWS = 10_000;
const DEFAULT_SHEETS = 12;

function generateExcelOnMainThread(
  rowsPerSheet: number,
  sheetCount: number
): DonePayload {
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

  return {
    buffer,
    rowsPerSheet,
    sheetCount,
    durationMs,
  };
}

export function ExcelPerfDemo() {
  const workerRef = useRef<Worker | null>(null);

  const [mainStatus, setMainStatus] = useState<Status>("idle");
  const [workerStatus, setWorkerStatus] = useState<Status>("idle");

  const [mainDuration, setMainDuration] = useState<number | null>(null);
  const [workerDuration, setWorkerDuration] = useState<number | null>(null);

  const [workerError, setWorkerError] = useState<string | null>(null);
  console.log("[Worker] initialized");

  useEffect(() => {
    const worker = new ExcelWorker();
    workerRef.current = worker;

    const handleMessage = (event: MessageEvent<FromWorkerMessage>) => {
      if (event.data.type !== "DONE") return;

      const { buffer, durationMs } = event.data.payload;

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `정산_워커_${Date.now()}.xlsx`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setWorkerDuration(durationMs);
      setWorkerStatus("done");
    };

    const handleError = (event: ErrorEvent) => {
      console.error("Worker error:", event);
      setWorkerStatus("error");
      setWorkerError(event.message);
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);

    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      worker.terminate();
    };
  }, []);

  const handleMainThreadClick = () => {
    setMainStatus("running");
    setMainDuration(null);

    const result = generateExcelOnMainThread(DEFAULT_ROWS, DEFAULT_SHEETS);

    const blob = new Blob([result.buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `정산_메인스레드_${Date.now()}.xlsx`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    setMainDuration(result.durationMs);
    setMainStatus("done");
  };

  const handleWorkerClick = () => {
    if (!workerRef.current) return;

    setWorkerStatus("running");
    setWorkerDuration(null);
    setWorkerError(null);

    workerRef.current.postMessage({
      type: "GENERATE",
      payload: {
        rowsPerSheet: DEFAULT_ROWS,
        sheetCount: DEFAULT_SHEETS,
      },
    });
  };

  const [counter, setCounter] = useState<number>(0);

  return (
    <section
      style={{
        border: "1px solid #ddd",
        padding: 16,
        borderRadius: 8,
        maxWidth: 680,
      }}
    >
      <h2>엑셀 생성 성능 비교 (워커 vs 메인 스레드)</h2>
      <p style={{ fontSize: 14, color: "#555" }}>
        대상: {DEFAULT_ROWS.toLocaleString()}행 × {DEFAULT_SHEETS} 시트
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button
          type="button"
          onClick={handleMainThreadClick}
          disabled={mainStatus === "running"}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ccc",
            cursor: mainStatus === "running" ? "not-allowed" : "pointer",
          }}
        >
          {mainStatus === "running"
            ? "메인 스레드: 생성 중..."
            : "메인 스레드에서 생성 (워커 미사용)"}
        </button>

        <button
          type="button"
          onClick={handleWorkerClick}
          disabled={workerStatus === "running"}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ccc",
            cursor: workerStatus === "running" ? "not-allowed" : "pointer",
          }}
        >
          {workerStatus === "running"
            ? "Web Worker: 생성 중..."
            : "Web Worker로 생성"}
        </button>
      </div>

      <div style={{ marginTop: 16, fontSize: 13 }}>
        <div>
          메인 스레드 상태: <b>{mainStatus}</b>
          {mainDuration !== null && (
            <span>· {(mainDuration / 1000).toFixed(2)}초</span>
          )}
        </div>
        <div style={{ marginTop: 4 }}>
          Web Worker 상태: <b>{workerStatus}</b>
          {workerDuration !== null && (
            <span> · {(workerDuration / 1000).toFixed(2)}초</span>
          )}
        </div>
        {workerError && (
          <div style={{ color: "red", marginTop: 4 }}>
            워커 에러: {workerError}
          </div>
        )}
      </div>

      <hr style={{ margin: "16px 0" }} />

      <div style={{ fontSize: 13 }}>
        <input type="text" value={""} />
        <span style={{ marginLeft: 8 }}>값: {counter}</span>
        <button
          type="button"
          onClick={() => setCounter((prev) => prev + 1)}
          style={{
            marginTop: 8,
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          add
        </button>
      </div>
    </section>
  );
}
