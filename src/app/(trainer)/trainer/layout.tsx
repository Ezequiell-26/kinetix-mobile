import { TrainerNav, TrainerBottomNav } from "@/components/trainer-nav";
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
      <TrainerNav />
      <OfflineIndicator />
      <div className="flex max-w-[1200px] mx-auto w-full">
        {/* Spacer matches the width of the sticky sidebar inside TrainerNav */}
        <div className="hidden lg:block w-[240px] shrink-0" aria-hidden="true" />
        <main className="flex-1 min-w-0 px-4 lg:px-8 py-6 pb-24 lg:pb-8 w-full">
          {children}
        </main>
      </div>
      <TrainerBottomNav />
      <RecentTracker role="trainer" />
    </div>
  );
}

