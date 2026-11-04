import type { TemplateProps } from "@/lib/types";
import { commaList, fmtRange, href, stripProtocol } from "@/lib/utils";
import { Bullets, contactItems, Ext } from "./shared";

// সময়রেখা: বাম পাশে তারিখ, মাঝে রঙিন রেখা ও বিন্দু
export default function Timeline({ cv, settings }: TemplateProps) {
  const { accent, showPhoto } = settings;
  const p = cv.personal;
  const H = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 mt-5 flex break-after-avoid items-center gap-3 text-[10.5pt] font-bold uppercase tracking-[0.14em] text-neutral-900">
      <span className="h-2.5 w-2.5 rotate-45" style={{ background: accent }} />
      {children}
      <span className="h-px flex-1 bg-neutral-200" />
    </h2>
  );
  const Item = ({ when, children }: { when: string; children: React.ReactNode }) => (
    <div className="grid break-inside-avoid grid-cols-[26mm_1fr] gap-4">
      <p className="pt-[1px] text-right text-[8.4pt] font-medium leading-tight text-neutral-500">{when}</p>
      <div className="relative border-l-2 pb-3 pl-4" style={{ borderColor: `${accent}55` }}>
        <span className="absolute -left-[5px] top-[3px] h-2 w-2 rounded-full ring-2 ring-white" style={{ background: accent }} />
        {children}
      </div>
    </div>
  );
  return (
    <div className="text-[9.3pt] leading-[1.45] text-neutral-700">
      <header className="flex items-center gap-5 rounded-xl px-5 py-4" style={{ background: `${accent}12` }}>
        {showPhoto && p.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-white" />
        )}
        <div className="min-w-0">
          <h1 className="text-[22pt] font-extrabold leading-tight text-neutral-900">{p.fullName || "Your Name"}</h1>
          {p.title && <p className="text-[11pt] font-semibold" style={{ color: accent }}>{p.title}</p>}
          <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[8.5pt] text-neutral-600">
            {contactItems(cv).map((c, i) => <Ext key={i} url={c.url}>{c.label}</Ext>)}
          </p>
        </div>
      </header>

      {cv.summary && <p className="mt-4">{cv.summary}</p>}

      {cv.skills.length > 0 && (
        <>
          <H>Skills</H>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {cv.skills.map((s) => (
              <p key={s.id}><b className="text-neutral-900">{s.name}</b><br /><span className="text-neutral-600">{commaList(s.items).join(" · ")}</span></p>
            ))}
          </div>
        </>
      )}

      {cv.experience.length > 0 && (
        <>
          <H>Experience</H>
          {cv.experience.map((e) => (
            <Item key={e.id} when={fmtRange(e.start, e.end, e.current)}>
              <p className="font-bold text-neutral-900">{e.role}</p>
              <p className="text-neutral-500">{e.company}{e.location && ` · ${e.location}`}</p>
              <Bullets text={e.bullets} className="mt-1" />
            </Item>
          ))}
        </>
      )}

      {cv.projects.length > 0 && (
        <>
          <H>Projects</H>
          <div className="grid grid-cols-2 gap-3">
            {cv.projects.map((pr) => (
              <div key={pr.id} className="break-inside-avoid rounded-lg border border-neutral-200 p-2.5">
                <p className="font-bold text-neutral-900">{pr.name}</p>
                {pr.tech && <p className="text-[8.3pt] font-medium" style={{ color: accent }}>{pr.tech}</p>}
                <Bullets text={pr.bullets} className="mt-1 text-[8.8pt]" />
                {(pr.link || pr.repo) && (
                  <p className="mt-1 break-all text-[8pt] text-neutral-500">
                    {pr.link && <Ext url={href(pr.link)}>{stripProtocol(pr.link)}</Ext>}
                    {pr.link && pr.repo && " · "}
                    {pr.repo && <Ext url={href(pr.repo)}>{stripProtocol(pr.repo)}</Ext>}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {cv.education.length > 0 && (
        <>
          <H>Education</H>
          {cv.education.map((ed) => (
            <Item key={ed.id} when={fmtRange(ed.start, ed.end)}>
              <p className="font-bold text-neutral-900">{ed.degree}</p>
              <p className="text-neutral-500">{ed.institution}{ed.result && ` · ${ed.result}`}</p>
            </Item>
          ))}
        </>
      )}

      {(cv.achievements.length > 0 || cv.certifications.length > 0) && (
        <>
          <H>Achievements</H>
          <Bullets text={[...cv.achievements, ...cv.certifications].map((a) => a.text).join("\n")} />
        </>
      )}
      {cv.languages && (<><H>Languages</H><p>{cv.languages}</p></>)}
    </div>
  );
}
