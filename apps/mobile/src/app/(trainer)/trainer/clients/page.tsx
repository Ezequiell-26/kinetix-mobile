import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search, Dumbbell } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ClientsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}){
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const statusFilter = sp.status && sp.status !== "TODOS" ? sp.status : undefined;

  const whereClause: Record<string, unknown> = {};
  if (q) {
    whereClause.OR = [
      { name: { contains: q } },
      { email: { contains: q } }
    ];
  }
  if (statusFilter) {
    whereClause.status = statusFilter;
  }

  const clients = await prisma.client.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      assignedProgram: { select: { id: true, name: true } },
      checkIns: { orderBy: { date: "desc" }, take: 1, select: { reviewed: true, date: true } },
      workoutLogs: { orderBy: { date: "desc" }, take: 1, select: { date: true } }
    }
  }).catch(() => []);

  const totalActivos = await prisma.client.count({ where: { status: "ACTIVO" } }).catch(() => 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Mis Clientes</h1>
          <p className="text-sm text-zinc-400">
            {clients.length} {clients.length === 1 ? "cliente" : "clientes"} • {totalActivos} activos
          </p>
        </div>
        <Link href="/trainer/clients/new">
          <Button variant="accent" size="sm" className="font-bold min-h-[44px]">
            <Plus size={16} className="mr-1.5" /> NUEVO CLIENTE
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="border-zinc-800 bg-zinc-900/60">
        <CardContent className="p-4 space-y-3">
          <form className="flex gap-2" method="GET">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Buscar por nombre o email..."
                name="q"
                defaultValue={sp.q}
                className="pl-9 bg-zinc-950 border-zinc-800 text-sm"
              />
            </div>
            {sp.status && <input type="hidden" name="status" value={sp.status} />}
            <Button type="submit" variant="outline" className="shrink-0 font-medium">
              Buscar
            </Button>
          </form>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["TODOS", "ACTIVO", "PAUSADO", "PENDIENTE", "FINALIZADO"].map(s => {
              const isActive = (!sp.status && s === "TODOS") || sp.status === s;
              const href = s === "TODOS"
                ? (sp.q ? `/trainer/clients?q=${encodeURIComponent(sp.q)}` : "/trainer/clients")
                : `/trainer/clients?status=${s}${sp.q ? `&q=${encodeURIComponent(sp.q)}` : ""}`;
              return (
                <Link
                  key={s}
                  href={href}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition font-medium shrink-0 ${
                    isActive
                      ? "bg-white text-black border-white font-bold"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {s}
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Grid of Clients */}
      {clients.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {clients.map(c => {
            const lastWorkout = c.workoutLogs?.[0]?.date;
            const hasPendingCheckin = c.checkIns?.[0]?.reviewed === false;

            return (
              <Link key={c.id} href={`/trainer/clients/${c.id}`} className="group">
                <Card className="hover:border-zinc-700 transition border-zinc-800 bg-zinc-900/90 h-full flex flex-col justify-between">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex gap-3 items-start">
                      <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center font-black text-base shrink-0 group-hover:bg-primary transition">
                        {c.name?.[0]?.toUpperCase() || "C"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-sm text-white truncate group-hover:text-primary transition">
                            {c.name}
                          </p>
                        </div>
                        <p className="text-xs text-zinc-500 truncate">{c.email}</p>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          <Badge variant={c.status === "ACTIVO" ? "success" : c.status === "PAUSADO" ? "warn" : "muted"} className="text-[10px]">
                            {c.status}
                          </Badge>
                          <Badge variant="muted" className="text-[10px]">
                            {c.plan}
                          </Badge>
                          {hasPendingCheckin && (
                            <Badge variant="warn" className="text-[10px]">
                              Check-in pendiente
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-zinc-950 rounded-xl p-2.5 border border-zinc-800/80">
                        <span className="text-zinc-500 text-[10px] uppercase font-bold block">Objetivo</span>
                        <p className="font-semibold text-white mt-0.5 truncate">{c.goal.replace("_", " ")}</p>
                      </div>
                      <div className="bg-zinc-950 rounded-xl p-2.5 border border-zinc-800/80">
                        <span className="text-zinc-500 text-[10px] uppercase font-bold block">Programa</span>
                        <p className="font-semibold text-white mt-0.5 truncate">
                          {c.assignedProgram?.name || "Sin asignar"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed border-zinc-800 bg-zinc-900/40">
          <CardContent className="py-14 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Users size={22} />
            </div>
            <p className="font-bold text-base text-white">No hay datos todavía</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {q || sp.status
                ? "No se encontraron clientes con los filtros seleccionados."
                : "Aún no tienes clientes registrados en tu plataforma."}
            </p>
            <Link href="/trainer/clients/new" className="inline-block mt-2">
              <Button variant="accent" size="sm" className="font-bold">
                + Crear Primer Cliente
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
