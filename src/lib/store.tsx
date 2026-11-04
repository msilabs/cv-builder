"use client";
// অ্যাপের সব ডেটা: একাধিক CV ভার্সন, অটো-সেভ, একাধিক ব্রাউজার ট্যাবের মধ্যে sync
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CV, Settings } from "./types";
import { defaultSettings, emptyCV } from "./sample";
import { normalizeCV, normalizeSettings } from "./normalize";
import { uid } from "./utils";
import { detectLang } from "@/i18n/lang";
import { dict } from "@/i18n/dict";

const mainName = () => dict[detectLang()].b.versions.mainName;

export const STORAGE_KEY = "cvbanao:data:v2";
const LEGACY_KEY = "bd-cv-builder:v1";
export const DATA_VERSION = 2;

export interface Profile {
  id: string;
  name: string;
  cv: CV;
  settings: Settings;
  updatedAt: number;
}

export interface AppData {
  app: "cvbanao";
  version: number;
  activeId: string;
  profiles: Profile[];
  lastBackupAt: number | null;
}

export type SaveState = "idle" | "saving" | "saved" | "error";

const newProfile = (name: string, cv: CV = emptyCV, settings: Settings = defaultSettings): Profile => ({
  id: uid(),
  name,
  cv,
  settings,
  updatedAt: Date.now(),
});

function freshData(): AppData {
  const p = newProfile(mainName());
  return { app: "cvbanao", version: DATA_VERSION, activeId: p.id, profiles: [p], lastBackupAt: null };
}

function normalizeData(raw: unknown): AppData | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Partial<AppData>;
  if (!Array.isArray(d.profiles) || d.profiles.length === 0) return null;
  const profiles = d.profiles.map((p) => ({
    id: p.id || uid(),
    name: p.name || "CV",
    cv: normalizeCV(p.cv),
    settings: normalizeSettings(p.settings),
    updatedAt: p.updatedAt || Date.now(),
  }));
  const activeId = profiles.some((p) => p.id === d.activeId) ? d.activeId! : profiles[0].id;
  return { app: "cvbanao", version: DATA_VERSION, activeId, profiles, lastBackupAt: d.lastBackupAt ?? null };
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = normalizeData(JSON.parse(raw));
      if (d) return d;
    }
    // পুরোনো (v1) ডেটা থাকলে নতুন ফরম্যাটে নিয়ে আসা
    const old = localStorage.getItem(LEGACY_KEY);
    if (old) {
      const o = JSON.parse(old);
      const p = newProfile(mainName(), normalizeCV(o.cv), normalizeSettings(o.settings));
      return { app: "cvbanao", version: DATA_VERSION, activeId: p.id, profiles: [p], lastBackupAt: null };
    }
  } catch {
    /* নষ্ট ডেটা হলে নতুন করে শুরু */
  }
  return freshData();
}

type Updater<T> = T | ((prev: T) => T);
const apply = <T,>(u: Updater<T>, prev: T): T => (typeof u === "function" ? (u as (p: T) => T)(prev) : u);

interface Store {
  loaded: boolean;
  data: AppData;
  profile: Profile;
  cv: CV;
  settings: Settings;
  setCV: (u: Updater<CV>) => void;
  setSettings: (u: Updater<Settings>) => void;
  saveState: SaveState;
  savedAt: number | null;
  switchProfile: (id: string) => void;
  addProfile: (name: string, cv?: CV, settings?: Settings) => string;
  duplicateProfile: (id: string, name: string) => string;
  renameProfile: (id: string, name: string) => void;
  deleteProfile: (id: string) => void;
  markBackup: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(freshData);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipSave = useRef(true);

  useEffect(() => {
    setData(loadData());
    setLoaded(true);
  }, []);

  // অটো-সেভ (৪০০ms পর)
  useEffect(() => {
    if (!loaded) return;
    if (skipSave.current) {
      // অন্য ট্যাব থেকে আসা ডেটা: এই ট্যাবের পুরোনো, অপেক্ষমাণ সেভ বাতিল, নইলে সেটা নতুন ডেটার ওপর লিখে ফেলত
      skipSave.current = false;
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    setSaveState("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSaveState("saved");
        setSavedAt(Date.now());
      } catch {
        setSaveState("error");
      }
    }, 400);
  }, [data, loaded]);

  // অন্য ট্যাবে বদলালে এখানেও আপডেট (ফেরত লেখা ছাড়া)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const d = normalizeData(JSON.parse(e.newValue));
        if (!d) return;
        skipSave.current = true;
        setData(d);
        setSaveState("saved");
        setSavedAt(Date.now());
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const profile = data.profiles.find((p) => p.id === data.activeId) ?? data.profiles[0];

  const updateActive = useCallback((fn: (p: Profile) => Profile) => {
    setData((d) => ({ ...d, profiles: d.profiles.map((p) => (p.id === d.activeId ? { ...fn(p), updatedAt: Date.now() } : p)) }));
  }, []);

  const setCV = useCallback((u: Updater<CV>) => updateActive((p) => ({ ...p, cv: apply(u, p.cv) })), [updateActive]);
  const setSettings = useCallback((u: Updater<Settings>) => updateActive((p) => ({ ...p, settings: apply(u, p.settings) })), [updateActive]);

  const store = useMemo<Store>(
    () => ({
      loaded,
      data,
      profile,
      cv: profile.cv,
      settings: profile.settings,
      setCV,
      setSettings,
      saveState,
      savedAt,
      switchProfile: (id) => setData((d) => ({ ...d, activeId: id })),
      addProfile: (name, cv = emptyCV, settings) => {
        const p = newProfile(name, cv, settings ?? profile.settings);
        setData((d) => ({ ...d, profiles: [...d.profiles, p], activeId: p.id }));
        return p.id;
      },
      duplicateProfile: (id, name) => {
        const src = data.profiles.find((p) => p.id === id);
        if (!src) return id;
        const p = newProfile(name, structuredClone(src.cv), structuredClone(src.settings));
        setData((d) => ({ ...d, profiles: [...d.profiles, p], activeId: p.id }));
        return p.id;
      },
      renameProfile: (id, name) => setData((d) => ({ ...d, profiles: d.profiles.map((p) => (p.id === id ? { ...p, name } : p)) })),
      deleteProfile: (id) =>
        setData((d) => {
          const rest = d.profiles.filter((p) => p.id !== id);
          if (!rest.length) return freshData();
          return { ...d, profiles: rest, activeId: d.activeId === id ? rest[0].id : d.activeId };
        }),
      markBackup: () => setData((d) => ({ ...d, lastBackupAt: Date.now() })),
    }),
    [loaded, data, profile, setCV, setSettings, saveState, savedAt],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
