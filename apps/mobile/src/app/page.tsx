import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as jose from "jose";
export default async function Home(){
  const c = await cookies();
  const t = c.get("ec_token")?.value;
  if(!t) redirect("/login");
  try{
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "ezequiel-coaching-super-secret-jwt-32chars!");
    const {payload} = await jose.jwtVerify(t, secret);
    const role = (payload as unknown as {role:string}).role;
    if(role==="TRAINER") redirect("/trainer/dashboard");
    redirect("/client/dashboard");
  }catch{ redirect("/login"); }
}
