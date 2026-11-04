"use client";
import { marked } from "marked";
import { useMemo } from "react";

// GitHub-এর মতো দেখতে প্রিভিউ; sandbox করা iframe-এ, তাই কোনো স্ক্রিপ্ট চলে না
const CSS = `
:root{color-scheme:light}
body{margin:0;padding:32px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#1f2328;background:#fff;word-wrap:break-word}
h1,h2,h3,h4{margin:24px 0 16px;font-weight:600;line-height:1.25}
h1{font-size:2em;padding-bottom:.3em;border-bottom:1px solid #d1d9e0b3}
h2{font-size:1.5em;padding-bottom:.3em;border-bottom:1px solid #d1d9e0b3}
h3{font-size:1.25em}h4{font-size:1em}
p,ul,ol,blockquote,pre{margin:0 0 16px}
ul,ol{padding-left:2em}li+li{margin-top:.25em}
a{color:#0969da;text-decoration:none}a:hover{text-decoration:underline}
blockquote{padding:0 1em;color:#59636e;border-left:.25em solid #d1d9e0}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:85%;padding:.2em .4em;background:#818b981f;border-radius:6px}
pre{padding:16px;overflow:auto;font-size:85%;line-height:1.45;background:#f6f8fa;border-radius:6px}
pre code{padding:0;background:transparent;font-size:100%}
img{max-width:100%;vertical-align:middle}
p img,a img{margin:2px}
hr{height:.25em;padding:0;margin:24px 0;background:#d1d9e0;border:0}
h1:first-child,h2:first-child,h3:first-child{margin-top:0}
`;

export function MarkdownFrame({ markdown, title = "README preview" }: { markdown: string; title?: string }) {
  const html = useMemo(() => {
    const body = marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
    // GitHub-এর মতো লিংক নতুন ট্যাবে
    return `<!doctype html><html><head><meta charset="utf-8"><base target="_blank"><style>${CSS}</style></head><body>${body}</body></html>`;
  }, [markdown]);
  return <iframe title={title} sandbox="allow-popups allow-popups-to-escape-sandbox" srcDoc={html} className="h-full min-h-[70vh] w-full rounded-xl border border-slate-200 bg-white shadow-sm" />;
}
