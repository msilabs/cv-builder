import type { TemplateId, TemplateProps } from "@/lib/types";
import Classic from "./Classic";
import Compact from "./Compact";
import Elegant from "./Elegant";
import Minimal from "./Minimal";
import Modern from "./Modern";
import Timeline from "./Timeline";

// নাম আর বিবরণ অভিধানে (t.tpl), ATS তথ্য lib/templateMeta-তে
export interface TemplateMeta {
  component: (p: TemplateProps) => React.ReactNode;
  padded: boolean;
  photo: boolean;
}

export const templates: Record<TemplateId, TemplateMeta> = {
  classic: { component: Classic, padded: true, photo: false },
  compact: { component: Compact, padded: true, photo: false },
  elegant: { component: Elegant, padded: true, photo: false },
  modern: { component: Modern, padded: false, photo: true },
  timeline: { component: Timeline, padded: true, photo: true },
  minimal: { component: Minimal, padded: true, photo: true },
};
