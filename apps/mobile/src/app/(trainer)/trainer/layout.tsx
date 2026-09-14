import { WebSidebar } from "@/components/web-sidebar";
import { OfflineIndicator } from "@/components/offline-indicator";
import { RecentTracker } from "@/components/recent-tracker";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TrainerLayout({children}:{children:React.ReactNode}){
  const s = await getSession();
  if(!s) redirect("/login");
  if(s.role!=="TRAINER") redirect("/client/dashboard");
  return (
    <div className="min-h-screen bg-[#080808]">
      <WebSidebar role="TRAINER" userName={s.name} />
      <OfflineIndicator />
      <div className="">
        <main className="max-w-[1600px] mx-auto w-full px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>
      <RecentTracker role="trainer" />
    </div>
  );
}

