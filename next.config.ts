import type { NextConfig } from "next";

// GitHub Pages-এ সাইট থাকে /<repo-নাম>/ এর নিচে; workflow এই ঠিকানা PAGES_BASE_PATH দিয়ে পাঠায়।
// Vercel বা লোকালে এটা খালি থাকে।
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export", // পুরোপুরি static HTML/CSS/JS, যেকোনো static হোস্টে চলে
  trailingSlash: true, // /builder/ → builder/index.html, GitHub Pages-এর জন্য
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
