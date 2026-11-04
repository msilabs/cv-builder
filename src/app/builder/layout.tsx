import type { Metadata } from "next";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "বিল্ডার · CVবানাও",
  alternates: { canonical: "/builder/" },
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
