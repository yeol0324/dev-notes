import type { ReactNode } from "react";
import { MswProvider } from "./msw-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <MswProvider>{children}</MswProvider>;
}
