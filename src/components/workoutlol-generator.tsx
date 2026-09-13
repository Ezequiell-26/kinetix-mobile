"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles, Shuffle, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkoutLolGeneratorProps {
  className?: string;
}

interface GeneratedWorkout {
  name: string;
  duration: string;
  difficulty: "Principiante" | "Intermedio" | "Avanzado";
  focus: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest: string;
  }>;
}

const workoutTemplates: Omit<GeneratedWorkout, "exercises">[] = [
  {
    name: "Full Body Explosivo",
    duration: "45 min",
    difficulty: "Intermedio",
    focus: "Fuerza completa",
  },
  {
    name: "HIIT Metabólico",
    duration: "30 min",
    difficulty: "Avanzado",
    focus: "Quema de grasa",
  },
  {
    name: "Hipertrofia Superior",
    duration: "50 min",
    difficulty: "Intermedio",
    focus: "Tren superior",
  },
  {
    name: "Piernas de Acero",
    duration: "55 min",
    difficulty: "Avanzado",
    focus: "Tren inferior",
  },
  {
    name: "Core & Estabilidad",
    duration: "25 min",
    difficulty: "Principiante",
    focus: "Core",
  },
];

const exercisePool = [
  { name: "Sentadillas", sets: 4, reps: "12-15", rest: "60s" },
  { name: "Flexiones", sets: 4, reps: "10-12", rest: "60s" },
  { name: "Peso Muerto", sets: 4, reps: "8-10", rest: "90s" },
  { name: "Press de Banca", sets: 4, reps: "10-12", rest: "75s" },
  { name: "Dominadas", sets: 3, reps: "8-10", rest: "90s" },
  { name: "Zancadas", sets: 3, reps: "12 c/u", rest: "60s" },
  { name: "Remo con Barra", sets: 4, reps: "10-12", rest: "75s" },
  { name: "Press Militar", sets: 3, reps: "10-12", rest: "60s" },
  { name: "Plancha", sets: 3, reps: "45s", rest: "45s" },
  { name: "Burpees", sets: 3, reps: "15", rest: "60s" },
  { name: "Mountain Climbers", sets: 3, reps: "30s", rest: "45s" },
  { name: "Curl de Bíceps", sets: 3, reps: "12-15", rest: "45s" },
  { name: "Extensiones de Tríceps", sets: 3, reps: "12-15", rest: "45s" },
  { name: "Elevaciones Laterales", sets: 3, reps: "15", rest: "45s" },
  { name: "Russian Twists", sets: 3, reps: "20", rest: "45s" },
];

export function WorkoutLolGenerator({ className }: WorkoutLolGeneratorProps) {
  const [generated, setGenerated] = useState<GeneratedWorkout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWorkout = () => {
    setIsGenerating(true);
    
    // Simular generación IA
    setTimeout(() => {
      const template = workoutTemplates[Math.floor(Math.random() * workoutTemplates.length)];
      
      // Seleccionar 5-7 ejercicios aleatorios
      const shuffled = [...exercisePool].sort(() => Math.random() - 0.5);
      const selectedExercises = shuffled.slice(0, 5 + Math.floor(Math.random() * 3));
      
      setGenerated({
        ...template,
        exercises: selectedExercises,
      });
      
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <Card className={cn("bg-surface/40 border-white/10", className)}>
      <CardContent className="p-6">
        {!generated ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-[#D6FF2A]/20 mb-3">
                <Dumbbell className="w-6 h-6 text-[#D6FF2A]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Generador de Rutinas
              </h3>
              <p className="text-sm text-white/60">
                Creá una rutina personalizada al instante usando IA
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <Target className="w-5 h-5 text-[#D6FF2A] mx-auto mb-1" />
                <p className="text-xs text-white/60">Enfoque</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <Clock className="w-5 h-5 text-[#D6FF2A] mx-auto mb-1" />
                <p className="text-xs text-white/60">Duración</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <Sparkles className="w-5 h-5 text-[#D6FF2A] mx-auto mb-1" />
                <p className="text-xs text-white/60">IA Power</p>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateWorkout}
              disabled={isGenerating}
              className="w-full bg-[#D6FF2A] text-black hover:bg-[#D6FF2A]/90 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Generando...
                </>
              ) : (
                <>
                  <Shuffle className="w-4 h-4 mr-2" />
                  Generar Rutina
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Generated Workout */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-white">{generated.name}</h3>
                  <p className="text-xs text-white/60">{generated.focus}</p>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  generated.difficulty === "Principiante" && "bg-green-500/20 text-green-400",
                  generated.difficulty === "Intermedio" && "bg-yellow-500/20 text-yellow-400",
                  generated.difficulty === "Avanzado" && "bg-red-500/20 text-red-400"
                )}>
                  {generated.difficulty}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-white/60 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {generated.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {generated.exercises.length} ejercicios
                </div>
              </div>

              {/* Exercises List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {generated.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D6FF2A]/20 text-[#D6FF2A] text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-white">{exercise.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/70">{exercise.sets} × {exercise.reps}</p>
                      <p className="text-xs text-white/40">desc: {exercise.rest}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setGenerated(null)}
                className="flex-1 border-white/20 text-white/70 hover:text-white hover:bg-white/5"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Otra vez
              </Button>
              <Button className="flex-1 bg-[#D6FF2A] text-black hover:bg-[#D6FF2A]/90">
                <Target className="w-4 h-4 mr-2" />
                Usar esta
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
