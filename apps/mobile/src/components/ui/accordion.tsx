"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Sección colapsable para "progressive disclosure".
 *
 * Patrón de la referencia FitSync: una zona dominante por pantalla y el resto
 * plegado, para que la información densa no compita. Accesible: el encabezado
 * es un <button> con aria-expanded y aria-controls.
 */
export function CollapsibleSection({
  title,
  subtitle,
  icon,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `sec-${title.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`;

  return (
    <section className="rounded-[20px] border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-zinc-800/40 transition min-h-[44px]"
      >
        {icon && (
          <span className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-primary shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-bold text-white truncate">{title}</span>
          {subtitle && <span className="block text-[11px] text-zinc-500 truncate">{subtitle}</span>}
        </span>
        {badge}
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={cn("text-zinc-500 transition-transform duration-200 shrink-0", open && "rotate-180")}
        />
      </button>
      {open && (
        <div id={panelId} className="px-4 pb-4 pt-2 space-y-4 border-t border-zinc-800/60">
          {children}
        </div>
      )}
    </section>
  );
}
