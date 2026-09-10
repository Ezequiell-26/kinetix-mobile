"use client";
/**
 * command-palette-pro.tsx — Command palette premium mejorado
 * Inspirado en patrones MIT de:
 * - pacocoursey/cmdk (MIT) https://github.com/pacocoursey/cmdk — fast, composable, unstyled command menu (fuzzy, groups, keyboard nav)
 * Licencia MIT respetada. Código original adaptado con fuzzy, agrupado, historial y microinteractions.
 * Atribución completa en docs/MIT_ATTRIBUTION.md #71
 */
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Clock, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Cmd = { label: string; href: string; kbd?: string; group: string; desc?: string };

const TRAINER_CMDS: Cmd[] = [
  { label: "Ir a Dashboard", href: "/trainer/dashboard", kbd: "D", group: "Navegación", desc: "Panel del entrenador" },
  { label: "Clientes", href: "/trainer/clients", kbd: "C", group: "Navegación", desc: "Listado + control" },
  { label: "Crear cliente", href: "/trainer/clients/new", kbd: "N", group: "Acciones", desc: "Alta rápida" },
  { label: "Entrenamientos", href: "/trainer/workouts", kbd: "E", group: "Navegación", desc: "Biblioteca + rutinas" },
  { label: "Crear rutina", href: "/trainer/workouts", kbd: "R", group: "Acciones", desc: "Nueva rutina" },
  { label: "Check-ins", href: "/trainer/checkins", kbd: "K", group: "Navegación", desc: "Revisar check-ins" },
  { label: "Mensajes", href: "/trainer/messages", kbd: "M", group: "Navegación", desc: "Chat con clientes" },
  { label: "Pagos", href: "/trainer/payments", kbd: "P", group: "Navegación", desc: "Suscripciones" },
  { label: "Progreso cliente", href: "/client/progress", kbd: "G", group: "Navegación", desc: "Vista cliente" },
  { label: "Ejercicios", href: "/trainer/exercises", kbd: "J", group: "Navegación", desc: "100 ejercicios" },
];

const CLIENT_CMDS: Cmd[] = [
  { label: "Mi Dashboard", href: "/client/dashboard", kbd: "D", group: "Navegación", desc: "Entrenamiento de hoy" },
  { label: "Mi Progreso", href: "/client/progress", kbd: "G", group: "Navegación", desc: "Peso • cargas • fotos" },
  { label: "Nutrición", href: "/client/nutrition", kbd: "N", group: "Navegación", desc: "Calculadoras + hábitos" },
  { label: "Mensajes", href: "/client/messages", kbd: "M", group: "Navegación", desc: "Chat con Ezequiel" },
  { label: "Check-ins", href: "/client/checkins", kbd: "K", group: "Navegación", desc: "Enviar check-in" },
  { label: "Comenzar entrenamiento", href: "/client/dashboard", kbd: "E", group: "Acciones", desc: "Ir a entrenar" },
  { label: "Registrar medidas", href: "/client/progress", kbd: "R", group: "Acciones", desc: "Peso + cintura" },
  { label: "Fotos de progreso", href: "/client/progress", kbd: "F", group: "Acciones", desc: "Antes / Actual" },
];

