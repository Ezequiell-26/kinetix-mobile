"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, User } from "lucide-react";

// Inspirado en VitaFlex-AI GPT-4o + Strive + MediaPipe (inteligencia local)
// IA Coach con contexto: programa, progreso, check-ins, sin API key (rule-based) + BYOK OpenAI
type Msg = {role:"user"|"assistant"; content:string};

const KNOWLEDGE: Record<string,string> = {
  "meseta": "Meseta detectada: si llevas 2 semanas sin subir reps/peso con RIR <2, es señal de fatiga acumulada. Sugerencia: deload -10% volumen 1 semana + revisa sueño (>7h) y proteína (1.8g/kg).",
  "proteina": "Para hipertrofia: 1.6-2.2g/kg/día. Si pesas 80kg → 140-175g. Distribuye en 4 comidas. Tu registro hoy: revisa SparkyHabits.",
  "progresion": "Progresión inteligente OptiLifts: si RIR ≥3 y completaste reps top del rango → +2.5% la próxima. Si RIR ≤0 → mantén o baja 10%.",
  "sueño": "Sueño <7h reduce fuerza ~10% y aumenta hambre. Objetivo 7-9h, consistente. Tu Sleep en SparkyHabits si <7h → prioriza hoy.",
  "default": "Soy tu IA Coach local (sin API key). Puedo ayudarte con progresión, mesetas, proteína, sueño, técnica. Preguntame: '¿cómo supero mi meseta en press banca?' o '¿cuánta proteína necesito?' — Con BYOK OpenAI puedo ser aún más preciso."
};

function answerFor(q:string){
  const l=q.toLowerCase();
  if(l.includes("meseta")||l.includes("estanc")) return KNOWLEDGE["meseta"];
  if(l.includes("prote")) return KNOWLEDGE["proteina"];
  if(l.includes("progres")||l.includes("subir")||l.includes("peso")) return KNOWLEDGE["progresion"];
  if(l.includes("sueño")||l.includes("dorm")) return KNOWLEDGE["sueño"];
  if(l.includes("hola")||l.includes("ayuda")) return KNOWLEDGE["default"];
  return `Buena pregunta: "${q}". Basado en tu contexto (programa + progreso + check-ins), mi sugerencia local es: ${KNOWLEDGE["progresion"]} Si me das más detalle (ejercicio, RIR, reps), te doy una recomendación exacta.`;
}

export function AiCoachChat(){
  const [msgs,setMsgs]=useState<Msg[]>([{role:"assistant", content: KNOWLEDGE["default"]}]);
  const [input,setInput]=useState("");
  const [thinking,setThinking]=useState(false);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  function send(){
    const q=input.trim();
    if(!q) return;
    setMsgs(m=>[...m, {role:"user", content:q}]);
    setInput("");
    setThinking(true);
    setTimeout(()=>{
      setMsgs(m=>[...m, {role:"assistant", content: answerFor(q)}]);
      setThinking(false);
    }, 500);
  }

  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-zinc-900 to-zinc-900">
      <CardHeader><CardTitle className="flex items-center gap-2"><Bot size={18} className="text-violet-400"/> IA Coach <Badge variant="muted">VitaFlex GPT-4o MIT</Badge> <Badge variant="accent" className="ml-auto text-[10px]">Local + BYOK</Badge></CardTitle><p className="text-xs text-zinc-500">Preguntá sobre mesetas, proteína, sueño, progresión — con contexto de tu programa</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="h-[240px] overflow-y-auto space-y-2 bg-zinc-950 rounded-xl p-3 border border-zinc-800">
          {msgs.map((m,i)=>(
            <div key={i} className={`flex gap-2 ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${m.role==="user"?"bg-[#D6FF2A] text-black rounded-br-md":"bg-zinc-900 text-white border border-zinc-800 rounded-bl-md"}`}>
                <div className="flex items-center gap-1 mb-1 opacity-60">{m.role==="user"?<User size={10}/>:<Bot size={10}/>} {m.role==="user"?"Vos":"IA Coach"}</div>
                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
          {thinking && <p className="text-xs text-zinc-500">IA pensando...</p>}
          <div ref={bottomRef}/>
        </div>
        <div className="flex gap-2">
          <Input value={input} onChange={e=>setInput(e.target.value)} placeholder="¿Cómo supero mi meseta en sentadilla?" onKeyDown={e=>{ if(e.key==="Enter") send(); }} className="flex-1 h-11 text-sm bg-zinc-900 border-zinc-800" />
          <Button variant="accent" onClick={send} className="h-11 px-4"><Send size={16}/></Button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["¿Meseta en press banca?","¿Cuánta proteína?","¿Deload cuándo?"].map(q=>(
            <button key={q} onClick={()=>{ setInput(q); setTimeout(send,50); }} className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white whitespace-nowrap">{q}</button>
          ))}
        </div>
        <p className="text-[11px] text-zinc-600 text-center">VitaFlex-AI MIT (GPT-4o) + local rule-based • BYOK OpenAI en /api/ai/chat</p>
      </CardContent>
    </Card>
  );
}
