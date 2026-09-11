import * as jose from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getJwtSecret } from "./secret";

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

export async function setAuthCookie(token:string){
  const c = await cookies();
  c.set(COOKIE_NAME, token, { httpOnly:true, secure:false, sameSite:"lax", maxAge:MAX_AGE, path:"/" });
}
export async function clearAuthCookie(){
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
export async function getSession():Promise<JWTPayload|null>{
  const c = await cookies();
  const t = c.get(COOKIE_NAME)?.value;
  if(!t) return null;
  return verifyToken(t);
}
export async function requireRole(roles:("TRAINER"|"CLIENT")[]){
  const s = await getSession();
  if(!s) return null;
  if(!roles.includes(s.role)) return null;
  return s;
}
