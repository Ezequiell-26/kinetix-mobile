import { WebSidebar } from "@/components/web-sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OfflineIndicator } from "@/components/offline-indicator";

export default async function ClientLayout({children}:{children:React.ReactNode}){
  const s = await getSession();
  if(!s) redirect("/login");
  if(s.role!=="CLIENT") redirect("/trainer/dashboard");
  return (
    <div className="flex min-h-screen bg-[#080808]">
      {/* Sidebar fijo a la izquierda */}
      <WebSidebar role="CLIENT" userName={s.name} />
      
      {/* Área principal de contenido a la derecha del sidebar */}
      <div className="flex-1 flex flex-col min-w-0">
        <OfflineIndicator />
        <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
