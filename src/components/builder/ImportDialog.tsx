"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { ImportResult } from "@/lib/normalize";
import { isEmptyCV } from "@/lib/sample";
import { useStore } from "@/lib/store";

// ইমপোর্ট করা ডেটা কোথায় বসবে: এই ভার্সনে, নাকি নতুন ভার্সনে (মূল CV অক্ষত রাখতে)
export function ImportDialog({ result, onClose }: { result: ImportResult | null; onClose: () => void }) {
  const { profile, setCV, setSettings, addProfile } = useStore();
  const [name, setName] = useState("");
  if (!result) return null;
  const defName = result.name || result.cv.personal.fullName || "ইমপোর্ট করা CV";
  const replace = () => {
    setCV(result.cv);
    if (result.settings) setSettings(result.settings);
    onClose();
  };
  const asNew = () => {
    addProfile(name.trim() || defName, result.cv, result.settings);
    onClose();
  };
  const c = result.cv;
  return (
    <Modal open onClose={onClose} title="ইমপোর্ট করা CV কোথায় রাখবেন?">
      <p className="text-sm text-slate-600">
        পাওয়া গেছে: <b>{c.personal.fullName || "নাম নেই"}</b> · {c.experience.length}টা অভিজ্ঞতা · {c.projects.length}টা প্রজেক্ট · {c.skills.length}টা স্কিল গ্রুপ
      </p>
      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3">
          <p className="text-sm font-semibold text-slate-800">নতুন ভার্সন হিসেবে রাখুন (নিরাপদ)</p>
          <p className="text-xs text-slate-500">বর্তমান &quot;{profile.name}&quot; যেমন আছে তেমনই থাকবে।</p>
          <div className="mt-2 flex gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={defName}
              className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-teal-600" />
            <button type="button" onClick={asNew} className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-800">নতুন ভার্সন</button>
          </div>
        </div>
        <button type="button" onClick={replace} className="w-full rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50">
          <p className="text-sm font-semibold text-slate-800">&quot;{profile.name}&quot; এর ডেটা বদলে দিন</p>
          <p className="text-xs text-slate-500">{isEmptyCV(profile.cv) ? "এই ভার্সনটা এখন খালি।" : "⚠ এই ভার্সনের বর্তমান ডেটা মুছে যাবে।"}</p>
        </button>
      </div>
    </Modal>
  );
}
