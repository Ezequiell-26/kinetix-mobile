"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload, Check, Download, Loader2, AlertCircle } from "lucide-react";

type ImportedSet = { date: string; workoutName: string; exercise: string; weight: number | null; reps: number | null; };
type ImportGroup = { date: string; workoutName: string; sets: ImportedSet[] };

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current.trim()); current = "";
    } else current += char;
  }
  values.push(current.trim());
  return values;
}

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseNumber(value: string | undefined): number | null {
  if (!value) return null;
  const normalized = value.replace(/,/g, ".").replace(/[^0-9.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCsv(csv: string): ImportedSet[] {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) throw new Error("El CSV no contiene filas de entrenamiento.");
  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const idx = (...names: string[]) => names.map((name) => headers.indexOf(normalizeHeader(name))).find((index) => index >= 0) ?? -1;
  const dateIndex = idx("Date", "Fecha");
  const workoutIndex = idx("Workout Name", "Workout", "Entrenamiento", "Routine");
  const exerciseIndex = idx("Exercise Name", "Exercise", "Ejercicio");
  const weightIndex = idx("Weight", "Peso");
  const repsIndex = idx("Reps", "Repetitions", "Repeticiones");

  if (dateIndex < 0 || exerciseIndex < 0 || weightIndex < 0 || repsIndex < 0) {
    throw new Error("El CSV debe incluir Date, Exercise Name, Weight y Reps.");
  }

  return lines.slice(1).map((line, rowIndex) => {
    const cells = parseCsvLine(line);
    const dateRaw = cells[dateIndex]?.trim();
    const parsedDate = new Date(dateRaw);
    if (!dateRaw || Number.isNaN(parsedDate.getTime())) throw new Error(`Fecha inválida en la fila ${rowIndex + 2}.`);
    return {
      date: parsedDate.toISOString(),
      workoutName: (cells[workoutIndex] || "Entrenamiento importado").trim().slice(0, 200),
      exercise: (cells[exerciseIndex] || "Ejercicio").trim().slice(0, 200),
      weight: parseNumber(cells[weightIndex]),
      reps: parseNumber(cells[repsIndex]) !== null ? Math.round(parseNumber(cells[repsIndex]) as number) : null,
    };
  });
}

export function HevyImportPro(){
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportedSet[] | null>(null);
  const [source, setSource] = useState<"hevy" | "strong">("hevy");
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const groups = useMemo<ImportGroup[]>(() => {
    if (!preview) return [];
    const map = new Map<string, ImportGroup>();
    for (const row of preview) {
      const day = row.date.slice(0, 10);
      const key = `${day}|${row.workoutName}`;
      const existing = map.get(key);
      if (existing) existing.sets.push(row);
      else map.set(key, { date: day, workoutName: row.workoutName, sets: [row] });
    }
    return [...map.values()];
  }, [preview]);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(null);
    setMessage(null);
    setError(null);
    try {
      const text = await file.text();
      setPreview(parseCsv(text));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo leer el CSV.");
    }
  }

  async function importHistory() {
    if (!groups.length || importing) return;
    setImporting(true);
    setMessage(null);
    setError(null);
    let importedGroups = 0;
    let importedSets = 0;
    try {
      for (const group of groups) {
        const response = await fetch("/api/workout-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            importSource: source,
            date: group.date,
            workoutName: group.workoutName,
            durationMin: null,
            comment: `Importado desde ${source === "hevy" ? "Hevy" : "Strong"}`,
            completed: true,
            sets: group.sets.map((set, index) => ({
              exerciseName: set.exercise,
              setNumber: index + 1,
              weight: set.weight,
              reps: set.reps,
              completed: true,
            })),
          }),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.error || `No se pudo importar ${group.workoutName}.`);
        importedGroups += 1;
        importedSets += group.sets.length;
      }
      setMessage(`Importación completada: ${importedGroups} entrenamientos y ${importedSets} series guardadas en tu historial.`);
      setPreview(null);
      setFileName(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La importación falló.");
    } finally {
      setImporting(false);
    }
  }

  function downloadExample() {
    const csv = "Date,Workout Name,Exercise Name,Set Order,Weight,Reps\n2026-09-08,Push,Press Banca,1,60,8\n2026-09-08,Push,Press Banca,2,62.5,7\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "kinetixfitt-import-example.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card className="border-primary/20 bg-[#0B151E]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white"><FileSpreadsheet size={16} className="text-primary"/> Hevy / Strong Import</CardTitle>
        <p className="text-xs text-[#8193A5]">Importá tu historial real y guardalo en KinetixFitt sin inventar sesiones.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className={`rounded-xl border p-3 cursor-pointer transition ${source === "hevy" ? "border-primary bg-primary/5" : "border-white/[0.06] bg-white/[0.02]"}`}>
            <input type="radio" name="import-source" className="sr-only" checked={source === "hevy"} onChange={() => setSource("hevy")} />
            <span className="text-xs font-bold text-white">Hevy CSV</span>
            <span className="mt-1 block text-[11px] text-[#8193A5]">Historial exportado desde Hevy</span>
          </label>
          <label className={`rounded-xl border p-3 cursor-pointer transition ${source === "strong" ? "border-primary bg-primary/5" : "border-white/[0.06] bg-white/[0.02]"}`}>
            <input type="radio" name="import-source" className="sr-only" checked={source === "strong"} onChange={() => setSource("strong")} />
            <span className="text-xs font-bold text-white">Strong CSV</span>
            <span className="mt-1 block text-[11px] text-[#8193A5]">Formato CSV compatible con Strong</span>
          </label>
        </div>

        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-primary/30">
          <Upload size={20} className="text-primary"/>
          <span className="text-xs font-bold text-white">{fileName || "Subí tu CSV"}</span>
          <span className="text-center text-[11px] text-[#8193A5]">Se valida y previsualiza antes de guardar.</span>
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
        </label>

        {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-200"><AlertCircle size={15} className="mt-0.5 shrink-0" />{error}</div>}
        {message && <div role="status" className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary"><Check size={15} className="mt-0.5 shrink-0" />{message}</div>}

        {preview && (
          <div className="space-y-2 rounded-xl border border-white/[0.06] bg-[#081119] p-3">
            <p className="flex items-center gap-1 text-xs font-bold text-white"><Check size={12} className="text-primary"/> Preview — {preview.length} series · {groups.length} entrenamientos</p>
            {groups.slice(0, 8).map((group) => (
              <div key={`${group.date}-${group.workoutName}`} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2 text-xs">
                <div className="flex justify-between gap-3"><span className="font-semibold text-white">{group.workoutName}</span><span className="text-[#8193A5]">{group.date}</span></div>
                <p className="mt-1 text-[11px] text-[#8193A5]">{group.sets.length} series · {group.sets[0]?.exercise || "Ejercicio"}{group.sets.length > 1 ? ` + ${group.sets.length - 1}` : ""}</p>
              </div>
            ))}
            {groups.length > 8 && <p className="text-center text-[11px] text-[#8193A5]">+ {groups.length - 8} entrenamientos más</p>}
            <Button variant="accent" className="w-full" onClick={importHistory} disabled={importing}>
              {importing ? <><Loader2 size={14} className="animate-spin"/> Guardando historial...</> : "Importar al historial →"}
            </Button>
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full" onClick={downloadExample}><Download size={14} className="mr-2"/> Descargar CSV de ejemplo</Button>
      </CardContent>
    </Card>
  );
}
