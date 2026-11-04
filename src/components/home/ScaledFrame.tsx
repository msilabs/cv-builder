// ব্রাউজার জানালার মতো ফ্রেম (শুধু দেখার জন্য)
export function WindowChrome({ label, children, dark }: { label: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-xl shadow-2xl ring-1 ${dark ? "bg-slate-900 ring-slate-700" : "bg-white ring-slate-200"}`}>
      <div aria-hidden className={`flex items-center gap-1.5 px-3 py-2 ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className={`ml-2 truncate rounded px-2 py-0.5 font-mono text-[10px] ${dark ? "bg-slate-900 text-slate-400" : "bg-white text-slate-600"}`}>{label}</span>
      </div>
      {children}
    </div>
  );
}
