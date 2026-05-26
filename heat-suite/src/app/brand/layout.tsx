import { AppShell, type NavGroup, type NavItem } from "@/components/AppShell";

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

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      groups={groups}
      bottomNav={bottomNav}
      roleLabel="Portal de Marca"
      userName="Nueva Isapre"
      account="Nueva Isapre — Co…"
      switchHref="/creator"
      switchLabel="Cambiar a creador"
    >
      {children}
    </AppShell>
  );
}
