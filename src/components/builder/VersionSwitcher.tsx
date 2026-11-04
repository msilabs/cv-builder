"use client";
import { Menu, MenuDivider, MenuItem } from "@/components/toolbar/Menu";
import { useStore } from "@/lib/store";

const ago = (t: number) => {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return "এইমাত্র";
  if (m < 60) return `${m} মিনিট আগে`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ঘণ্টা আগে`;
  return `${Math.round(h / 24)} দিন আগে`;
};

const askName = (msg: string, def: string) => {
  const v = prompt(msg, def);
  return v?.trim() ? v.trim().slice(0, 60) : null;
};

// একাধিক CV ভার্সন: মূল CV, নির্দিষ্ট জবের জন্য আলাদা CV ইত্যাদি
export function VersionSwitcher() {
  const { data, profile, switchProfile, addProfile, duplicateProfile, renameProfile, deleteProfile } = useStore();
  return (
    <Menu align="left"
      buttonClass="flex max-w-[11rem] items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 sm:max-w-[16rem]"
      label={<><span aria-hidden>🗂</span><span className="truncate">{profile.name}</span></>}>
      {(close) => (
        <div className="w-72">
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">আপনার CV ভার্সন ({data.profiles.length})</p>
          <div className="max-h-64 overflow-y-auto">
            {data.profiles.map((p) => (
              <button key={p.id} type="button" onClick={() => { switchProfile(p.id); close(); }}
                className={`flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 ${p.id === profile.id ? "bg-teal-50" : ""}`}>
                <span className="mt-0.5 w-4 text-teal-700">{p.id === profile.id ? "✓" : ""}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-slate-800">{p.name}</span>
                  <span className="block text-[11px] text-slate-400">{p.cv.personal.fullName || "নাম নেই"} · {ago(p.updatedAt)}</span>
                </span>
              </button>
            ))}
          </div>
          <MenuDivider />
          <MenuItem hint="একই তথ্য নিয়ে নির্দিষ্ট জবের জন্য আলাদা CV বানাতে" onClick={() => {
            const n = askName("নতুন কপির নাম দিন:", `${profile.name} (কপি)`);
            if (n) duplicateProfile(profile.id, n);
            close();
          }}>⧉ এই ভার্সনের কপি বানান</MenuItem>
          <MenuItem onClick={() => {
            const n = askName("নতুন খালি ভার্সনের নাম দিন:", "নতুন CV");
            if (n) addProfile(n);
            close();
          }}>＋ নতুন খালি ভার্সন</MenuItem>
          <MenuItem onClick={() => {
            const n = askName("নতুন নাম দিন:", profile.name);
            if (n) renameProfile(profile.id, n);
            close();
          }}>✎ নাম বদলান</MenuItem>
          <MenuItem danger onClick={() => {
            if (confirm(`"${profile.name}" ভার্সনটা মুছে ফেলবেন? এটা আর ফেরত আনা যাবে না।`)) deleteProfile(profile.id);
            close();
          }}>🗑 এই ভার্সন মুছুন</MenuItem>
        </div>
      )}
    </Menu>
  );
}
