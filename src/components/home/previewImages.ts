// হোম পেজের প্রিভিউ ছবি (npm run previews দিয়ে আসল বিল্ডার থেকে তৈরি)
import portfolio from "@/assets/previews/portfolio.jpg";
import readme from "@/assets/previews/readme.jpg";
import classic from "@/assets/previews/tpl-classic.jpg";
import compact from "@/assets/previews/tpl-compact.jpg";
import elegant from "@/assets/previews/tpl-elegant.jpg";
import minimal from "@/assets/previews/tpl-minimal.jpg";
import modern from "@/assets/previews/tpl-modern.jpg";
import timeline from "@/assets/previews/tpl-timeline.jpg";
import type { TemplateId } from "@/lib/types";

export const templateImages: Record<TemplateId, typeof classic> = { classic, compact, elegant, modern, timeline, minimal };
export const heroImages = { portfolio, readme, cv: classic };
