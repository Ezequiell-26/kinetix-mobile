"use client";
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Notif = {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  link: string | null;
  createdAt: string;
};

export function NotificationsBell(){
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);

  async function load(){
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setNotifs(data);
      }
    } catch {}
  }

  useEffect(() => {
    let alive = true;
    const tick = () => {
      // Sin polling en background/offline: batería + servidor.
      if (document.hidden || !navigator.onLine) return;
      if (alive) load();
    };
    load();
    const t = setInterval(tick, 30000);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("online", tick);
    return () => {
      alive = false;
      clearInterval(t);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("online", tick);
    };
  }, []);

  const unread = notifs.filter(n => !n.read).length;

  async function markAll(){
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      setNotifs(notifs.map(n => ({ ...n, read: true })));
    } catch {}
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
        aria-label="Notificaciones"
      >
        <Bell size={18} className="text-zinc-300" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-[11px] font-black rounded-full flex items-center justify-center animate-pulse">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <Card className="absolute right-0 top-12 w-[340px] max-w-[90vw] z-40 shadow-2xl border-zinc-800 bg-zinc-950 max-h-[70vh] overflow-hidden flex flex-col">
            <div className="p-3.5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <p className="font-bold text-sm text-white">Notificaciones</p>
              {unread > 0 && (
                <button onClick={markAll} className="text-xs text-primary hover:underline font-medium">
                  Marcar leídas
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-zinc-900">
              {notifs.length === 0 ? (
                <p className="text-xs text-zinc-500 p-8 text-center">No hay notificaciones todavía</p>
              ) : (
                notifs.map(n => {
                  const content = (
                    <div
                      key={n.id}
                      className={`p-3 flex gap-3 hover:bg-zinc-900/60 transition ${
                        !n.read ? "bg-primary/[0.04]" : ""
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !n.read ? "bg-primary" : "bg-transparent"
                        }`}
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-white truncate">{n.title}</p>
                        <p className="text-zinc-400 truncate mt-0.5">{n.body}</p>
                        <div className="flex items-center justify-between mt-1.5 text-[10px] text-zinc-500">
                          <span>
                            {new Date(n.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                          </span>
                          <Badge variant="muted" className="text-[9px] py-0 px-1.5">
                            {n.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );

                  return n.link ? (
                    <Link key={n.id} href={n.link}>
                      {content}
                    </Link>
                  ) : (
                    content
                  );
                })
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
