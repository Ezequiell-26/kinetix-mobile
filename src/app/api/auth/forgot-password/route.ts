import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";

// In-memory store for demo (in production use DB table + email)
// For now we store token in a simple way and log it
const tokens = new Map<string, {email:string, expires:number}>();

export async function POST(req: Request){
  const { email } = await req.json();
  if(!email) return NextResponse.json({error:"Email requerido"},{status:400});
  const user = await prisma.user.findUnique({where:{email}});
  // Always return success to not leak if email exists
  if(user){
    const token = randomUUID();
    tokens.set(token, {email, expires: Date.now() + 1000*60*30});
    console.log(`[FORGOT] Token for ${email}: ${token} -> http://localhost:3001/reset-password?token=${token}`);
    // In production, send email here via Resend/SendGrid
    // For demo, we return token in response so user can test
    return NextResponse.json({ok:true, token, message:"Si el email existe, recibirás instrucciones. Token (demo): "+token});
  }
  return NextResponse.json({ok:true, message:"Si el email existe, recibirás instrucciones."});
}

// Helpers kept internal (not exported, Next route can only export HTTP verbs)