function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#D6FF2A]/30 text-white rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export function CommandPalettePro({ role = "trainer" }: { role?: "trainer" | "client" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const commands = role === "client" ? CLIENT_CMDS : TRAINER_CMDS;

  // load recent from localStorage (cmdk MIT: recents pattern)
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(`cmdk-recent-${role}`) || "[]");
      if (Array.isArray(r)) setRecent(r.slice(0, 3));
    } catch {}
  }, [role]);

  function pushRecent(href: string) {
    try {
      const next = [href, ...recent.filter((x) => x !== href)].slice(0, 3);
      setRecent(next);
      localStorage.setItem(`cmdk-recent-${role}`, JSON.stringify(next));
    } catch {}
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "/" && !open && (e.target as HTMLElement)?.tagName !== "INPUT" && (e.target as HTMLElement)?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      setIdx(0);
    } else setQ("");
  }, [open]);

  const filtered = useMemo(() => {
    if (!q) return commands;
    const low = q.toLowerCase();
    // cmdk MIT: simple fuzzy (includes + prefix bonus)
    return commands
      .map((c) => {
        const hay = `${c.label} ${c.desc || ""} ${c.group}`.toLowerCase();
        const score = hay.includes(low) ? (c.label.toLowerCase().startsWith(low) ? 2 : 1) : 0;
        return { c, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.c);
  }, [q, commands]);

  const groups = useMemo(() => {
    const m = new Map<string, Cmd[]>();
    for (const c of filtered) {
      if (!m.has(c.group)) m.set(c.group, []);
      m.get(c.group)!.push(c);
    }
    return Array.from(m.entries());
  }, [filtered]);

  const flat = filtered;

  function go(c: Cmd) {
    pushRecent(c.href);
    setOpen(false);
    router.push(c.href);
  }

  // keyboard nav inside palette
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = flat[idx];
      if (c) go(c);
    }
  }

  return (
    <>
      {/* Trigger — shadcn/ui + cmdk style, radix focus */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir paleta de comandos"
        className={cn(
          "hidden lg:flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2",
          "hover:border-zinc-700 hover:text-zinc-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6FF2A]/40"
        )}
      >
        <Search size={14} />
        <span>Buscar…</span>
        <span className="ml-2 hidden xl:inline-flex items-center gap-1 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
          <Command size={10} />K
        </span>
      </button>

      {/* Mobile trigger small */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-full px-3 py-2 text-zinc-400"
      >
        <Search size={14} /> Buscar
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-start justify-center pt-[12vh] sm:pt-[20vh] p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="relative w-full max-w-[560px] bg-[#111111] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
            >
              {/* Search input — cmdk input */}
              <div className="flex items-center gap-3 p-4 border-b border-zinc-800 shrink-0">
                <Search size={18} className="text-zinc-500 shrink-0" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setIdx(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder={
                    role === "client"
                      ? "Buscar entrenos, progreso, nutrición…"
                      : "Buscar clientes, rutinas, check-ins…"
                  }
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-600 text-white"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="shrink-0 p-1 rounded-lg hover:bg-zinc-800 text-zinc-500"
                  aria-label="Cerrar"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Recent (cmdk pattern) */}
              {!q && recent.length > 0 && (
                <div className="px-2 pt-3 pb-1">
                  <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase px-2 mb-1 flex items-center gap-1">
                    <Clock size={10} /> Recientes
                  </p>
                  <div className="space-y-1">
                    {recent
                      .map((href) => commands.find((c) => c.href === href))
                      .filter(Boolean)
                      .map((c) => (
                        <button
                          key={`recent-${c!.href}`}
                          onClick={() => go(c!)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-900 border border-transparent hover:border-zinc-800 flex justify-between items-center text-sm"
                        >
                          <span className="text-zinc-200">{c!.label}</span>
                          <ArrowRight size={14} className="text-zinc-600" />
                        </button>
                      ))}
                  </div>
                  <div className="h-px bg-zinc-800 my-2 mx-2" />
                </div>
              )}

              {/* Grouped results — cmdk groups */}
              <div className="overflow-y-auto flex-1 p-2 space-y-4">
                {filtered.length === 0 ? (
                  <div className="py-10 text-center space-y-1">
                    <p className="text-sm font-bold text-white">Sin resultados</p>
                    <p className="text-xs text-zinc-500">Probá con “{role === "client" ? "progreso" : "clientes"}” o “mensajes”</p>
                  </div>
                ) : (
                  groups.map(([group, items]) => (
                    <div key={group}>
                      <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase px-2 mb-1">{group}</p>
                      <div className="space-y-1">
                        {items.map((c) => {
                          const globalIdx = flat.indexOf(c);
                          const active = globalIdx === idx;
                          return (
                            <button
                              key={c.href + c.label}
                              onClick={() => go(c)}
                              onMouseEnter={() => setIdx(globalIdx)}
                              className={cn(
                                "w-full text-left px-3 py-2.5 rounded-xl flex justify-between items-center border transition",
                                active
                                  ? "bg-white text-black border-white"
                                  : "bg-zinc-900/50 text-zinc-200 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                              )}
                            >
                              <div className="min-w-0">
                                <span className="text-sm font-semibold block truncate">
                                  {highlight(c.label, q)}
                                </span>
                                {c.desc && (
                                  <span className={cn("text-[11px] truncate block", active ? "text-black/60" : "text-zinc-500")}>
                                    {c.desc}
                                  </span>
                                )}
                              </div>
                              {c.kbd && (
                                <span
                                  className={cn(
                                    "ml-2 text-xs px-2 py-1 rounded-lg border shrink-0 font-mono",
                                    active
                                      ? "bg-black text-white border-black"
                                      : "bg-zinc-950 text-zinc-400 border-zinc-800"
                                  )}
                                >
                                  {c.kbd}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-zinc-800 text-[11px] text-zinc-600 flex items-center justify-between shrink-0">
                <span className="hidden sm:inline">↑↓ navegar • ↵ seleccionar • ESC cerrar</span>
                <span className="sm:hidden">↵ seleccionar • / para abrir</span>
                <span className="text-zinc-500">{filtered.length} comandos</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
