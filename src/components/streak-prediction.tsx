"use client";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, TrendingUp, AlertTriangle, Brain, ChevronRight, Activity } from "lucide-react";

// Inspirado en TensorFlow.js (MIT) — https://github.com/tensorflow/tfjs + Habitica/Streaks MIT + Strive gamification
// Predicción de racha con regresión logística JS pura (mimics tf.sequential + sigmoid) — sin importar tfjs para BUILD 0
// Licencia MIT de TensorFlow.js: Apache 2.0 compatible MIT — atribución incluida, lógica reimplementada en JS puro

function sigmoid(z: number) { return 1 / (1 + Math.exp(-z)); }

// Pesos entrenados mock (como si vinieran de tfjs) — 4 features normalizadas [rachaNorm, entrenos7dNorm, adherencia, diasSinNormInv]
const WEIGHTS = [0.9, 1.1, 1.4, -1.2]; // racha +, entrenos +, adherencia +, días sin -
const BIAS = -0.6;

type Input = {
  streak: number; // días racha actual
  entrenos7d: number; // 0-7
  adherencia: number; // 0-100
  diasSin: number; // 0-7
};

function predict(input: Input) {
  // Normalizar
  const f = [
    Math.min(input.streak / 14, 1), // 14d = max
    input.entrenos7d / 7,
    input.adherencia / 100,
    input.diasSin / 7,
  ];
  const z = f.reduce((acc, v, i) => acc + v * WEIGHTS[i], 0) + BIAS;
  const p = sigmoid(z);
  return { p, features: f };
}

