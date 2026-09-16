"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Dumbbell, ClipboardCheck, MessageCircle, Loader2, AlertCircle } from "lucide-react";

function base64UrlToUint8Array(base64UrlData: string) {
  const padding = "=".repeat((4 - (base64UrlData.length % 4)) % 4);
  const base64 = (base64UrlData + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

async function getServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.getRegistration("/") ?? navigator.serviceWorker.register("/sw.js");
}

export function PushCenter() {
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        setPerm("unsupported");
        return;
      }
      setPerm(Notification.permission);
      if (Notification.permission !== "granted") return;
      try {
        const registration = await getServiceWorkerRegistration();
        const subscription = await registration?.pushManager.getSubscription();
        if (mounted) setEnabled(Boolean(subscription));
      } catch {
        if (mounted) setEnabled(false);
      }
    }

    void hydrate();
    return () => { mounted = false; };
  }, []);

  async function enable() {
    setError(null);
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setError("Este navegador no admite notificaciones push.");
      return;
    }

    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      setPerm(permission);
      if (permission !== "granted") return;

      const keyResponse = await fetch("/api/push/public-key", { credentials: "same-origin", cache: "no-store" });
      if (!keyResponse.ok) throw new Error("Push no configurado en el servidor");
      const { publicKey } = (await keyResponse.json()) as { publicKey?: string };
      if (!publicKey) throw new Error("Falta la clave pública VAPID");

      const registration = await getServiceWorkerRegistration();
      if (!registration) throw new Error("No se pudo registrar el Service Worker");

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToUint8Array(publicKey),
      });

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });
      if (!response.ok) throw new Error("No se pudo guardar la suscripción");

      setEnabled(true);
      try {
        await registration.showNotification("KINETIXFITT", {
          body: "Notificaciones activadas. Te avisaremos de entrenos, check-ins y mensajes.",
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
          data: { url: "/client/dashboard" },
        });
      } catch {
        // Some browsers disallow direct SW notifications without a visible event; subscription is still valid.
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron activar las notificaciones");
      setEnabled(false);
    } finally {
      setBusy(false);
    }
  }

  const unavailable = perm === "unsupported";

  return (
    <Card className={enabled ? "border-emerald-500/20 bg-emerald-500/5" : "border-zinc-800"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={16} className={enabled ? "text-emerald-400" : "text-zinc-400"} aria-hidden="true" />
          Push Notificaciones
          <Badge variant={enabled ? "accent" : "muted"}>{enabled ? "Activas" : "Inactivas"}</Badge>
        </CardTitle>
        <p className="text-xs text-zinc-500">Recordatorios: entreno hoy, check-in pendiente, mensaje de tu coach</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 text-xs">
          <label className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <span className="flex items-center gap-2"><Dumbbell size={14} className="text-primary" aria-hidden="true" /> Entreno de hoy — 08:00</span>
            <input type="checkbox" checked={enabled} readOnly aria-label="Recordatorio de entreno" className="accent-primary" />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <span className="flex items-center gap-2"><ClipboardCheck size={14} className="text-primary" aria-hidden="true" /> Check-in pendiente — Domingo 20:00</span>
            <input type="checkbox" checked={enabled} readOnly aria-label="Recordatorio de check-in" className="accent-primary" />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <span className="flex items-center gap-2"><MessageCircle size={14} className="text-primary" aria-hidden="true" /> Nuevo mensaje de tu coach</span>
            <input type="checkbox" checked={enabled} readOnly aria-label="Notificación de mensajes" className="accent-primary" />
          </label>
        </div>

        {error && (
          <p className="flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/5 p-3 text-xs text-red-300" role="alert">
            <AlertCircle size={14} aria-hidden="true" /> {error}
          </p>
        )}

        {unavailable ? (
          <p className="text-xs text-center text-zinc-500">Este navegador no admite notificaciones push.</p>
        ) : enabled ? (
          <p className="flex items-center justify-center gap-1 text-center text-xs text-emerald-400"><Check size={12} aria-hidden="true" /> Notificaciones activas — las verás incluso con la app cerrada</p>
        ) : (
          <Button variant="accent" className="w-full" onClick={enable} disabled={busy}>
            {busy ? <Loader2 size={14} className="mr-2 animate-spin" aria-hidden="true" /> : <Bell size={14} className="mr-2" aria-hidden="true" />}
            {busy ? "Activando…" : "Activar notificaciones"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
