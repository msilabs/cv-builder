import { StoreProvider } from "@/lib/store";

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
