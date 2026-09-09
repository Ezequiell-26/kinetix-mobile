"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Check } from "lucide-react";

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

  useEffect(() => {
    async function loadPrograms(){
      try {
        const res = await fetch("/api/programs");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setPrograms(data);
            if (!selected && data.length > 0) {
              setSelected(currentProgramId || data[0].id);
            }
          }
        }
      } catch {}
    }
    loadPrograms();
  }, [currentProgramId]);

  async function handleAssign(){
    if (!selected) return;
    setLoading(true);
    setAssignedSuccess(false);

    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedProgramId: selected })
      });

      if (res.ok) {
        setAssignedSuccess(true);
        setTimeout(() => setAssignedSuccess(false), 4000);
      }
    } catch {
      alert("Error al asignar programa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-[#D6FF2A]/30 bg-zinc-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Dumbbell size={18} className="text-[#D6FF2A]" /> Asignar Programa
        </CardTitle>
        <p className="text-xs text-zinc-400">
          Asigná o cambiá el plan de entrenamiento para <span className="text-white font-medium">{clientName}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {programs.length === 0 ? (
          <p className="text-xs text-zinc-500 py-2">Cargando programas disponibles...</p>
        ) : (
          programs.map(p => {
            const isCurrent = selected === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                className={`w-full text-left p-3 rounded-xl border transition flex justify-between items-center ${
                  isCurrent
                    ? "bg-[#D6FF2A] text-black border-[#D6FF2A]"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-white"
                }`}
              >
                <div>
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className={`text-xs ${isCurrent ? "text-black/70" : "text-zinc-500"}`}>
                    {p.durationWeeks} semanas • {p.frequency} días/sem • {p.clients?.length || 0} clientes activos
                  </p>
                </div>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isCurrent ? "bg-black border-black text-[#D6FF2A]" : "border-zinc-700"
                  }`}
                >
                  {isCurrent && <Check size={12} strokeWidth={3} />}
                </span>
              </button>
            );
          })
        )}

        <Button
          variant={assignedSuccess ? "outline" : "accent"}
          className="w-full h-11 font-bold text-sm"
          onClick={handleAssign}
          disabled={loading || !selected}
        >
          {loading ? "Asignando..." : assignedSuccess ? "✓ Programa Asignado con Éxito" : "ASIGNAR PROGRAMA"}
        </Button>

        {assignedSuccess && (
          <p className="text-xs text-center text-emerald-400 font-medium animate-in fade-in">
            Programa guardado en la base de datos. {clientName} tiene el entrenamiento disponible en su cuenta.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
