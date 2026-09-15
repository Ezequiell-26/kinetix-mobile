"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Check, Loader2, AlertCircle } from "lucide-react";

type ProgramOption = {
  id: string;
  name: string;
  durationWeeks: number;
  frequency: number;
  clients?: Array<{ id: string }>;
};

export function AssignProgram({
  clientId,
  clientName,
  currentProgramId
}: {
  clientId: string;
  clientName: string;
  currentProgramId?: string | null;
}){
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [selected, setSelected] = useState<string>(currentProgramId || "");
  const [loading, setLoading] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadPrograms(){
      try {
        setError(null);
        const res = await fetch("/api/programs", { cache: "no-store" });
        if (!res.ok) throw new Error("No se pudieron cargar los programas.");
        const data = await res.json();
        if (cancelled || !Array.isArray(data)) return;
        setPrograms(data);
        setSelected((previous) => currentProgramId || previous || data[0]?.id || "");
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "No se pudieron cargar los programas.");
      }
    }
    loadPrograms();
    return () => { cancelled = true; };
  }, [currentProgramId]);

  async function handleAssign(){
    if (!selected || loading) return;
    setLoading(true);
    setAssignedSuccess(false);
    setError(null);

    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedProgramId: selected })
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.error || "Error al asignar el programa.");
      }
      setAssignedSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Error al asignar el programa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-primary/30 bg-[#0B151E]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <Dumbbell size={18} className="text-primary" /> Asignar Programa
        </CardTitle>
        <p className="text-xs text-[#8193A5]">
          Asigná o cambiá el plan de entrenamiento para <span className="font-medium text-white">{clientName}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {programs.length === 0 ? (
          <p className="py-2 text-xs text-[#8193A5]">Cargando programas disponibles...</p>
        ) : (
          programs.map((program) => {
            const isCurrent = selected === program.id;
            return (
              <button
                key={program.id}
                type="button"
                onClick={() => { setSelected(program.id); setAssignedSuccess(false); setError(null); }}
                className={`w-full rounded-xl border p-3 text-left transition ${isCurrent ? "border-primary bg-primary text-black" : "border-white/[0.06] bg-white/[0.02] text-white hover:border-primary/30 hover:bg-white/[0.04]"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{program.name}</p>
                    <p className={`text-xs ${isCurrent ? "text-black/70" : "text-[#8193A5]"}`}>
                      {program.durationWeeks} semanas • {program.frequency} días/sem • {program.clients?.length || 0} clientes
                    </p>
                  </div>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${isCurrent ? "border-black bg-black text-primary" : "border-white/15"}`}>
                    {isCurrent && <Check size={12} strokeWidth={3} />}
                  </span>
                </div>
              </button>
            );
          })
        )}

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          variant={assignedSuccess ? "outline" : "accent"}
          className="h-11 w-full font-bold text-sm"
          onClick={handleAssign}
          disabled={loading || !selected || programs.length === 0}
        >
          {loading ? <><Loader2 size={15} className="animate-spin" /> Asignando...</> : assignedSuccess ? <><Check size={15} /> Programa guardado</> : "ASIGNAR PROGRAMA"}
        </Button>

        {assignedSuccess && (
          <p className="text-center text-xs font-medium text-primary" role="status">
            {clientName} ya tiene el programa disponible en su cuenta.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
