import { AppShell, type NavItem } from "@/components/AppShell";

const nav: NavItem[] = [
  { label: "Panel", href: "/creator", icon: "📊" },
  { label: "Explorar campañas", href: "/creator/campaigns", icon: "🔎" },
  { label: "Mis postulaciones", href: "/creator/applications", icon: "📨" },
  { label: "Mi perfil", href: "/creator/profile", icon: "👤" },
];

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      nav={nav}
      roleLabel="Portal de Creador"
      userName="Lucía Marín"
      switchHref="/brand"
      switchLabel="Cambiar a marca"
    >
      {children}
    </AppShell>
  );
}
