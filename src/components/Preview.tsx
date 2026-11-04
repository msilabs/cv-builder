"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/lang";
import type { TemplateProps } from "@/lib/types";
import { templates } from "./templates";

const A4_PX = 793.7; // 210mm @96dpi
const ZOOMS = [0.5, 0.65, 0.8, 1, 1.25, 1.5];

export default function Preview({ cv, settings, empty = false }: TemplateProps & { empty?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [height, setHeight] = useState(1123);
  const tpl = templates[settings.template];
  const T = tpl.component;
  const { t } = useLang();
  const Z = t.b.zoom;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setFit(Math.min(1, (el.clientWidth - 16) / A4_PX)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = page.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = zoom === "fit" ? fit : zoom;
  const pages = Math.max(1, Math.ceil((height - 2) / 1122.5));
  const step = (d: 1 | -1) => {
    const cur = zoom === "fit" ? fit : zoom;
    const next = d > 0 ? ZOOMS.find((z) => z > cur + 0.01) : [...ZOOMS].reverse().find((z) => z < cur - 0.01);
    if (next) setZoom(next);
  };
  const zbtn = "flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-30";

  return (
    <div ref={wrap} className="w-full print:!block">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-3 print:hidden">
        <span className="text-xs text-slate-500">
          {t.b.preview.pages(pages)}
          {pages > 2 && t.b.preview.tooLong}
        </span>
        <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
          <button type="button" className={zbtn} onClick={() => step(-1)} disabled={scale <= ZOOMS[0]} aria-label={Z.out} title={Z.out}>−</button>
          <button type="button" className={`${zbtn} ${zoom === "fit" ? "bg-teal-50 text-teal-800" : ""}`} onClick={() => setZoom("fit")}>
            {zoom === "fit" ? Z.fit : `${Math.round(scale * 100)}%`}
          </button>
          <button type="button" className={zbtn} onClick={() => step(1)} disabled={scale >= ZOOMS[ZOOMS.length - 1]} aria-label={Z.in} title={Z.in}>+</button>
        </div>
      </div>
      <div className="overflow-x-auto pb-2 print:overflow-visible print:p-0">
        <div className="relative mx-auto print:!h-auto print:!w-auto" style={{ width: A4_PX * scale, height: height * scale }}>
          <div
            id="cv-page"
            ref={page}
            className={`cv-page origin-top-left bg-white shadow-xl ring-1 ring-slate-200 print:!transform-none print:shadow-none print:ring-0 ${tpl.padded ? "px-[14mm] py-[10mm]" : ""}`}
            style={{ width: "210mm", minHeight: "297mm", transform: `scale(${scale})`, ["--accent" as string]: settings.accent }}
          >
            <T cv={cv} settings={settings} />
          </div>
          {empty && (
            <div className="absolute inset-x-0 top-[28%] flex justify-center px-6 print:hidden">
              <div className="max-w-xs rounded-2xl border border-dashed border-slate-300 bg-white/90 p-5 text-center shadow-sm backdrop-blur">
                <p className="text-3xl" aria-hidden>📄</p>
                <p className="mt-2 font-semibold text-slate-800">{t.b.emptyPreview.title}</p>
                <p className="mt-1 hidden text-sm text-slate-500 lg:block">{t.b.emptyPreview.body}</p>
                <p className="mt-1 text-sm text-slate-500 lg:hidden">{t.b.emptyPreview.bodyMobile}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
