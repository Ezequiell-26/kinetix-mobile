import * as jose from "jose";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { getJwtSecret } from "./secret";
import { createSession, revokeSession, revokeAllUserSessions, validateSession } from "./session-store";

const SECRET = getJwtSecret();
const COOKIE_NAME = "ec_token";
const MAX_AGE = 60*60*24*7;

export type JWTPayload = { id:string; email:string; role:"TRAINER"|"CLIENT"; name:string };

export async function hashPassword(p:string){ return bcrypt.hash(p,10); }
export async function verifyPassword(p:string,h:string){ return bcrypt.compare(p,h); }

export async function createToken(payload:JWTPayload){
  return await new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(SECRET);
}

export async function verifyToken(token:string):Promise<JWTPayload|null>{
  try{ const {payload}= await jose.jwtVerify(token, SECRET); return payload as unknown as JWTPayload; }catch{ return null; }
}

/**
 * Crea token JWT + sesión en DB.
 */
export async function createAuthSession(
  payload: JWTPayload,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
  const jwt = await createToken(payload);
  
  // Crear sesión en DB para tracking y revocación
  await createSession(payload.id, userAgent, ipAddress);
  
  return jwt;
}

export async function setAuthCookie(token:string){
  const c = await cookies();
  c.set(COOKIE_NAME, token, { httpOnly:true, secure:false, sameSite:"lax", maxAge:MAX_AGE, path:"/" });
}

export async function clearAuthCookie(){
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

/**
 * Obtiene sesión validando JWT Y sesión en DB.
 */
export async function getSession():Promise<JWTPayload|null>{
  const c = await cookies();
  const t = c.get(COOKIE_NAME)?.value;
  if(!t) return null;
  
  // Primero verificar JWT
  const payload = await verifyToken(t);
  if(!payload) return null;
  
  // Luego verificar sesión en DB (permite revocación server-side)
  const userId = await validateSession(t);
  if(!userId || userId !== payload.id) return null;
  
  return payload;
}

export async function requireRole(roles:("TRAINER"|"CLIENT")[]){
  const s = await getSession();
  if(!s) return null;
  if(!roles.includes(s.role)) return null;
  return s;
}

/**
 * Logout con invalidación server-side de la sesión.
 */
export async function logoutCurrentSession(){
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if(token){
    await revokeSession(token);
  }
  await clearAuthCookie();
}

/**
 * Logout global - invalida TODAS las sesiones del usuario.
 */
export async function logoutAllSessions(userId: string){
  await revokeAllUserSessions(userId);
  await clearAuthCookie();
}
