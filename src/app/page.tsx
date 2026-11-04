import Link from "next/link";

const features = [
  { icon: "🤖", title: "ATS-বান্ধব", text: "বাংলাদেশি ও বিদেশি কোম্পানির ATS সফটওয়্যার সহজে পড়তে পারে এমন ফরম্যাট। PDF-এর লেখা সিলেক্ট করা যায়।" },
  { icon: "💻", title: "ডেভেলপারদের জন্য বানানো", text: "GitHub, পোর্টফোলিও, প্রজেক্ট (Play Store/App Store লিংক), টেক স্ট্যাক, ICPC/Codeforces অর্জন — সব আলাদা সেকশনে।" },
  { icon: "🇧🇩", title: "বাংলাদেশি ফরম্যাট", text: "CGPA (৪.০০), SSC/HSC GPA (৫.০০), +880 নম্বর — দেশের রিক্রুটাররা যেভাবে দেখতে চান।" },
  { icon: "⚡", title: "লাইভ প্রিভিউ", text: "লিখতে লিখতেই A4 পেজে CV দেখুন। ৩টা টেমপ্লেট ও পছন্দের রং।" },
  { icon: "🔒", title: "প্রাইভেসি", text: "লগইন লাগে না। ডেটা শুধু আপনার ব্রাউজারে থাকে। JSON ব্যাকআপ নিতে পারবেন।" },
  { icon: "🆓", title: "সম্পূর্ণ ফ্রি", text: "কোনো ওয়াটারমার্ক নেই, কোনো লুকানো চার্জ নেই।" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <span className="text-xl font-bold text-teal-700">CV<span className="text-slate-800">বানাও</span></span>
        <Link href="/builder" className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">CV বানান</Link>
      </nav>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 text-center sm:pt-20">
        <p className="mx-auto mb-4 inline-block rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">ওয়েব · মোবাইল অ্যাপ · সফটওয়্যার ডেভেলপারদের জন্য</p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          ১০ মিনিটে প্রফেশনাল ডেভেলপার CV বানান
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          বাংলাদেশের টেক কোম্পানি থেকে রিমোট জব — রিক্রুটার আর ATS দুজনেরই পছন্দের CV। ফ্রি, লগইন ছাড়াই, সরাসরি PDF।
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/builder" className="rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white shadow-lg shadow-teal-700/20 hover:bg-teal-800">এখনই শুরু করুন →</Link>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">ভালো ডেভেলপার CV-র কিছু টিপস</h2>
        <ul className="mt-6 space-y-3 text-slate-700">
          <li>✅ CV ইংরেজিতে লিখুন — বাংলাদেশের প্রায় সব টেক কোম্পানি ইংরেজি CV চায়।</li>
          <li>✅ প্রতিটি পয়েন্ট অ্যাকশন ভার্ব দিয়ে শুরু করুন আর সংখ্যা দিন: “Reduced load time by 40%”।</li>
          <li>✅ ফ্রেশার হলে প্রজেক্ট সেকশন সবচেয়ে গুরুত্বপূর্ণ — লাইভ লিংক আর GitHub দিন।</li>
          <li>✅ ১–২ পৃষ্ঠার মধ্যে রাখুন। বাবা-মায়ের নাম, ধর্ম, বৈবাহিক অবস্থা দরকার নেই।</li>
        </ul>
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} CVবানাও · বাংলাদেশে তৈরি</footer>
    </div>
  );
}
