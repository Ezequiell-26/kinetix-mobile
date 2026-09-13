"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ThumbsUp, ThumbsDown, RefreshCw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostWorkoutCoachProps {
  workoutId?: string;
  workoutName?: string;
  className?: string;
}

interface Feedback {
  rating: "good" | "bad" | null;
  notes: string;
}

export function PostWorkoutCoach({ workoutId, workoutName, className }: PostWorkoutCoachProps) {
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({ rating: null, notes: "" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRating = (rating: "good" | "bad") => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    // Simular análisis IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className={cn("bg-gradient-to-br from-[#D6FF2A]/10 to-transparent border-[#D6FF2A]/20", className)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-[#D6FF2A]/20">
              <CheckCircle className="w-5 h-5 text-[#D6FF2A]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">¡Análisis completado!</h3>
              <p className="text-xs text-white/60">Tu feedback ha sido registrado</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-white/70">
            <p>
              Basado en tu rendimiento, te recomendamos:
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>Mantener la frecuencia actual de entrenamiento</li>
              <li>Incrementar ligeramente la carga en la próxima sesión</li>
              <li>Enfocarse en recuperación activa mañana</li>
            </ul>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSubmitted(false)}
            className="mt-4 border-white/20 text-white/70 hover:text-white hover:bg-white/5"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Nuevo análisis
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-surface/40 border-white/10", className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-full bg-[#D6FF2A]/20">
            <Sparkles className="w-5 h-5 text-[#D6FF2A]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">Coach Post-Entreno</h3>
            <p className="text-xs text-white/60">
              {workoutName ? `Análisis de ${workoutName}` : "¿Cómo te fue en tu entrenamiento?"}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <p className="text-xs text-white/70 mb-2">Calificá tu sesión:</p>
          <div className="flex gap-2">
            <Button
              variant={feedback.rating === "good" ? "default" : "outline"}
              size="sm"
              onClick={() => handleRating("good")}
              className={cn(
                "flex-1",
                feedback.rating === "good"
                  ? "bg-[#D6FF2A] text-black hover:bg-[#D6FF2A]/90"
                  : "border-white/20 text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Excelente
            </Button>
            <Button
              variant={feedback.rating === "bad" ? "default" : "outline"}
              size="sm"
              onClick={() => handleRating("bad")}
              className={cn(
                "flex-1",
                feedback.rating === "bad"
                  ? "bg-red-500 text-white hover:bg-red-500/90"
                  : "border-white/20 text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Regular
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="text-xs text-white/70 block mb-2">
            Comentarios adicionales (opcional)
          </label>
          <textarea
            value={feedback.notes}
            onChange={(e) => setFeedback(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="¿Algo que quieras destacar? ¿Dolor, fatiga, PRs...?"
            className="w-full min-h-[80px] px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D6FF2A]/50 resize-none"
          />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!feedback.rating || isAnalyzing}
          className="w-full bg-[#D6FF2A] text-black hover:bg-[#D6FF2A]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Obtener recomendaciones
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
