import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, Bell, Smartphone, Lock } from "lucide-react";

// Página pública indexable: sin metadata propio heredaba el título genérico
// del layout raíz en los resultados de búsqueda.
export const metadata: Metadata = {
  title: "Instalar KinetiX — App para Android e iPhone",
  description:
    "Instalá KinetiX como app nativa en tu celular: funciona offline, con ícono en el inicio y pantalla completa.",
  alternates: { canonical: "/install" },
};

export default function InstallPage(){
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      <header className="sticky top-0 z-10 bg-[#080808]/80 backdrop-blur border-b border-zinc-900">
        <div className="flex items-center gap-2 px-4 h-[56px] max-w-[640px] mx-auto w-full">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-black text-sm">E</div>
          <span className="font-display font-bold text-sm">KinetiX</span>
        </div>
      </header>
      <main className="flex-1 max-w-[640px] mx-auto w-full px-4 py-6 space-y-4">
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary flex items-center justify-center font-black text-black text-3xl">E</div>
          <h1 className="text-2xl font-display font-bold mt-4">Instalar KinetiX</h1>
          <p className="text-sm text-zinc-500 mt-2">Como app nativa en Android y iPhone. Funciona offline, icono en inicio, pantalla completa.</p>
        </div>

        <Card>
          <CardHeader><CardTitle>Android (Chrome, Brave, Edge)</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal pl-5 space-y-2 text-zinc-300">
              <li>Abrí esta web en <b className="text-white">Chrome</b></li>
              <li>Tocá el menu <b className="text-white">⋮ (arriba derecha)</b></li>
              <li>Tocá <b className="text-white">&ldquo;Instalar app&rdquo;</b> o &ldquo;Agregar a pantalla principal&rdquo;</li>
              <li>Confirmá <b className="text-white">Instalar</b></li>
            </ol>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-xs text-primary">
              Se abrirá como app independiente, con icono &ldquo;E&rdquo; amarillo en tu home.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>iPhone / iPad (Safari)</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal pl-5 space-y-2 text-zinc-300">
              <li>Abrí esta web en <b className="text-white">Safari</b> (no Chrome iOS)</li>
              <li>Tocá el botón <b className="text-white">Compartir</b> ⎙ (abajo, cuadrado con flecha)</li>
              <li>Deslizá y tocá <b className="text-white">&ldquo;Agregar al inicio&rdquo;</b></li>
              <li>Tocá <b className="text-white">Agregar</b> (arriba derecha)</li>
            </ol>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400">
              Tip: también podés mantener presionado el icono luego para moverlo o crear carpetas.
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader><CardTitle>Beneficios de instalar</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"><p className="font-bold flex items-center gap-1.5"><Zap size={13} className="text-primary" />Offline</p><p className="text-zinc-500 text-xs mt-1">Tus entrenamientos cacheados, sin señal seguís entrenando.</p></div>
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"><p className="font-bold flex items-center gap-1.5"><Bell size={13} className="text-primary" />Push</p><p className="text-zinc-500 text-xs mt-1">Notificaciones de check-in, mensajes y vencimientos.</p></div>
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"><p className="font-bold flex items-center gap-1.5"><Smartphone size={13} className="text-primary" />Pantalla completa</p><p className="text-zinc-500 text-xs mt-1">Sin barra de navegador, como app del store.</p></div>
            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800"><p className="font-bold flex items-center gap-1.5"><Lock size={13} className="text-primary" />Seguro</p><p className="text-zinc-500 text-xs mt-1">Mismo login, datos privados por cliente.</p></div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Link href="/login"><Button variant="accent" className="w-full h-[52px]">IR AL LOGIN</Button></Link>
          <Link href="/client/onboarding"><Button variant="outline" className="w-full">Ver onboarding cliente</Button></Link>
          <p className="text-xs text-center text-zinc-500">PWA lista para Play Store (TWA) y App Store (via PWA). Sin necesidad de pasar por stores para instalar.</p>
        </div>
      </main>
    </div>
  );
}
