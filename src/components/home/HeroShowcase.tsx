"use client";
import { useMemo } from "react";
import { TemplateThumb } from "@/components/builder/TemplateThumb";
import { markdownDocument } from "@/components/readme/MarkdownFrame";
import { generatePortfolio } from "@/lib/portfolio";
import { generateReadme } from "@/lib/readme";
import { defaultSettings, sampleCV } from "@/lib/sample";
import { ScaledFrame, WindowChrome } from "./ScaledFrame";

// আসল জেনারেটর দিয়ে তৈরি তিনটা প্রিভিউ: CV, README, পোর্টফোলিও
export function HeroShowcase() {
  const portfolio = useMemo(() => generatePortfolio(sampleCV, { ...defaultSettings.portfolio, theme: "midnight" }), []);
  const readme = useMemo(() => markdownDocument(generateReadme(sampleCV, { style: "code", showStats: false, hidden: ["education", "languages", "achievements", "certifications"] })), []);
  return (
    <div aria-hidden className="relative mx-auto h-[330px] w-[358px] sm:h-[470px] sm:w-[510px] lg:h-[520px] lg:w-[564px]">
      <div className="absolute left-0 top-0 h-[520px] w-[564px] origin-top-left scale-[0.635] sm:scale-[0.905] lg:scale-100">
        <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-teal-400/25 via-emerald-300/10 to-violet-400/20 blur-2xl dark:from-teal-500/20 dark:to-violet-500/20" />
        <div className="absolute right-0 top-0">
          <WindowChrome label="tanvir.github.io" dark>
            <ScaledFrame title="Portfolio" html={portfolio} width={1200} height={760} scale={0.36} />
          </WindowChrome>
        </div>
        <div className="absolute left-0 top-[70px] -rotate-[4deg] rounded-md shadow-2xl ring-1 ring-black/5 transition duration-500 hover:rotate-0">
          <TemplateThumb id="classic" accent="#0f766e" width={238} />
        </div>
        <div className="absolute bottom-0 right-4">
          <WindowChrome label="README.md">
            <ScaledFrame title="README" html={readme} width={860} height={640} scale={0.4} />
          </WindowChrome>
        </div>
      </div>
    </div>
  );
}
