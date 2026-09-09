"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Check, ShieldCheck, Dumbbell, Calendar, CreditCard } from "lucide-react";

type ClientProfileData = {
  id: string;
  name: string;
  email: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  goal: string;
  plan: string;
  status: string;
  experience: string | null;
  availability: number | null;
  equipment: string | null;
  subscription: {
    plan: string;
    status: string;
    price: number | null;
    nextPayment: string | null;
  } | null;
};

export default function ClientProfilePage(){
  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("HIPERTROFIA");
  const [availability, setAvailability] = useState(4);
  const [equipment, setEquipment] = useState("Gimnasio completo");

  async function loadProfile(){
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (meData?.user?.id) {
        // Find client
        const clientsRes = await fetch("/api/clients");
        if (clientsRes.ok) {
          const all = await clientsRes.json();
          // Find own client or use first
          const myClient = all.find((c: { email: string }) => c.email === meData.user.email) || all[0];
          if (myClient) {
            const detailRes = await fetch(`/api/clients/${myClient.id}`);
            if (detailRes.ok) {
              const full = await detailRes.json();
              setProfile(full);
              setName(full.name || "");
              setAge(full.age ? String(full.age) : "");
              setWeight(full.weight ? String(full.weight) : "");
              setHeight(full.height ? String(full.height) : "");
              setGoal(full.goal || "HIPERTROFIA");
              setAvailability(full.availability || 4);
              setEquipment(full.equipment || "Gimnasio completo");
            }
          }
        }
      }
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent){
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/clients/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: age ? Number(age) : null,
          weight: weight ? Number(weight) : null,
          height: height ? Number(height) : null,
          goal,
          availability: Number(availability),
          equipment
        })
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert("Error al guardar cambios");
      }
    } catch {
      alert("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-zinc-500">Cargando perfil...</div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold">Mi Perfil</h1>
        <p className="text-sm text-zinc-400">Datos personales, objetivos físicos y preferencias</p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check size={16} /> Tus cambios fueron guardados exitosamente.
        </div>
      )}

      {/* Identity Card */}
      <Card className="border-zinc-800 bg-zinc-900/90">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#D6FF2A] text-black flex items-center justify-center font-black text-2xl shrink-0">
            {name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg text-white truncate">{name || "Atleta"}</h2>
            <p className="text-xs text-zinc-400 truncate">{profile?.email}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge variant="success" className="text-[10px]">{profile?.status || "ACTIVO"}</Badge>
              <Badge variant="muted" className="text-[10px]">{profile?.plan || "PERSONALIZADO"}</Badge>
              <Badge variant="accent" className="text-[10px]">{goal.replace("_", " ")}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <Card className="border-zinc-800 bg-zinc-900/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Datos Físicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Nombre Completo</Label>
                <Input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input value={profile?.email || ""} disabled className="opacity-50" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Edad</Label>
                <Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="28" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Peso (kg)</Label>
                <Input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="85.0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Altura (cm)</Label>
                <Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="178" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Objetivo de Entrenamiento</Label>
              <select
                value={goal}
                onChange={e => setGoal(e.target.value)}
                className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6FF2A]"
              >
                <option value="HIPERTROFIA">Hipertrofia (Ganancia Muscular)</option>
                <option value="PERDIDA_GRASA">Pérdida de Grasa & Definición</option>
                <option value="FUERZA">Fuerza Máxima & Powerlifting</option>
                <option value="RECOMPOSICION">Recomposición Corporal</option>
                <option value="OTRO">Salud & Acondicionamiento</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card className="border-zinc-800 bg-zinc-900/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Disponibilidad y Equipamiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Días de entrenamiento por semana</Label>
                <select
                  value={availability}
                  onChange={e => setAvailability(Number(e.target.value))}
                  className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6FF2A]"
                >
                  <option value={2}>2 días</option>
                  <option value={3}>3 días</option>
                  <option value={4}>4 días</option>
                  <option value={5}>5 días</option>
                  <option value={6}>6 días</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Lugar de entrenamiento</Label>
                <Input
                  value={equipment}
                  onChange={e => setEquipment(e.target.value)}
                  placeholder="Gimnasio comercial, casa con mancuernas..."
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              disabled={saving}
              className="w-full h-12 font-black text-sm tracking-wide mt-2"
            >
              {saving ? "Guardando..." : "GUARDAR CAMBIOS ✓"}
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* Subscription Card */}
      <Card className="border-zinc-800 bg-zinc-900/90">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard size={18} className="text-[#D6FF2A]" /> Suscripción de Coaching
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <p className="font-bold text-white text-sm">Plan {profile?.plan || "Personalizado"}</p>
              <p className="text-zinc-500">Coaching 1:1 con Ezequiel</p>
            </div>
            <Badge variant="success">Activa</Badge>
          </div>

          {profile?.subscription && (
            <div className="space-y-1 text-zinc-400">
              <div className="flex justify-between py-1 border-b border-zinc-850">
                <span>Cuota mensual</span>
                <span className="font-bold text-white">${profile.subscription.price?.toLocaleString("es-AR")} ARS</span>
              </div>
              {profile.subscription.nextPayment && (
                <div className="flex justify-between py-1">
                  <span>Próximo vencimiento</span>
                  <span className="font-bold text-zinc-300">
                    {new Date(profile.subscription.nextPayment).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>
          )}

          <p className="text-[11px] text-zinc-500 text-center pt-1">
            🔒 Pagos y renovaciones gestionadas de forma segura. No se almacenan datos de tarjetas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
