import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { dict } from "@/i18n/dict";

export const metadata: Metadata = {
  title: dict.en.meta.title,
  description: dict.en.meta.description,
  alternates: { canonical: "/en/", languages: { bn: "/", en: "/en/" } },
  openGraph: { title: dict.en.meta.title, description: dict.en.meta.description, locale: "en_US", url: "/en/" },
};

export default function HomeEn() {
  return <HomePage lang="en" />;
}
