import { AppShell, type NavItem } from "@/components/AppShell";

const nav: NavItem[] = [
  { label: "Inicio", href: "/creator", icon: "🏠" },
  { label: "Explorar", href: "/creator/campaigns", icon: "🧭" },
  { label: "Collabs", href: "/creator/applications", icon: "🤝" },
  { label: "Perfil", href: "/creator/profile", icon: "👤" },
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
