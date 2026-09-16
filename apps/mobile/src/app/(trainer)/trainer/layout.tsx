import { WebSidebar } from "@/components/web-sidebar";
import { RecentTracker } from "@/components/recent-tracker";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "TRAINER") redirect("/client/dashboard");

  return (
    <>
      <WebSidebar role="TRAINER" userName={session.name}>
        {children}
      </WebSidebar>
      <RecentTracker role="trainer" />
    </>
  );
}
