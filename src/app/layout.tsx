import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";

const bn = Hind_Siliguri({ variable: "--font-bn", subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"] });
const en = Inter({ variable: "--font-en", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CVবানাও — বাংলাদেশি ডেভেলপারদের জন্য ফ্রি CV বিল্ডার",
  description: "ওয়েব, মোবাইল অ্যাপ ও সফটওয়্যার ডেভেলপারদের জন্য ATS-বান্ধব CV কয়েক মিনিটে বানান। ফ্রি, লগইন ছাড়াই, PDF ডাউনলোড।",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body className={`${bn.variable} ${en.variable} antialiased`}>{children}</body>
    </html>
  );
}
