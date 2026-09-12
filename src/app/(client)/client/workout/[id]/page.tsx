/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VelocityTracker } from "@/components/velocity-tracker";
import { FormCheck } from "@/components/form-check";
import { VoiceCoach } from "@/components/voice-coach";
import { RepCounter } from "@/components/rep-counter";
import { voiceEngine } from "@/lib/voice-engine/engine";
import { ExerciseImage } from "@/components/exercise-image";
import { GymMode } from "@/components/gym-mode";
import { Celebration } from "@/components/celebration";
import { Lightbulb, 
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
  Check,
  Gauge
} from "lucide-react";
import { CollapsibleSection } from "@/components/ui/accordion";

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
    video?: string | null;
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

type ExerciseHistoryEntry = { weight: number; reps: number; date: string };

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

  // Track completed sets (+ ref espejo para el guard anti-doble-tap)
  const [loggedSets, setLoggedSets] = useState<Record<string, CompletedSetRecord>>({});
  const loggedKeysRef = useRef<Set<string>>(new Set());

  // Rest Timer State
  const [restRemaining, setRestRemaining] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Session timing + borrador anti-refresh (se pierde la página, no la sesión)
  const [startTime] = useState<number>(Date.now());
  const draftStartRef = useRef<number>(0);
  const [draftRestored, setDraftRestored] = useState(false);
  const draftKey = `ec:draft:${workoutId}`;
  function persistDraft(next: Record<string, CompletedSetRecord>, exIdx: number, setIdx: number) {
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        sets: next, exIdx, setIdx,
        start: draftStartRef.current || startTime,
        savedAt: Date.now(),
      }));
    } catch {}
  }
  function clearDraft() {
    loggedKeysRef.current.clear();
    try {
      localStorage.removeItem(draftKey);
    } catch {}
  }
  const [finished, setFinished] = useState<boolean>(false);
  const [gymMode, setGymMode] = useState<boolean>(false);
  const [finalComment, setFinalComment] = useState<string>("");
  const [savingLog, setSavingLog] = useState<boolean>(false);
  const [savedOffline, setSavedOffline] = useState<boolean>(false);
  // Historial real por ejercicio (último peso x reps logrado, sea cual sea
  // el entrenamiento en el que se hizo) — estilo "progresión automática" de
  // apps de gym reconocidas: nunca hay que adivinar con qué peso arrancar.
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, ExerciseHistoryEntry>>({});

  // Narrador 3-2-1-¡vamos! sobre el final del descanso (el audio dura ~6s).
  // Disparo único por descanso: al cruzar los 6s o al arrancar un descanso corto.
  const restCueRef = useRef({ resting: false, value: 0 });
  useEffect(() => {
    const prev = restCueRef.current;
    if (isResting && !isTimerPaused && restRemaining > 0) {
      if ((!prev.resting && restRemaining <= 6) || (prev.value > 6 && restRemaining <= 6)) {
        voiceEngine.emit("REST_COMPLETED");
      }
      // Avisos "quedan X segundos" según verbosidad (una vez por marca).
      const v = voiceEngine.settings.restVerbosity;
      const marks = v === "full" ? [60, 30, 10] : v === "standard" ? [30, 10] : [];
      if (marks.includes(restRemaining)) {
        voiceEngine.emit("REST_WARNING", { remaining: restRemaining });
      }
    }
    restCueRef.current = { resting: isResting, value: restRemaining };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResting, restRemaining, isTimerPaused]);

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
        // Restaura el borrador si la página se recargó a mitad de sesión (<12h).
        try {
          const raw = localStorage.getItem(`ec:draft:${workoutId}`);
          if (raw) {
            const d = JSON.parse(raw) as {
              sets: Record<string, CompletedSetRecord>;
              exIdx: number; setIdx: number; start: number; savedAt: number;
            };
            const count = Object.keys(d.sets || {}).length;
            if (count > 0 && Date.now() - d.savedAt < 12 * 3600 * 1000) {
              setLoggedSets(d.sets);
              loggedKeysRef.current = new Set(Object.keys(d.sets));
              setCurrentExIdx(Math.min(d.exIdx, (data.exercises?.length || 1) - 1));
              setCurrentSetIdx(d.setIdx);
              draftStartRef.current = d.start;
              setDraftRestored(true);
            } else {
              localStorage.removeItem(`ec:draft:${workoutId}`);
            }
          }
        } catch {}
        if (data.exercises?.[0]) {
          const firstEx = data.exercises[0];
          setReps(firstEx.reps?.split("-")?.[0] || "8");
          setRir(firstEx.rir !== null ? String(firstEx.rir) : "2");
        }

        // Trae el historial reciente y arma un mapa exerciseName -> último peso/reps.
        // Silencioso: si falla, simplemente no hay precarga (no bloquea el entreno).
        fetch("/api/workout-logs")
          .then(r => (r.ok ? r.json() : []))
          .then((logs: { date: string; sets: { exerciseName: string; weight: number | null; reps: number | null }[] }[]) => {
            const history: Record<string, ExerciseHistoryEntry> = {};
            for (const log of logs) {
              for (const st of log.sets || []) {
                if (!st.exerciseName || st.weight === null || st.weight === undefined) continue;
                if (!history[st.exerciseName]) {
                  history[st.exerciseName] = { weight: st.weight, reps: st.reps || 0, date: log.date };
                }
              }
            }
            setExerciseHistory(history);
          })
          .catch(() => {});
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al cargar");
      } finally {
        setLoading(false);
      }
    }
    loadWorkout();
  }, [workoutId]);

  // Rest timer con deadline (no deriva si la pestaña/pantalla se suspende:
  // los intervalos se estrangulan en background, el deadline no).
  const deadlineRef = useRef(0);
  useEffect(() => {
    if (!isResting || isTimerPaused) return;
    if (deadlineRef.current === 0) {
      deadlineRef.current = Date.now() + restRemaining * 1000;
    }
    if (restRemaining <= 0) {
      deadlineRef.current = 0;
      setIsResting(false);
      playBeep();
      try { navigator.vibrate?.([80, 50, 80]); } catch {}
      return;
    }
    const timer = setInterval(() => {
      const left = Math.ceil((deadlineRef.current - Date.now()) / 1000);
      if (left <= 0) {
        deadlineRef.current = 0;
        setRestRemaining(0);
        setIsResting(false);
        playBeep();
        try { navigator.vibrate?.([80, 50, 80]); } catch {}
        return;
      }
      setRestRemaining((prev) => (prev === left ? prev : left));
    }, 250);
    return () => clearInterval(timer);
  }, [isResting, isTimerPaused, restRemaining]);

  // Al pausar se congela el restante real; al reanudar el deadline se recalcula.
  useEffect(() => {
    if (isTimerPaused && isResting && deadlineRef.current !== 0) {
      setRestRemaining(Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000)));
      deadlineRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerPaused]);

  const currentExercise = workout?.exercises?.[currentExIdx];
  const totalTargetSets = workout?.exercises?.reduce((acc, e) => acc + e.sets, 0) || 1;
  const totalCompletedSets = Object.keys(loggedSets).length;
  const progressPercent = Math.min(100, Math.round((totalCompletedSets / totalTargetSets) * 100));

  // Sync inputs when changing exercise — si hay historial real de ese
  // ejercicio, precarga el último peso usado (progresión automática); si no,
  // cae al rango objetivo que dejó el entrenador.
  useEffect(() => {
    if (currentExercise) {
      const hist = exerciseHistory[currentExercise.exercise.name];
      setReps(hist ? String(hist.reps || currentExercise.reps?.split("-")?.[0] || "8") : (currentExercise.reps?.split("-")?.[0] || "8"));
      setWeight(hist ? String(hist.weight) : "");
      setRir(currentExercise.rir !== null && currentExercise.rir !== undefined ? String(currentExercise.rir) : "2");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExIdx, currentExercise, exerciseHistory]);

  // Aviso de voz al cambiar de ejercicio (salta el montaje inicial).
  const firstExRef = useRef(true);
  useEffect(() => {
    if (firstExRef.current) {
      firstExRef.current = false;
      return;
    }
    if (currentExercise) {
      voiceEngine.emit("EXERCISE_STARTED", { name: currentExercise.exercise.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExIdx]);

  // Aviso de voz al completar el entreno.
  useEffect(() => {
    if (finished) {
      voiceEngine.emit("WORKOUT_COMPLETED");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

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
    const nextSets = { ...loggedSets, [key]: record };

    // Haptic feedback
    try { navigator.vibrate?.(40); } catch {}

    // Anti-doble-tap: la misma serie dos veces seguidas actualiza el registro
    // SIN avanzar (el state llega tarde al segundo tap; el ref no).
    const isRepeat = loggedKeysRef.current.has(key);
    loggedKeysRef.current.add(key);
    if (isRepeat) {
      persistDraft(nextSets, currentExIdx, currentSetIdx);
      return;
    }

    // Voice Engine: arranque en la primera serie, hitos, serie completada + motivación.
    voiceEngine.unlock();
    const newCount = totalCompletedSets + 1;
    if (totalCompletedSets === 0) {
      voiceEngine.emit("WORKOUT_STARTED");
    } else if (totalTargetSets >= 4 && newCount === Math.floor(totalTargetSets / 2)) {
      voiceEngine.emit("REP_MILESTONE", { key: "mitad", text: "Vas por la mitad." });
    } else if (newCount === totalTargetSets - 1) {
      voiceEngine.emit("REP_MILESTONE", { key: "ultimo", text: "Último esfuerzo." });
    }
    voiceEngine.emit("SET_COMPLETED");
    voiceEngine.motivate(`${workoutId}-ex${currentExIdx}-set${currentSetIdx}`);

    // Check next set or next exercise
    if (currentSetIdx < currentExercise.sets - 1) {
      setCurrentSetIdx(prev => prev + 1);
      persistDraft(nextSets, currentExIdx, currentSetIdx + 1);
      const rest = currentExercise.restSec || 90;
      setRestRemaining(rest);
      voiceEngine.emit("REST_STARTED", { rest });
      setIsResting(true);
      setIsTimerPaused(false);
    } else if (currentExIdx < (workout?.exercises?.length || 0) - 1) {
      setCurrentExIdx(prev => prev + 1);
      setCurrentSetIdx(0);
      persistDraft(nextSets, currentExIdx + 1, 0);
      setRestRemaining(90);
      voiceEngine.emit("REST_STARTED", { rest: 90 });
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
      voiceEngine.emit("EXERCISE_COMPLETED");
      setCurrentExIdx(prev => prev + 1);
      setCurrentSetIdx(0);
      setRestRemaining(60);
      voiceEngine.emit("REST_STARTED", { rest: 60 });
      setIsResting(true);
      setIsTimerPaused(false);
    } else {
      voiceEngine.emit("EXERCISE_COMPLETED");
      setFinished(true);
    }
  }

  // Final submission of workout session to DB (con cola offline real)
  async function handleFinishWorkout(){
    if (!workout) return;
    setSavingLog(true);

    const durationMin = Math.max(1, Math.round((Date.now() - (draftStartRef.current || startTime)) / (1000 * 60)));
    const setsPayload = Object.values(loggedSets);
    const payload = {
      workoutId: workout.id,
      durationMin,
      comment: finalComment || `Sesión completada (${totalCompletedSets} series)`,
      completed: true,
      sets: setsPayload,
    };

    const queueOffline = () => {
      try {
        localStorage.setItem(`ec:offline:${Date.now()}`, JSON.stringify(payload));
      } catch {}
      setSavedOffline(true);
    };

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch("/api/workout-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        clearDraft();
        router.push("/client/dashboard");
      } else {
        queueOffline();
      }
    } catch {
      clearTimeout(timeout);
      queueOffline();
    } finally {
      setSavingLog(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - (draftStartRef.current || startTime)) / (1000 * 60)));
    const totalVolume = Object.values(loggedSets).reduce((acc, s) => acc + (s.weight * s.reps), 0);
    const exercisesDoneCount = new Set(Object.values(loggedSets).map(s => s.exerciseName)).size;

    return (
      <div className="space-y-5 py-4 max-w-md mx-auto">
        {/* Recompensa inmediata: refuerzo positivo tras el esfuerzo */}
        <Celebration show={finished} />
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto">
            <span className="ring-burst absolute inset-0 rounded-full border-2 border-primary" aria-hidden="true" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-black shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_10px_36px_rgba(52,211,153,0.45)]">
              <Check size={36} strokeWidth={3} />
            </div>
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
              <p className="text-xl font-black text-primary mt-0.5">{totalVolume.toLocaleString("es-AR")} kg</p>
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
          {savingLog ? "Guardando..." : "GUARDAR Y VOLVER AL INICIO"}
        </Button>
        {savedOffline && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center space-y-2">
            <p className="text-sm font-bold text-amber-300">Guardado offline ✓</p>
            <p className="text-xs text-zinc-400">Sin conexión ahora. Tu sesión se sincroniza sola al volver internet.</p>
            <Button variant="outline" size="sm" className="w-full min-h-[48px]" onClick={() => router.push("/client/dashboard")}>
              Volver al inicio →
            </Button>
          </div>
        )}
      </div>
    );
  }

  if(gymMode && workout){
    return (
      <GymMode
        exercises={workout.exercises.map(e=>({id:e.id, name:e.exercise.name, sets:e.sets, reps:e.reps, restSec:e.restSec, image:e.exercise.image, video:e.exercise.video, instructions:e.exercise.instructions || e.notes, muscleGroup:e.exercise.muscleGroup}))}
        onExit={()=>setGymMode(false)}
        onFinish={()=>{ setGymMode(false); setFinished(true); }}
      />
    );
  }

  return (
    <div className="space-y-4 pb-12 select-none">
      {draftRestored && (
        <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/[0.07] px-4 py-3">
          <CheckCircle size={16} className="text-primary shrink-0" />
          <p className="text-xs text-zinc-300 flex-1">Sesión recuperada donde la dejaste.</p>
          <button onClick={() => setDraftRestored(false)} aria-label="Ocultar aviso" className="text-zinc-500 hover:text-white text-sm leading-none px-2 min-h-[32px]">×</button>
        </div>
      )}
      {/* Top Session Progress Bar */}
      <div className="space-y-2 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
        <div className="flex items-center justify-between text-xs">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-zinc-400 hover:text-white p-1 -ml-1">
            <ArrowLeft size={16} /> Salir
          </button>
          <p className="font-bold text-white truncate max-w-[200px]">{workout.name}</p>
          <div className="flex items-center gap-2"><Badge variant="accent" className="font-bold">
            {currentExIdx + 1} / {workout.exercises.length}
          </Badge><button onClick={()=>setGymMode(true)} className="text-[11px] font-black bg-primary text-black px-3.5 min-h-[44px] rounded-full">GYM MODE</button></div>
        </div>
        <Progress value={progressPercent} className="h-2 bg-zinc-800" />
        <div className="flex justify-between text-[11px] text-zinc-400">
          <span>Serie {totalCompletedSets + 1} de {totalTargetSets}</span>
          <span className="font-bold text-primary">{progressPercent}% realizado</span>
        </div>
      </div>

      {/* Rest Timer Modal / Overlay Banner */}
      {isResting && (
        <Card className="border-primary/40 bg-primary/[0.08] text-center shadow-2xl animate-in fade-in">
          <CardContent className="py-5 px-4 space-y-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1">
              <Clock size={14} /> Tiempo de Descanso
            </span>
            <p className={`text-5xl sm:text-6xl font-black font-mono text-white tracking-tight tabular-nums ${restRemaining <= 10 && restRemaining > 0 ? "urgent text-primary" : ""}`}>
              {Math.floor(restRemaining / 60)}:{String(restRemaining % 60).padStart(2, "0")}
            </p>
            <p className="text-xs text-zinc-400">
              Próxima: Serie {currentSetIdx + 1} • {currentExercise?.exercise.name}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-12 px-5 text-[13px] font-bold bg-zinc-900/90 border-zinc-700"
                onClick={() => {
                  if (deadlineRef.current > 0) {
                    deadlineRef.current += 30 * 1000;
                  } else {
                    deadlineRef.current = Date.now() + (restRemaining + 30) * 1000;
                  }
                  setRestRemaining(r => r + 30);
                }}
              >
                +30s
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-12 px-5 text-[13px] font-bold bg-zinc-900/90 border-zinc-700"
                onClick={() => {
                  const next = !isTimerPaused;
                  setIsTimerPaused(next);
                  voiceEngine.emit(next ? "WORKOUT_PAUSED" : "WORKOUT_RESUMED");
                }}
              >
                {isTimerPaused ? <Play size={14} className="mr-1" /> : <Pause size={14} className="mr-1" />}
                {isTimerPaused ? "Reanudar" : "Pausar"}
              </Button>
              <Button
                variant="accent"
                size="sm"
                className="h-12 px-5 text-[13px] font-bold text-black"
                onClick={() => {
                  deadlineRef.current = 0;
                  setIsResting(false);
                }}
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
            <div className="h-32 sm:h-48 w-full bg-zinc-950 relative overflow-hidden">
              <ExerciseImage src={currentExercise.exercise.image} videoSrc={currentExercise.exercise.video} alt={currentExercise.exercise.name} muscleGroup={currentExercise.exercise.muscleGroup} name={currentExercise.exercise.name} className="w-full h-full object-cover opacity-80" priority />
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
                    <span className="font-bold text-primary">Carga sugerida:</span> {currentExercise.load}
                  </p>
                )}
                {currentExercise.tempo && (
                  <p className="text-zinc-300">
                    <span className="font-bold text-zinc-400">Tempo:</span> {currentExercise.tempo}
                  </p>
                )}
                {currentExercise.notes && (
                  <p className="text-zinc-400 italic"><Lightbulb size={12} className="inline mr-1 -mt-0.5 text-violet-300" />{currentExercise.notes}</p>
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
                            ? "bg-primary ring-2 ring-primary/40"
                            : "bg-zinc-800"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Large touch inputs for Gym use — con steppers +/- estilo Symmetry:
                  registrar una serie no debería requerir abrir el teclado del celular. */}
              {exerciseHistory[currentExercise.exercise.name] && (
                <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 -mb-1">
                  <Flame size={12} className="text-primary" />
                  Última vez: <span className="text-zinc-300 font-bold">{exerciseHistory[currentExercise.exercise.name].weight}kg × {exerciseHistory[currentExercise.exercise.name].reps}</span> — precargado, ajustá si hace falta
                </p>
              )}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label htmlFor="set-weight" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block text-center">
                    Peso (kg)
                  </label>
                  <div className="flex items-stretch gap-1">
                    <button type="button" aria-label="Restar 2.5 kg" onClick={() => setWeight(w => String(Math.max(0, Math.round(((parseFloat(w) || 0) - 2.5) * 10) / 10)))} className="w-8 shrink-0 rounded-xl bg-zinc-900 border-2 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-90 transition flex items-center justify-center font-black text-lg">−</button>
                    <input
                      id="set-weight"
                      inputMode="decimal"
                      type="number"
                      step="0.5"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="0"
                      className="w-full h-14 bg-zinc-900 border-2 border-zinc-800 focus:border-primary rounded-xl text-center font-black text-2xl text-white outline-none min-w-0"
                    />
                    <button type="button" aria-label="Sumar 2.5 kg" onClick={() => setWeight(w => String(Math.round(((parseFloat(w) || 0) + 2.5) * 10) / 10))} className="w-8 shrink-0 rounded-xl bg-zinc-900 border-2 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-90 transition flex items-center justify-center font-black text-lg">+</button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="set-reps" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block text-center">
                    Reps
                  </label>
                  <div className="flex items-stretch gap-1">
                    <button type="button" aria-label="Restar una repetición" onClick={() => setReps(r => String(Math.max(0, (parseInt(r) || 0) - 1)))} className="w-8 shrink-0 rounded-xl bg-zinc-900 border-2 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-90 transition flex items-center justify-center font-black text-lg">−</button>
                    <input
                      id="set-reps"
                      inputMode="numeric"
                      type="number"
                      value={reps}
                      onChange={e => setReps(e.target.value)}
                      placeholder="8"
                      className="w-full h-14 bg-zinc-900 border-2 border-zinc-800 focus:border-primary rounded-xl text-center font-black text-2xl text-white outline-none min-w-0"
                    />
                    <button type="button" aria-label="Sumar una repetición" onClick={() => setReps(r => String((parseInt(r) || 0) + 1))} className="w-8 shrink-0 rounded-xl bg-zinc-900 border-2 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-90 transition flex items-center justify-center font-black text-lg">+</button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="set-rir" className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block text-center">
                    RIR
                  </label>
                  <div className="flex items-stretch gap-1">
                    <button type="button" aria-label="Restar RIR" onClick={() => setRir(r => String(Math.max(0, (parseInt(r) || 0) - 1)))} className="w-8 shrink-0 rounded-xl bg-zinc-900 border-2 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-90 transition flex items-center justify-center font-black text-lg">−</button>
                    <input
                      id="set-rir"
                      inputMode="numeric"
                      type="number"
                      min={0}
                      max={10}
                      value={rir}
                      onChange={e => setRir(e.target.value)}
                      placeholder="2"
                      className="w-full h-14 bg-zinc-900 border-2 border-zinc-800 focus:border-primary rounded-xl text-center font-black text-2xl text-white outline-none min-w-0"
                    />
                    <button type="button" aria-label="Sumar RIR" onClick={() => setRir(r => String(Math.min(10, (parseInt(r) || 0) + 1)))} className="w-8 shrink-0 rounded-xl bg-zinc-900 border-2 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-90 transition flex items-center justify-center font-black text-lg">+</button>
                  </div>
                </div>
              </div>

              {/* Contador en vivo ANTES de completar: primero contás, después cerrás */}
              <RepCounter
                key={`${currentExIdx}-${currentSetIdx}`}
                targetReps={parseInt(currentExercise.reps?.split("-")?.[0] || "8", 10) || 8}
                setKey={`Serie ${currentSetIdx + 1}`}
                onFirstTap={() =>
                  voiceEngine.emit("SET_STARTED", {
                    set: currentSetIdx + 1,
                    totalSets: currentExercise.sets,
                    reps: parseInt(currentExercise.reps?.split("-")?.[0] || "8", 10) || 8,
                    weight: parseFloat(weight) || 0,
                  })
                }
              />

              {/* Big Action Button — pegado abajo en móvil (zona pulgar) */}
              <div className="cta-sticky">
                <Button
                  variant="accent"
                  onClick={handleSaveSet}
                  className="w-full h-14 text-base font-black tracking-wide shadow-[0_8px_32px_rgba(52,211,153,0.35)]"
                >
                  COMPLETAR SERIE
                </Button>
              </div>
            </div>

            {/* Análisis avanzado plegado: en plena serie solo importa serie/reps/peso */}
            <CollapsibleSection
              title="Análisis avanzado"
              subtitle="Velocidad y técnica (opcional)"
              icon={<Gauge size={18} />}
            >
              <VelocityTracker />
              <FormCheck />
            </CollapsibleSection>
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
