"use client";
import { useEffect, useState } from "react";

// রেন্ডারে সরাসরি Date.now() না ডেকে নির্দিষ্ট সময় পরপর বদলানো "এখন"
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
