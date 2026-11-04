"use client";
import { memo } from "react";
import { templates } from "@/components/templates";
import { LinksEnabled } from "@/components/templates/shared";
import { defaultSettings, sampleCV } from "@/lib/sample";
import type { TemplateId } from "@/lib/types";

const A4_W = 793.7;
const A4_H = 1122.5;

// নমুনা CV দিয়ে আসল টেমপ্লেটের ছোট ছবি
export const TemplateThumb = memo(function TemplateThumb({ id, accent, width = 140 }: { id: TemplateId; accent: string; width?: number }) {
  const t = templates[id];
  const T = t.component;
  const scale = width / A4_W;
  return (
    <div aria-hidden className="pointer-events-none relative overflow-hidden rounded-md bg-white ring-1 ring-slate-200" style={{ width, height: A4_H * scale }}>
      <div className={`origin-top-left bg-white ${t.padded ? "px-[14mm] py-[10mm]" : ""}`} style={{ width: "210mm", minHeight: "297mm", transform: `scale(${scale})` }}>
        <LinksEnabled.Provider value={false}>
          <T cv={sampleCV} settings={{ ...defaultSettings, template: id, accent, showPhoto: false }} />
        </LinksEnabled.Provider>
      </div>
    </div>
  );
});
