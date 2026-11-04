"use client";
import { useLang } from "@/i18n/lang";
import { useEffect, useRef, useState } from "react";
import type { TemplateProps } from "@/lib/types";
import { templates } from "./templates";

const A4_PX = 793.7; // 210mm @96dpi

export default function Preview({ cv, settings }: TemplateProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(1123);
  const tpl = templates[settings.template];
  const T = tpl.component;
  const { t } = useLang();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, (el.clientWidth - 32) / A4_PX)));
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

  const pages = Math.max(1, Math.ceil((height - 2) / 1122.5));

  return (
    <div ref={wrap} className="w-full print:!block">
      <p className="mb-2 text-center text-xs text-slate-500 print:hidden">
        {t.b.preview.pages(pages)}
        {pages > 2 && t.b.preview.tooLong}
      </p>
      <div className="mx-auto print:!h-auto print:!w-auto" style={{ width: A4_PX * scale, height: height * scale }}>
        <div
          id="cv-page"
          ref={page}
          className={`cv-page origin-top-left bg-white shadow-xl ring-1 ring-slate-200 print:!transform-none print:shadow-none print:ring-0 ${tpl.padded ? "px-[14mm] py-[10mm]" : ""}`}
          style={{ width: "210mm", minHeight: "297mm", transform: `scale(${scale})`, ["--accent" as string]: settings.accent }}
        >
          <T cv={cv} settings={settings} />
        </div>
      </div>
    </div>
  );
}
