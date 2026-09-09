"use client";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const adherenceData = [
  {name:"Sem 1", adherence:78, volumen:12},
  {name:"Sem 2", adherence:82, volumen:14},
  {name:"Sem 3", adherence:84, volumen:16},
  {name:"Sem 4", adherence:92, volumen:18},
];
const revenueData = [
  {name:"Ene", value: 320000},
  {name:"Feb", value: 385000},
  {name:"Mar", value: 420000},
  {name:"Abr", value: 480000},
];
const checkinData = [
  {name:"Completados", value: 24, color:"#D6FF2A"},
  {name:"Pendientes", value: 5, color:"#27272A"},
  {name:"Atrasados", value: 2, color:"#f59e0b"},
];

export function AdherenceChart(){
  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={adherenceData}>
          <XAxis dataKey="name" tick={{fill:"#71717a", fontSize:11}} axisLine={false} tickLine={false} />
          <YAxis hide domain={[60,100]} />
          <Tooltip contentStyle={{background:"#111111", border:"1px solid #27272A", borderRadius:12, color:"#fff"}} />
          <Area type="monotone" dataKey="adherence" stroke="#D6FF2A" fill="#D6FF2A" fillOpacity={0.12} strokeWidth={2.5} dot={{fill:"#D6FF2A", r:3}} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export function RevenueChart(){
  return (
    <div className="h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={revenueData}>
          <XAxis dataKey="name" tick={{fill:"#71717a", fontSize:11}} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{background:"#111111", border:"1px solid #27272A", borderRadius:12}} formatter={(v:number)=>[`$${v.toLocaleString("es-AR")}`,"Ingresos"]} />
          <Bar dataKey="value" radius={[8,8,0,0]} fill="#D6FF2A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function CheckinDonut(){
  return (
    <div className="h-[160px] flex items-center justify-center gap-6">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#27272A" strokeWidth="12" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#D6FF2A" strokeWidth="12" strokeDasharray={`${(24/31)*251} 251`} strokeLinecap="round" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray={`${(2/31)*251} 251`} strokeDashoffset={`-${(24/31)*251}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black">77%</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Completados</span>
        </div>
      </div>
      <div className="space-y-2 text-xs">
        {checkinData.map(d=>(
          <div key={d.name} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background:d.color}} />{d.name} <b className="ml-auto">{d.value}</b></div>
        ))}
      </div>
    </div>
  );
}
