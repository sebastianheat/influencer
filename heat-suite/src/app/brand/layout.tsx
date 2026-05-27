import { AppShell, type NavGroup, type NavItem } from "@/components/AppShell";
import { auth } from "@/auth";

const groups: NavGroup[] = [
  {
    label: "General",
    items: [{ label: "Dashboard", href: "/brand", icon: "▦" }],
  },
  {
    label: "Campañas",
    items: [{ label: "Mis campañas", href: "/brand/campaigns", icon: "📣" }],
  },
  {
    label: "Gestión",
    items: [
      { label: "Contenidos", href: "/brand/content", icon: "🎬" },
      { label: "Creadores", href: "/brand/influencers", icon: "✦" },
      { label: "Afiliados", href: "/brand/affiliates", icon: "🛡️" },
      { label: "Chat", href: "/brand/chat", icon: "✉️" },
    ],
  },
];

const bottomNav: NavItem[] = [
  { label: "Configuración", href: "/brand/settings", icon: "⚙️" },
];

export default async function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const name = session?.user?.name ?? "Marca";
  return (
    <AppShell
      groups={groups}
      bottomNav={bottomNav}
      roleLabel="Portal de Marca"
      userName={name}
      account={name}
      switchHref="/creator"
      switchLabel="Cambiar a creador"
    >
      {children}
    </AppShell>
  );
}
