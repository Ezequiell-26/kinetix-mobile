'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Dumbbell, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface OneRMCalculatorProps {
  onComplete?: (oneRM: number) => void;
}

// Fórmulas comunes para calcular 1RM
const formulas = {
  epley: (weight: number, reps: number) => weight * (1 + reps / 30),
  brzycki: (weight: number, reps: number) => weight * (36 / (37 - reps)),
  lander: (weight: number, reps: number) => weight * (100 / (101.3 - 2.67123 * reps)),
  lombardi: (weight: number, reps: number) => weight * Math.pow(reps, 0.10),
  mayhew: (weight: number, reps: number) => weight * (100 / (52.2 + 41.9 * Math.exp(-0.055 * reps))),
  oconner: (weight: number, reps: number) => weight * (1 + 0.025 * reps),
  wathan: (weight: number, reps: number) => weight * (100 / (48.8 + 53.8 * Math.exp(-0.075 * reps))),
};

export function OneRMCalculator({ onComplete }: OneRMCalculatorProps) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [exercise, setExercise] = useState('');
  const [selectedFormula, setSelectedFormula] = useState<string>('all');
  const [results, setResults] = useState<{ formula: string; value: number }[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const calculateOneRM = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);

    if (!w || !r || w <= 0 || r <= 0 || r > 15) {
      return;
    }

    if (selectedFormula === 'all') {
      const allResults = Object.entries(formulas).map(([name, formula]) => ({
        formula: name.charAt(0).toUpperCase() + name.slice(1),
        value: parseFloat(formula(w, r).toFixed(2)),
      }));

      // Ordenar por valor y calcular promedio
      const avg = allResults.reduce((sum, r) => sum + r.value, 0) / allResults.length;
      allResults.push({ formula: 'Promedio', value: parseFloat(avg.toFixed(2)) });

      setResults(allResults);
    } else {
      const formula = formulas[selectedFormula as keyof typeof formulas];
      const value = parseFloat(formula(w, r).toFixed(2));
      setResults([{ formula: selectedFormula.charAt(0).toUpperCase() + selectedFormula.slice(1), value }]);
    }

    if (onComplete && results.length > 0) {
      const avg = results.reduce((sum, r) => sum + r.value, 0) / results.length;
      onComplete(avg);
    }
  };

  const getPercentages = (oneRM: number) => {
    const percentages = [
      { percent: 100, reps: '1', label: 'Máximo' },
      { percent: 95, reps: '2-3', label: 'Fuerza' },
      { percent: 90, reps: '3-5', label: 'Fuerza/Hipertrofia' },
      { percent: 85, reps: '5-8', label: 'Hipertrofia' },
      { percent: 80, reps: '8-12', label: 'Hipertrofia/Resistencia' },
      { percent: 75, reps: '12-15', label: 'Resistencia' },
      { percent: 70, reps: '15-20', label: 'Resistencia Muscular' },
      { percent: 60, reps: '20+', label: 'Resistencia/Cardio' },
    ];

    return percentages.map(p => ({
      ...p,
      weight: parseFloat((oneRM * p.percent / 100).toFixed(2)),
    }));
  };

  const percentages = results.length > 0 
    ? getPercentages(results.find(r => r.formula === 'Promedio')?.value || 0)
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calculator className="h-4 w-4" />
          Calcular 1RM
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Calculadora de Repetición Máxima (1RM)
          </DialogTitle>
          <DialogDescription>
            Calcula tu máximo teórico en un ejercicio basado en el peso levantado y las repeticiones completadas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Ej: 100"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reps">Repeticiones</Label>
              <Input
                id="reps"
                type="number"
                placeholder="Ej: 5"
                min="1"
                max="15"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Máximo recomendado: 15 reps
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercise">Ejercicio (opcional)</Label>
            <Input
              id="exercise"
              placeholder="Ej: Press de banca"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Fórmula</Label>
            <Select value={selectedFormula} onValueChange={setSelectedFormula}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar fórmula" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas (promedio)</SelectItem>
                <SelectItem value="epley">Epley</SelectItem>
                <SelectItem value="brzycki">Brzycki</SelectItem>
                <SelectItem value="lander">Lander</SelectItem>
                <SelectItem value="lombardi">Lombardi</SelectItem>
                <SelectItem value="mayhew">Mayhew</SelectItem>
                <SelectItem value="oconner">O'Conner</SelectItem>
                <SelectItem value="wathan">Wathan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={calculateOneRM} className="w-full">
            Calcular
          </Button>

          {/* Resultados */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Resultados
                </h4>
                
                <div className="grid grid-cols-2 gap-2">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        result.formula === 'Promedio'
                          ? 'bg-primary/10 border-primary'
                          : 'bg-muted'
                      } border`}
                    >
                      <p className="text-xs text-muted-foreground">{result.formula}</p>
                      <p className="text-lg font-bold">{result.value} kg</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabla de porcentajes */}
              {percentages.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Zonas de Entrenamiento</h4>
                  
                  <div className="space-y-2">
                    {percentages.map((zone, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-16">{zone.percent}%</span>
                          <span className="text-xs text-muted-foreground w-32">{zone.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {zone.reps} reps
                          </span>
                          <span className="font-semibold w-16 text-right">
                            {zone.weight} kg
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-500">
                  <p className="font-semibold mb-1">Nota importante:</p>
                  <p>
                    El 1RM calculado es una estimación teórica. Para obtener valores precisos, 
                    realiza un test de 1RM real bajo supervisión profesional. Las fórmulas son 
                    más precisas entre 3-10 repeticiones.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook para usar la calculadora
export function useOneRMCalculator() {
  const [oneRM, setOneRM] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  
  const handleComplete = (value: number) => {
    setOneRM(value);
    setIsOpen(false);
  };

  return { oneRM, isOpen, open, close, handleComplete };
}
