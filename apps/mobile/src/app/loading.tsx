export default function Loading() {
  return (
    <div
      className="min-h-[60dvh] flex flex-col items-center justify-center gap-3"
      role="status"
      aria-busy="true"
      aria-label="Cargando"
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-[#D6FF2A] animate-spin"
        aria-hidden="true"
      />
      <p className="text-sm text-zinc-500 font-bold">Cargando…</p>
    </div>
  );
}
