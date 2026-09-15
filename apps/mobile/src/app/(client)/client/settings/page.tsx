"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, KeyRound, BellOff } from "lucide-react";

export default function ClientSettings() {
  const router = useRouter();

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Incluso si la petición falla, abandonamos la vista protegida.
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-4 max-w-[640px] pb-20">
      <h1 className="text-2xl font-display font-bold">Ajustes</h1>
      <Card>
        <CardHeader><CardTitle>Apariencia</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-500">Elegí blanco o negro — minimalista y premium, se ve prolijo en cualquier celu.</p>
          <ThemeToggle />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Notificaciones</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <BellOff size={18} className="mt-0.5 shrink-0 text-zinc-500" />
            <div>
              <p className="text-sm font-semibold text-white">Preferencias de notificación en preparación</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">No mostramos controles que todavía no se guardan en el backend. Cuando la persistencia esté conectada, esta sección tendrá preferencias por canal y tipo.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Cuenta</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Link href="/forgot-password" className="block">
            <Button variant="outline" className="w-full gap-2" type="button"><KeyRound size={16} /> Cambiar contraseña</Button>
          </Link>
          <Button variant="ghost" className="w-full text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 flex items-center justify-center gap-2 h-12 font-bold" onClick={logout}><LogOut size={16}/> Cerrar sesión</Button>
          <p className="text-[11px] text-zinc-600 text-center">El cambio de contraseña utiliza el flujo de recuperación de cuenta y no expone tu contraseña actual.</p>
        </CardContent>
      </Card>
    </div>
  );
}
