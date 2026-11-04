"use client";
import { useState } from "react";
import { CVSettingsPanel } from "@/components/builder/CVSettingsPanel";
import { FileMenu } from "@/components/builder/FileMenu";
import { ImportDialog } from "@/components/builder/ImportDialog";
import { VersionSwitcher } from "@/components/builder/VersionSwitcher";
import { Toolbar } from "@/components/builder/Toolbar";
import Editor from "@/components/editor/Editor";
import Preview from "@/components/Preview";
import type { ImportResult } from "@/lib/normalize";
import { emptyCV, findSampleLeftovers, isEmptyCV, sampleCV, visibleCV } from "@/lib/sample";
import { useStore } from "@/lib/store";
import type { SectionKey } from "@/lib/types";

export default function BuilderPage() {
  const { cv, setCV, settings, setSettings, loaded } = useStore();
  const [pane, setPane] = useState<"edit" | "preview">("edit");
  const [pendingImport, setPendingImport] = useState<ImportResult | null>(null);

  const shownCV = visibleCV(cv, settings.hidden);
  const leftovers = findSampleLeftovers(shownCV);
  const isEmpty = isEmptyCV(cv);
  const toggleSection = (k: SectionKey) =>
    setSettings((s) => ({ ...s, hidden: s.hidden.includes(k) ? s.hidden.filter((x) => x !== k) : [...s.hidden, k] }));

  const onImport = (r: ImportResult) => {
    // খালি ভার্সনে সরাসরি বসানো, নইলে কোথায় রাখবে জিজ্ঞেস
    if (isEmpty) {
      setCV(r.cv);
      if (r.settings) setSettings(r.settings);
    } else setPendingImport(r);
  };

  const downloadPDF = () => {
    if (leftovers.length && !confirm(`সতর্কতা: আপনার CV-তে এখনো নমুনা ডেটা আছে (${leftovers.join(", ")})।\n\nতবুও PDF ডাউনলোড করবেন?`)) return;
    const prev = document.title;
    document.title = `${cv.personal.fullName || "CV"} - CV`.replace(/[\\/:*?"<>|]/g, "");
    window.print();
    setTimeout(() => (document.title = prev), 500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 print:block print:bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden">
        <Toolbar
          left={loaded && <VersionSwitcher />}
          right={
            <>
              <FileMenu isEmpty={isEmpty} onImport={onImport} />
              <button className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-800 sm:px-4" onClick={downloadPDF}>
                ⬇ PDF<span className="hidden sm:inline"> ডাউনলোড</span>
              </button>
            </>
          }
        />
        <div className="flex border-t border-slate-100 lg:hidden">
          {(["edit", "preview"] as const).map((k) => (
            <button key={k} onClick={() => setPane(k)} className={`flex-1 py-2 text-sm font-medium ${pane === k ? "border-b-2 border-teal-700 text-teal-700" : "text-slate-500"}`}>
              {k === "edit" ? "✏️ এডিট" : "👁 প্রিভিউ"}
            </button>
          ))}
        </div>
      </header>

      <ImportDialog result={pendingImport} onClose={() => setPendingImport(null)} />
      <div className="grid flex-1 lg:grid-cols-[minmax(380px,520px)_1fr] print:block">
        <aside className={`space-y-3 overflow-y-auto p-4 lg:h-[calc(100vh-49px)] print:hidden ${pane === "edit" ? "" : "hidden lg:block"}`}>
          <CVSettingsPanel />
          {loaded && leftovers.length > 0 && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-semibold">⚠️ নমুনা ডেটা এখনো রয়ে গেছে</p>
              <p className="mt-1">এই ঘরগুলোতে নিজের তথ্য দিন: <b>{leftovers.join(", ")}</b></p>
              <button className="mt-2 rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700" onClick={() => confirm("সব মুছে খালি ফর্ম দিয়ে শুরু করবেন?") && setCV(emptyCV)}>
                সব মুছে নতুন করে শুরু
              </button>
            </div>
          )}
          {loaded && isEmpty && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
              <p>👋 নিচের ফর্ম পূরণ করুন, ডান পাশে CV তৈরি হতে দেখবেন।</p>
              <button className="mt-2 text-xs font-semibold text-teal-700 underline" onClick={() => setCV(sampleCV)}>একটা নমুনা CV দেখতে চাই</button>
            </div>
          )}
          {loaded && <Editor cv={cv} setCV={setCV} hidden={settings.hidden} toggleSection={toggleSection} />}
          <p className="pb-6 text-center text-[11px] text-slate-400">🔒 আপনার ডেটা শুধু আপনার ব্রাউজারেই সেভ থাকে, কোনো সার্ভারে যায় না।</p>
        </aside>

        <main className={`overflow-y-auto p-4 lg:h-[calc(100vh-49px)] print:block print:h-auto print:overflow-visible print:p-0 ${pane === "preview" ? "" : "hidden lg:block"}`}>
          {loaded && <Preview cv={shownCV} settings={settings} />}
        </main>
      </div>
    </div>
  );
}
