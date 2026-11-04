// বিল্ডারের সব বোতামের এক রকম স্টাইল
const base =
  "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 disabled:cursor-not-allowed disabled:opacity-40";

export const btnOutline = `${base} border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50`;
export const btnPrimary = `${base} bg-teal-700 font-semibold text-white shadow-sm shadow-teal-900/10 hover:bg-teal-800`;
export const btnAI = `${base} border border-violet-200 bg-violet-50 text-violet-800 hover:border-violet-300 hover:bg-violet-100`;
export const btnGhost = `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900`;
