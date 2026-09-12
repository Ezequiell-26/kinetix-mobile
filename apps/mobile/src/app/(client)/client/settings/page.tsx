"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut } from "lucide-react";

export default function ClientSettings(){
  const r=useRouter();
  async function logout(){
    try{ await fetch("/api/auth/logout",{method:"POST"}); }catch{}
    r.push("/login");
    r.refresh();
  }
  return (
    <div className="space-y-4 max-w-[640px] pb-20">
      <h1 className="text-2xl font-display font-bold">Ajustes</h1>
      <Card><CardHeader><CardTitle>Apariencia</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-500">Elegí blanco o negro — minimalista y premium, se ve prolijo en cualquier celu.</p>
          <ThemeToggle variant="full" />
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Notificaciones</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <label className="flex justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800"><span>Nuevo entrenamiento</span><input type="checkbox" defaultChecked /></label>
          <label className="flex justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800"><span>Mensaje de Ezequiel</span><input type="checkbox" defaultChecked /></label>
          <label className="flex justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800"><span>Recordatorio de entrenamiento</span><input type="checkbox" defaultChecked /></label>
          <label className="flex justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800"><span>Check-in pendiente</span><input type="checkbox" defaultChecked /></label>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Cuenta</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full" onClick={()=>alert("Cambiar contraseña — en prod enviará email de reseteo")}>Cambiar contraseña</Button>
          <Button variant="ghost" className="w-full text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 flex items-center justify-center gap-2 h-12 font-bold" onClick={logout}><LogOut size={16}/> Cerrar sesión</Button>
          <p className="text-[11px] text-zinc-600 text-center">Cerrar sesión te lleva al login. Tus datos quedan guardados.</p>
        </CardContent>
      </Card>
    </div>
  );
}
