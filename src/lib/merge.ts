// দুই ট্যাবের ডেটা মেলানো: প্রতিটা ভার্সনের যেটা সবচেয়ে শেষে বদলেছে সেটা থাকে
import type { AppData } from "./store";

export interface MergeResult {
  data: AppData;
  /** এই ট্যাবের কিছু নতুন পরিবর্তন রয়ে গেছে, তাই আবার সেভ করতে হবে */
  localWins: boolean;
}

export function mergeData(local: AppData, incoming: AppData, incomingSavedAt = 0): MergeResult {
  const localById = new Map(local.profiles.map((p) => [p.id, p]));
  const incomingIds = new Set(incoming.profiles.map((p) => p.id));
  let localWins = false;

  const profiles = incoming.profiles.map((p) => {
    const l = localById.get(p.id);
    if (l && l.updatedAt > p.updatedAt) {
      localWins = true;
      return l;
    }
    return p;
  });

  // শুধু এই ট্যাবে আছে: অন্য ট্যাব সেভ করার পরে বানানো হলে রাখি, নইলে ওখানে মুছে ফেলা হয়েছে
  for (const l of local.profiles) {
    if (incomingIds.has(l.id)) continue;
    if (l.updatedAt > incomingSavedAt) {
      profiles.push(l);
      localWins = true;
    }
  }

  if (!profiles.length) return { data: incoming, localWins: false };
  const activeId = profiles.some((p) => p.id === local.activeId) ? local.activeId : profiles.some((p) => p.id === incoming.activeId) ? incoming.activeId : profiles[0].id;
  const lastBackupAt = Math.max(local.lastBackupAt ?? 0, incoming.lastBackupAt ?? 0) || null;
  return { data: { ...incoming, profiles, activeId, lastBackupAt }, localWins };
}
