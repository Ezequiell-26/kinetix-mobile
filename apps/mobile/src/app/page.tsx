import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

// La verificación usa getJwtSecret() (fail-closed en producción).
// Antes había un fallback hardcodeado al secreto de dev que puenteaba
// esa protección si JWT_SECRET no estaba definido.
export default async function Home(){
  const s = await getSession();
  if(!s) redirect("/login");
  if(s.role==="TRAINER") redirect("/trainer/dashboard");
  redirect("/client/dashboard");
}
