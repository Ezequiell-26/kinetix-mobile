import { NextResponse } from "next/server";

// Versión pública mínima: sin execSync por request y sin exponer rama/hash de git.
export async function GET(){
  return NextResponse.json({ version: "1.0.0" });
}
