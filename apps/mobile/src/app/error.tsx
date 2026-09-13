"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-[60dvh] flex flex-col items-center justify-center gap-3 text-center px-6"
      role="alert"
    >
      <p className="text-lg font-black text-white">Algo falló al cargar</p>
      <p className="text-sm text-zinc-500 max-w-xs">
        No pudimos mostrar esta pantalla. Revisá tu conexión e intentá de
        nuevo.
      </p>
      {process.env.NODE_ENV === "development" && error?.message && (
        <pre className="text-[11px] text-zinc-600 max-w-full overflow-auto">
          {error.message}
        </pre>
      )}
      <button
        onClick={reset}
        className="mt-2 min-h-[44px] px-6 rounded-full bg-[#D6FF2A] text-black text-sm font-black"
      >
        Reintentar
      </button>
    </div>
  );
}
