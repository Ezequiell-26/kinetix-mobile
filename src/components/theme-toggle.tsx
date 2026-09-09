"use client";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
      >
        <span className="w-8 h-8 rounded-lg bg-white dark:bg-[#D6FF2A] flex items-center justify-center text-black">
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
        </span>
        <span className="flex-1 text-left">{isLight ? "Modo oscuro" : "Modo claro"}</span>
        <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full">{isLight ? "Blanco" : "Negro"}</span>
      </button>
    );
  }
  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition text-zinc-400 hover:text-white"
      title={isLight ? "Cambiar a oscuro" : "Cambiar a claro"}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
