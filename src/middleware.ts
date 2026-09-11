import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { getJwtSecret } from "@/lib/secret";

const SECRET = getJwtSecret();

export async function middleware(req: NextRequest){
  const path = req.nextUrl.pathname;
  const isTrainer = path.startsWith("/trainer");
  const isClient = path.startsWith("/client");
  if(!isTrainer && !isClient) return NextResponse.next();

  const token = req.cookies.get("ec_token")?.value;
  if(!token){
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try{
    const {payload} = await jose.jwtVerify(token, SECRET);
    const role = (payload as unknown as {role:string}).role;
    if(isTrainer && role!=="TRAINER") return NextResponse.redirect(new URL("/client/dashboard", req.url));
    if(isClient && role!=="CLIENT") return NextResponse.redirect(new URL("/trainer/dashboard", req.url));
    return NextResponse.next();
  }catch{
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = { matcher: ["/trainer/:path*", "/client/:path*"] };
