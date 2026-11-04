"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { btnAI, btnOutline, btnPrimary } from "@/components/ui/styles";
import type { AITask } from "@/lib/ai";
import { templates } from "@/components/templates";
import { AIPanel } from "@/components/ai/AIPanel";
import { CVSettingsPanel } from "@/components/builder/CVSettingsPanel";
import { ProgressCard } from "@/components/builder/ProgressCard";
import { FileMenu } from "@/components/builder/FileMenu";
import { ImportDialog } from "@/components/builder/ImportDialog";
import { Toolbar } from "@/components/builder/Toolbar";
import { VersionSwitcher } from "@/components/builder/VersionSwitcher";
import { useHashView, type View, ViewTabs } from "@/components/builder/ViewTabs";
import Editor from "@/components/editor/Editor";
import Preview from "@/components/Preview";
import { PortfolioHowTo, PortfolioPreviewPane, PortfolioSettingsPanel } from "@/components/portfolio/PortfolioPanels";
import { ReadmeHowTo, ReadmePreviewPane, ReadmeSettingsPanel, useReadmeActions } from "@/components/readme/ReadmePanels";
import { downloadText } from "@/lib/files";
import { type ImportResult, readImportFile } from "@/lib/normalize";
import { generatePortfolio } from "@/lib/portfolio";
import { generateReadme, githubUsername } from "@/lib/readme";
import { emptyCV, findSampleLeftovers, isEmptyCV, sampleCV, visibleCV } from "@/lib/sample";
import { useDialogs } from "@/components/ui/Dialogs";
import { useLang } from "@/i18n/lang";
import { useStore } from "@/lib/store";
import type { CV, SectionKey, Settings, TemplateId } from "@/lib/types";

const AVAILABLE: View[] = ["cv", "readme", "portfolio"];

// কোন ট্যাবের "দেখাও/লুকাও" তালিকা
const hiddenOf = (s: Settings, v: View) => (v === "readme" ? s.readme.hidden : v === "portfolio" ? s.portfolio.hidden : s.hidden);

