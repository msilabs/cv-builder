"use client";
import { useLang } from "@/i18n/lang";
import type { CV, SectionKey, Education, Experience, Project, SimpleItem, SkillGroup } from "@/lib/types";
import { uid } from "@/lib/utils";
import { AddButton, Field, ItemCard, listOps, Section } from "./fields";

export default function Editor({ cv, setCV, hidden, toggleSection }: { cv: CV; setCV: (fn: (c: CV) => CV) => void; hidden: SectionKey[]; toggleSection: (k: SectionKey) => void }) {
  const { t } = useLang();
  const L = t.b.editor;
  const vis = (k: SectionKey) => ({ visible: !hidden.includes(k), onToggleVisible: () => toggleSection(k) });
  const set = <K extends keyof CV>(k: K, v: CV[K]) => setCV((c) => ({ ...c, [k]: v }));
  const setP = (k: keyof CV["personal"], v: string) => setCV((c) => ({ ...c, personal: { ...c.personal, [k]: v } }));
  const p = cv.personal;

  const exp = listOps<Experience>(cv.experience, (l) => set("experience", l));
  const proj = listOps<Project>(cv.projects, (l) => set("projects", l));
  const edu = listOps<Education>(cv.education, (l) => set("education", l));
  const sk = listOps<SkillGroup>(cv.skills, (l) => set("skills", l));

  const onPhoto = (f?: File) => {
    if (!f) return;
    if (f.size > 1.5 * 1024 * 1024) return alert(L.photoTooBig);
    const r = new FileReader();
    r.onload = () => setP("photo", String(r.result));
    r.readAsDataURL(f);
  };

  return (
    <div className="space-y-3">
      <Section title={L.personal} icon="👤" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="field-fullName" label={L.fullName} value={p.fullName} onChange={(v) => setP("fullName", v)} placeholder="Tanvir Ahmed" />
          <Field label={L.title} value={p.title} onChange={(v) => setP("title", v)} placeholder="Flutter Developer" />
          <Field label={L.email} type="email" value={p.email} onChange={(v) => setP("email", v)} placeholder="you@example.com" />
          <Field label={L.phone} value={p.phone} onChange={(v) => setP("phone", v)} placeholder="+880 17XX-XXXXXX" />
          <Field label={L.location} value={p.location} onChange={(v) => setP("location", v)} placeholder="Dhaka, Bangladesh" />
          <Field label="GitHub" value={p.github} onChange={(v) => setP("github", v)} placeholder="github.com/username" />
          <Field label="LinkedIn" value={p.linkedin} onChange={(v) => setP("linkedin", v)} placeholder="linkedin.com/in/username" />
          <Field label={L.website} value={p.website} onChange={(v) => setP("website", v)} placeholder="yourname.dev" />
          <div className="sm:col-span-2">
            <Field label={L.tagline} value={p.tagline} onChange={(v) => setP("tagline", v)}
              placeholder="Building fast, accessible web apps from Dhaka 🇧🇩" />
          </div>
        </div>
        <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <summary className="cursor-pointer text-sm font-medium text-slate-700">{L.moreLinks}</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="X / Twitter" value={p.twitter} onChange={(v) => setP("twitter", v)} placeholder="@username" />
            <Field label={L.blog} value={p.blog} onChange={(v) => setP("blog", v)} placeholder="medium.com/@username" />
            <Field label="Codeforces username" value={p.codeforces} onChange={(v) => setP("codeforces", v)} placeholder="tourist" />
            <Field label="LeetCode username" value={p.leetcode} onChange={(v) => setP("leetcode", v)} placeholder="username" />
          </div>
        </details>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={cv.openToWork} onChange={(e) => set("openToWork", e.target.checked)} />
          {L.openToWork}
        </label>
        <div className="flex items-center gap-3">
          {p.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
          )}
          <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
            {L.photo}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
          </label>
          {p.photo && <button type="button" className="text-sm text-red-500" onClick={() => setP("photo", "")}>{L.photoRemove}</button>}
        </div>
        <p className="text-[11px] text-slate-400">{L.photoTip}</p>
      </Section>

      <Section {...vis("summary")} title={L.summary} icon="📝">
        <Field
          label={L.summaryLabel} textarea value={cv.summary} onChange={(v) => set("summary", v)}
          placeholder="Backend developer with 2+ years of experience in Node.js..."
          hint={L.summaryHint}
        />
      </Section>

      <Section {...vis("skills")} title={L.skills} icon="🛠️" count={cv.skills.length}>
        {cv.skills.map((s, i) => (
          <ItemCard key={s.id} title={s.name || L.newGroup} onRemove={() => sk.remove(s.id)} onUp={i > 0 ? () => sk.move(i, -1) : undefined} onDown={i < cv.skills.length - 1 ? () => sk.move(i, 1) : undefined}>
            <Field label={L.groupName} value={s.name} onChange={(v) => sk.update(s.id, { name: v })} placeholder="Frontend" />
            <Field label={L.groupItems} value={s.items} onChange={(v) => sk.update(s.id, { items: v })} placeholder="React, Next.js, Tailwind" />
          </ItemCard>
        ))}
        <AddButton onClick={() => sk.add({ id: uid(), name: "", items: "" })}>{L.addGroup}</AddButton>
      </Section>

      <Section {...vis("experience")} title={L.experience} icon="💼" count={cv.experience.length}>
        {cv.experience.map((e, i) => (
          <ItemCard key={e.id} title={e.role || e.company || L.newExperience} onRemove={() => exp.remove(e.id)} onUp={i > 0 ? () => exp.move(i, -1) : undefined} onDown={i < cv.experience.length - 1 ? () => exp.move(i, 1) : undefined}>
            <Field label={L.role} value={e.role} onChange={(v) => exp.update(e.id, { role: v })} placeholder="Software Engineer" />
            <Field label={L.company} value={e.company} onChange={(v) => exp.update(e.id, { company: v })} placeholder="Company Ltd." />
            <Field label={L.expLocation} value={e.location} onChange={(v) => exp.update(e.id, { location: v })} placeholder="Dhaka / Remote" />
            <div />
            <Field label={L.start} type="month" value={e.start} onChange={(v) => exp.update(e.id, { start: v })} />
            <div>
              <Field label={L.end} type="month" value={e.end} disabled={e.current} onChange={(v) => exp.update(e.id, { end: v })} />
              <label className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                <input type="checkbox" checked={e.current} onChange={(ev) => exp.update(e.id, { current: ev.target.checked })} /> {L.current}
              </label>
            </div>
            <div className="sm:col-span-2">
              <Field label={L.bullets} textarea rows={5} value={e.bullets} onChange={(v) => exp.update(e.id, { bullets: v })}
                placeholder={"Built REST APIs with Node.js serving 50k users\nReduced page load time by 35%"}
                hint={L.bulletsHint} />
            </div>
          </ItemCard>
        ))}
        <AddButton onClick={() => exp.add({ id: uid(), company: "", role: "", location: "", start: "", end: "", current: false, bullets: "" })}>{L.addExperience}</AddButton>
      </Section>

      <Section {...vis("projects")} title={L.projects} icon="🚀" count={cv.projects.length}>
        {cv.projects.map((pr, i) => (
          <ItemCard key={pr.id} title={pr.name || L.newProject} onRemove={() => proj.remove(pr.id)} onUp={i > 0 ? () => proj.move(i, -1) : undefined} onDown={i < cv.projects.length - 1 ? () => proj.move(i, 1) : undefined}>
            <Field label={L.projectName} value={pr.name} onChange={(v) => proj.update(pr.id, { name: v })} placeholder="E-commerce App" />
            <Field label={L.tech} value={pr.tech} onChange={(v) => proj.update(pr.id, { tech: v })} placeholder="Flutter, Firebase" />
            <Field label={L.link} value={pr.link} onChange={(v) => proj.update(pr.id, { link: v })} placeholder="myapp.com" />
            <Field label={L.repo} value={pr.repo} onChange={(v) => proj.update(pr.id, { repo: v })} placeholder="github.com/you/repo" />
            <label className="flex items-center gap-2 text-xs text-slate-600 sm:col-span-2">
              <input type="checkbox" checked={pr.featured} onChange={(e) => proj.update(pr.id, { featured: e.target.checked })} />
              {L.featured}
            </label>
            <div className="sm:col-span-2">
              <Field label={L.projectBullets} textarea rows={3} value={pr.bullets} onChange={(v) => proj.update(pr.id, { bullets: v })} placeholder="What it does, your role, impact" />
            </div>
          </ItemCard>
        ))}
        <AddButton onClick={() => proj.add({ id: uid(), name: "", tech: "", link: "", repo: "", featured: false, bullets: "" })}>{L.addProject}</AddButton>
      </Section>

      <Section {...vis("education")} title={L.education} icon="🎓" count={cv.education.length}>
        {cv.education.map((ed, i) => (
          <ItemCard key={ed.id} title={ed.degree || L.newDegree} onRemove={() => edu.remove(ed.id)} onUp={i > 0 ? () => edu.move(i, -1) : undefined} onDown={i < cv.education.length - 1 ? () => edu.move(i, 1) : undefined}>
            <Field label={L.degree} value={ed.degree} onChange={(v) => edu.update(ed.id, { degree: v })} placeholder="B.Sc. in CSE / HSC / SSC" />
            <Field label={L.institution} value={ed.institution} onChange={(v) => edu.update(ed.id, { institution: v })} placeholder="University / College name" />
            <Field label={L.result} value={ed.result} onChange={(v) => edu.update(ed.id, { result: v })} placeholder="CGPA: 3.50 / 4.00" hint={L.resultHint} />
            <div className="grid grid-cols-2 gap-2">
              <Field label={L.start} type="month" value={ed.start} onChange={(v) => edu.update(ed.id, { start: v })} />
              <Field label={L.passed} type="month" value={ed.end} onChange={(v) => edu.update(ed.id, { end: v })} />
            </div>
          </ItemCard>
        ))}
        <AddButton onClick={() => edu.add({ id: uid(), degree: "", institution: "", result: "", start: "", end: "" })}>{L.addEducation}</AddButton>
      </Section>

      <SimpleList {...vis("achievements")} title={L.achievements} icon="🏆" items={cv.achievements} onChange={(l) => set("achievements", l)} placeholder="ICPC Dhaka Regional 2023 – Ranked 45th" />
      <SimpleList {...vis("certifications")} title={L.certifications} icon="📜" items={cv.certifications} onChange={(l) => set("certifications", l)} placeholder="AWS Certified Developer – Associate" />

      <Section {...vis("languages")} title={L.languages} icon="🌐">
        <Field label={L.languages} value={cv.languages} onChange={(v) => set("languages", v)} placeholder="Bangla (Native), English (Professional)" />
      </Section>
    </div>
  );
}

function SimpleList({ title, icon, items, onChange, placeholder, visible, onToggleVisible }: { title: string; icon: string; items: SimpleItem[]; onChange: (l: SimpleItem[]) => void; placeholder: string; visible: boolean; onToggleVisible: () => void }) {
  const ops = listOps(items, onChange);
  const { t } = useLang();
  return (
    <Section title={title} icon={icon} count={items.length} visible={visible} onToggleVisible={onToggleVisible}>
      {items.map((a, i) => (
        <div key={a.id} className="flex gap-2">
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600" value={a.text} placeholder={placeholder} onChange={(e) => ops.update(a.id, { text: e.target.value })} />
          <button type="button" aria-label={t.b.fields.up} className="text-slate-400 disabled:opacity-30" disabled={i === 0} onClick={() => ops.move(i, -1)}>↑</button>
          <button type="button" aria-label={t.b.fields.remove} className="px-1 text-red-500" onClick={() => ops.remove(a.id)}>✕</button>
        </div>
      ))}
      <AddButton onClick={() => ops.add({ id: uid(), text: "" })}>{t.b.editor.add}</AddButton>
    </Section>
  );
}
