"use client";
import { Lock, Sparkles } from "@/components/ui/icons";
// বিল্ডার পেজ: টুলবার, বাঁ পাশে ফর্ম, ডান পাশে CV / README / পোর্টফোলিওর প্রিভিউ
import { useMemo, useRef, useState } from "react";
import { AIPanel } from "@/components/ai/AIPanel";
import { type AINotice, BuilderNotices } from "@/components/builder/BuilderNotices";
import { CrashNotice } from "@/components/builder/CrashNotice";
import { CVSettingsPanel } from "@/components/builder/CVSettingsPanel";
import { ExportActions } from "@/components/builder/ExportActions";
import { FileMenu } from "@/components/builder/FileMenu";
import { ImportDialog } from "@/components/builder/ImportDialog";
import { MobilePaneSwitch, type Pane } from "@/components/builder/MobilePaneSwitch";
import { ProgressCard } from "@/components/builder/ProgressCard";
import { Toolbar } from "@/components/builder/Toolbar";
import { useTemplateFromQuery } from "@/components/builder/useTemplateFromQuery";
import { VersionSwitcher } from "@/components/builder/VersionSwitcher";
import { useHashView, type View, ViewTabs } from "@/components/builder/ViewTabs";
import { WelcomeCard } from "@/components/builder/WelcomeCard";
import Editor from "@/components/editor/Editor";
import { PortfolioHowTo, PortfolioPreviewPane, PortfolioSettingsPanel } from "@/components/portfolio/PortfolioPanels";
import Preview from "@/components/Preview";
import { ReadmeHowTo, ReadmePreviewPane, ReadmeSettingsPanel } from "@/components/readme/ReadmePanels";
import { useDialogs } from "@/components/ui/Dialogs";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { btnAI } from "@/components/ui/styles";
import { useLang } from "@/i18n/lang";
import type { AITask } from "@/lib/ai";
import { type ImportResult, readImportFile } from "@/lib/normalize";
import { generatePortfolio } from "@/lib/portfolio";
import { generateReadme, githubUsername } from "@/lib/readme";
import { findSampleLeftovers, isEmptyCV, sampleCV, visibleCV } from "@/lib/sample";
import { useStore } from "@/lib/store";
import type { SectionKey, Settings } from "@/lib/types";

const AVAILABLE: View[] = ["cv", "readme", "portfolio"];

// কোন ট্যাবের "দেখান/লুকান" তালিকা
const hiddenOf = (s: Settings, v: View) => (v === "readme" ? s.readme.hidden : v === "portfolio" ? s.portfolio.hidden : s.hidden);

