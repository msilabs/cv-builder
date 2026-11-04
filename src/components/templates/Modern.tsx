import type { TemplateProps } from "@/lib/types";
import { commaList, fmtRange, href, stripProtocol } from "@/lib/utils";
import { Bullets, contactItems, Ext } from "./shared";

// সাইডবার সহ দুই কলাম টেমপ্লেট
export default function Modern({ cv, settings }: TemplateProps) {
  const { accent, showPhoto } = settings;
  const p = cv.personal;
  const H = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 mt-5 break-after-avoid flex items-center gap-2 text-[10.5pt] font-bold uppercase tracking-wider first:mt-0" style={{ color: accent }}>
      <span className="inline-block h-[2px] w-4" style={{ background: accent }} />
      {children}
    </h2>
  );
  const SH = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 mt-5 text-[9.5pt] font-bold uppercase tracking-widest text-white/90 first:mt-0">{children}</h2>
  );

  return (
    <div className="grid min-h-[inherit] grid-cols-[34%_1fr] text-[9.3pt] leading-[1.42] text-neutral-800">
      <aside className="px-[7mm] py-[12mm] text-white" style={{ background: accent }}>
        {showPhoto && p.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo} alt="" className="mx-auto mb-5 h-28 w-28 rounded-full border-4 border-white/30 object-cover" />
        )}
        <SH>Contact</SH>
        <ul className="space-y-1.5 break-words text-[8.6pt] text-white/90">
          {contactItems(cv).map((c, i) => (
            <li key={i}>
              <Ext url={c.url}>{c.label}</Ext>
            </li>
          ))}
        </ul>

        {cv.skills.length > 0 && (
          <>
            <SH>Skills</SH>
            <div className="space-y-2.5">
              {cv.skills.map((s) => (
                <div key={s.id}>
                  <p className="mb-1 text-[8.6pt] font-semibold text-white">{s.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {commaList(s.items).map((it) => (
                      <span key={it} className="rounded bg-white/15 px-1.5 py-[1px] text-[8pt]">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {cv.languages && (
          <>
            <SH>Languages</SH>
            <p className="text-[8.6pt] text-white/90">{cv.languages}</p>
          </>
        )}
      </aside>

      <main className="px-[8mm] py-[12mm]">
        <h1 className="text-[22pt] font-extrabold leading-tight text-neutral-900">{p.fullName || "Your Name"}</h1>
        {p.title && <p className="text-[11.5pt] font-medium" style={{ color: accent }}>{p.title}</p>}
        {cv.summary && <p className="mt-3 text-neutral-700">{cv.summary}</p>}

        {cv.experience.length > 0 && (
          <>
            <H>Experience</H>
            <div className="space-y-3">
              {cv.experience.map((e) => (
                <div key={e.id} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-bold text-neutral-900">{e.role}</p>
                    <p className="shrink-0 text-[8.5pt] text-neutral-500">{fmtRange(e.start, e.end, e.current)}</p>
                  </div>
                  <p className="text-neutral-600">
                    {e.company}
                    {e.location && ` · ${e.location}`}
                  </p>
                  <Bullets text={e.bullets} className="mt-1" />
                </div>
              ))}
            </div>
          </>
        )}

        {cv.projects.length > 0 && (
          <>
            <H>Projects</H>
            <div className="space-y-3">
              {cv.projects.map((pr) => (
                <div key={pr.id} className="break-inside-avoid">
                  <p className="font-bold text-neutral-900">{pr.name}</p>
                  {pr.tech && <p className="text-[8.5pt] font-medium" style={{ color: accent }}>{pr.tech}</p>}
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
            <div className="space-y-2">
              {cv.education.map((ed) => (
                <div key={ed.id} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-bold text-neutral-900">{ed.degree}</p>
                    <p className="shrink-0 text-[8.5pt] text-neutral-500">{fmtRange(ed.start, ed.end)}</p>
                  </div>
                  <p className="text-neutral-600">
                    {ed.institution}
                    {ed.result && ` · ${ed.result}`}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {(cv.achievements.length > 0 || cv.certifications.length > 0) && (
          <>
            <H>Achievements & Certifications</H>
            <Bullets text={[...cv.achievements, ...cv.certifications].map((a) => a.text).join("\n")} />
          </>
        )}
      </main>
    </div>
  );
}
