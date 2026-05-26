import { AppShell, type NavItem } from "@/components/AppShell";

const nav: NavItem[] = [
  { label: "Panel", href: "/brand", icon: "📊" },
  { label: "Campañas", href: "/brand/campaigns", icon: "🎯" },
  { label: "Creadores", href: "/brand/influencers", icon: "🔍" },
  { label: "Pagos", href: "/brand/billing", icon: "💳" },
];

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      nav={nav}
      roleLabel="Portal de Marca"
      userName="Aurora Studio"
      switchHref="/creator"
      switchLabel="Cambiar a creador"
    >
      {children}
    </AppShell>
  );
}
