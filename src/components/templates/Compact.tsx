import type { TemplateProps } from "@/lib/types";
import { commaList, fmtRange, href, stripProtocol } from "@/lib/utils";
import { Bullets, contactItems, Ext } from "./shared";

function H({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <h2 className="mb-1 mt-2.5 break-after-avoid border-b border-neutral-300 pb-[1px] text-[9.5pt] font-bold uppercase tracking-[0.12em]" style={{ color: accent }}>
      {children}
    </h2>
  );
}

// ঘন, এক কলাম: বেশি তথ্য এক পৃষ্ঠায়, ATS-বান্ধব
export default function Compact({ cv, settings }: TemplateProps) {
  const { accent } = settings;
  const p = cv.personal;
  return (
    <div className="text-[8.9pt] leading-[1.35] text-neutral-800">
      <header className="flex items-end justify-between gap-6 border-b-2 pb-2" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-[19pt] font-bold leading-none text-neutral-900">{p.fullName || "Your Name"}</h1>
          {p.title && <p className="mt-1 text-[10pt] font-medium text-neutral-600">{p.title}</p>}
        </div>
        <ul className="text-right text-[8.2pt] leading-[1.45] text-neutral-600">
          {contactItems(cv).map((c, i) => (
            <li key={i}><Ext url={c.url}>{c.label}</Ext></li>
          ))}
        </ul>
      </header>

      {cv.summary && (<><H accent={accent}>Summary</H><p>{cv.summary}</p></>)}

      {cv.skills.length > 0 && (
        <>
          <H accent={accent}>Skills</H>
          {cv.skills.map((s) => (
            <p key={s.id}>
              <b className="text-neutral-900">{s.name}:</b> {commaList(s.items).join(", ")}
            </p>
          ))}
        </>
      )}

      {cv.experience.length > 0 && (
        <>
          <H accent={accent}>Experience</H>
          <div className="space-y-1.5">
            {cv.experience.map((e) => (
              <div key={e.id} className="break-inside-avoid">
                <div className="flex justify-between gap-3">
                  <p><b className="text-neutral-900">{e.role}</b>{e.company && <> — {e.company}</>}{e.location && <span className="text-neutral-500">, {e.location}</span>}</p>
                  <p className="shrink-0 text-neutral-600">{fmtRange(e.start, e.end, e.current)}</p>
                </div>
                <Bullets text={e.bullets} className="mt-0.5 space-y-0" />
              </div>
            ))}
          </div>
        </>
      )}

      {cv.projects.length > 0 && (
        <>
          <H accent={accent}>Projects</H>
          <div className="space-y-1.5">
            {cv.projects.map((pr) => (
              <div key={pr.id} className="break-inside-avoid">
                <p><b className="text-neutral-900">{pr.name}</b>{pr.tech && <span className="text-neutral-600"> ({pr.tech})</span>}</p>
                {(pr.link || pr.repo) && (
                  <p className="text-[8.2pt] text-neutral-500">
                    {pr.link && <Ext url={href(pr.link)}>{stripProtocol(pr.link)}</Ext>}
                    {pr.link && pr.repo && " · "}
                    {pr.repo && <Ext url={href(pr.repo)}>{stripProtocol(pr.repo)}</Ext>}
                  </p>
                )}
                <Bullets text={pr.bullets} className="mt-0.5 space-y-0" />
              </div>
            ))}
          </div>
        </>
      )}

      {cv.education.length > 0 && (
        <>
          <H accent={accent}>Education</H>
          {cv.education.map((ed) => (
            <div key={ed.id} className="flex justify-between gap-3 break-inside-avoid">
              <p><b className="text-neutral-900">{ed.degree}</b>, {ed.institution}{ed.result && <span className="text-neutral-600"> — {ed.result}</span>}</p>
              <p className="shrink-0 text-neutral-600">{fmtRange(ed.start, ed.end)}</p>
            </div>
          ))}
        </>
      )}

      {(cv.achievements.length > 0 || cv.certifications.length > 0) && (
        <>
          <H accent={accent}>Achievements & Certifications</H>
          <Bullets text={[...cv.achievements, ...cv.certifications].map((a) => a.text).join("\n")} className="space-y-0" />
        </>
      )}
      {cv.languages && (<><H accent={accent}>Languages</H><p>{cv.languages}</p></>)}
    </div>
  );
}
