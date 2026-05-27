import { AppShell, type NavItem } from "@/components/AppShell";
import { auth } from "@/auth";

const nav: NavItem[] = [
  { label: "Panel", href: "/admin", icon: "📊" },
  { label: "Usuarios", href: "/admin/users", icon: "👥" },
  { label: "Campañas", href: "/admin/campaigns", icon: "🎯" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const name = session?.user?.name ?? "Equipo Heat";
  return (
    <AppShell
      nav={nav}
      roleLabel="Heat Suite · Admin"
      userName={name}
      account={name}
      switchHref="/brand"
      switchLabel="Ir a portal de marca"
    >
      {children}
    </AppShell>
  );
}
