"use client";
import { useEffect, useState } from "react";

// একই সাইট অন্য ট্যাবে খোলা আছে কিনা (BroadcastChannel দিয়ে)
export function useOtherTabs() {
  const [others, setOthers] = useState(0);
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const me = Math.random().toString(36).slice(2);
    const seen = new Set<string>();
    const ch = new BroadcastChannel("cvbanao-tabs");
    const update = () => setOthers(seen.size);
    ch.onmessage = (e: MessageEvent<{ type: string; id: string }>) => {
      const { type, id } = e.data || {};
      if (!id || id === me) return;
      if (type === "hello") {
        seen.add(id);
        ch.postMessage({ type: "here", id: me });
      } else if (type === "here") seen.add(id);
      else if (type === "bye") seen.delete(id);
      update();
    };
    ch.postMessage({ type: "hello", id: me });
    const bye = () => ch.postMessage({ type: "bye", id: me });
    window.addEventListener("pagehide", bye);
    return () => {
      bye();
      window.removeEventListener("pagehide", bye);
      ch.close();
    };
  }, []);
  return others;
}
