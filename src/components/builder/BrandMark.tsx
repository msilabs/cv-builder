// লোগো চিহ্ন (app/icon.svg-এর মতো)
export function BrandMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="bm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#bm)" />
      <rect x="17" y="13" width="30" height="38" rx="4" fill="#fff" />
      <rect x="22" y="20" width="14" height="3" rx="1.5" fill="#0f766e" />
      <rect x="22" y="27" width="20" height="2.5" rx="1.25" fill="#99f6e4" />
      <rect x="22" y="33" width="20" height="2.5" rx="1.25" fill="#99f6e4" />
      <rect x="22" y="39" width="13" height="2.5" rx="1.25" fill="#99f6e4" />
    </svg>
  );
}