export default function BuilderPage() {
  const { cv, setCV, settings, setSettings, loaded, profile } = useStore();
  const { t } = useLang();
  const B = t.b;
  const { confirm, toast } = useDialogs();
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTask, setAiTask] = useState<AITask | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<{ message: string; prev: CV; profileId: string } | null>(null);
  const [pane, setPane] = useState<"edit" | "preview">("edit");
  const [view, setView] = useState<View>("cv");
  const [pendingImport, setPendingImport] = useState<ImportResult | null>(null);
  useHashView(view, setView, AVAILABLE);

  // হোম পেজের টেমপ্লেট গ্যালারি থেকে ?t=modern এলে সেই টেমপ্লেট বাছাই
  useEffect(() => {
    if (!loaded) return;
    const params = new URLSearchParams(window.location.search);
    const tpl = params.get("t") as TemplateId | null;
    if (tpl && tpl in templates) {
      setSettings((s) => ({ ...s, template: tpl }));
      params.delete("t");
      const q = params.toString();
      history.replaceState(null, "", `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`);
    }
  }, [loaded, setSettings]);

  const hidden = hiddenOf(settings, view);
  const shownCV = useMemo(() => visibleCV(cv, hidden), [cv, hidden]);
  const leftovers = findSampleLeftovers(shownCV).map((k) => B.leftover.fields[k]);
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
      toast(B.toast.imported);
    } else setPendingImport(r);
  };

  const okToExport = async (what: string) =>
    !leftovers.length || (await confirm({ message: B.confirmLeftover(what, leftovers.join(", ")), confirmLabel: B.dialogs.continue }));

  const portfolioHtml = useMemo(() => (view === "portfolio" ? generatePortfolio(shownCV, settings.portfolio) : ""), [view, shownCV, settings.portfolio]);
  const downloadPortfolio = async () => {
    if (!(await okToExport(B.views.portfolio))) return;
    downloadText("index.html", portfolioHtml, "text/html");
    toast(B.toast.downloaded);
  };
  const openPortfolio = () => {
    const url = URL.createObjectURL(new Blob([portfolioHtml], { type: "text/html" }));
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const readme = useReadmeActions(markdown, () => okToExport("README"));

  const downloadPDF = async () => {
    if (!(await okToExport("CV"))) return;
    const prev = document.title;
    document.title = `${cv.personal.fullName || "CV"} - CV`.replace(/[\\/:*?"<>|]/g, "");
    window.print();
    setTimeout(() => (document.title = prev), 500);
  };

  const primary = btnPrimary;
  const secondary = `${btnOutline} hidden sm:inline-flex`;
  const openAI = (task: AITask | null = null) => {
    setAiTask(task);
    setAiOpen(true);
  };
  const importFile = async (f?: File) => {
    if (!f) return;
    try {
      onImport(await readImportFile(f));
    } catch (e) {
      const m = (e as Error).message;
      toast(B.file.openError(B.errors[m] ?? B.errors.parse), "error");
    }
  };
  const focusName = () => {
    const el = document.getElementById("field-fullName");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus({ preventScroll: true });
  };
  const actions =
    view === "readme" ? (
      <>
        <button className={secondary} onClick={readme.download}>{B.actions.md}</button>
        <button className={primary} onClick={readme.copy}>{readme.copied ? B.actions.copied : B.actions.copyReadme}</button>
      </>
    ) : view === "portfolio" ? (
      <>
        <button className={secondary} onClick={openPortfolio}>{B.actions.openTab}</button>
        <button className={primary} onClick={downloadPortfolio}>{B.actions.html}</button>
      </>
    ) : (
      <button className={primary} onClick={downloadPDF}>⬇ {B.actions.pdf}<span className="hidden xl:inline">{B.actions.download}</span></button>
    );

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:h-screen lg:overflow-hidden print:block print:h-auto print:overflow-visible print:bg-white">
      <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden">
        <Toolbar
          left={loaded && <VersionSwitcher />}
          center={<ViewTabs view={view} setView={setView} available={AVAILABLE} />}
          right={
            <>
              <button type="button" onClick={() => openAI()} aria-label={B.actions.ai} className={`${btnAI} w-9 px-0 lg:w-auto lg:px-3`}>
                <span aria-hidden>🤖</span> <span className="hidden lg:inline">{B.actions.ai}</span>
              </button>
              <FileMenu isEmpty={isEmpty} onImport={onImport} />
              {actions}
            </>
          }
        />
      </header>

      {/* মোবাইল/ট্যাবলেটে নিচে ভাসমান এডিট/প্রিভিউ */}
      <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center lg:hidden print:hidden">
        <div className="flex rounded-full border border-slate-200 bg-white/95 p-1 shadow-xl shadow-slate-900/15 backdrop-blur">
          {(["edit", "preview"] as const).map((k) => (
            <button key={k} type="button" onClick={() => { setPane(k); window.scrollTo({ top: 0 }); }} aria-pressed={pane === k}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${pane === k ? "bg-teal-700 text-white" : "text-slate-600"}`}>
              {B.pane[k]}
            </button>
          ))}
        </div>
      </div>
      <input ref={importRef} type="file" accept="application/json,.json,.txt" className="hidden" onChange={(e) => { importFile(e.target.files?.[0]); e.target.value = ""; }} />

      <ImportDialog result={pendingImport} onClose={() => setPendingImport(null)} />
      <AIPanel open={aiOpen} initialTask={aiTask} onClose={() => { setAiOpen(false); setAiTask(null); }} onApplied={(prev, profileId, message) => setNotice({ prev, profileId, message })} />
      <div className="grid flex-1 lg:min-h-0 lg:grid-cols-[minmax(380px,520px)_1fr] print:block">
        <aside className={`space-y-3 overflow-y-auto p-4 pb-24 lg:h-full lg:pb-4 print:hidden ${pane === "edit" ? "" : "hidden lg:block"}`}>
          {notice && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900">
              <p>🤖 {notice.message} {B.notice.review}</p>
              <div className="flex shrink-0 gap-2">
                {notice.profileId && notice.profileId === profile.id && (
                  <button type="button" className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-violet-800 ring-1 ring-violet-300 hover:bg-violet-100"
                    onClick={() => { setCV(notice.prev); setNotice(null); }}>{B.notice.undo}</button>
                )}
                <button type="button" aria-label={B.actions.close} className="px-1 text-violet-400 hover:text-violet-700" onClick={() => setNotice(null)}>✕</button>
              </div>
            </div>
          )}
          {loaded && !isEmpty && <ProgressCard cv={cv} />}
          {view === "cv" && <CVSettingsPanel />}
          {view === "readme" && <ReadmeSettingsPanel />}
          {view === "portfolio" && <PortfolioSettingsPanel />}
          {loaded && leftovers.length > 0 && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-semibold">{B.leftover.title}</p>
              <p className="mt-1">{B.leftover.body} <b>{leftovers.join(", ")}</b></p>
              <button className="mt-2 rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700" onClick={async () => (await confirm({ message: B.leftover.confirmClear, confirmLabel: B.dialogs.clear, danger: true })) && setCV(emptyCV)}>
                {B.leftover.clear}
              </button>
            </div>
          )}
          {loaded && isEmpty && (
            <div className="rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 text-sm text-slate-700 shadow-sm">
              <p className="font-semibold text-slate-900">{B.welcome.title}</p>
              <p className="mt-1 text-slate-600">{B.welcome.body(B.views[view])}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { label: B.welcome.fill, onClick: focusName },
                  { label: B.welcome.sample, onClick: () => setCV(sampleCV) },
                  { label: B.welcome.ai, onClick: () => openAI("fromText") },
                  { label: B.welcome.import, onClick: () => importRef.current?.click() },
                ].map((x) => (
                  <button key={x.label} type="button" onClick={x.onClick}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-teal-400 hover:text-teal-800">
                    {x.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {loaded && <Editor cv={cv} setCV={setCV} hidden={hidden} toggleSection={toggleSection} />}
          {view === "readme" && <ReadmeHowTo user={githubUsername(cv.personal.github)} />}
          {view === "portfolio" && <PortfolioHowTo github={cv.personal.github} />}
          <p className="pb-6 text-center text-[11px] text-slate-400">{B.privacy}</p>
        </aside>

        <main className={`overflow-y-auto bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] p-4 pb-24 [background-size:18px_18px] lg:h-full lg:pb-4 print:block print:bg-none print:h-auto print:overflow-visible print:p-0 ${pane === "preview" ? "" : "hidden lg:block"}`}>
          {loaded && view === "cv" && <Preview cv={shownCV} settings={settings} empty={isEmpty} />}
          {loaded && view === "readme" && <ReadmePreviewPane markdown={markdown} />}
          {loaded && view === "portfolio" && <PortfolioPreviewPane html={portfolioHtml} />}
        </main>
      </div>
    </div>
  );
}
