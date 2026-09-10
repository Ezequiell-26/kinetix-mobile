"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, FileText, Play } from "lucide-react";

// Inspirado en Wiki.js + Outline MIT — knowledge base para clientes
const ARTICLES=[
  {title:"Cómo progresar sin lesionarte", type:"video", time:"6′", views:"1.2k"},
  {title:"Proteína: cuánto y cuándo", type:"artículo", time:"4′", views:"890"},
  {title:"Sueño y rendimiento", type:"artículo", time:"5′", views:"650"},
  {title:"RIR y RPE explicados", type:"video", time:"8′", views:"1.5k"},
];

export function EducationHub(){
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen size={16} className="text-violet-400"/> Educación <Badge variant="muted">Wiki.js MIT</Badge></CardTitle><p className="text-xs text-zinc-500">Artículos y videos de Ezequiel — sin YouTube, todo en la app</p></CardHeader>
      <CardContent className="space-y-2">
        {ARTICLES.map(a=>(
          <a key={a.title} href="#" className="flex gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.type==="video"?"bg-red-500/20 text-red-400":"bg-violet-500/20 text-violet-400"}`}>{a.type==="video"?<Play size={16}/>:<FileText size={16}/>}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{a.title}</p>
              <p className="text-xs text-zinc-500">{a.type} • {a.time} • {a.views} vistas</p>
            </div>
            <Badge variant="muted" className="shrink-0 text-[11px]">{a.type}</Badge>
          </a>
        ))}
        <p className="text-[11px] text-zinc-600 text-center">Wiki.js MIT — KB privada, sin Notion, todo en tu dominio</p>
      </CardContent>
    </Card>
  );
}
