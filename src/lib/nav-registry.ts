import type { Role } from "@prisma/client";

export interface NavEntry {
  label: string;
  href: string;
  icon?: string;
  roles: Role[];
  category?: string;
  keywords?: string[];
}

export const navForRole: Record<Role, NavEntry[]> = {
  CLIENT: [
    { label: "Dashboard", href: "/client/dashboard", icon: "LayoutDashboard", roles: ["CLIENT"], keywords: ["inicio", "home"] },
    { label: "Workouts", href: "/client/workouts", icon: "Dumbbell", roles: ["CLIENT"], keywords: ["entrenamientos", "rutinas"] },
    { label: "Nutrición", href: "/client/nutrition", icon: "Apple", roles: ["CLIENT"], keywords: ["dieta", "comida", "alimentación"] },
    { label: "Progreso", href: "/client/progress", icon: "TrendingUp", roles: ["CLIENT"], keywords: ["métricas", "estadísticas"] },
    { label: "Mensajes", href: "/client/messages", icon: "MessageSquare", roles: ["CLIENT"], keywords: ["chat", "conversación"] },
    { label: "Check-ins", href: "/client/checkins", icon: "ClipboardCheck", roles: ["CLIENT"], keywords: ["formulario", "seguimiento"] },
  ],
  TRAINER: [
    { label: "Dashboard", href: "/trainer/dashboard", icon: "LayoutDashboard", roles: ["TRAINER"], keywords: ["inicio", "home", "resumen"] },
    { label: "Clientes", href: "/trainer/clients", icon: "Users", roles: ["TRAINER"], keywords: ["atletas", "alumnos"] },
    { label: "Programas", href: "/trainer/programs", icon: "FileText", roles: ["TRAINER"], keywords: ["rutinas", "planes"] },
    { label: "Mensajes", href: "/trainer/messages", icon: "MessageSquare", roles: ["TRAINER"], keywords: ["chat", "conversación"] },
    { label: "Analytics", href: "/trainer/analytics", icon: "BarChart3", roles: ["TRAINER"], keywords: ["estadísticas", "métricas", "ingresos"] },
    { label: "Configuración", href: "/trainer/settings", icon: "Settings", roles: ["TRAINER"], keywords: ["ajustes", "perfil"] },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard", roles: ["ADMIN"], keywords: ["inicio", "home"] },
    { label: "Usuarios", href: "/admin/users", icon: "Users", roles: ["ADMIN"], keywords: ["clientes", "trainers"] },
    { label: "Sistema", href: "/admin/system", icon: "Settings", roles: ["ADMIN"], keywords: ["configuración", "administración"] },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart3", roles: ["ADMIN"], keywords: ["métricas", "reportes"] },
  ],
};

export function getAllNavEntries(): NavEntry[] {
  return Object.values(navForRole).flat();
}

export function getNavForRole(role: Role): NavEntry[] {
  return navForRole[role] || [];
}

export function searchNav(query: string, role: Role): NavEntry[] {
  const entries = getNavForRole(role);
  const q = query.toLowerCase().trim();
  if (!q) return entries;
  
  return entries.filter(entry => {
    const labelMatch = entry.label.toLowerCase().includes(q);
    const keywordMatch = entry.keywords?.some(k => k.toLowerCase().includes(q)) ?? false;
    const hrefMatch = entry.href.toLowerCase().includes(q);
    return labelMatch || keywordMatch || hrefMatch;
  });
}
