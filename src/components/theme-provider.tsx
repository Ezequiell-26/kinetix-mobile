"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";

type Theme = "dark" | "light";
const Ctx = createContext<{ theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }>({
  theme: "dark",
  toggle: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(Ctx);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("ec-theme") as Theme) || "dark";
    setThemeState(saved);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(saved);
    document.documentElement.setAttribute("data-theme", saved);
    setMounted(true);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("ec-theme", t);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(t);
    document.documentElement.setAttribute("data-theme", t);
  }
  function toggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  // Avoid flash: render light/dark after mount
  if (!mounted) return <>{children}</>;

  // Todo framer-motion respeta la preferencia del SO (reduced motion).
  return (
    <MotionConfig reducedMotion="user">
      <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>
    </MotionConfig>
  );
}
