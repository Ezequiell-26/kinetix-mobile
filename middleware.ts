import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

/**
 * Middleware de autenticación y autorización.
 * 
 * Seguridad:
 * - Usa JWT_SECRET desde env (fail-closed en producción)
 * - Verifica token y rol antes de permitir acceso
 * - Redirects apropiados según rol
 */
const SECRET = process.env.JWT_SECRET 
  ? new TextEncoder().encode(process.env.JWT_SECRET)
  : process.env.NODE_ENV === "production"
    ? (() => { throw new Error("JWT_SECRET requerido en producción"); })()
    : new TextEncoder().encode("ezequiel-coaching-super-secret-jwt-32chars!");

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
    
    if(isTrainer && role!=="TRAINER") {
      return NextResponse.redirect(new URL("/client/dashboard", req.url));
    }
    if(isClient && role!=="CLIENT") {
      return NextResponse.redirect(new URL("/trainer/dashboard", req.url));
    }
    
    return NextResponse.next();
  }catch{
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = { matcher: ["/trainer/:path*", "/client/:path*"] };
