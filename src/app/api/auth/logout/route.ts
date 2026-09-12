import { NextResponse } from "next/server";
import { logoutCurrentSession, getSession } from "@/lib/auth";

/**
 * Logout con invalidación server-side de la sesión.
 */
export async function POST(){
  // Invalidar sesión en DB antes de borrar cookie
  await logoutCurrentSession();
  return NextResponse.json({ok:true});
}

/**
 * Logout global - invalida TODAS las sesiones del usuario actual.
 * Útil para "cerrar sesión en todos los dispositivos".
 */
export async function DELETE(){
  const session = await getSession();
  if(!session) {
    return NextResponse.json({error:"No autenticado"}, {status:401});
  }
  
  // Invalidar todas las sesiones del usuario
  const { logoutAllSessions } = await import("@/lib/auth");
  await logoutAllSessions(session.id);
  
  return NextResponse.json({ok:true});
}