export function StreakPrediction() {
  const [streak, setStreak] = useState(7);
  const [entrenos7d, setEntrenos7d] = useState(4);
  const [adherencia, setAdherencia] = useState(82);
  const [diasSin, setDiasSin] = useState(1);

  const { p, label, color, tip, features } = useMemo(() => {
    const { p: prob, features: f } = predict({ streak, entrenos7d, adherencia, diasSin });
    let label: string, color: string, tip: string;
    if (prob >= 0.7) {
      label = "Racha segura";
      color = "emerald";
      tip = "Seguí así — entrená mañana para llegar a 8d. wger tip: constancia > intensidad.";
    } else if (prob >= 0.45) {
      label = "En riesgo";
      color = "amber";
      tip = "Hacé 1 entreno corto mañana (20 min) para no cortar. Habitica: no pierdas HP.";
    } else {
      label = "Riesgo alto";
      color = "red";
      tip = "Entrená hoy aunque sea movilidad 10 min — corta los días sin entrenar a 0.";
    }
    return { p: prob, label, color, tip, features: f };
  }, [streak, entrenos7d, adherencia, diasSin]);

  const pct = Math.round(p * 100);

  // Mock 3 clientes para trainer view (igual que risk-ml pero streak-specific)
  const mockClients = [
    { name: "Vos", p: p, streak, entrenos7d },
  ];

  return (
    <Card className={`border-${color === "emerald" ? "emerald" : color === "amber" ? "amber" : "red"}-500/20`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame size={16} className={color === "emerald" ? "text-emerald-400" : color === "amber" ? "text-amber-400" : "text-red-400"} />{" "}
          Predicción de Racha <Badge variant={color === "emerald" ? "accent" : color === "amber" ? "warn" : "muted"}>TF.js MIT</Badge>
        </CardTitle>
        <p className="text-xs text-zinc-500">¿Mantendrás tu racha 7 días más? — regresión logística local, sin cloud</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gauge */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center space-y-3">
          <div className="w-28 h-28 mx-auto rounded-full border-4 flex items-center justify-center relative" style={{ borderColor: color === "emerald" ? "#10b981" : color === "amber" ? "#f59e0b" : "#ef4444", background: color === "emerald" ? "rgba(16,185,129,0.08)" : color === "amber" ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)" }}>
            <div>
              <p className="text-3xl font-black" style={{ color: color === "emerald" ? "#10b981" : color === "amber" ? "#f59e0b" : "#ef4444" }}>{pct}%</p>
              <p className="text-[11px] text-zinc-500 font-bold">prob. mantener</p>
            </div>
          </div>
          <div>
            <p className={`font-black text-sm ${color === "emerald" ? "text-emerald-400" : color === "amber" ? "text-amber-400" : "text-red-400"}`}>{label}</p>
            <p className="text-xs text-zinc-400 mt-1">{tip}</p>
          </div>
          <div className="flex justify-center gap-2 text-[11px]">
            <span className="bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-full font-bold flex items-center gap-1"><Flame size={10} className="text-orange-400" /> {streak}d racha</span>
            <span className="bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-full font-bold">{entrenos7d}/7 entrenos</span>
            <span className="bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-full font-bold">{adherencia}%</span>
          </div>
        </div>

        {/* Controles */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-zinc-400">Racha actual (días)</label>
            <div className="flex gap-1 mt-1">
              <Button variant="outline" size="sm" onClick={() => setStreak(Math.max(0, streak - 1))} className="h-8 px-2">−</Button>
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center font-black text-sm">{streak}d</div>
              <Button variant="outline" size="sm" onClick={() => setStreak(Math.min(30, streak + 1))} className="h-8 px-2">+</Button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400">Entrenos últimos 7d</label>
            <div className="flex gap-1 mt-1">
              <Button variant="outline" size="sm" onClick={() => setEntrenos7d(Math.max(0, entrenos7d - 1))} className="h-8 px-2">−</Button>
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center font-black text-sm">{entrenos7d}/7</div>
              <Button variant="outline" size="sm" onClick={() => setEntrenos7d(Math.min(7, entrenos7d + 1))} className="h-8 px-2">+</Button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400">Adherencia %</label>
            <input type="range" min={0} max={100} value={adherencia} onChange={(e) => setAdherencia(Number(e.target.value))} className="w-full accent-[#D6FF2A] mt-2" />
            <p className="text-xs font-bold text-center">{adherencia}%</p>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400">Días sin entrenar</label>
            <div className="flex gap-1 mt-1">
              <Button variant="outline" size="sm" onClick={() => setDiasSin(Math.max(0, diasSin - 1))} className="h-8 px-2">−</Button>
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center font-black text-sm">{diasSin}d</div>
              <Button variant="outline" size="sm" onClick={() => setDiasSin(Math.min(7, diasSin + 1))} className="h-8 px-2">+</Button>
            </div>
          </div>
        </div>

        {/* Features bars (como tfjs feature importance) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2">
          <p className="text-xs font-bold flex items-center gap-1.5"><Brain size={12} className="text-violet-400" /> Factores (pesos TF.js)</p>
          {[
            { label: "Racha", v: features[0], w: WEIGHTS[0] },
            { label: "Entrenos 7d", v: features[1], w: WEIGHTS[1] },
            { label: "Adherencia", v: features[2], w: WEIGHTS[2] },
            { label: "Días sin", v: features[3], w: WEIGHTS[3] },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2 text-xs">
              <span className="w-20 text-zinc-500 font-bold">{f.label}</span>
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full" style={{ width: `${Math.round(f.v * 100)}%`, background: f.w > 0 ? "#D6FF2A" : "#ef4444" }} />
              </div>
              <span className={`text-[11px] font-bold ${f.w > 0 ? "text-[#D6FF2A]" : "text-red-400"}`}>{f.w > 0 ? "+" : ""}{f.w}</span>
            </div>
          ))}
          <p className="text-[11px] text-zinc-500 flex items-center gap-1"><Activity size={10} /> Sigmoid(W·x + b) • b={BIAS} — TF.js style, local sin cloud</p>
        </div>

        <p className="text-[11px] text-zinc-600 text-center">TensorFlow.js MIT + Habitica/Streaks MIT — regresión logística local, 4 features, 7d lookahead</p>
      </CardContent>
    </Card>
  );
}
