import { AppShell, type NavItem } from "@/components/AppShell";
import { auth } from "@/auth";

const nav: NavItem[] = [
  { label: "Inicio", href: "/creator", icon: "🏠" },
  { label: "Explorar", href: "/creator/campaigns", icon: "🧭" },
  { label: "Collabs", href: "/creator/applications", icon: "🤝" },
  { label: "Perfil", href: "/creator/profile", icon: "👤" },
];

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const name = session?.user?.name ?? "Creador";
  return (
    <AppShell
      nav={nav}
      roleLabel="Portal de Creador"
      userName={name}
      account={name}
      switchHref="/brand"
      switchLabel="Cambiar a marca"
    >
      {children}
    </AppShell>
  );
}

