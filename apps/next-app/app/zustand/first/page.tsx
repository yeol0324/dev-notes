"use client";

import Link from "next/link";
// import { useGlobalStore } from "@/app/provider/use-global-store";
import { useCounterStore } from "@/app/provider/use-counter-store";
import { useStore } from "@/app/provider/use-store";

export default function FirstPage() {
  //   const { count, increment } = useGlobalStore();
  const count = useStore(useCounterStore, (state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Count: {count}
        </h1>
        <button
          onClick={increment}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg mb-4 transition-colors duration-200"
        >
          Increment
        </button>
        <div className="mt-4">
          <Link
            href={"/zustand/second"}
            className="text-blue-500 hover:text-blue-600 underline transition-colors duration-200"
          >
            Move to second page
          </Link>
        </div>
      </div>
    </div>
  );
}
