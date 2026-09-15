import { WebSidebar } from "@/components/web-sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "CLIENT") redirect("/trainer/dashboard");

  return (
    <WebSidebar role="CLIENT" userName={session.name}>
      {children}
    </WebSidebar>
  );
}
