import * as jose from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
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
 * Crea el JWT y registra la sesión en DB: permite revocación server-side
 * (logout real, logout global) en lugar de confiar solo en la firma del token.
 */
export async function createAuthSession(
  payload: JWTPayload,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
  const jwt = await createToken(payload);
  await createSession(payload.id, jwt, userAgent, ipAddress);
  return jwt;
}

export async function setAuthCookie(token:string){
  const c = await cookies();
  // secure solo en producción HTTPS: con secure:true en http://localhost el
  // navegador descarta la cookie y el login "funciona" pero nunca hay sesión.
  const isProd = process.env.NODE_ENV === "production";
  c.set(COOKIE_NAME, token, { httpOnly:true, secure:isProd, sameSite:"lax", maxAge:MAX_AGE, path:"/" });
}
export async function clearAuthCookie(){
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
export async function getSession():Promise<JWTPayload|null>{
  const c = await cookies();
  const t = c.get(COOKIE_NAME)?.value;
  if(!t) return null;

  // 1) Firma y expiración del JWT.
  const payload = await verifyToken(t);
  if(!payload) return null;

  // 2) La sesión debe existir en DB, no revocada y no expirada.
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
 * Logout: revoca la sesión actual en DB (además de limpiar la cookie, que
 * hace el route handler).
 */
export async function logoutCurrentSession(){
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if(token){
    await revokeSession(token);
  }
}

/**
 * Logout global: revoca TODAS las sesiones del usuario ("cerrar sesión en
 * todos los dispositivos").
 */
export async function logoutAllSessions(userId: string){
  return revokeAllUserSessions(userId);
}

/**
 * getCurrentUser - Helper para obtener el usuario actual desde una request de API
 * Retorna null si no hay sesión válida
 */
export async function getCurrentUser() {
  return getSession();
}
