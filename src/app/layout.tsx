import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { dict } from "@/i18n/dict";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const bn = Hind_Siliguri({ variable: "--font-bn", subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"] });
const en = Inter({ variable: "--font-en", subsets: ["latin"] });

const m = dict.bn.meta;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: m.title,
  description: m.description,
  applicationName: "CVবানাও",
  keywords: ["CV builder", "resume builder", "developer CV", "GitHub profile README generator", "portfolio generator", "ATS CV", "Bangladesh", "সিভি বানানো", "সিভি ফরম্যাট"],
  alternates: { canonical: "/", languages: { bn: "/", en: "/en/" } },
  openGraph: {
    type: "website",
    siteName: "CVবানাও",
    title: m.title,
    description: m.description,
    url: "/",
    locale: "bn_BD",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "CVবানাও" }],
  },
  twitter: { card: "summary_large_image", title: m.title, description: m.description, images: ["/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body className={`${bn.variable} ${en.variable} antialiased`}>{children}</body>
    </html>
  );
}
