"use client";
import { usePathname } from "next/navigation";
import { ClientBottomNav, ClientTopBar } from "@/components/client-nav";
import { OfflineIndicator } from "@/components/offline-indicator";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { RecentTracker } from "@/components/recent-tracker";

/** En /messages el chat toma toda la pantalla (estilo WhatsApp): sin topbar, sin tabs, sin floats. */
export function ClientChrome({ name, children }: { name?: string | null; children: React.ReactNode }) {
  const path = usePathname();
  const fullScreen = path?.startsWith("/client/messages");
  if (fullScreen) {
    return <div className="h-dvh bg-[#080808] flex flex-col overflow-hidden">{children}</div>;
  }
  return (
    <div className="min-h-screen bg-[#080808]">
      <ClientTopBar name={name ?? undefined} />
      <OfflineIndicator />
      <main className="max-w-[640px] lg:max-w-[1100px] mx-auto w-full px-4 lg:px-8 py-6 pb-24 lg:pb-12">
        {children}
      </main>
      <ClientBottomNav />
      <WhatsappFloat />
      <RecentTracker role="client" />
    </div>
  );
}
