"use client";

// import { useGlobalStore } from "@/app/provider/use-global-store";
import { useCounterStore } from "@/app/provider/use-counter-store";

export default function SecondPage() {
  //   const { count, increment, reset } = useGlobalStore();
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);
  const reset = useCounterStore((s) => s.reset);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-2xl text-black font-bold mb-4">
        Count on Second Page: {count}
      </h1>
      <div className="space-x-4">
        <button
          onClick={increment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Increment
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
