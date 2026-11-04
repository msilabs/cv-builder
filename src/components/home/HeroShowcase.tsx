import Image from "next/image";
import { heroImages } from "./previewImages";
import { WindowChrome } from "./ScaledFrame";

// আগে থেকে তৈরি ছবি: CV, README, পোর্টফোলিও (হোম পেজে বাড়তি JavaScript লাগে না)
export function HeroShowcase({ alt }: { alt: { cv: string; readme: string; portfolio: string } }) {
  return (
    <div className="relative mx-auto h-[330px] w-[358px] sm:h-[470px] sm:w-[510px] lg:h-[520px] lg:w-[564px]">
      <div className="absolute left-0 top-0 h-[520px] w-[564px] origin-top-left scale-[0.635] sm:scale-[0.905] lg:scale-100">
        <div aria-hidden className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-teal-400/25 via-emerald-300/10 to-violet-400/20 blur-2xl dark:from-teal-500/20 dark:to-violet-500/20" />
        <div className="absolute right-0 top-0">
          <WindowChrome label="tanvir.github.io" dark>
            <Image src={heroImages.portfolio} alt={alt.portfolio} width={432} height={274} priority className="block" />
          </WindowChrome>
        </div>
        <div className="absolute left-0 top-[70px] -rotate-[4deg] overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition duration-500 hover:rotate-0">
          <Image src={heroImages.cv} alt={alt.cv} width={238} height={337} priority className="block" />
        </div>
        <div className="absolute bottom-0 right-4">
          <WindowChrome label="README.md">
            <Image src={heroImages.readme} alt={alt.readme} width={344} height={256} className="block" />
          </WindowChrome>
        </div>
      </div>
    </div>
  );
}
