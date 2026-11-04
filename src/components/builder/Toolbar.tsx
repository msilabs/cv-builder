"use client";
import Link from "next/link";
import { IssueLink, StarButton } from "@/components/toolbar/GitHubButtons";
import { SaveIndicator } from "@/components/toolbar/SaveIndicator";
import { useStore } from "@/lib/store";

export function Toolbar({ left, center, right }: { left?: React.ReactNode; center?: React.ReactNode; right?: React.ReactNode }) {
  const { saveState, savedAt } = useStore();
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/" className="shrink-0 font-bold text-teal-700">CV<span className="text-slate-800">বানাও</span></Link>
        {left}
        <SaveIndicator state={saveState} savedAt={savedAt} />
      </div>
      {center && <div className="order-last flex w-full justify-center md:order-none md:w-auto md:flex-1">{center}</div>}
      <div className="ml-auto flex items-center gap-2">
        {right}
        <IssueLink />
        <StarButton compact />
      </div>
    </div>
  );
}
