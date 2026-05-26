import { AppShell, type NavItem } from "@/components/AppShell";

const nav: NavItem[] = [
  { label: "Panel", href: "/admin", icon: "📊" },
  { label: "Usuarios", href: "/admin/users", icon: "👥" },
  { label: "Campañas", href: "/admin/campaigns", icon: "🎯" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      nav={nav}
      roleLabel="Heat Suite · Admin"
      userName="Equipo Heat"
      switchHref="/brand"
      switchLabel="Ir a portal de marca"
    >
      {children}
    </AppShell>
  );
}
