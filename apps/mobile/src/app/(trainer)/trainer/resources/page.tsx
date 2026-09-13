import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TrainerResources(){
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-display font-bold">Recursos & Plantillas</h1><p className="text-sm text-zinc-500">Gestiona tu biblioteca VIP para clientes</p></div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Card><CardHeader><CardTitle>Plantillas de programas</CardTitle><p className="text-xs text-zinc-500">3 plantillas • duplica en 1 toque</p></CardHeader><CardContent><Button variant="outline" size="sm" className="w-full">Gestionar plantillas</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Biblioteca de ejercicios</CardTitle><p className="text-xs text-zinc-500">10 ejercicios • videos e imágenes</p></CardHeader><CardContent><Button variant="outline" size="sm" className="w-full">Ver biblioteca</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Recursos VIP</CardTitle><p className="text-xs text-zinc-500">Videos y PDFs para clientes</p></CardHeader><CardContent><Button variant="accent" size="sm" className="w-full">Subir recurso</Button></CardContent></Card>
        <Card className="border-primary/20 bg-primary/[0.03]"><CardHeader><CardTitle>WhatsApp Business</CardTitle><p className="text-xs text-zinc-500">Conecta tu número para mensajes</p></CardHeader><CardContent><Button variant="outline" size="sm" className="w-full">Conectar</Button></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Exportar todo</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">Exportar clientes CSV</Button>
          <Button variant="outline" size="sm" className="flex-1">Exportar progresos PDF</Button>
        </CardContent>
      </Card>
    </div>
  );
}
