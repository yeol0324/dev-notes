import { useState, useEffect } from "react";

export const useStore = <T, F>(
  store: <U>(selector: (state: T) => U) => U,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
