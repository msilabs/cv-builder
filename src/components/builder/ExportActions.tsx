"use client";
// টুলবারের ডান দিকের প্রধান কাজ: PDF, README কপি, পোর্টফোলিও ডাউনলোড
import { useReadmeActions } from "@/components/readme/ReadmePanels";
import { useDialogs } from "@/components/ui/Dialogs";
import { btnOutline, btnPrimary } from "@/components/ui/styles";
import { useLang } from "@/i18n/lang";
import { downloadText } from "@/lib/files";
import type { View } from "./ViewTabs";

export function ExportActions({ view, markdown, portfolioHtml, leftovers, fullName }: {
  view: View; markdown: string; portfolioHtml: string; leftovers: string[]; fullName: string;
}) {
  const { t } = useLang();
  const B = t.b;
  const { confirm, toast } = useDialogs();

  // নমুনার তথ্য রয়ে গেলে আগে জিজ্ঞেস করা
  const okToExport = async (what: string) =>
    !leftovers.length || (await confirm({ message: B.confirmLeftover(what, leftovers.join(", ")), confirmLabel: B.dialogs.continue }));

  const readme = useReadmeActions(markdown, () => okToExport("README"));

  const downloadPDF = async () => {
    if (!(await okToExport("CV"))) return;
    // ফোনে প্রিন্ট থেকে PDF সেভ করা কঠিন, তাই আগে নির্দেশনা
    if (window.matchMedia("(pointer: coarse)").matches && !(await confirm({ title: B.mobilePdf.title, message: B.mobilePdf.body, confirmLabel: B.mobilePdf.go }))) return;
    const prev = document.title;
    document.title = `${fullName || "CV"} - CV`.replace(/[\\/:*?"<>|]/g, "");
    window.print();
    setTimeout(() => (document.title = prev), 500);
  };

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

  const secondary = `${btnOutline} hidden sm:inline-flex`;
  if (view === "readme")
    return (
      <>
        <button type="button" className={secondary} onClick={readme.download}>{B.actions.md}</button>
        <button type="button" className={btnPrimary} onClick={readme.copy}>{readme.copied ? B.actions.copied : B.actions.copyReadme}</button>
      </>
    );
  if (view === "portfolio")
    return (
      <>
        <button type="button" className={secondary} onClick={openPortfolio}>{B.actions.openTab}</button>
        <button type="button" className={btnPrimary} onClick={downloadPortfolio}>{B.actions.html}</button>
      </>
    );
  return (
    <button type="button" className={btnPrimary} onClick={downloadPDF}>
      ⬇ {B.actions.pdf}<span className="hidden xl:inline">{B.actions.download}</span>
    </button>
  );
}
