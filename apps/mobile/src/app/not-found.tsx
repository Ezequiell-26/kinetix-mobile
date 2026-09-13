import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60dvh] flex flex-col items-center justify-center gap-3 text-center px-6">
      <p className="text-5xl font-black text-zinc-800" aria-hidden="true">
        404
      </p>
      <p className="text-lg font-black text-white">Página no encontrada</p>
      <p className="text-sm text-zinc-500 max-w-xs">
        La dirección no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-2 min-h-[44px] inline-flex items-center px-6 rounded-full bg-[#D6FF2A] text-black text-sm font-black"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
