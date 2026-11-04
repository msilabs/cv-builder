"use client";
import { useDialogs } from "@/components/ui/Dialogs";
import { useLang } from "@/i18n/lang";
import { useRef } from "react";
import { Menu, MenuDivider, MenuItem } from "@/components/toolbar/Menu";
import { exportProfile } from "@/lib/files";
import { extractJSON, parseImport, type ImportResult } from "@/lib/normalize";
import { emptyCV, sampleCV } from "@/lib/sample";
import { useStore } from "@/lib/store";
import { useNow } from "@/lib/useNow";

const DAY = 24 * 60 * 60 * 1000;

export function needsBackup(lastBackupAt: number | null, hasData: boolean, now: number) {
  return hasData && (!lastBackupAt || now - lastBackupAt > 7 * DAY);
}

export function FileMenu({ isEmpty, onImport }: { isEmpty: boolean; onImport: (r: ImportResult) => void }) {
  const { profile, setCV, data, markBackup } = useStore();
  const { t } = useLang();
  const L = t.b.file;
  const { confirm, toast } = useDialogs();
  const fileRef = useRef<HTMLInputElement>(null);
  const now = useNow(60000);
  const warn = needsBackup(data.lastBackupAt, !isEmpty, now);
  const last = data.lastBackupAt ? L.daysAgo(Math.max(0, Math.floor((now - data.lastBackupAt) / DAY))) : L.never;

  const readFile = async (f?: File) => {
    if (!f) return;
    try {
      onImport(parseImport(extractJSON(await f.text())));
    } catch (e) {
      const m = (e as Error).message;
      toast(L.openError(t.b.errors[m] ?? t.b.errors.parse), "error");
    }
  };

  return (
    <>
      <Menu label={<>📁 <span className="hidden lg:inline">{L.menu}</span></>} badge={warn}>
        {(close) => (
          <>
            <MenuItem onClick={() => { exportProfile(profile); markBackup(); close(); toast(t.b.toast.backup); }} hint={L.lastBackup(last)}>
              {L.save}
            </MenuItem>
            <MenuItem onClick={() => { fileRef.current?.click(); close(); }} hint={L.importHint}>
              {L.import}
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={async () => { close(); if (isEmpty || (await confirm({ message: L.confirmSample, confirmLabel: t.b.dialogs.load }))) setCV(sampleCV); }}>
              {L.sample}
            </MenuItem>
            <MenuItem danger onClick={async () => { close(); if (await confirm({ message: L.confirmClear, confirmLabel: t.b.dialogs.clear, danger: true })) setCV(emptyCV); }}>
              {L.clear}
            </MenuItem>
            {warn && (
              <p className="m-1 rounded-md bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-800">
                {L.backupWarn}
              </p>
            )}
          </>
        )}
      </Menu>
      <input ref={fileRef} type="file" accept="application/json,.json,.txt" className="hidden"
        onChange={(e) => { readFile(e.target.files?.[0]); e.target.value = ""; }} />
    </>
  );
}
