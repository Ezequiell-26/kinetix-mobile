"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { navForRole } from "@/lib/nav-registry";
import { useSessionUserKey, useUserPrefs } from "@/lib/user-prefs";

/**
 * Registra destinos recientes por usuario cada vez que la ruta coincide con
 * una entrada canónica del registro. Se monta una vez por layout.
 */
export function RecentTracker({ role }: { role: "client" | "trainer" }) {
  const pathname = usePathname();
  const userKey = useSessionUserKey();
  const { pushRecent } = useUserPrefs(userKey);

  useEffect(() => {
    if (!pathname || !userKey) return;
    const entry = navForRole(role).find(n =>
      pathname === n.href.split("?")[0] || pathname.startsWith(n.href.split("?")[0] + "/")
    );
    if (entry) pushRecent({ href: entry.href, label: entry.label });
    // pushRecent estable vía useCallback; pathname/userKey son las deps reales
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, userKey, role]);

  return null;
}
