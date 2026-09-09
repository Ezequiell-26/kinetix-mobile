import { ClientBottomNav, ClientTopBar } from "@/components/client-nav";
import { OfflineIndicator } from "@/components/offline-indicator";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function ClientLayout({children}:{children:React.ReactNode}){
  const s = await getSession();
  if(!s) redirect("/login");
  if(s.role!=="CLIENT") redirect("/trainer/dashboard");
  return (
    <div className="min-h-screen bg-[#080808]">
      <ClientTopBar name={s.name} />
      <OfflineIndicator />
      <main className="max-w-[640px] mx-auto w-full px-4 py-6 pb-24">
        {children}
      </main>
      <ClientBottomNav />
      <WhatsappFloat />
    </div>
  );
}
