"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Dumbbell } from "lucide-react";

/**
 * Generador de sesiones al estilo workout.lol (MIT): elegís músculos y
 * equipamiento, y arma una sesión con ejercicios reales de la biblioteca
 * local (/api/exercises). Es una sugerencia: el plan asignado por tu coach
 * siempre manda.
 */

type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string | null;
  level: string;
};

const MUSCLES = [
  { id: "chest", label: "Pecho" },
  { id: "back", label: "Espalda" },
  { id: "shoulders", label: "Hombros" },
  { id: "biceps", label: "Bíceps" },
  { id: "triceps", label: "Tríceps" },
  { id: "core", label: "Core" },
  { id: "glutes", label: "Glúteos" },
  { id: "legs", label: "Piernas" },
  { id: "arms", label: "Brazos" },
  { id: "cardio", label: "Cardio" },
] as const;

// Grupos de la biblioteca (ExerciseDB, en inglés) por músculo en español
const MUSCLE_MATCHERS: Record<string, string[]> = {
  chest: ["chest"],
  back: ["back"],
  shoulders: ["shoulders"],
  biceps: ["biceps"],
  triceps: ["triceps"],
  core: ["abdominals", "waist"],
  glutes: ["glutes"],
  legs: ["upper legs", "lower legs"],
  arms: ["upper arms"],
  cardio: ["cardio"],
};

const EQUIPMENT = [
  { id: "all", label: "Todo" },
  { id: "barbell", label: "Barra" },
  { id: "dumbbell", label: "Mancuernas" },
  { id: "bodyweight", label: "Peso corporal" },
  { id: "band", label: "Bandas" },
  { id: "machine", label: "Máquina / Cable" },
] as const;

const EQUIPMENT_MATCHERS: Record<string, string[]> = {
  barbell: ["barbell"],
  dumbbell: ["dumbbell"],
  bodyweight: ["body only", "body weight"],
  band: ["band"],
  machine: ["machine", "cable", "leverage"],
};

const REPS_BY_MUSCLE: Record<string, string> = {
  chest: "8-12",
  back: "8-12",
  shoulders: "10-15",
  biceps: "10-15",
  triceps: "10-15",
  core: "15-20",
  glutes: "10-15",
  legs: "8-12",
  arms: "10-15",
  cardio: "3-4 min",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function WorkoutLolGenerator() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [muscles, setMuscles] = useState<string[]>(["chest", "back"]);
  const [equipment, setEquipment] = useState<string>("all");
  const [count, setCount] = useState(4);
  const [session, setSession] = useState<Array<{ ex: Exercise; muscle: string }> | null>(null);

  useEffect(() => {
    fetch("/api/exercises")
      .then(r => r.json())
      .then((data: Exercise[]) => setExercises(Array.isArray(data) ? data : []))
      .catch(() => setExercises([]))
      .finally(() => setLoading(false));
  }, []);

  const pools = useMemo(() => {
    const eq = EQUIPMENT_MATCHERS[equipment];
    const map = new Map<string, Exercise[]>();
    for (const m of muscles) {
      const matchers = MUSCLE_MATCHERS[m] ?? [];
      const pool = exercises.filter(e => {
        const group = e.muscleGroup.toLowerCase();
        const eqOk = !eq || (e.equipment ?? "").toLowerCase().split(" ").some(w => eq.some(m2 => w.startsWith(m2)));
        return eqOk && matchers.some(mm => group.includes(mm));
      });
      map.set(m, shuffle(pool));
    }
    return map;
  }, [exercises, muscles, equipment]);

  const generate = () => {
    // Round-robin entre los músculos elegidos para una sesión balanceada
    const result: Array<{ ex: Exercise; muscle: string }> = [];
    const idx = new Map(muscles.map(m => [m, 0]));
    let progress = true;
    while (result.length < count && progress) {
      progress = false;
      for (const m of muscles) {
        if (result.length >= count) break;
        const pool = pools.get(m) ?? [];
        const i = idx.get(m) ?? 0;
        if (i < pool.length) {
          result.push({ ex: pool[i], muscle: m });
          idx.set(m, i + 1);
          progress = true;
        }
      }
    }
    setSession(result);
  };

  const toggleMuscle = (id: string) => {
    setSession(null);
    setMuscles(prev => (prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]));
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" /> Generador de sesión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-bold text-zinc-400 mb-2">1 · Músculos</p>
          <div className="flex flex-wrap gap-1.5">
            {MUSCLES.map(m => (
              <button
                key={m.id}
                onClick={() => toggleMuscle(m.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                  muscles.includes(m.id)
                    ? "bg-primary text-black border-primary"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-zinc-400 mb-2">2 · Equipamiento</p>
          <div className="flex flex-wrap gap-1.5">
            {EQUIPMENT.map(e => (
              <button
                key={e.id}
                onClick={() => { setEquipment(e.id); setSession(null); }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                  equipment === e.id
                    ? "bg-white text-black border-white"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs font-bold text-zinc-400">3 · Ejercicios</p>
          <div className="flex gap-1.5">
            {[3, 4, 5, 6].map(n => (
              <button
                key={n}
                onClick={() => { setCount(n); setSession(null); }}
                className={`w-9 h-9 rounded-xl text-xs font-black border transition ${
                  count === n
                    ? "bg-primary text-black border-primary"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={generate}
            disabled={!muscles.length || loading}
            className="ml-auto px-4 py-2 rounded-xl bg-primary text-black text-xs font-black flex items-center gap-1.5 disabled:opacity-40 hover:brightness-110 transition"
          >
            {session ? <RefreshCw size={14} /> : <Sparkles size={14} />}
            {session ? "Regenerar" : "Generar"}
          </button>
        </div>

        {loading && <p className="text-xs text-zinc-500 text-center py-4">Cargando biblioteca…</p>}

        {!loading && session && session.length === 0 && (
          <p className="text-xs text-zinc-500 text-center py-4">
            No hay ejercicios con esos filtros. Probá con otro equipamiento o más músculos.
          </p>
        )}

        {session && session.length > 0 && (
          <div className="space-y-2">
            {session.map((item, i) => (
              <div key={`${item.ex.id}-${i}`} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">{item.ex.name}</p>
                  <p className="text-[11px] text-zinc-500">
                    {MUSCLES.find(m => m.id === item.muscle)?.label} · {item.ex.equipment || "—"} · {item.ex.level}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-primary">3 × {REPS_BY_MUSCLE[item.muscle]}</p>
                  <p className="text-[10px] text-zinc-500">sugerido</p>
                </div>
              </div>
            ))}
            <p className="text-[11px] text-zinc-600 text-center flex items-center justify-center gap-1">
              <Dumbbell size={11} /> Sugerencia automática — tu plan asignado siempre manda
            </p>
          </div>
        )}

        {!session && !loading && (
          <p className="text-[11px] text-zinc-600 text-center">
            Inspirado en workout.lol (MIT) · ejercicios de la biblioteca local
          </p>
        )}
      </CardContent>
    </Card>
  );
}
