"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaRegister() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const ua = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua);
    setIsIOS(ios);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      if (!standalone) setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const t = setTimeout(() => setShowInstall(false), 20000);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(t);
    };
  }, []);

  async function install() {
    if (!deferred) return;
    try {
      deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setShowInstall(false);
    } catch {
      setShowInstall(false);
    }
    setDeferred(null);
  }

  if (isStandalone) return null;

  if (isIOS && !isStandalone) {
    return (
      <div className="fixed bottom-[84px] left-3 right-3 z-50 lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-[360px]">
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-4 shadow-2xl flex gap-3 items-start">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-black shrink-0">E</div>
          <div className="flex-1">
            <p className="text-sm font-bold">Instalar KinetiX</p>
            <p className="text-xs text-zinc-400 mt-1">
              En iPhone: toca <span className="text-white font-semibold">Compartir</span> ⎙{" "}
              &rarr; <span className="text-white font-semibold">Agregar al inicio</span> para usarla como app.
            </p>
            <button onClick={() => setShowInstall(false)} className="text-xs text-zinc-500 mt-2">
              Cerrar
            </button>
          </div>
          <button onClick={() => setShowInstall(false)} className="text-zinc-500 p-1"><X size={14} /></button>
        </div>
      </div>
    );
  }

  if (!showInstall || !deferred) return null;

  return (
    <div className="fixed bottom-[84px] left-3 right-3 z-50 lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-[360px]">
      <div className="bg-white text-black rounded-2xl p-4 shadow-2xl flex gap-3 items-center">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-black shrink-0">E</div>
        <div className="flex-1">
          <p className="text-sm font-bold">Instalar app</p>
          <p className="text-xs text-zinc-600">Acceso directo, funciona offline.</p>
        </div>
        <button onClick={install} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold">
          INSTALAR
        </button>
        <button onClick={() => setShowInstall(false)} className="text-zinc-400 p-1"><X size={14} /></button>
      </div>
    </div>
  );
}
