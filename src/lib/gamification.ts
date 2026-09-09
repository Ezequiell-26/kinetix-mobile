export type Badge = { id:string; name:string; icon:string; earned:boolean; desc:string };
export const badges: Badge[] = [
  {id:"streak7", name:"Racha 7", icon:"\uD83D\uDD25", earned:true, desc:"7 días seguidos"},
  {id:"streak30", name:"Racha 30", icon:"\u2B50", earned:false, desc:"30 días"},
  {id:"pr", name:"Nuevo PR", icon:"\uD83C\uDFC6", earned:true, desc:"Récord en press banca"},
  {id:"checkin", name:"Check-in Pro", icon:"\u2705", earned:true, desc:"8/8 check-ins"},
  {id:"volume", name:"Volumen", icon:"\uD83D\uDCAA", earned:true, desc:"10t en una semana"},
];

export function getStreak(days:number){
  if(days>=30) return {label:"Leyenda", color:"text-[#D6FF2A]"};
  if(days>=14) return {label:"Imparable", color:"text-emerald-400"};
  if(days>=7) return {label:"En racha", color:"text-amber-400"};
  return {label:"Comenzando", color:"text-zinc-500"};
}
