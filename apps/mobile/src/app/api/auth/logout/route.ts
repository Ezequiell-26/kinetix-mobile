import { NextResponse } from "next/server";
import { clearAuthCookie, logoutCurrentSession, getSession, logoutAllSessions } from "@/lib/auth";

/**
 * Logout: invalida la sesión en DB y limpia la cookie.
 */
export async function POST(){
  await logoutCurrentSession();
  await clearAuthCookie();
  return NextResponse.json({ok:true});
}

/**
 * Logout global: invalida TODAS las sesiones del usuario.
 */
export async function DELETE(){
  const session = await getSession();
  if(!session) {
    return NextResponse.json({error:"No autenticado"}, {status:401});
  }
  await logoutAllSessions(session.id);
  await clearAuthCookie();
  return NextResponse.json({ok:true});
}
