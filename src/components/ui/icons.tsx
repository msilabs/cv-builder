// সব জায়গায় একই রকম আইকন (lucide) + ব্র্যান্ড/পতাকার নিজস্ব SVG
// ইমোজি প্রতিটা অপারেটিং সিস্টেমে আলাদা দেখায় (Windows-এ পতাকা "BD" লেখা হয়ে যায়), তাই UI-তে SVG
export {
  AlignLeft, ArrowLeft, ArrowRight, Award, Ban, Briefcase, Bug, Check, ChevronDown, ChevronUp, CircleCheck, Code, Copy,
  Download, Ellipsis, ExternalLink, Eye, FileCheck2, FileText, FileUp, FlaskConical, FolderOpen, Globe, GraduationCap,
  Info, Languages, Layers, Lightbulb, LoaderCircle, Lock, Mail, Minus, Monitor, PenLine, Pencil, Plus, Rocket, RotateCcw,
  Save, Scale, Smartphone, Sparkles, Star, Target, Trash2, TriangleAlert, Trophy, Undo2, User, WandSparkles, Wrench, X,
} from "lucide-react";

export function GitHubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden focusable="false">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

// বাংলাদেশের পতাকা: সবুজ জমিনে লাল বৃত্ত, বৃত্ত একটু বাঁ দিকে (৯:১০ অনুপাতে)
export function BangladeshFlag({ className = "h-3 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 6" className={`inline-block rounded-[1px] align-[-0.1em] ${className}`} role="img" aria-label="Bangladesh">
      <rect width="10" height="6" fill="#006a4e" />
      <circle cx="4.5" cy="3" r="2" fill="#f42a41" />
    </svg>
  );
}
