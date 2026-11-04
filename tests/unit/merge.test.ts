import { describe, expect, it } from "vitest";
import { mergeData } from "@/lib/merge";
import { emptyCV, defaultSettings } from "@/lib/sample";
import type { AppData, Profile } from "@/lib/store";

const prof = (id: string, name: string, updatedAt: number): Profile => ({ id, name, updatedAt, cv: { ...emptyCV, personal: { ...emptyCV.personal, fullName: name } }, settings: defaultSettings });
const data = (profiles: Profile[], activeId = profiles[0].id): AppData => ({ app: "cvbanao", version: 2, activeId, profiles, lastBackupAt: null });

describe("mergeData", () => {
  it("takes the newer copy of each version", () => {
    const local = data([prof("a", "local A", 200), prof("b", "local B", 100)]);
    const incoming = data([prof("a", "other A", 150), prof("b", "other B", 300)]);
    const { data: m, localWins } = mergeData(local, incoming, 300);
    expect(m.profiles.map((p) => p.name)).toEqual(["local A", "other B"]);
    expect(localWins).toBe(true);
  });

  it("accepts the other tab completely when it is newer everywhere", () => {
    const local = data([prof("a", "old", 100)]);
    const incoming = data([prof("a", "new", 200)]);
    expect(mergeData(local, incoming, 200)).toMatchObject({ localWins: false, data: { profiles: [{ name: "new" }] } });
  });

  it("keeps versions created here after the other tab saved, drops versions deleted there", () => {
    const local = data([prof("a", "A", 100), prof("new", "made here", 500), prof("gone", "deleted there", 50)]);
    const incoming = data([prof("a", "A", 100)]);
    const { data: m } = mergeData(local, incoming, 400);
    expect(m.profiles.map((p) => p.id)).toEqual(["a", "new"]);
  });

  it("keeps this tab's active version if it still exists", () => {
    const local = data([prof("a", "A", 1), prof("b", "B", 1)], "b");
    const incoming = data([prof("a", "A", 1), prof("b", "B", 1)], "a");
    expect(mergeData(local, incoming).data.activeId).toBe("b");
  });
});
