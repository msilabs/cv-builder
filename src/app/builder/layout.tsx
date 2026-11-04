import type { Metadata } from "next";
import { DialogProvider } from "@/components/ui/Dialogs";
import { LangProvider } from "@/i18n/lang";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "বিল্ডার · CVবানাও",
  alternates: { canonical: "/builder/" },
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <DialogProvider>
        <StoreProvider>{children}</StoreProvider>
      </DialogProvider>
    </LangProvider>
  );
}
