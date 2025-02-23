"use client";

import { useEffect, useState, type ReactNode } from "react";

type MswProviderPropsType = {
  children: ReactNode;
};

export const MswProvider = ({ children }: MswProviderPropsType) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const enableMsw = async () => {
      if (process.env.NODE_ENV !== "development") {
        setReady(true);
        return;
      }

      const { worker } = await import("./model");
      await worker.start({
        onUnhandledRequest: "bypass",
      });

      setReady(true);
    };

    enableMsw();
  }, []);

  if (!ready) return null; // 로딩 UI 넣고 싶으면 여기서
  return <>{children}</>;
};
