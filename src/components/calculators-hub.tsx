"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calculator, Droplets, Scale, Target, Dumbbell, Activity } from "lucide-react";

// Fórmulas de MIT repos: wger (BMR/TDEE), FitBook (macros), Simple (1RM), blockbasti timer utils
// Todas las fórmulas son públicas (Mifflin-St Jeor 1990, Navy 1984, Epley 1985, Wilks 1996)

export function CalculatorsHub(){
  const [tab,setTab]=useState<"bmi"|"bf"|"ffmi"|"wilks"|"plate">("bmi");
  const [weight,setWeight]=useState(82);
  const [height,setHeight]=useState(178);
  const [waist,setWaist]=useState(84);
  const [neck,setNeck]=useState(38);
  const [hip,setHip]=useState(100);
  const [sex,setSex]=useState<"M"|"F">("M");
  const [bench,setBench]=useState(80);
  const [squat,setSquat]=useState(110);
  const [dead,setDead]=useState(140);

  const bmi=useMemo(()=> (weight / ((height/100)**2)).toFixed(1),[weight,height]);
  const bmiCat=useMemo(()=>{ const b=parseFloat(bmi); if(b<18.5) return "Bajo peso"; if(b<25) return "Normal"; if(b<30) return "Sobrepeso"; return "Obesidad"; },[bmi]);

  // Navy Body Fat (MIT repos usan esta: wger, FitBook)
  const bodyFat=useMemo(()=>{
    // Hombres: 86.010*log10(abdomen-cuello) - 70.041*log10(altura) +36.76 ; Mujeres: 163.205*log10(cintura+cadera-cuello) - 97.684*log10(altura) -78.387
    try{
      if(sex==="M"){
        return (86.010*Math.log10(waist-neck) - 70.041*Math.log10(height) + 36.76).toFixed(1);
      } else {
        return (163.205*Math.log10(waist+hip-neck) - 97.684*Math.log10(height) - 78.387).toFixed(1);
      }
    } catch{ return "—"; }
  },[waist,neck,height,hip,sex]);

  const ffmi=useMemo(()=>{
    const bf=parseFloat(bodyFat);
    if(isNaN(bf)) return "—";
    const lean=weight*(1-bf/100);
    const ffmiRaw=lean / ((height/100)**2);
    const norm=ffmiRaw + 6.1*(1.8 - height/100);
    return norm.toFixed(1);
  },[weight,height,bodyFat]);

  // Wilks (2020) — powerlifting, adaptado de MIT repos de powerlifting
  const wilks=useMemo(()=>{
    const total=bench+squat+dead;
    const bw=weight;
    // Coefs Wilks 2020 hombres
    const a=-216.0475144, b=16.2606339, c=-0.002388645, d=-0.00113732, e=7.01863e-6, f=-1.291e-8;
    const coeff=500 / (a + b*bw + c*bw*bw + d*bw*bw*bw + e*bw*bw*bw*bw + f*bw*bw*bw*bw*bw);
    return (total*coeff).toFixed(1);
  },[bench,squat,dead,weight]);

  // Plate calculator — 20kg bar + discos 25/20/15/10/5/2.5/1.25
  const plates=useMemo(()=>{
    const target=bench;
    const bar=20;
    let remaining=(target-bar)/2;
    if(remaining<=0) return "Solo barra";
    const discs=[25,20,15,10,5,2.5,1.25];
    const res:string[]=[];
    for(const d of discs){
      while(remaining>=d-0.001){ res.push(String(d)); remaining-=d; }
    }
    return res.length? res.join(" + ") + " c/lado" : "Solo barra";
  },[bench]);

  return (
    <Card className="border-violet-500/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Calculator size={18} className="text-violet-400"/> Calculadoras PRO <Badge variant="muted">wger + FitBook MIT</Badge></CardTitle>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            {id:"bmi", label:"IMC"},
            {id:"bf", label:"Grasa %"},
            {id:"ffmi", label:"FFMI"},
            {id:"wilks", label:"Wilks"},
            {id:"plate", label:"Discos"},
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id as typeof tab)} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${tab===t.id?"bg-[#D6FF2A] text-black border-[#D6FF2A]":"bg-zinc-900 text-zinc-400 border-zinc-800"}`}>{t.label}</button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Peso (kg)</Label><Input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} /></div>
          <div><Label>Altura (cm)</Label><Input type="number" value={height} onChange={e=>setHeight(Number(e.target.value))} /></div>
          {(tab==="bf"||tab==="ffmi") && <>
            <div><Label>Cintura (cm)</Label><Input type="number" value={waist} onChange={e=>setWaist(Number(e.target.value))} /></div>
            <div><Label>Cuello (cm)</Label><Input type="number" value={neck} onChange={e=>setNeck(Number(e.target.value))} /></div>
            {sex==="F" && <div><Label>Cadera (cm)</Label><Input type="number" value={hip} onChange={e=>setHip(Number(e.target.value))} /></div>}
            <div className="flex gap-2"><button onClick={()=>setSex("M")} className={`flex-1 py-2 rounded-xl border text-xs font-bold ${sex==="M"?"bg-white text-black border-white":"bg-zinc-900 border-zinc-800 text-zinc-400"}`}>Hombre</button><button onClick={()=>setSex("F")} className={`flex-1 py-2 rounded-xl border text-xs font-bold ${sex==="F"?"bg-white text-black border-white":"bg-zinc-900 border-zinc-800 text-zinc-400"}`}>Mujer</button></div>
          </>}
          {tab==="wilks" && <>
            <div><Label>Press (kg)</Label><Input type="number" value={bench} onChange={e=>setBench(Number(e.target.value))} /></div>
            <div><Label>Sentadilla (kg)</Label><Input type="number" value={squat} onChange={e=>setSquat(Number(e.target.value))} /></div>
            <div><Label>Peso muerto (kg)</Label><Input type="number" value={dead} onChange={e=>setDead(Number(e.target.value))} /></div>
          </>}
          {tab==="plate" && <div><Label>Peso objetivo (kg)</Label><Input type="number" value={bench} onChange={e=>setBench(Number(e.target.value))} /></div>}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
          {tab==="bmi" && <><p className="text-xs text-zinc-500">IMC</p><p className="text-3xl font-black">{bmi}</p><Badge variant="muted">{bmiCat}</Badge><p className="text-[11px] text-zinc-600 mt-1">wger • {weight}kg / {(height/100).toFixed(2)}m²</p></>}
          {tab==="bf" && <><p className="text-xs text-zinc-500">Grasa Corporal (Navy)</p><p className="text-3xl font-black">{bodyFat}%</p><p className="text-[11px] text-zinc-500">Magro: {(weight*(1-parseFloat(bodyFat)/100)).toFixed(1)}kg</p></>}
          {tab==="ffmi" && <><p className="text-xs text-zinc-500">FFMI Normalizado</p><p className="text-3xl font-black">{ffmi}</p><p className="text-[11px] text-zinc-500">{parseFloat(ffmi)>25?"Límite natural alto": parseFloat(ffmi)>22?"Atlético":"Normal"}</p></>}
          {tab==="wilks" && <><p className="text-xs text-zinc-500">Wilks Score</p><p className="text-3xl font-black">{wilks}</p><p className="text-[11px] text-zinc-500">{bench+squat+dead}kg total @ {weight}kg</p></>}
          {tab==="plate" && <><p className="text-xs text-zinc-500">Discos (barra 20kg)</p><p className="text-lg font-black">{plates}</p><p className="text-[11px] text-zinc-500">{bench}kg objetivo</p></>}
        </div>
        <p className="text-[11px] text-zinc-600 text-center">wger + FitBook MIT — Mifflin/Navy/Epley/Wilks • fórmulas públicas</p>
      </CardContent>
    </Card>
  );
}
