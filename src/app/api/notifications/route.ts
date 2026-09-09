import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const notifs = await prisma.notification.findMany({where:{userId: s.id}, orderBy:{createdAt:"desc"}, take:20});
  return NextResponse.json(notifs);
}

export async function POST(req: Request){
  const s = await getSession();
  if(!s) return NextResponse.json({error:"No auth"},{status:401});
  const { id } = await req.json();
  if(id){
    await prisma.notification.update({where:{id}, data:{read:true}});
  } else {
    await prisma.notification.updateMany({where:{userId: s.id, read:false}, data:{read:true}});
  }
  return NextResponse.json({ok:true});
}
