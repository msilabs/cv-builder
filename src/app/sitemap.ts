import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1, alternates: { languages: { bn: `${SITE_URL}/`, en: `${SITE_URL}/en/` } } },
    { url: `${SITE_URL}/en/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/builder/`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
