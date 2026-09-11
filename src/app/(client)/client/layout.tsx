import { ClientChrome } from "@/components/client-chrome";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function ClientLayout({children}:{children:React.ReactNode}){
  const s = await getSession();
  if(!s) redirect("/login");
  if(s.role!=="CLIENT") redirect("/trainer/dashboard");
  return (
    <ClientChrome name={s.name}>
      {children}
    </ClientChrome>
  );
}
