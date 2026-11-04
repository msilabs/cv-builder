import type { TemplateId, TemplateProps } from "@/lib/types";
import Classic from "./Classic";
import Compact from "./Compact";
import Elegant from "./Elegant";
import Minimal from "./Minimal";
import Modern from "./Modern";
import Timeline from "./Timeline";

export interface TemplateMeta {
  name: string;
  desc: string;
  component: (p: TemplateProps) => React.ReactNode;
  padded: boolean;
  photo: boolean;
  ats: boolean; // এক কলাম, ATS সফটওয়্যার সহজে পড়ে
}

export const templates: Record<TemplateId, TemplateMeta> = {
  classic: { name: "ক্লাসিক", desc: "এক কলাম, সবচেয়ে নিরাপদ", component: Classic, padded: true, photo: false, ats: true },
  compact: { name: "কম্প্যাক্ট", desc: "ঘন, এক পৃষ্ঠায় বেশি তথ্য", component: Compact, padded: true, photo: false, ats: true },
  elegant: { name: "এলিগ্যান্ট", desc: "Serif ফন্ট, মার্জিত", component: Elegant, padded: true, photo: false, ats: true },
  modern: { name: "মডার্ন", desc: "রঙিন সাইডবার, স্কিল ট্যাগ", component: Modern, padded: false, photo: true, ats: false },
  timeline: { name: "টাইমলাইন", desc: "সময়রেখায় অভিজ্ঞতা", component: Timeline, padded: true, photo: true, ats: false },
  minimal: { name: "মিনিমাল", desc: "পরিচ্ছন্ন, প্রচুর সাদা জায়গা", component: Minimal, padded: true, photo: true, ats: false },
};
