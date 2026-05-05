import { useEffect, useState } from "react";
import type { Deal } from "@/lib/deals";

const KEY = "compare-deals";

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: string[]) => {
    setIds(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const toggle = (id: string) => {
    persist(ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id].slice(-4));
  };
  const remove = (id: string) => persist(ids.filter(x => x !== id));
  const clear = () => persist([]);
  const has = (id: string) => ids.includes(id);

  return { ids, toggle, remove, clear, has };
}

export function getCompared(deals: Deal[], ids: string[]) {
  return ids.map(id => deals.find(d => d.id === id)).filter(Boolean) as Deal[];
}
