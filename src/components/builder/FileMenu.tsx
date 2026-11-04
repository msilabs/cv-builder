"use client";
import { useRef } from "react";
import { Menu, MenuDivider, MenuItem } from "@/components/toolbar/Menu";
import { exportProfile } from "@/lib/files";
import { extractJSON, parseImport, type ImportResult } from "@/lib/normalize";
import { emptyCV, sampleCV } from "@/lib/sample";
import { useStore } from "@/lib/store";

const DAY = 24 * 60 * 60 * 1000;

export function needsBackup(lastBackupAt: number | null, hasData: boolean) {
  return hasData && (!lastBackupAt || Date.now() - lastBackupAt > 7 * DAY);
}

export function FileMenu({ isEmpty, onImport }: { isEmpty: boolean; onImport: (r: ImportResult) => void }) {
  const { profile, setCV, data, markBackup } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const warn = needsBackup(data.lastBackupAt, !isEmpty);
  const last = data.lastBackupAt ? `${Math.max(0, Math.floor((Date.now() - data.lastBackupAt) / DAY))} দিন আগে` : "কখনো নেওয়া হয়নি";

  const readFile = async (f?: File) => {
    if (!f) return;
    try {
      onImport(parseImport(extractJSON(await f.text())));
    } catch (e) {
      alert(`ফাইলটা খোলা গেল না: ${(e as Error).message}`);
    }
  };

  return (
    <>
      <Menu label={<>📁 <span className="hidden sm:inline">ফাইল</span></>} badge={warn}>
        {(close) => (
          <>
            <MenuItem onClick={() => { exportProfile(profile); markBackup(); close(); }} hint={`শেষ ব্যাকআপ: ${last}`}>
              💾 JSON হিসেবে সেভ (ব্যাকআপ)
            </MenuItem>
            <MenuItem onClick={() => { fileRef.current?.click(); close(); }} hint="আগে সেভ করা বা AI-এর বানানো JSON">
              📂 JSON ইমপোর্ট
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => { if (isEmpty || confirm("নমুনা ডেটা লোড করবেন? এই ভার্সনের বর্তমান ডেটা মুছে যাবে।")) setCV(sampleCV); close(); }}>
              🧪 নমুনা CV লোড করুন
            </MenuItem>
            <MenuItem danger onClick={() => { if (confirm("এই ভার্সনের সব ডেটা মুছে ফেলবেন?")) setCV(emptyCV); close(); }}>
              🗑 সব মুছে নতুন করে শুরু
            </MenuItem>
            {warn && (
              <p className="m-1 rounded-md bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-800">
                ডেটা শুধু এই ব্রাউজারে আছে। ব্রাউজারের ডেটা মুছলে বা অন্য ডিভাইসে গেলে পাবেন না, তাই মাঝে মাঝে JSON ব্যাকআপ নিন।
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
