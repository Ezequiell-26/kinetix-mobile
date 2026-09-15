"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { AlertTriangle, Check, Loader2, LogOut, Save, Shield } from "lucide-react";

type Profile = { name: string; email: string; bio: string; specialty: string };
type SessionRow = { id: string; current: boolean; userAgent?: string | null; ipAddress?: string | null; lastUsed: string; expiresAt: string };

export default function TrainerSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({ name: "", email: "", bio: "", specialty: "" });
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [profileResponse, sessionsResponse] = await Promise.all([
        fetch("/api/trainer/profile", { cache: "no-store" }),
        fetch("/api/auth/sessions", { cache: "no-store" }),
      ]);
      const profileData = await profileResponse.json().catch(() => null);
      const sessionData = await sessionsResponse.json().catch(() => null);
      if (!profileResponse.ok) throw new Error(profileData?.error || "No se pudo cargar el perfil.");
      if (!sessionsResponse.ok) throw new Error(sessionData?.error || "No se pudieron cargar las sesiones.");
      setProfile({ name: profileData.name || "", email: profileData.email || "", bio: profileData.bio || "", specialty: profileData.specialty || "" });
      setSessions(Array.isArray(sessionData.sessions) ? sessionData.sessions : []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron cargar los ajustes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function saveProfile() {
    setSaving(true); setError(null); setSuccess(null);
    try {
      const response = await fetch("/api/trainer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, bio: profile.bio, specialty: profile.specialty }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "No se pudo guardar el perfil.");
      setSuccess("Perfil actualizado.");
      setProfile((current) => ({ ...current, name: data.name || current.name, bio: data.bio || "", specialty: data.specialty || "" }));
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar el perfil.");
    } finally {
      setSaving(false);
    }
  }

  async function revokeAll() {
    if (revoking) return;
    setRevoking(true); setError(null); setSuccess(null);
    try {
      const response = await fetch("/api/auth/sessions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "No se pudieron cerrar las sesiones.");
      router.push("/login");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron cerrar las sesiones.");
      setRevoking(false);
    }
  }

  async function logout() {
    try { await fetch("/api/auth/logout", { method: "POST" }); } finally { router.push("/login"); router.refresh(); }
  }

  return (
    <div className="max-w-[760px] space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Ajustes</h1>
        <p className="mt-1 text-sm text-[#8193A5]">Perfil, seguridad, apariencia y preferencias de tu espacio de coach.</p>
      </div>

      {loading && <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs text-[#8193A5]"><Loader2 size={14} className="animate-spin" /> Cargando ajustes...</div>}
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200"><AlertTriangle size={15} className="mt-0.5" />{error}</div>}
      {success && <div role="status" className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary"><Check size={15} />{success}</div>}

      <Card className="border-primary/15 bg-[#0B151E]"><CardHeader><CardTitle>Apariencia</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-sm text-[#8193A5]">Tema global de KinetixFitt, con soporte para preferencia del sistema.</p><ThemeToggle /><p className="text-xs text-zinc-600">Se aplica sin recargar la página.</p></CardContent></Card>

      <Card className="border-primary/15 bg-[#0B151E]"><CardHeader><CardTitle>Perfil de entrenador</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="trainer-name">Nombre</Label><Input id="trainer-name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} maxLength={80} /></div>
          <div className="space-y-2"><Label htmlFor="trainer-email">Email</Label><Input id="trainer-email" value={profile.email} disabled /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="trainer-specialty">Especialidad</Label><Input id="trainer-specialty" value={profile.specialty} onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} placeholder="Hipertrofia, fuerza, rendimiento..." maxLength={120} /></div>
        <div className="space-y-2"><Label htmlFor="trainer-bio">Biografía</Label><textarea id="trainer-bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} maxLength={500} rows={4} className="w-full rounded-xl border border-white/[0.08] bg-[#081119] px-3 py-2 text-sm text-white outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10" placeholder="Presentate a tus clientes..." /></div>
        <Button variant="accent" onClick={() => void saveProfile()} disabled={saving || loading} className="gap-2">{saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} {saving ? "Guardando..." : "Guardar cambios"}</Button>
      </CardContent></Card>

      <Card className="border-primary/15 bg-[#0B151E]"><CardHeader><CardTitle className="flex items-center gap-2"><Shield size={17} className="text-primary" /> Seguridad y sesiones</CardTitle></CardHeader><CardContent className="space-y-3">
        <p className="text-xs text-[#8193A5]">Las sesiones se validan en servidor. Podés cerrar todas las sesiones desde aquí si sospechás acceso no autorizado.</p>
        <div className="space-y-2">{sessions.map((session) => <div key={session.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs"><div className="flex items-center justify-between gap-3"><div><p className="font-bold text-white">{session.current ? "Sesión actual" : "Sesión activa"}</p><p className="mt-1 text-[#8193A5]">{session.userAgent || "Cliente desconocido"}</p></div>{session.current && <span className="rounded-full bg-primary/10 px-2 py-1 font-black text-primary">ACTUAL</span>}</div><p className="mt-2 text-[11px] text-zinc-600">Último uso: {new Date(session.lastUsed).toLocaleString("es-AR")}</p></div>)}{!loading && sessions.length === 0 && <p className="text-xs text-zinc-600">No hay sesiones activas.</p>}</div>
        <Button variant="outline" onClick={() => void revokeAll()} disabled={revoking || loading} className="w-full gap-2">{revoking ? <Loader2 size={15} className="animate-spin" /> : <Shield size={15} />} Cerrar todas las sesiones</Button>
      </CardContent></Card>

      <Card className="border-red-500/20 bg-red-500/[0.04]"><CardHeader><CardTitle className="text-red-300">Cuenta</CardTitle></CardHeader><CardContent><Button variant="ghost" className="h-12 w-full gap-2 border border-red-500/20 bg-[#081119] text-red-300 hover:bg-red-500/10" onClick={() => void logout}><LogOut size={16} /> Cerrar sesión</Button></CardContent></Card>
    </div>
  );
}
