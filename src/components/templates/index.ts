import type { TemplateId, TemplateProps } from "@/lib/types";
import Classic from "./Classic";
import Modern from "./Modern";
import Minimal from "./Minimal";

export const templates: Record<TemplateId, { name: string; desc: string; component: (p: TemplateProps) => React.ReactNode; padded: boolean; photo: boolean }> = {
  classic: { name: "ক্লাসিক (ATS)", desc: "এক কলাম, ATS সফটওয়্যারে সবচেয়ে ভালো পড়া যায়", component: Classic, padded: true, photo: false },
  modern: { name: "মডার্ন", desc: "রঙিন সাইডবার, স্কিল ট্যাগ", component: Modern, padded: false, photo: true },
  minimal: { name: "মিনিমাল", desc: "পরিচ্ছন্ন, প্রচুর সাদা জায়গা", component: Minimal, padded: true, photo: true },
};
