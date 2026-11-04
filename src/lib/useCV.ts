"use client";
import { useEffect, useRef, useState } from "react";
import type { CV, Settings } from "./types";
import { defaultSettings, emptyCV } from "./sample";

const KEY = "bd-cv-builder:v1";

export function useCV() {
  const [cv, setCV] = useState<CV>(emptyCV);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // প্রথমবার ব্রাউজার থেকে লোড
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.cv) setCV({ ...emptyCV, ...data.cv, personal: { ...emptyCV.personal, ...data.cv.personal } });
        if (data.settings) setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  // অটো-সেভ
  useEffect(() => {
    if (!loaded) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify({ cv, settings }));
      } catch {
        /* storage full / blocked */
      }
    }, 400);
  }, [cv, settings, loaded]);

  return { cv, setCV, settings, setSettings, loaded };
}
