import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "TRAINER") return null;

  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const statusFilter = sp.status && sp.status !== "TODOS" ? sp.status : undefined;
  const whereClause: Record<string, unknown> = { trainerId: session.id };
  if (q) whereClause.OR = [{ name: { contains: q } }, { email: { contains: q } }];
  if (statusFilter) whereClause.status = statusFilter;

  const [clients, totalActivos] = await Promise.all([
    prisma.client.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        assignedProgram: { select: { id: true, name: true } },
        checkIns: { orderBy: { date: "desc" }, take: 1, select: { reviewed: true, date: true } },
        workoutLogs: { orderBy: { date: "desc" }, take: 1, select: { date: true } },
      },
      take: 200,
    }),
    prisma.client.count({ where: { trainerId: session.id, status: "ACTIVO" } }),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-display font-bold lg:text-3xl text-white">Mis Clientes</h1><p className="text-sm text-zinc-400">{clients.length} {clients.length === 1 ? "cliente" : "clientes"} • {totalActivos} activos</p></div><Link href="/trainer/clients/new"><Button variant="accent" size="sm" className="min-h-[44px] font-bold"><Plus size={16} className="mr-1.5"/> NUEVO CLIENTE</Button></Link></div>
      <Card className="border-primary/15 bg-[#0B151E]"><CardContent className="space-y-3 p-4"><form className="flex gap-2" method="GET"><div className="relative flex-1"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"/><Input placeholder="Buscar por nombre o email..." name="q" defaultValue={sp.q} className="border-white/[0.08] bg-[#081119] pl-9 text-sm"/></div>{sp.status && <input type="hidden" name="status" value={sp.status}/>}<Button type="submit" variant="outline" className="shrink-0 font-medium">Buscar</Button></form><div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">{["TODOS","ACTIVO","PAUSADO","PENDIENTE","FINALIZADO"].map((status)=><Link key={status} href={status === "TODOS" ? (sp.q ? `/trainer/clients?q=${encodeURIComponent(sp.q)}` : "/trainer/clients") : `/trainer/clients?status=${status}${sp.q ? `&q=${encodeURIComponent(sp.q)}` : ""}`} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${((!sp.status&&status==="TODOS")||sp.status===status)?"border-primary bg-primary text-black font-bold":"border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-zinc-700"}`}>{status}</Link>)}</div></CardContent></Card>
      {clients.length>0?<div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">{clients.map((client)=><Link key={client.id} href={`/trainer/clients/${client.id}`} className="group"><Card className="h-full border-white/[0.06] bg-[#0B151E] transition hover:border-primary/25"><CardContent className="space-y-3 p-4"><div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-base font-black text-black transition group-hover:bg-primary">{client.name?.[0]?.toUpperCase()||"C"}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white transition group-hover:text-primary">{client.name}</p><p className="truncate text-xs text-zinc-500">{client.email}</p><div className="mt-2 flex flex-wrap gap-1.5"><Badge variant={client.status === "ACTIVO" ? "success" : client.status === "PAUSADO" ? "warn" : "muted"} className="text-[10px]">{client.status}</Badge><Badge variant="muted" className="text-[10px]">{client.plan}</Badge>{client.checkIns?.[0]?.reviewed === false&&<Badge variant="warn" className="text-[10px]">Check-in pendiente</Badge>}</div></div></div><div className="grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl border border-white/[0.06] bg-[#081119] p-2.5"><span className="block text-[10px] font-bold uppercase text-zinc-500">Objetivo</span><p className="mt-0.5 truncate font-semibold text-white">{client.goal.replaceAll("_", " ")}</p></div><div className="rounded-xl border border-white/[0.06] bg-[#081119] p-2.5"><span className="block text-[10px] font-bold uppercase text-zinc-500">Programa</span><p className="mt-0.5 truncate font-semibold text-white">{client.assignedProgram?.name||"Sin asignar"}</p></div></div></CardContent></Card></Link>)}</div>:<Card className="border-dashed border-white/[0.08] bg-[#0B151E]"><CardContent className="space-y-3 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-zinc-500"><Users size={22}/></div><p className="text-base font-bold text-white">No hay clientes todavía</p><p className="mx-auto max-w-sm text-xs text-zinc-500">{q||sp.status?"No se encontraron clientes con los filtros seleccionados.":"Aún no tenés clientes registrados en tu cartera."}</p><Link href="/trainer/clients/new" className="mt-2 inline-block"><Button variant="accent" size="sm" className="font-bold">+ Crear Primer Cliente</Button></Link></CardContent></Card>}
    </div>
  );
}
