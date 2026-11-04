"use client";
import { Eye, Pencil } from "@/components/ui/icons";
import { useLang } from "@/i18n/lang";

export type Pane = "edit" | "preview";

// মোবাইল/ট্যাবলেটে নিচে ভাসমান এডিট/প্রিভিউ বোতাম
export function MobilePaneSwitch({ pane, setPane }: { pane: Pane; setPane: (p: Pane) => void }) {
  const { t } = useLang();
  return (
    <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center lg:hidden print:hidden">
      <div className="flex rounded-full border border-slate-200 bg-white/95 p-1 shadow-xl shadow-slate-900/15 backdrop-blur">
        {(["edit", "preview"] as const).map((k) => (
          <button key={k} type="button" aria-pressed={pane === k} onClick={() => { setPane(k); window.scrollTo({ top: 0 }); }}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition ${pane === k ? "bg-teal-700 text-white" : "text-slate-600"}`}>
            {k === "edit" ? <Pencil className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            {t.b.pane[k]}
          </button>
        ))}
      </div>
    </div>
  );
}
