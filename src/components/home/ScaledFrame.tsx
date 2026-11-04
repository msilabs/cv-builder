"use client";
// বড় পেজকে ছোট করে দেখানো (শুধু দেখার জন্য, ক্লিক বা স্ক্রিপ্ট চলে না)
export function ScaledFrame({ html, width, height, scale, title }: { html: string; width: number; height: number; scale: number; title: string }) {
  return (
    <div className="relative overflow-hidden" style={{ width: width * scale, height: height * scale }}>
      <iframe title={title} aria-hidden tabIndex={-1} sandbox="" srcDoc={html} loading="lazy"
        className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-white" style={{ width, height, transform: `scale(${scale})` }} />
    </div>
  );
}

export function WindowChrome({ label, children, dark }: { label: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-xl shadow-2xl ring-1 ${dark ? "bg-slate-900 ring-slate-700" : "bg-white ring-slate-200"}`}>
      <div className={`flex items-center gap-1.5 px-3 py-2 ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className={`ml-2 truncate rounded px-2 py-0.5 font-mono text-[10px] ${dark ? "bg-slate-900 text-slate-400" : "bg-white text-slate-500"}`}>{label}</span>
      </div>
      {children}
    </div>
  );
}
