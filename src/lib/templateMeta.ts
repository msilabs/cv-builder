import type { TemplateId } from "./types";

// কোন টেমপ্লেট এক কলামের (ATS-বান্ধব); টেমপ্লেটের কোড ছাড়াই জানা যায়
export const TEMPLATE_IDS: TemplateId[] = ["classic", "compact", "elegant", "modern", "timeline", "minimal"];
export const TEMPLATE_ATS: Record<TemplateId, boolean> = { classic: true, compact: true, elegant: true, modern: false, timeline: false, minimal: false };
