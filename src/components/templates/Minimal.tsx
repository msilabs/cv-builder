import type { TemplateProps } from "@/lib/types";
import { commaList, fmtRange, href, stripProtocol } from "@/lib/utils";
import { Bullets, contactItems, Ext } from "./shared";

// বাম পাশে সেকশন লেবেল সহ মিনিমাল টেমপ্লেট
export default function Minimal({ cv, settings }: TemplateProps) {
  const { accent, showPhoto } = settings;
  const p = cv.personal;
  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <section className="grid grid-cols-[28mm_1fr] gap-4 border-t border-neutral-200 pt-3 mt-3">
      <h2 className="text-[8.5pt] font-semibold uppercase tracking-widest" style={{ color: accent }}>{label}</h2>
      <div>{children}</div>
    </section>
  );

  return (
    <div className="text-[9.4pt] leading-[1.45] text-neutral-700">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-[24pt] font-light tracking-tight text-neutral-900">{p.fullName || "Your Name"}</h1>
          {p.title && <p className="text-[11pt] text-neutral-500">{p.title}</p>}
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[8.6pt] text-neutral-500">
            {contactItems(cv).map((c, i) => (
              <Ext key={i} url={c.url}>{c.label}</Ext>
            ))}
          </p>
        </div>
        {showPhoto && p.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo} alt="" className="h-24 w-24 shrink-0 rounded-lg object-cover" />
        )}
      </header>

      {cv.summary && (
        <Row label="Profile">
          <p>{cv.summary}</p>
        </Row>
      )}

      {cv.skills.length > 0 && (
        <Row label="Skills">
          <div className="space-y-0.5">
            {cv.skills.map((s) => (
              <p key={s.id}>
                <span className="font-medium text-neutral-900">{s.name}</span>
                <span className="text-neutral-400"> — </span>
                {commaList(s.items).join(" · ")}
              </p>
            ))}
          </div>
        </Row>
      )}

      {cv.experience.length > 0 && (
        <Row label="Experience">
          <div className="space-y-3">
            {cv.experience.map((e) => (
              <div key={e.id} className="break-inside-avoid">
                <div className="flex justify-between gap-3">
                  <p>
                    <span className="font-semibold text-neutral-900">{e.role}</span>
                    {e.company && <span>, {e.company}</span>}
                  </p>
                  <p className="shrink-0 text-[8.5pt] text-neutral-400">{fmtRange(e.start, e.end, e.current)}</p>
                </div>
                {e.location && <p className="text-[8.5pt] text-neutral-400">{e.location}</p>}
                <Bullets text={e.bullets} className="mt-1" />
              </div>
            ))}
          </div>
        </Row>
      )}

      {cv.projects.length > 0 && (
        <Row label="Projects">
          <div className="space-y-3">
            {cv.projects.map((pr) => (
              <div key={pr.id} className="break-inside-avoid">
                <p>
                  <span className="font-semibold text-neutral-900">{pr.name}</span>
                  {pr.tech && <span className="text-neutral-400"> — {pr.tech}</span>}
                </p>
                {(pr.link || pr.repo) && (
                  <p className="text-[8.5pt]" style={{ color: accent }}>
                    {pr.link && <Ext url={href(pr.link)}>{stripProtocol(pr.link)}</Ext>}
                    {pr.link && pr.repo && " · "}
                    {pr.repo && <Ext url={href(pr.repo)}>{stripProtocol(pr.repo)}</Ext>}
                  </p>
                )}
                <Bullets text={pr.bullets} className="mt-0.5" />
              </div>
            ))}
          </div>
        </Row>
      )}

      {cv.education.length > 0 && (
        <Row label="Education">
          <div className="space-y-2">
            {cv.education.map((ed) => (
              <div key={ed.id} className="break-inside-avoid">
                <div className="flex justify-between gap-3">
                  <p className="font-semibold text-neutral-900">{ed.degree}</p>
                  <p className="shrink-0 text-[8.5pt] text-neutral-400">{fmtRange(ed.start, ed.end)}</p>
                </div>
                <p>
                  {ed.institution}
                  {ed.result && <span className="text-neutral-500"> · {ed.result}</span>}
                </p>
              </div>
            ))}
          </div>
        </Row>
      )}

      {cv.achievements.length > 0 && (
        <Row label="Achievements">
          <Bullets text={cv.achievements.map((a) => a.text).join("\n")} />
        </Row>
      )}
      {cv.certifications.length > 0 && (
        <Row label="Certifications">
          <Bullets text={cv.certifications.map((a) => a.text).join("\n")} />
        </Row>
      )}
      {cv.languages && (
        <Row label="Languages">
          <p>{cv.languages}</p>
        </Row>
      )}
    </div>
  );
}
