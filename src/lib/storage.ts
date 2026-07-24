import { useCallback, useEffect, useState } from "react";

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const FAV_KEY = "devhub:favorites";
const REC_KEY = "devhub:recents";
const SEEN_KEY = "devhub:seen";
const MAX_RECENTS = 8;

export function useFavorites() {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => setItems(readLS<string[]>(FAV_KEY, [])), []);

  const toggle = useCallback((slug: string) => {
    setItems((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      writeLS(FAV_KEY, next);
      return next;
    });
  }, []);

  const isFav = useCallback((slug: string) => items.includes(slug), [items]);
  return { favorites: items, toggle, isFav };
}

export function useRecents() {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => setItems(readLS<string[]>(REC_KEY, [])), []);

  const push = useCallback((slug: string) => {
    setItems((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_RECENTS);
      writeLS(REC_KEY, next);
      return next;
    });
  }, []);

  return { recents: items, push };
}

export function useSeen() {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => setItems(readLS<string[]>(SEEN_KEY, [])), []);

  const markSeen = useCallback((slug: string) => {
    setItems((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      writeLS(SEEN_KEY, next);
      return next;
    });
  }, []);

  const isSeen = useCallback((slug: string) => items.includes(slug), [items]);
  return { seen: items, markSeen, isSeen };
}

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setValue(readLS<T>(key, initial));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (ready) writeLS(key, value);
  }, [key, value, ready]);
  return [value, setValue] as const;
}
