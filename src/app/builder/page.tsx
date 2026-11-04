"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import Editor from "@/components/editor/Editor";
import Preview from "@/components/Preview";
import { templates } from "@/components/templates";
import { emptyCV, findSampleLeftovers, sampleCV } from "@/lib/sample";
import type { TemplateId } from "@/lib/types";
import { useCV } from "@/lib/useCV";

const ACCENTS = ["#0f766e", "#1d4ed8", "#7c3aed", "#be123c", "#c2410c", "#334155", "#006a4e"];

export default function BuilderPage() {
  const { cv, setCV, settings, setSettings, loaded } = useCV();
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const fileRef = useRef<HTMLInputElement>(null);

  const leftovers = findSampleLeftovers(cv);
  const isEmpty = !cv.personal.fullName && !cv.summary && cv.experience.length === 0 && cv.projects.length === 0 && cv.skills.length === 0;

  const downloadPDF = () => {
    if (leftovers.length && !confirm(`সতর্কতা: আপনার CV-তে এখনো নমুনা ডেটা আছে (${leftovers.join(", ")})।\n\nতবুও PDF ডাউনলোড করবেন?`)) return;
    const prev = document.title;
    document.title = `${cv.personal.fullName || "CV"} - CV`.replace(/[\\/:*?"<>|]/g, "");
    window.print();
    setTimeout(() => (document.title = prev), 500);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ cv, settings }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(cv.personal.fullName || "cv").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJSON = (f?: File) => {
    if (!f) return;
    f.text().then((t) => {
      try {
        const d = JSON.parse(t);
        if (!d.cv?.personal) throw new Error();
        setCV({ ...emptyCV, ...d.cv });
        if (d.settings) setSettings((s) => ({ ...s, ...d.settings }));
      } catch {
        alert("ফাইলটা সঠিক CV JSON না");
      }
    });
  };

  const btn = "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50";

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 print:block print:bg-white">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          <Link href="/" className="font-bold text-teal-700">CV<span className="text-slate-800">বানাও</span></Link>
          <div className="flex flex-wrap items-center gap-2">
            <button className={btn} onClick={() => (isEmpty || confirm("নমুনা ডেটা লোড করবেন? বর্তমান ডেটা মুছে যাবে।")) && setCV(sampleCV)}>নমুনা</button>
            <button className={btn} onClick={() => confirm("সব ডেটা মুছে ফেলবেন?") && setCV(emptyCV)}>নতুন করে শুরু</button>
            <button className={btn} onClick={exportJSON} title="ব্যাকআপ হিসেবে সেভ করুন">JSON সেভ</button>
            <button className={btn} onClick={() => fileRef.current?.click()}>JSON ইমপোর্ট</button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => { importJSON(e.target.files?.[0]); e.target.value = ""; }} />
            <button className="rounded-md bg-teal-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-800" onClick={downloadPDF}>⬇ PDF ডাউনলোড</button>
          </div>
        </div>
        <div className="flex border-t border-slate-100 lg:hidden">
          {(["edit", "preview"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 py-2 text-sm font-medium ${tab === k ? "border-b-2 border-teal-700 text-teal-700" : "text-slate-500"}`}>
              {k === "edit" ? "✏️ এডিট" : "👁 প্রিভিউ"}
            </button>
          ))}
        </div>
      </header>

      <div className="grid flex-1 lg:grid-cols-[minmax(380px,520px)_1fr] print:block">
        <aside className={`space-y-3 overflow-y-auto p-4 lg:h-[calc(100vh-53px)] print:hidden ${tab === "edit" ? "" : "hidden lg:block"}`}>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">টেমপ্লেট</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(templates) as TemplateId[]).map((id) => (
                <button key={id} onClick={() => setSettings((s) => ({ ...s, template: id }))}
                  className={`rounded-lg border p-2 text-left text-xs ${settings.template === id ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" : "border-slate-200 hover:border-slate-300"}`}>
                  <span className="block font-semibold text-slate-800">{templates[id].name}</span>
                  <span className="mt-0.5 block text-[10.5px] leading-snug text-slate-500">{templates[id].desc}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-500">রং:</span>
              {ACCENTS.map((c) => (
                <button key={c} aria-label={c} onClick={() => setSettings((s) => ({ ...s, accent: c }))}
                  className={`h-6 w-6 rounded-full ${settings.accent === c ? "ring-2 ring-slate-800 ring-offset-2" : ""}`} style={{ background: c }} />
              ))}
              <input type="color" value={settings.accent} onChange={(e) => setSettings((s) => ({ ...s, accent: e.target.value }))} className="h-6 w-8 cursor-pointer" />
              {templates[settings.template].photo && (
                <label className="ml-auto flex items-center gap-1.5 text-xs text-slate-600">
                  <input type="checkbox" checked={settings.showPhoto} onChange={(e) => setSettings((s) => ({ ...s, showPhoto: e.target.checked }))} /> ছবি দেখাও
                </label>
              )}
            </div>
          </div>
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
          {loaded && <Editor cv={cv} setCV={(fn) => setCV(fn)} />}
          <p className="pb-6 text-center text-[11px] text-slate-400">🔒 আপনার ডেটা শুধু আপনার ব্রাউজারেই সেভ থাকে, কোনো সার্ভারে যায় না।</p>
        </aside>

        <main className={`overflow-y-auto p-4 lg:h-[calc(100vh-53px)] print:block print:h-auto print:overflow-visible print:p-0 ${tab === "preview" ? "" : "hidden lg:block"}`}>
          {loaded && <Preview cv={cv} settings={settings} />}
        </main>
      </div>
    </div>
  );
}
