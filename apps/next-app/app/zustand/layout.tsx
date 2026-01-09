import { CounterStoreProvider } from "@/app/provider/use-counter-store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CounterStoreProvider>{children}</CounterStoreProvider>;
}
