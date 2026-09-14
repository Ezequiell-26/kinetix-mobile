import { WebSidebar } from "@/components/web-sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ClientLayout({children}:{children:React.ReactNode}){
  const s = await getSession();
  if(!s) redirect("/login");
  if(s.role!=="CLIENT") redirect("/trainer/dashboard");
  return (
    <div className="min-h-screen bg-[#080808]">
      <WebSidebar role="CLIENT" userName={s.name} />
      <div className="lg:ml-0">
        <main className="max-w-[1600px] mx-auto w-full px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
