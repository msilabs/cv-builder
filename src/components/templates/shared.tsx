"use client";
import { createContext, useContext } from "react";
import type { CV } from "@/lib/types";
import { href, lines, stripProtocol } from "@/lib/utils";

export function Bullets({ text, className = "" }: { text: string; className?: string }) {
  const items = lines(text);
  if (!items.length) return null;
  return (
    <ul className={`list-disc pl-[1.1em] space-y-[2px] ${className}`}>
      {items.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

export function contactItems(cv: CV) {
  const p = cv.personal;
  const out: { label: string; url?: string }[] = [];
  if (p.email) out.push({ label: p.email, url: `mailto:${p.email}` });
  if (p.phone) out.push({ label: p.phone, url: `tel:${p.phone.replace(/[^\d+]/g, "")}` });
  if (p.location) out.push({ label: p.location });
  for (const u of [p.github, p.linkedin, p.website]) if (u) out.push({ label: stripProtocol(u), url: href(u) });
  return out;
}

// থাম্বনেইলে লিংক বন্ধ: থাম্বনেইল নিজেই লিংক/বোতামের ভেতরে থাকে, আর লিংকের ভেতরে লিংক অবৈধ
export const LinksEnabled = createContext(true);

export function Ext({ url, children, className = "" }: { url?: string; children: React.ReactNode; className?: string }) {
  const enabled = useContext(LinksEnabled);
  if (!url || !enabled) return <span className={className}>{children}</span>;
  return (
    <a href={url} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
