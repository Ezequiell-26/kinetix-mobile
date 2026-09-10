/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FormCheck } from "@/components/form-check";
import { VoiceCoach } from "@/components/voice-coach";
import { ExerciseImage } from "@/components/exercise-image";
import { GymMode } from "@/components/gym-mode";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Dumbbell, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Flame, 
  Info,
  Check
} from "lucide-react";

type WorkoutExerciseItem = {
  id: string;
  order: number;
  sets: number;
  reps: string;
  rir: number | null;
  rpe: number | null;
  restSec: number;
  tempo: string | null;
  load: string | null;
  notes: string | null;
  exercise: {
    id: string;
    name: string;
    muscleGroup: string;
    image: string | null;
    instructions: string | null;
    equipment: string | null;
  };
};

type WorkoutData = {
  id: string;
  name: string;
  description: string | null;
  estimatedMin: number;
  exercises: WorkoutExerciseItem[];
};

type CompletedSetRecord = {
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  rir: number | null;
  rpe: number | null;
};

export default function WorkoutExecutionPage(){
  const params = useParams();
  const router = useRouter();
  const workoutId = Array.isArray(params.id) ? params.id[0] : params.id as string;

  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSetIdx, setCurrentSetIdx] = useState(0);

  // Live input values
  const [weight, setWeight] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [rir, setRir] = useState<string>("2");

  // Track completed sets
  const [loggedSets, setLoggedSets] = useState<Record<string, CompletedSetRecord>>({});

  // Rest Timer State
  const [restRemaining, setRestRemaining] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Session timing
  const [startTime] = useState<number>(Date.now());
  const [finished, setFinished] = useState<boolean>(false);
  const [gymMode, setGymMode] = useState<boolean>(false);
  const [finalComment, setFinalComment] = useState<string>("");
  const [savingLog, setSavingLog] = useState<boolean>(false);

  // Audio beep
  function playBeep(){
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }

  // Load workout from API
  useEffect(() => {
    async function loadWorkout(){
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/workouts/${workoutId}`);
        if (!res.ok) throw new Error("No se pudo cargar el entrenamiento");
        const data = await res.json();
        setWorkout(data);
        if (data.exercises?.[0]) {
          const firstEx = data.exercises[0];
          setReps(firstEx.reps?.split("-")?.[0] || "8");
          setRir(firstEx.rir !== null ? String(firstEx.rir) : "2");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar");
      } finally {
        setLoading(false);
      }
    }
    loadWorkout();
  }, [workoutId]);

  // Handle rest timer countdown
  useEffect(() => {
    if (!isResting || isTimerPaused) return;
    if (restRemaining <= 0) {
      setIsResting(false);
      playBeep();
      try { navigator.vibrate?.([80, 50, 80]); } catch {}
      return;
    }
    const timer = setInterval(() => {
      setRestRemaining(prev => {
        if (prev <= 1) {
          setIsResting(false);
          playBeep();
          try { navigator.vibrate?.([80, 50, 80]); } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isResting, isTimerPaused, restRemaining]);

  const currentExercise = workout?.exercises?.[currentExIdx];
  const totalTargetSets = workout?.exercises?.reduce((acc, e) => acc + e.sets, 0) || 1;
  const totalCompletedSets = Object.keys(loggedSets).length;
  const progressPercent = Math.min(100, Math.round((totalCompletedSets / totalTargetSets) * 100));

  // Sync inputs when changing exercise
  useEffect(() => {
    if (currentExercise) {
      setReps(currentExercise.reps?.split("-")?.[0] || "8");
      setRir(currentExercise.rir !== null && currentExercise.rir !== undefined ? String(currentExercise.rir) : "2");
    }
  }, [currentExIdx, currentExercise]);

  // Complete a set
  function handleSaveSet(){
    if (!currentExercise) return;
    const key = `${currentExIdx}-${currentSetIdx}`;
    const numWeight = parseFloat(weight) || 0;
    const numReps = parseInt(reps) || parseInt(currentExercise.reps) || 8;
    const numRir = rir !== "" ? parseInt(rir) : null;

    const record: CompletedSetRecord = {
      exerciseName: currentExercise.exercise.name,
      setNumber: currentSetIdx + 1,
      weight: numWeight,
      reps: numReps,
      rir: numRir,
      rpe: null,
    };

    setLoggedSets(prev => ({ ...prev, [key]: record }));

    // Haptic feedback
    try { navigator.vibrate?.(40); } catch {}

    // Check next set or next exercise
    if (currentSetIdx < currentExercise.sets - 1) {
      setCurrentSetIdx(prev => prev + 1);
      const rest = currentExercise.restSec || 90;
      setRestRemaining(rest);
      setIsResting(true);
      setIsTimerPaused(false);
    } else if (currentExIdx < (workout?.exercises?.length || 0) - 1) {
      setCurrentExIdx(prev => prev + 1);
      setCurrentSetIdx(0);
      setRestRemaining(90);
      setIsResting(true);
      setIsTimerPaused(false);
    } else {
      // Finished all exercises
      setFinished(true);
      try { navigator.vibrate?.([100, 50, 150]); } catch {}
    }
  }

  // Complete entire current exercise
  function handleCompleteExercise(){
    if (!workout) return;
    if (currentExIdx < workout.exercises.length - 1) {
      setCurrentExIdx(prev => prev + 1);
      setCurrentSetIdx(0);
      setRestRemaining(60);
      setIsResting(true);
      setIsTimerPaused(false);
    } else {
      setFinished(true);
    }
  }

  // Final submission of workout session to DB
  async function handleFinishWorkout(){
    if (!workout) return;
    setSavingLog(true);

    const durationMin = Math.max(1, Math.round((Date.now() - startTime) / (1000 * 60)));
    const setsPayload = Object.values(loggedSets);

    try {
      const res = await fetch("/api/workout-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutId: workout.id,
          durationMin,
          comment: finalComment || `Sesión completada (${totalCompletedSets} series)`,
          completed: true,
          sets: setsPayload
        })
      });

      if (res.ok) {
        router.push("/client/dashboard");
      } else {
        router.push("/client/dashboard");
      }
    } catch {
      router.push("/client/dashboard");
    } finally {
      setSavingLog(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[#D6FF2A] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-zinc-400">Cargando tu entrenamiento...</p>
      </div>
    );
  }

  // Error state
  if (error || !workout || !workout.exercises?.length) {
    return (
      <div className="space-y-4 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white">
          <ArrowLeft size={16} /> Volver
        </button>
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="py-10 text-center space-y-3">
            <p className="text-red-400 font-semibold">{error || "Este entrenamiento no tiene ejercicios configurados todavía."}</p>
            <Button variant="accent" onClick={() => router.push("/client/workout")}>
              Ver mis rutinas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Final Summary Screen
  if (finished) {
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - startTime) / (1000 * 60)));
    const totalVolume = Object.values(loggedSets).reduce((acc, s) => acc + (s.weight * s.reps), 0);
    const exercisesDoneCount = new Set(Object.values(loggedSets).map(s => s.exerciseName)).size;

    return (
      <div className="space-y-5 py-4 max-w-md mx-auto">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#D6FF2A] flex items-center justify-center text-black mx-auto">
            <Check size={36} strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-display font-bold">¡Entrenamiento Completado!</h1>
          <p className="text-xs text-zinc-400">{workout.name}</p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold block">Duración</span>
              <p className="text-xl font-black text-white mt-0.5">{elapsedMinutes} min</p>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold block">Ejercicios</span>
              <p className="text-xl font-black text-white mt-0.5">{exercisesDoneCount || workout.exercises.length}</p>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold block">Series</span>
              <p className="text-xl font-black text-white mt-0.5">{totalCompletedSets}</p>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold block">Volumen</span>
              <p className="text-xl font-black text-[#D6FF2A] mt-0.5">{totalVolume.toLocaleString("es-AR")} kg</p>
            </div>
          </CardContent>
        </Card>

        {/* Notes on session */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400">¿Cómo sentiste la sesión? (Opcional)</label>
          <Input
            value={finalComment}
            onChange={e => setFinalComment(e.target.value)}
            placeholder="Excelente bombeo, subí 2.5kg en el último ejercicio..."
            className="h-12 bg-zinc-900 border-zinc-800 text-sm"
          />
        </div>

        <Button
          variant="accent"
          onClick={handleFinishWorkout}
          disabled={savingLog}
          className="w-full h-14 font-black text-base tracking-wide"
        >
          {savingLog ? "Guardando..." : "GUARDAR Y VOLVER AL INICIO ✓"}
        </Button>
      </div>
    );
  }

  if(gymMode && workout){
    return (
      <GymMode
        exercises={workout.exercises.map(e=>({id:e.id, name:e.exercise.name, sets:e.sets, reps:e.reps, restSec:e.restSec, image:e.exercise.image, instructions:e.exercise.instructions || e.notes, muscleGroup:e.exercise.muscleGroup}))}
        onExit={()=>setGymMode(false)}
        onFinish={()=>{ setGymMode(false); setFinished(true); }}
      />
    );
  }

  return (
    <div className="space-y-4 pb-12 select-none">
      {/* Top Session Progress Bar */}
      <div className="space-y-2 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
        <div className="flex items-center justify-between text-xs">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-zinc-400 hover:text-white p-1 -ml-1">
            <ArrowLeft size={16} /> Salir
          </button>
          <p className="font-bold text-white truncate max-w-[200px]">{workout.name}</p>
          <div className="flex items-center gap-2"><Badge variant="accent" className="font-bold">
            {currentExIdx + 1} / {workout.exercises.length}
          </Badge><button onClick={()=>setGymMode(true)} className="text-[11px] font-black bg-[#D6FF2A] text-black px-2.5 py-1 rounded-full">GYM MODE</button></div>
        </div>
        <Progress value={progressPercent} className="h-2 bg-zinc-800" />
        <div className="flex justify-between text-[11px] text-zinc-400">
          <span>Serie {totalCompletedSets + 1} de {totalTargetSets}</span>
          <span className="font-bold text-[#D6FF2A]">{progressPercent}% realizado</span>
        </div>
      </div>

      {/* Rest Timer Modal / Overlay Banner */}
      {isResting && (
        <Card className="border-[#D6FF2A]/40 bg-[#D6FF2A]/[0.08] text-center shadow-2xl animate-in fade-in">
          <CardContent className="py-5 px-4 space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D6FF2A] flex items-center justify-center gap-1">
              <Clock size={14} /> Tiempo de Descanso
            </span>
            <p className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight">
              {Math.floor(restRemaining / 60)}:{String(restRemaining % 60).padStart(2, "0")}
            </p>
            <p className="text-xs text-zinc-400">
              Próxima: Serie {currentSetIdx + 1} • {currentExercise?.exercise.name}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-10 text-xs font-bold bg-zinc-900/90 border-zinc-700"
                onClick={() => setRestRemaining(r => r + 30)}
              >
                +30s
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 text-xs font-bold bg-zinc-900/90 border-zinc-700"
                onClick={() => setIsTimerPaused(!isTimerPaused)}
              >
                {isTimerPaused ? <Play size={14} className="mr-1" /> : <Pause size={14} className="mr-1" />}
                {isTimerPaused ? "Reanudar" : "Pausar"}
              </Button>
              <Button
                variant="accent"
                size="sm"
                className="h-10 text-xs font-bold text-black"
                onClick={() => setIsResting(false)}
              >
                Continuar ya →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Exercise Card */}
      {currentExercise && (
        <Card className="border-zinc-800 bg-zinc-900/90 overflow-hidden">
          {/* Header image / Banner */}
          {currentExercise.exercise.image && (
            <div className="h-40 sm:h-48 w-full bg-zinc-950 relative overflow-hidden">
              <ExerciseImage src={currentExercise.exercise.image} alt={currentExercise.exercise.name} muscleGroup={currentExercise.exercise.muscleGroup} name={currentExercise.exercise.name} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                <div>
                  <Badge variant="muted" className="text-[10px] mb-1">
                    {currentExercise.exercise.muscleGroup}
                  </Badge>
                  <h2 className="text-xl font-bold text-white tracking-tight">{currentExercise.exercise.name}</h2>
                </div>
              </div>
            </div>
          )}

          {!currentExercise.exercise.image && (
            <div className="p-4 border-b border-zinc-800">
              <Badge variant="muted" className="text-[10px] mb-1">
                {currentExercise.exercise.muscleGroup}
              </Badge>
              <h2 className="text-xl font-bold text-white">{currentExercise.exercise.name}</h2>
            </div>
          )}

          <CardContent className="p-4 space-y-4">
            {/* Target specs bar */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Series</span>
                <span className="font-bold text-white text-sm">{currentExercise.sets}</span>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Reps</span>
                <span className="font-bold text-white text-sm">{currentExercise.reps}</span>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">RIR</span>
                <span className="font-bold text-white text-sm">
                  {currentExercise.rir !== null ? currentExercise.rir : "—"}
                </span>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Descanso</span>
                <span className="font-bold text-white text-sm">{currentExercise.restSec}s</span>
              </div>
            </div>

            {/* Notes / Instructions from Coach */}
            {(currentExercise.notes || currentExercise.tempo || currentExercise.load) && (
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs space-y-1">
                {currentExercise.load && (
                  <p className="text-zinc-300">
                    <span className="font-bold text-[#D6FF2A]">Carga sugerida:</span> {currentExercise.load}
                  </p>
                )}
                {currentExercise.tempo && (
                  <p className="text-zinc-300">
                    <span className="font-bold text-zinc-400">Tempo:</span> {currentExercise.tempo}
                  </p>
                )}
                {currentExercise.notes && (
                  <p className="text-zinc-400 italic">💡 {currentExercise.notes}</p>
                )}
              </div>
            )}

            {/* Set tracking & Inputs */}
            <div className="border border-zinc-800 rounded-2xl p-4 bg-zinc-950 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white">Serie {currentSetIdx + 1}</span>
                  <span className="text-xs text-zinc-500">de {currentExercise.sets}</span>
                </div>
                {/* Visual set circles */}
                <div className="flex gap-1.5">
                  {Array.from({ length: currentExercise.sets }).map((_, i) => {
                    const isDone = loggedSets[`${currentExIdx}-${i}`] !== undefined;
                    const isCurrent = i === currentSetIdx;
                    return (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition ${
                          isDone
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                            : isCurrent
                            ? "bg-[#D6FF2A] ring-2 ring-[#D6FF2A]/40"
                            : "bg-zinc-800"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Large touch inputs for Gym use */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block text-center">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="0"
                    className="w-full h-14 bg-zinc-900 border-2 border-zinc-800 focus:border-[#D6FF2A] rounded-xl text-center font-black text-2xl text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block text-center">
                    Reps
                  </label>
                  <input
                    type="number"
                    value={reps}
                    onChange={e => setReps(e.target.value)}
                    placeholder="8"
                    className="w-full h-14 bg-zinc-900 border-2 border-zinc-800 focus:border-[#D6FF2A] rounded-xl text-center font-black text-2xl text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block text-center">
                    RIR
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={rir}
                    onChange={e => setRir(e.target.value)}
                    placeholder="2"
                    className="w-full h-14 bg-zinc-900 border-2 border-zinc-800 focus:border-[#D6FF2A] rounded-xl text-center font-black text-2xl text-white outline-none"
                  />
                </div>
              </div>

              {/* Big Action Button */}
              <Button
                variant="accent"
                onClick={handleSaveSet}
                className="w-full h-14 text-base font-black tracking-wide"
              >
                COMPLETAR SERIE ✓
              </Button>
            </div>

            <FormCheck />
            <VoiceCoach exerciseName={currentExercise.exercise.name} nextExercise={workout.exercises[currentExIdx+1]?.exercise.name} />
            {/* Navigation & Complete Exercise */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-11 text-xs"
                onClick={() => {
                  if (currentSetIdx > 0) setCurrentSetIdx(s => s - 1);
                  else if (currentExIdx > 0) {
                    setCurrentExIdx(e => e - 1);
                    setCurrentSetIdx(0);
                  }
                }}
                disabled={currentExIdx === 0 && currentSetIdx === 0}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-11 text-xs border-zinc-700"
                onClick={handleCompleteExercise}
              >
                Completar Ejercicio →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Exercises Carousel / Shortcut Bar */}
      <div className="space-y-1.5 pt-2">
        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-1">
          Ejercicios de la sesión:
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {workout.exercises.map((exItem, idx) => {
            const isSelected = idx === currentExIdx;
            const isExDone = Array.from({ length: exItem.sets }).every(
              (_, s) => loggedSets[`${idx}-${s}`] !== undefined
            );
            return (
              <button
                key={exItem.id}
                onClick={() => {
                  setCurrentExIdx(idx);
                  setCurrentSetIdx(0);
                }}
                className={`shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-white text-black border-white shadow-md font-bold"
                    : isExDone
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {isExDone && <Check size={13} className="stroke-[3]" />}
                <span>{exItem.exercise.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
