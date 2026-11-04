"use client";
import type { CV, SectionKey, Education, Experience, Project, SimpleItem, SkillGroup } from "@/lib/types";
import { uid } from "@/lib/utils";
import { AddButton, Field, ItemCard, listOps, Section } from "./fields";

export default function Editor({ cv, setCV, hidden, toggleSection }: { cv: CV; setCV: (fn: (c: CV) => CV) => void; hidden: SectionKey[]; toggleSection: (k: SectionKey) => void }) {
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
    if (f.size > 1.5 * 1024 * 1024) return alert("ছবি ১.৫ MB-এর কম হতে হবে");
    const r = new FileReader();
    r.onload = () => setP("photo", String(r.result));
    r.readAsDataURL(f);
  };

  return (
    <div className="space-y-3">
      <Section title="ব্যক্তিগত তথ্য" icon="👤" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="পূর্ণ নাম" value={p.fullName} onChange={(v) => setP("fullName", v)} placeholder="Tanvir Ahmed" />
          <Field label="পদবি / রোল" value={p.title} onChange={(v) => setP("title", v)} placeholder="Flutter Developer" />
          <Field label="ইমেইল" type="email" value={p.email} onChange={(v) => setP("email", v)} placeholder="you@example.com" />
          <Field label="মোবাইল" value={p.phone} onChange={(v) => setP("phone", v)} placeholder="+880 17XX-XXXXXX" />
          <Field label="ঠিকানা" value={p.location} onChange={(v) => setP("location", v)} placeholder="Dhaka, Bangladesh" />
          <Field label="GitHub" value={p.github} onChange={(v) => setP("github", v)} placeholder="github.com/username" />
          <Field label="LinkedIn" value={p.linkedin} onChange={(v) => setP("linkedin", v)} placeholder="linkedin.com/in/username" />
          <Field label="পোর্টফোলিও / ওয়েবসাইট" value={p.website} onChange={(v) => setP("website", v)} placeholder="yourname.dev" />
        </div>
        <div className="flex items-center gap-3">
          {p.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
          )}
          <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
            ছবি আপলোড (ঐচ্ছিক)
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
          </label>
          {p.photo && <button type="button" className="text-sm text-red-500" onClick={() => setP("photo", "")}>সরান</button>}
        </div>
        <p className="text-[11px] text-slate-400">টিপ: বিদেশি/রিমোট চাকরিতে ছবি ছাড়া CV দেওয়াই ভালো। মডার্ন ও মিনিমাল টেমপ্লেটে ছবি দেখানো যায়।</p>
      </Section>

      <Section {...vis("summary")} title="প্রফেশনাল সামারি" icon="📝">
        <Field
          label="২–৪ লাইনে নিজের পরিচয়" textarea value={cv.summary} onChange={(v) => set("summary", v)}
          placeholder="Backend developer with 2+ years of experience in Node.js..."
          hint="অভিজ্ঞতার বছর, মূল টেকনোলজি আর একটা বড় অর্জন উল্লেখ করুন।"
        />
      </Section>

      <Section {...vis("skills")} title="টেকনিক্যাল স্কিল" icon="🛠️" count={cv.skills.length}>
        {cv.skills.map((s, i) => (
          <ItemCard key={s.id} title={s.name || "নতুন গ্রুপ"} onRemove={() => sk.remove(s.id)} onUp={i > 0 ? () => sk.move(i, -1) : undefined} onDown={i < cv.skills.length - 1 ? () => sk.move(i, 1) : undefined}>
            <Field label="গ্রুপের নাম" value={s.name} onChange={(v) => sk.update(s.id, { name: v })} placeholder="Frontend" />
            <Field label="স্কিল (কমা দিয়ে)" value={s.items} onChange={(v) => sk.update(s.id, { items: v })} placeholder="React, Next.js, Tailwind" />
          </ItemCard>
        ))}
        <AddButton onClick={() => sk.add({ id: uid(), name: "", items: "" })}>স্কিল গ্রুপ যোগ করুন</AddButton>
      </Section>

      <Section {...vis("experience")} title="কাজের অভিজ্ঞতা" icon="💼" count={cv.experience.length}>
        {cv.experience.map((e, i) => (
          <ItemCard key={e.id} title={e.role || e.company || "নতুন অভিজ্ঞতা"} onRemove={() => exp.remove(e.id)} onUp={i > 0 ? () => exp.move(i, -1) : undefined} onDown={i < cv.experience.length - 1 ? () => exp.move(i, 1) : undefined}>
            <Field label="পদবি" value={e.role} onChange={(v) => exp.update(e.id, { role: v })} placeholder="Software Engineer" />
            <Field label="কোম্পানি" value={e.company} onChange={(v) => exp.update(e.id, { company: v })} placeholder="Company Ltd." />
            <Field label="লোকেশন" value={e.location} onChange={(v) => exp.update(e.id, { location: v })} placeholder="Dhaka / Remote" />
            <div />
            <Field label="শুরু" type="month" value={e.start} onChange={(v) => exp.update(e.id, { start: v })} />
            <div>
              <Field label="শেষ" type="month" value={e.end} disabled={e.current} onChange={(v) => exp.update(e.id, { end: v })} />
              <label className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                <input type="checkbox" checked={e.current} onChange={(ev) => exp.update(e.id, { current: ev.target.checked })} /> এখনো এখানে কাজ করছি
              </label>
            </div>
            <div className="sm:col-span-2">
              <Field label="কী কী করেছেন (প্রতি লাইনে একটি পয়েন্ট)" textarea rows={5} value={e.bullets} onChange={(v) => exp.update(e.id, { bullets: v })}
                placeholder={"Built REST APIs with Node.js serving 50k users\nReduced page load time by 35%"}
                hint="অ্যাকশন ভার্ব দিয়ে শুরু করুন (Built, Led, Reduced) এবং সংখ্যা দিন।" />
            </div>
          </ItemCard>
        ))}
        <AddButton onClick={() => exp.add({ id: uid(), company: "", role: "", location: "", start: "", end: "", current: false, bullets: "" })}>অভিজ্ঞতা যোগ করুন</AddButton>
      </Section>

      <Section {...vis("projects")} title="প্রজেক্ট" icon="🚀" count={cv.projects.length}>
        {cv.projects.map((pr, i) => (
          <ItemCard key={pr.id} title={pr.name || "নতুন প্রজেক্ট"} onRemove={() => proj.remove(pr.id)} onUp={i > 0 ? () => proj.move(i, -1) : undefined} onDown={i < cv.projects.length - 1 ? () => proj.move(i, 1) : undefined}>
            <Field label="প্রজেক্টের নাম" value={pr.name} onChange={(v) => proj.update(pr.id, { name: v })} placeholder="E-commerce App" />
            <Field label="টেক স্ট্যাক" value={pr.tech} onChange={(v) => proj.update(pr.id, { tech: v })} placeholder="Flutter, Firebase" />
            <Field label="লাইভ / Play Store / App Store লিংক" value={pr.link} onChange={(v) => proj.update(pr.id, { link: v })} placeholder="myapp.com" />
            <Field label="সোর্স কোড (GitHub)" value={pr.repo} onChange={(v) => proj.update(pr.id, { repo: v })} placeholder="github.com/you/repo" />
            <div className="sm:col-span-2">
              <Field label="বিবরণ (প্রতি লাইনে একটি পয়েন্ট)" textarea rows={3} value={pr.bullets} onChange={(v) => proj.update(pr.id, { bullets: v })} placeholder="What it does, your role, impact" />
            </div>
          </ItemCard>
        ))}
        <AddButton onClick={() => proj.add({ id: uid(), name: "", tech: "", link: "", repo: "", featured: false, bullets: "" })}>প্রজেক্ট যোগ করুন</AddButton>
      </Section>

      <Section {...vis("education")} title="শিক্ষা" icon="🎓" count={cv.education.length}>
        {cv.education.map((ed, i) => (
          <ItemCard key={ed.id} title={ed.degree || "নতুন ডিগ্রি"} onRemove={() => edu.remove(ed.id)} onUp={i > 0 ? () => edu.move(i, -1) : undefined} onDown={i < cv.education.length - 1 ? () => edu.move(i, 1) : undefined}>
            <Field label="ডিগ্রি" value={ed.degree} onChange={(v) => edu.update(ed.id, { degree: v })} placeholder="B.Sc. in CSE / HSC / SSC" />
            <Field label="প্রতিষ্ঠান" value={ed.institution} onChange={(v) => edu.update(ed.id, { institution: v })} placeholder="University / College name" />
            <Field label="ফলাফল" value={ed.result} onChange={(v) => edu.update(ed.id, { result: v })} placeholder="CGPA: 3.50 / 4.00" hint="SSC/HSC হলে GPA: 5.00 / 5.00" />
            <div className="grid grid-cols-2 gap-2">
              <Field label="শুরু" type="month" value={ed.start} onChange={(v) => edu.update(ed.id, { start: v })} />
              <Field label="শেষ / পাস" type="month" value={ed.end} onChange={(v) => edu.update(ed.id, { end: v })} />
            </div>
          </ItemCard>
        ))}
        <AddButton onClick={() => edu.add({ id: uid(), degree: "", institution: "", result: "", start: "", end: "" })}>শিক্ষাগত যোগ্যতা যোগ করুন</AddButton>
      </Section>

      <SimpleList {...vis("achievements")} title="অর্জন (ICPC, Codeforces, হ্যাকাথন)" icon="🏆" items={cv.achievements} onChange={(l) => set("achievements", l)} placeholder="ICPC Dhaka Regional 2023 – Ranked 45th" />
      <SimpleList {...vis("certifications")} title="সার্টিফিকেশন" icon="📜" items={cv.certifications} onChange={(l) => set("certifications", l)} placeholder="AWS Certified Developer – Associate" />

      <Section {...vis("languages")} title="ভাষা" icon="🌐">
        <Field label="ভাষা" value={cv.languages} onChange={(v) => set("languages", v)} placeholder="Bangla (Native), English (Professional)" />
      </Section>
    </div>
  );
}

function SimpleList({ title, icon, items, onChange, placeholder, visible, onToggleVisible }: { title: string; icon: string; items: SimpleItem[]; onChange: (l: SimpleItem[]) => void; placeholder: string; visible: boolean; onToggleVisible: () => void }) {
  const ops = listOps(items, onChange);
  return (
    <Section title={title} icon={icon} count={items.length} visible={visible} onToggleVisible={onToggleVisible}>
      {items.map((a, i) => (
        <div key={a.id} className="flex gap-2">
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600" value={a.text} placeholder={placeholder} onChange={(e) => ops.update(a.id, { text: e.target.value })} />
          <button type="button" className="text-slate-400 disabled:opacity-30" disabled={i === 0} onClick={() => ops.move(i, -1)}>↑</button>
          <button type="button" className="px-1 text-red-500" onClick={() => ops.remove(a.id)}>✕</button>
        </div>
      ))}
      <AddButton onClick={() => ops.add({ id: uid(), text: "" })}>যোগ করুন</AddButton>
    </Section>
  );
}
