import type { TemplateProps } from "@/lib/types";
import { commaList, fmtRange, href, stripProtocol } from "@/lib/utils";
import { Bullets, contactItems, Ext } from "./shared";

// Serif ফন্ট, মাঝখানে হেডার: মার্জিত ও ক্লাসিক, এক কলাম তাই ATS-বান্ধব
export default function Elegant({ cv, settings }: TemplateProps) {
  const { accent } = settings;
  const p = cv.personal;
  const H = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-1.5 mt-4 break-after-avoid text-center text-[10pt] font-semibold uppercase tracking-[0.25em]" style={{ color: accent }}>
      <span className="inline-block border-b px-3 pb-0.5" style={{ borderColor: accent }}>{children}</span>
    </h2>
  );
  return (
    <div className="text-[9.6pt] leading-[1.45] text-neutral-800" style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}>
      <header className="text-center">
        <h1 className="text-[24pt] font-normal uppercase leading-tight tracking-[0.12em] text-neutral-900">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="mt-1 text-[11pt] italic text-neutral-600">{p.title}</p>}
        <p className="mt-2 flex flex-wrap justify-center gap-x-2 text-[8.6pt] text-neutral-600">
          {contactItems(cv).map((c, i) => (
            <span key={i}>{i > 0 && <span className="mr-2" style={{ color: accent }}>◆</span>}<Ext url={c.url}>{c.label}</Ext></span>
          ))}
        </p>
      </header>

      {cv.summary && (<><H>Profile</H><p className="text-center italic">{cv.summary}</p></>)}

      {cv.skills.length > 0 && (
        <>
          <H>Expertise</H>
          <div className="space-y-0.5">
            {cv.skills.map((s) => (
              <p key={s.id} className="grid grid-cols-[32mm_1fr] gap-3">
                <span className="text-right font-semibold text-neutral-900">{s.name}</span>
                <span>{commaList(s.items).join(", ")}</span>
              </p>
            ))}
          </div>
        </>
      )}

      {cv.experience.length > 0 && (
        <>
          <H>Experience</H>
          <div className="space-y-2.5">
            {cv.experience.map((e) => (
              <div key={e.id} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-3">
                  <p><b className="text-neutral-900">{e.role}</b>{e.company && <span className="italic">, {e.company}</span>}</p>
                  <p className="shrink-0 text-[8.8pt] text-neutral-600">{fmtRange(e.start, e.end, e.current)}</p>
                </div>
                {e.location && <p className="text-[8.6pt] text-neutral-500">{e.location}</p>}
                <Bullets text={e.bullets} className="mt-0.5" />
              </div>
            ))}
          </div>
        </>
      )}

      {cv.projects.length > 0 && (
        <>
          <H>Selected Projects</H>
          <div className="space-y-2">
            {cv.projects.map((pr) => (
              <div key={pr.id} className="break-inside-avoid">
                <p><b className="text-neutral-900">{pr.name}</b>{pr.tech && <span className="italic text-neutral-600"> — {pr.tech}</span>}</p>
                {(pr.link || pr.repo) && (
                  <p className="text-[8.5pt] text-neutral-500">
                    {pr.link && <Ext url={href(pr.link)}>{stripProtocol(pr.link)}</Ext>}
                    {pr.link && pr.repo && " · "}
                    {pr.repo && <Ext url={href(pr.repo)}>{stripProtocol(pr.repo)}</Ext>}
                  </p>
                )}
                <Bullets text={pr.bullets} className="mt-0.5" />
              </div>
            ))}
          </div>
        </>
      )}

      {cv.education.length > 0 && (
        <>
          <H>Education</H>
          {cv.education.map((ed) => (
            <div key={ed.id} className="mb-1 flex items-baseline justify-between gap-3 break-inside-avoid">
              <p><b className="text-neutral-900">{ed.degree}</b><br /><span className="italic">{ed.institution}</span>{ed.result && <span className="text-neutral-600"> · {ed.result}</span>}</p>
              <p className="shrink-0 text-[8.8pt] text-neutral-600">{fmtRange(ed.start, ed.end)}</p>
            </div>
          ))}
        </>
      )}

      {(cv.achievements.length > 0 || cv.certifications.length > 0) && (
        <>
          <H>Honours</H>
          <Bullets text={[...cv.achievements, ...cv.certifications].map((a) => a.text).join("\n")} />
        </>
      )}
      {cv.languages && (<><H>Languages</H><p className="text-center">{cv.languages}</p></>)}
    </div>
  );
}
