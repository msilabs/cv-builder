"use client";
import { useLang } from "@/i18n/lang";
import { Menu, MenuDivider, MenuItem } from "@/components/toolbar/Menu";
import { btnOutline } from "@/components/ui/styles";
import { useStore } from "@/lib/store";

const ago = (time: number, A: { now: string; min: (x: number) => string; hour: (x: number) => string; day: (x: number) => string }) => {
  const m = Math.round((Date.now() - time) / 60000);
  if (m < 1) return A.now;
  if (m < 60) return A.min(m);
  const h = Math.round(m / 60);
  if (h < 24) return A.hour(h);
  return A.day(Math.round(h / 24));
};

const askName = (msg: string, def: string) => {
  const v = prompt(msg, def);
  return v?.trim() ? v.trim().slice(0, 60) : null;
};

// একাধিক CV ভার্সন: মূল CV, নির্দিষ্ট জবের জন্য আলাদা CV ইত্যাদি
export function VersionSwitcher() {
  const { data, profile, switchProfile, addProfile, duplicateProfile, renameProfile, deleteProfile } = useStore();
  const { t } = useLang();
  const L = t.b.versions;
  return (
    <Menu align="left"
      buttonClass={`${btnOutline} max-w-[8.5rem] !justify-start px-2.5 sm:max-w-[16rem]`}
      label={<><span aria-hidden>🗂</span><span className="truncate">{profile.name}</span></>}>
      {(close) => (
        <div className="w-72">
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{L.heading(data.profiles.length)}</p>
          <div className="max-h-64 overflow-y-auto">
            {data.profiles.map((p) => (
              <button key={p.id} type="button" onClick={() => { switchProfile(p.id); close(); }}
                className={`flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 ${p.id === profile.id ? "bg-teal-50" : ""}`}>
                <span className="mt-0.5 w-4 text-teal-700">{p.id === profile.id ? "✓" : ""}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-slate-800">{p.name}</span>
                  <span className="block text-[11px] text-slate-400">{p.cv.personal.fullName || L.noName} · {ago(p.updatedAt, t.b.ago)}</span>
                </span>
              </button>
            ))}
          </div>
          <MenuDivider />
          <MenuItem hint={L.duplicateHint} onClick={() => {
            const n = askName(L.duplicatePrompt, `${profile.name}${L.copySuffix}`);
            if (n) duplicateProfile(profile.id, n);
            close();
          }}>{L.duplicate}</MenuItem>
          <MenuItem onClick={() => {
            const n = askName(L.addPrompt, L.addDefault);
            if (n) addProfile(n);
            close();
          }}>{L.add}</MenuItem>
          <MenuItem onClick={() => {
            const n = askName(L.renamePrompt, profile.name);
            if (n) renameProfile(profile.id, n);
            close();
          }}>{L.rename}</MenuItem>
          <MenuItem danger onClick={() => {
            if (confirm(L.confirmRemove(profile.name))) deleteProfile(profile.id);
            close();
          }}>{L.remove}</MenuItem>
        </div>
      )}
    </Menu>
  );
}
