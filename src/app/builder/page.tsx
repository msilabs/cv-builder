"use client";
import { useMemo, useState } from "react";
import { CVSettingsPanel } from "@/components/builder/CVSettingsPanel";
import { FileMenu } from "@/components/builder/FileMenu";
import { ImportDialog } from "@/components/builder/ImportDialog";
import { Toolbar } from "@/components/builder/Toolbar";
import { VersionSwitcher } from "@/components/builder/VersionSwitcher";
import { useHashView, type View, ViewTabs } from "@/components/builder/ViewTabs";
import Editor from "@/components/editor/Editor";
import Preview from "@/components/Preview";
import { ReadmeHowTo, ReadmePreviewPane, ReadmeSettingsPanel, useReadmeActions } from "@/components/readme/ReadmePanels";
import type { ImportResult } from "@/lib/normalize";
import { generateReadme, githubUsername } from "@/lib/readme";
import { emptyCV, findSampleLeftovers, isEmptyCV, sampleCV, visibleCV } from "@/lib/sample";
import { useStore } from "@/lib/store";
import type { SectionKey, Settings } from "@/lib/types";

const AVAILABLE: View[] = ["cv", "readme"];

// কোন ট্যাবের "দেখাও/লুকাও" তালিকা
const hiddenOf = (s: Settings, v: View) => (v === "readme" ? s.readme.hidden : v === "portfolio" ? s.portfolio.hidden : s.hidden);

export default function BuilderPage() {
  const { cv, setCV, settings, setSettings, loaded } = useStore();
  const [pane, setPane] = useState<"edit" | "preview">("edit");
  const [view, setView] = useState<View>("cv");
  const [pendingImport, setPendingImport] = useState<ImportResult | null>(null);
  useHashView(view, setView, AVAILABLE);

  const hidden = hiddenOf(settings, view);
  const shownCV = useMemo(() => visibleCV(cv, hidden), [cv, hidden]);
  const leftovers = findSampleLeftovers(shownCV);
  const isEmpty = isEmptyCV(cv);
  const markdown = useMemo(() => (view === "readme" ? generateReadme(shownCV, settings.readme) : ""), [view, shownCV, settings.readme]);

  const toggleSection = (k: SectionKey) =>
    setSettings((s) => {
      const cur = hiddenOf(s, view);
      const next = cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k];
      if (view === "readme") return { ...s, readme: { ...s.readme, hidden: next } };
      if (view === "portfolio") return { ...s, portfolio: { ...s.portfolio, hidden: next } };
      return { ...s, hidden: next };
    });

  const onImport = (r: ImportResult) => {
    if (isEmpty) {
      setCV(r.cv);
      if (r.settings) setSettings(r.settings);
    } else setPendingImport(r);
  };

  const okToExport = (what: string) =>
    !leftovers.length || confirm(`সতর্কতা: আপনার ${what}-তে এখনো নমুনা ডেটা আছে (${leftovers.join(", ")})।\n\nতবুও চালিয়ে যাবেন?`);

  const readme = useReadmeActions(markdown, () => okToExport("README"));

  const downloadPDF = () => {
    if (!okToExport("CV")) return;
    const prev = document.title;
    document.title = `${cv.personal.fullName || "CV"} - CV`.replace(/[\\/:*?"<>|]/g, "");
    window.print();
    setTimeout(() => (document.title = prev), 500);
  };

  const primary = "rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-800 sm:px-4";
  const actions =
    view === "readme" ? (
      <>
        <button className="hidden rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 sm:block" onClick={readme.download}>⬇ .md</button>
        <button className={primary} onClick={readme.copy}>{readme.copied ? "✓ কপি হয়েছে" : "📋 README কপি"}</button>
      </>
    ) : (
      <button className={primary} onClick={downloadPDF}>⬇ PDF<span className="hidden sm:inline"> ডাউনলোড</span></button>
    );

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:h-screen lg:overflow-hidden print:block print:h-auto print:overflow-visible print:bg-white">
      <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden">
        <Toolbar
          left={loaded && <VersionSwitcher />}
          center={<ViewTabs view={view} setView={setView} available={AVAILABLE} />}
          right={<><FileMenu isEmpty={isEmpty} onImport={onImport} />{actions}</>}
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
      <div className="grid flex-1 lg:min-h-0 lg:grid-cols-[minmax(380px,520px)_1fr] print:block">
        <aside className={`space-y-3 overflow-y-auto p-4 lg:h-full print:hidden ${pane === "edit" ? "" : "hidden lg:block"}`}>
          {view === "cv" && <CVSettingsPanel />}
          {view === "readme" && <ReadmeSettingsPanel />}
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
              <p>👋 নিচের ফর্ম পূরণ করুন, ডান পাশে {view === "readme" ? "README" : "CV"} তৈরি হতে দেখবেন। একবার তথ্য দিলেই CV, README আর পোর্টফোলিও তিনটাই তৈরি হবে।</p>
              <button className="mt-2 text-xs font-semibold text-teal-700 underline" onClick={() => setCV(sampleCV)}>একটা নমুনা দেখতে চাই</button>
            </div>
          )}
          {loaded && <Editor cv={cv} setCV={setCV} hidden={hidden} toggleSection={toggleSection} />}
          {view === "readme" && <ReadmeHowTo user={githubUsername(cv.personal.github)} />}
          <p className="pb-6 text-center text-[11px] text-slate-400">🔒 আপনার ডেটা শুধু আপনার ব্রাউজারেই সেভ থাকে, কোনো সার্ভারে যায় না।</p>
        </aside>

        <main className={`overflow-y-auto p-4 lg:h-full print:block print:h-auto print:overflow-visible print:p-0 ${pane === "preview" ? "" : "hidden lg:block"}`}>
          {loaded && view === "cv" && <Preview cv={shownCV} settings={settings} />}
          {loaded && view === "readme" && <ReadmePreviewPane markdown={markdown} />}
        </main>
      </div>
    </div>
  );
}
