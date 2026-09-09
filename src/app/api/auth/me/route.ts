import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
export async function GET(){
  const s = await getSession();
  if(!s) return NextResponse.json({user:null},{status:401});
  return NextResponse.json({user:s});
}
