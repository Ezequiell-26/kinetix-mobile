import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
export default function TrainerSettings(){
  return (
    <div className="max-w-[640px] space-y-4">
      <h1 className="text-2xl font-display font-bold">Ajustes</h1>
      <Card><CardHeader><CardTitle>Apariencia</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-500">Blanco y negro premium — minimalista, prolijo, profesional. Cambia el tema de toda la app.</p>
          <ThemeToggle variant="full" />
          <p className="text-xs text-zinc-500">Se guarda automáticamente • funciona en Android e iOS • sin recargar</p>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Perfil de entrenador</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Nombre</Label><Input defaultValue="Ezequiel" /></div>
          <div className="space-y-2"><Label>Email</Label><Input defaultValue="ezequiel@ezequielcoaching.com" /></div>
          <div className="space-y-2"><Label>Biografía</Label><Input defaultValue="Coach certificado • 8 años transformando físicos" /></div>
          <Button variant="accent">Guardar cambios</Button>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Notificaciones</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <label className="flex justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800"><span>Nuevo check-in</span><input type="checkbox" defaultChecked /></label>
          <label className="flex justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800"><span>Cliente inactivo</span><input type="checkbox" defaultChecked /></label>
          <label className="flex justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800"><span>Push notifications</span><span className="text-xs text-zinc-500">Preparado</span></label>
        </CardContent>
      </Card>
    </div>
  );
}
