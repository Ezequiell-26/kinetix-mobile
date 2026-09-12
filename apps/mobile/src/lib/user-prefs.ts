"use client";
import { useCallback, useEffect, useState } from "react";

/**
 * Preferencias por usuario (favoritos + recientes).
 *
 * Local-first: localStorage bajo `ec-prefs:{email}`, con estructura plana
 * { favs: Entry[], recent: Entry[] } pensada para migrar a persistencia de
 * servidor sin cambiar los consumidores (misma forma de datos).
 * Entry apunta SIEMPRE a la ubicación canónica (nav-registry).
 */

export type PrefEntry = { href: string; label: string };

type Prefs = { favs: PrefEntry[]; recent: PrefEntry[] };
const EMPTY: Prefs = { favs: [], recent: [] };
const MAX_RECENT = 6;

function readKey(userKey: string): Prefs {
  try {
    const raw = localStorage.getItem(`ec-prefs:${userKey}`);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw);
    return {
      favs: Array.isArray(p.favs) ? p.favs : [],
      recent: Array.isArray(p.recent) ? p.recent : [],
    };
  } catch {
    return EMPTY;
  }
}

function writeKey(userKey: string, prefs: Prefs) {
  try {
    localStorage.setItem(`ec-prefs:${userKey}`, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent("ec-prefs-changed"));
  } catch {}
}

/**
 * Hook de preferencias. userKey null = sesión todavía cargando (render neutro).
 */
export function useUserPrefs(userKey: string | null) {
  const [prefs, setPrefs] = useState<Prefs>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!userKey) { setPrefs(EMPTY); setReady(false); return; }
    setPrefs(readKey(userKey));
    setReady(true);
    const onChange = () => setPrefs(readKey(userKey));
    window.addEventListener("ec-prefs-changed", onChange);
    return () => window.removeEventListener("ec-prefs-changed", onChange);
  }, [userKey]);

  const isFav = useCallback(
    (href: string) => prefs.favs.some(f => f.href === href),
    [prefs]
  );

  const toggleFav = useCallback(
    (entry: PrefEntry) => {
      if (!userKey) return;
      const cur = readKey(userKey);
      const favs = cur.favs.some(f => f.href === entry.href)
        ? cur.favs.filter(f => f.href !== entry.href)
        : [...cur.favs, entry];
      writeKey(userKey, { ...cur, favs });
    },
    [userKey]
  );

  const pushRecent = useCallback(
    (entry: PrefEntry) => {
      if (!userKey) return;
      const cur = readKey(userKey);
      const recent = [entry, ...cur.recent.filter(r => r.href !== entry.href)].slice(0, MAX_RECENT);
      writeKey(userKey, { ...cur, recent });
    },
    [userKey]
  );

  return { favs: prefs.favs, recent: prefs.recent, isFav, toggleFav, pushRecent, ready };
}

/** Email del usuario en sesión (para particionar prefs). Null mientras carga. */
export function useSessionUserKey() {
  const [userKey, setUserKey] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me")
      .then(r => (r.ok ? r.json() : null))
      .then(s => {
        // /api/auth/me devuelve { user: { email } }; aceptamos también { email } plano.
        const email = s?.user?.email ?? s?.email;
        if (alive && email) setUserKey(String(email).toLowerCase());
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return userKey;
}
