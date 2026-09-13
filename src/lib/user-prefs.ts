"use client";

import { useEffect, useState, useCallback } from "react";

interface UserPrefs {
  theme: "dark" | "light";
  language: string;
  notifications: boolean;
  collapsedNav: boolean;
}

const DEFAULT_PREFS: UserPrefs = {
  theme: "dark",
  language: "es",
  notifications: true,
  collapsedNav: false,
};

const PREFS_KEY = "kinetixfitt_user_prefs";

export function useUserPrefs() {
  const sessionKey = useSessionUserKey();
  
  const [prefs, setPrefs] = useState<UserPrefs>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFS;
    try {
      const stored = localStorage.getItem(PREFS_KEY);
      return stored ? { ...DEFAULT_PREFS, ...JSON.parse(stored) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error("Failed to save user prefs", e);
    }
  }, [prefs]);

  const updatePref = useCallback(<K extends keyof UserPrefs>(key: K, value: UserPrefs[K]) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetPrefs = useCallback(() => {
    setPrefs(DEFAULT_PREFS);
    localStorage.removeItem(PREFS_KEY);
  }, []);

  return {
    prefs,
    updatePref,
    resetPrefs,
    sessionKey,
  };
}

// Session user key hook for command palette context
export function useSessionUserKey(): string | null {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("kinetixfitt_session_key");
      setKey(stored);
    } catch {
      setKey(null);
    }
  }, []);

  return key;
}

export function setSessionUserKey(key: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("kinetixfitt_session_key", key);
  }
}

export function clearSessionUserKey(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("kinetixfitt_session_key");
  }
}