export default function BuilderPage() {
  const { cv, setCV, settings, setSettings, loaded } = useStore();
  const { t } = useLang();
  const B = t.b;
  const { toast } = useDialogs();
  const [view, setView] = useState<View>("cv");
  const [pane, setPane] = useState<Pane>("edit");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTask, setAiTask] = useState<AITask | null>(null);
  const [notice, setNotice] = useState<AINotice | null>(null);
  const [pendingImport, setPendingImport] = useState<ImportResult | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  useHashView(view, setView, AVAILABLE);
  useTemplateFromQuery(loaded, setSettings);

  const hidden = hiddenOf(settings, view);
  const shownCV = useMemo(() => visibleCV(cv, hidden), [cv, hidden]);
  const leftovers = findSampleLeftovers(shownCV).map((k) => B.leftover.fields[k]);
  const isEmpty = isEmptyCV(cv);
  const markdown = useMemo(() => (view === "readme" ? generateReadme(shownCV, settings.readme) : ""), [view, shownCV, settings.readme]);
  const portfolioHtml = useMemo(() => (view === "portfolio" ? generatePortfolio(shownCV, settings.portfolio) : ""), [view, shownCV, settings.portfolio]);

  const toggleSection = (k: SectionKey) =>
    setSettings((s) => {
      const cur = hiddenOf(s, view);
      const next = cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k];
      if (view === "readme") return { ...s, readme: { ...s.readme, hidden: next } };
      if (view === "portfolio") return { ...s, portfolio: { ...s.portfolio, hidden: next } };
      return { ...s, hidden: next };
    });

  // খালি ভার্সনে সরাসরি বসানো, নইলে কোথায় রাখবে জিজ্ঞেস করা
  const onImport = (r: ImportResult) => {
    if (!isEmpty) return setPendingImport(r);
    setCV(r.cv);
    if (r.settings) setSettings(r.settings);
    toast(B.toast.imported);
  };
  const importFile = async (f?: File) => {
    if (!f) return;
    try {
      onImport(await readImportFile(f));
    } catch (e) {
      toast(B.file.openError(B.errors[(e as Error).message] ?? B.errors.parse), "error");
    }
  };
  const openImport = () => importRef.current?.click();
  const openAI = (task: AITask | null = null) => {
    setAiTask(task);
    setAiOpen(true);
  };
  const focusName = () => {
    const el = document.getElementById("field-fullName");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:h-screen lg:overflow-hidden print:block print:h-auto print:overflow-visible print:bg-white">
      <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden">
        <Toolbar
          left={loaded && <VersionSwitcher />}
          center={<ViewTabs view={view} setView={setView} available={AVAILABLE} />}
          right={
            <>
              <button type="button" onClick={() => openAI()} aria-label={B.actions.ai} className={`${btnAI} w-9 px-0 lg:w-auto lg:px-3`}>
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden /> <span className="hidden lg:inline">{B.actions.ai}</span>
              </button>
              <FileMenu isEmpty={isEmpty} onImport={onImport} />
              <ExportActions view={view} markdown={markdown} portfolioHtml={portfolioHtml} leftovers={leftovers} fullName={cv.personal.fullName} />
            </>
          }
        />
      </header>

      <MobilePaneSwitch pane={pane} setPane={setPane} />
      <input ref={importRef} type="file" accept="application/json,.json,.txt" className="hidden" onChange={(e) => { importFile(e.target.files?.[0]); e.target.value = ""; }} />
      <ImportDialog result={pendingImport} onClose={() => setPendingImport(null)} />
      <AIPanel key={aiOpen ? `open-${aiTask ?? "menu"}` : "closed"} open={aiOpen} initialTask={aiTask}
        onClose={() => { setAiOpen(false); setAiTask(null); }} onApplied={(prev, profileId, message) => setNotice({ prev, profileId, message })} />

      <div className="grid flex-1 lg:min-h-0 lg:grid-cols-[minmax(380px,520px)_1fr] print:block">
        <aside className={`space-y-3 overflow-y-auto p-4 pb-24 lg:h-full lg:pb-4 print:hidden ${pane === "edit" ? "" : "hidden lg:block"}`}>
          <BuilderNotices notice={notice} onDismissNotice={() => setNotice(null)} leftovers={leftovers} />
          {loaded && !isEmpty && <ProgressCard cv={cv} />}
          {view === "cv" && <CVSettingsPanel />}
          {view === "readme" && <ReadmeSettingsPanel />}
          {view === "portfolio" && <PortfolioSettingsPanel />}
          {loaded && isEmpty && (
            <WelcomeCard what={B.views[view]} onFill={focusName} onSample={() => setCV(sampleCV)} onAI={() => openAI("fromText")} onImport={openImport} />
          )}
          {loaded && (
            <ErrorBoundary fallback={(reset) => <CrashNotice reset={reset} />}>
              <Editor cv={cv} setCV={setCV} hidden={hidden} toggleSection={toggleSection} />
            </ErrorBoundary>
          )}
          {view === "readme" && <ReadmeHowTo user={githubUsername(cv.personal.github)} />}
          {view === "portfolio" && <PortfolioHowTo github={cv.personal.github} />}
          <p className="flex items-center justify-center gap-1 pb-6 text-center text-[11px] text-slate-500"><Lock className="h-3 w-3" aria-hidden />{B.privacy}</p>
        </aside>

        <main className={`overflow-y-auto bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] p-4 pb-24 [background-size:18px_18px] lg:h-full lg:pb-4 print:block print:h-auto print:overflow-visible print:bg-none print:p-0 ${pane === "preview" ? "" : "hidden lg:block"}`}>
          <ErrorBoundary key={view} fallback={(reset) => <CrashNotice reset={reset} />}>
            {loaded && view === "cv" && <Preview cv={shownCV} settings={settings} empty={isEmpty} />}
            {loaded && view === "readme" && <ReadmePreviewPane markdown={markdown} />}
            {loaded && view === "portfolio" && <PortfolioPreviewPane html={portfolioHtml} />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
