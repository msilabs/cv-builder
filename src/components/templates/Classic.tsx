import type { TemplateProps } from "@/lib/types";
import { commaList, fmtRange, href, stripProtocol } from "@/lib/utils";
import { Bullets, contactItems, Ext } from "./shared";

function H({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <h2 className="mt-3 mb-1 break-after-avoid border-b pb-0.5 text-[10.5pt] font-bold uppercase tracking-wider" style={{ color: accent, borderColor: accent }}>
      {children}
    </h2>
  );
}

// ATS-বান্ধব এক কলাম টেমপ্লেট
export default function Classic({ cv, settings }: TemplateProps) {
  const { accent } = settings;
  const p = cv.personal;

  return (
    <div className="text-[9.3pt] leading-[1.4] text-neutral-800">
      <header className="text-center">
        <h1 className="text-[22pt] font-bold leading-tight text-neutral-900">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="mt-0.5 text-[11pt] font-medium" style={{ color: accent }}>{p.title}</p>}
        <p className="mt-1 flex flex-wrap justify-center gap-x-2 text-[8.8pt] text-neutral-600">
          {contactItems(cv).map((c, i) => (
            <span key={i}>
              {i > 0 && <span className="mr-2 text-neutral-300">|</span>}
              <Ext url={c.url}>{c.label}</Ext>
            </span>
          ))}
        </p>
      </header>

      {cv.summary && (
        <>
          <H accent={accent}>Summary</H>
          <p>{cv.summary}</p>
        </>
      )}

      {cv.skills.length > 0 && (
        <>
          <H accent={accent}>Technical Skills</H>
          <div className="space-y-0.5">
            {cv.skills.map((s) => (
              <p key={s.id}>
                <span className="font-semibold text-neutral-900">{s.name}: </span>
                {commaList(s.items).join(", ")}
              </p>
            ))}
          </div>
        </>
      )}

      {cv.experience.length > 0 && (
        <>
          <H accent={accent}>Experience</H>
          <div className="space-y-2">
            {cv.experience.map((e) => (
              <div key={e.id} className="break-inside-avoid">
                <div className="flex justify-between gap-4">
                  <p className="font-bold text-neutral-900">{e.role}</p>
                  <p className="shrink-0 text-neutral-600">{fmtRange(e.start, e.end, e.current)}</p>
                </div>
                <div className="flex justify-between gap-4 italic text-neutral-700">
                  <p>{e.company}</p>
                  <p className="shrink-0">{e.location}</p>
                </div>
                <Bullets text={e.bullets} className="mt-1" />
              </div>
            ))}
          </div>
        </>
      )}

      {cv.projects.length > 0 && (
        <>
          <H accent={accent}>Projects</H>
          <div className="space-y-2">
            {cv.projects.map((pr) => (
              <div key={pr.id} className="break-inside-avoid">
                <p>
                  <span className="font-bold text-neutral-900">{pr.name}</span>
                  {pr.tech && <span className="text-neutral-600"> | {pr.tech}</span>}
                </p>
                {(pr.link || pr.repo) && (
                  <p className="text-[8.8pt] text-neutral-600">
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
          <H accent={accent}>Education</H>
          <div className="space-y-1.5">
            {cv.education.map((ed) => (
              <div key={ed.id} className="break-inside-avoid">
                <div className="flex justify-between gap-4">
                  <p className="font-bold text-neutral-900">{ed.degree}</p>
                  <p className="shrink-0 text-neutral-600">{fmtRange(ed.start, ed.end)}</p>
                </div>
                <div className="flex justify-between gap-4 text-neutral-700">
                  <p className="italic">{ed.institution}</p>
                  <p className="shrink-0 font-medium">{ed.result}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {cv.achievements.length > 0 && (
        <>
          <H accent={accent}>Achievements</H>
          <Bullets text={cv.achievements.map((a) => a.text).join("\n")} />
        </>
      )}

      {cv.certifications.length > 0 && (
        <>
          <H accent={accent}>Certifications</H>
          <Bullets text={cv.certifications.map((a) => a.text).join("\n")} />
        </>
      )}

      {cv.languages && (
        <>
          <H accent={accent}>Languages</H>
          <p>{cv.languages}</p>
        </>
      )}
    </div>
  );
}
