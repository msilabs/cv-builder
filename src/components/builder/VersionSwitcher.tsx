"use client";
import { useDialogs } from "@/components/ui/Dialogs";
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


// একাধিক CV ভার্সন: মূল CV, নির্দিষ্ট জবের জন্য আলাদা CV ইত্যাদি
export function VersionSwitcher() {
  const { data, profile, switchProfile, addProfile, duplicateProfile, renameProfile, deleteProfile } = useStore();
  const { t } = useLang();
  const L = t.b.versions;
  const { prompt, confirm, toast } = useDialogs();
  const askName = (title: string, defaultValue: string) => prompt({ title, defaultValue });
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
          <MenuItem hint={L.duplicateHint} onClick={async () => {
            close();
            const n = await askName(L.duplicatePrompt, `${profile.name}${L.copySuffix}`);
            if (n) { duplicateProfile(profile.id, n); toast(t.b.toast.versionCreated(n)); }
          }}>{L.duplicate}</MenuItem>
          <MenuItem onClick={async () => {
            close();
            const n = await askName(L.addPrompt, L.addDefault);
            if (n) { addProfile(n); toast(t.b.toast.versionCreated(n)); }
          }}>{L.add}</MenuItem>
          <MenuItem onClick={async () => {
            close();
            const n = await askName(L.renamePrompt, profile.name);
            if (n) { renameProfile(profile.id, n); toast(t.b.toast.renamed); }
          }}>{L.rename}</MenuItem>
          <MenuItem danger onClick={async () => {
            close();
            if (await confirm({ message: L.confirmRemove(profile.name), confirmLabel: t.b.dialogs.delete, danger: true })) {
              deleteProfile(profile.id);
              toast(t.b.toast.versionDeleted, "info");
            }
          }}>{L.remove}</MenuItem>
        </div>
      )}
    </Menu>
  );
}
