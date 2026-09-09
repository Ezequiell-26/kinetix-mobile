import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const resources = [
  {id:"1", title:"Guía de Técnica: Sentadilla Perfecta", type:"Video", duration:"8 min", premium:true, thumb:"https://images.unsplash.com/photo-1434608519340-334ff72da56d?w=400"},
  {id:"2", title:"E-book: Nutrición para Hipertrofia", type:"PDF", duration:"24 pág", premium:true, thumb:"https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400"},
  {id:"3", title:"Checklist: Preparación de Comidas", type:"Guía", duration:"5 min", premium:false, thumb:"https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400"},
  {id:"4", title:"Audio: Motivación Pre-Entreno", type:"Audio", duration:"12 min", premium:true, thumb:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"},
];

export default function ResourcesPage(){
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div><h1 className="text-2xl font-display font-bold">Recursos VIP</h1><p className="text-sm text-zinc-500">Videos, guías y e-books exclusivos de Ezequiel</p></div>
        <Badge variant="accent">VIP</Badge>
      </div>

      <Card className="bg-gradient-to-br from-[#D6FF2A]/10 to-zinc-900 border-[#D6FF2A]/20">
        <CardContent className="pt-4 flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#D6FF2A] flex items-center justify-center font-black text-black">★</div>
          <div><p className="font-bold">Acceso VIP completo</p><p className="text-xs text-zinc-500">12 recursos • nuevos cada semana • solo para clientes Premium/Personalizado</p></div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {resources.map(r=>(
          <Card key={r.id} className="overflow-hidden hover:border-zinc-700 transition group">
            <div className="flex gap-3 p-3">
              <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.thumb} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 items-center"><Badge variant={r.premium?"accent":"muted"}>{r.type}</Badge><span className="text-xs text-zinc-500">{r.duration}</span>{r.premium && <span className="text-xs text-[#D6FF2A]">• VIP</span>}</div>
                <p className="font-semibold text-sm mt-1 line-clamp-2">{r.title}</p>
                <div className="flex gap-2 mt-2"><Button variant="outline" size="sm" className="h-7 text-xs">Ver</Button><Button variant="ghost" size="sm" className="h-7 text-xs">Guardar</Button></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>¿Necesitás ayuda?</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Link href="/client/messages" className="flex-1"><Button variant="accent" className="w-full">Chatear con Ezequiel</Button></Link>
          <a href="https://wa.me/5490000000000" target="_blank" className="flex-1"><Button variant="outline" className="w-full">WhatsApp</Button></a>
        </CardContent>
      </Card>
    </div>
  );
}
