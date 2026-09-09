"use client";
export function InstallPromptDetails(){
  return (
    <div className="space-y-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
      <p className="font-bold text-sm">Instalar como app</p>
      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-[#111111] p-3 rounded-xl border border-zinc-800">
          <p className="font-bold">Android (Chrome)</p>
          <p className="text-zinc-400 mt-1">1. Abre el menú ⋮<br/>2. Toca &ldquo;Instalar app&rdquo; o &ldquo;Agregar a pantalla principal&rdquo;<br/>3. Confirma Instalar</p>
        </div>
        <div className="bg-[#111111] p-3 rounded-xl border border-zinc-800">
          <p className="font-bold">iPhone (Safari)</p>
          <p className="text-zinc-400 mt-1">1. Toca Compartir \u2399 (abajo)<br/>2. &ldquo;Agregar al inicio&rdquo;<br/>3. Agregar</p>
        </div>
      </div>
      <p className="text-[11px] text-zinc-500">Una vez instalada abre como app nativa: pantalla completa, icono en home, funciona offline, notificaciones push listas.</p>
    </div>
  );
}
