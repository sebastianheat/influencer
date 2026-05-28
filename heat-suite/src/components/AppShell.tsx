"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { SupportChatWidget } from "./SupportChatWidget";
import { Avatar } from "./ui";
import { cn } from "@/lib/cn";
import { logout } from "@/lib/auth-actions";

export type NavItem = { label: string; href: string; icon: string };
export type NavGroup = { label?: string; items: NavItem[] };

export function AppShell({
  nav,
  groups,
  bottomNav,
  roleLabel,
  userName,
  account,
  switchHref,
  switchLabel,
  children,
}: {
  nav?: NavItem[];
  groups?: NavGroup[];
  bottomNav?: NavItem[];
  roleLabel: string;
  userName: string;
  account?: string;
  switchHref: string;
  switchLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);

  const sections: NavGroup[] = groups ?? [{ items: nav ?? [] }];
  const flatItems = sections.flatMap((g) => g.items);

  const allHrefs = [
    ...sections.flatMap((g) => g.items.map((i) => i.href)),
    ...(bottomNav?.map((i) => i.href) ?? []),
  ];
  const matches = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");
  const activeHref = allHrefs
    .filter(matches)
    .sort((a, b) => b.length - a.length)[0];
  const isActive = (href: string) => href === activeHref;

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold transition-colors",
          active
            ? "bg-[var(--color-sidebar-active)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            : "text-white/55 hover:bg-[var(--color-sidebar-hover)] hover:text-white",
        )}
      >
        <span className="text-base">{item.icon}</span>
        {item.label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-page">
      <aside
        className={cn(
          "thin-scroll fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col bg-sidebar transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="px-5 pb-2 pt-6">
          <Logo />
        </div>
        <div className="mx-5 mt-5 rounded-[10px] bg-white/[0.04] px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
            {roleLabel}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-white">
            {userName}
          </p>
        </div>

        <nav className="mt-4 flex-1 space-y-4 overflow-y-auto px-3">
          {sections.map((group, gi) => (
            <div key={gi} className="space-y-0.5">
              {group.label && (
                <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.08] p-3">
          {bottomNav?.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
          <Link
            href={switchHref}
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white/55 transition-colors hover:bg-[var(--color-sidebar-hover)] hover:text-white"
          >
            <span className="text-base">🔄</span>
            {switchLabel}
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm font-semibold text-white/55 transition-colors hover:bg-[var(--color-sidebar-hover)] hover:text-white"
            >
              <span className="text-base">↩︎</span>
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-surface/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              className="-ml-1 rounded-lg p-2 text-ink"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <Logo variant="dark" className="h-7 md:hidden" />
          </div>
          <div className="relative hidden flex-1 max-w-md md:block">
            <input
              placeholder="Buscar campañas, creadores…"
              className="h-10 w-full rounded-[10px] border border-line bg-soft pl-10 pr-4 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dim">
              ⌕
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setAcctOpen(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-surface text-soft-ink hover:text-ink"
                aria-label="Notificaciones"
              >
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-[14px] border border-line bg-surface shadow-[var(--shadow-card)]">
                  <p className="border-b border-line px-4 py-3 text-sm font-bold text-ink">
                    Notificaciones
                  </p>
                  <div className="divide-y divide-line">
                    {[
                      { t: "Nueva postulación recibida", s: "Hace 2 h" },
                      { t: "Tu campaña fue publicada", s: "Hoy" },
                      { t: "Conexión verificada", s: "Ayer" },
                    ].map((n) => (
                      <div key={n.t} className="px-4 py-3 hover:bg-soft">
                        <p className="text-sm font-medium text-ink">{n.t}</p>
                        <p className="text-xs text-dim">{n.s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Account */}
            <div className="relative">
              <button
                onClick={() => {
                  setAcctOpen((v) => !v);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 rounded-[10px] border border-line bg-surface px-2 py-2 text-sm font-semibold text-ink hover:border-line-strong sm:px-3"
              >
                <Avatar name={account ?? userName} size={24} />
                <span className="hidden max-w-[140px] truncate sm:block">
                  {account ?? userName}
                </span>
                <span className="text-dim">▾</span>
              </button>
              {acctOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-[14px] border border-line bg-surface shadow-[var(--shadow-card)]">
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-bold text-ink">{userName}</p>
                    <p className="text-xs text-dim">{roleLabel}</p>
                  </div>
                  <Link
                    href={switchHref}
                    onClick={() => setAcctOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-ink hover:bg-soft"
                  >
                    🔄 {switchLabel}
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-danger hover:bg-soft"
                    >
                      ↩︎ Cerrar sesión
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>

        {(notifOpen || acctOpen) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setNotifOpen(false);
              setAcctOpen(false);
            }}
          />
        )}

        <main className="flex-1 px-4 py-6 pb-24 sm:px-5 sm:py-7 lg:px-8 lg:pb-7">
          {children}
        </main>
      </div>

      {/* AI support chat (floating bottom-right, always available) */}
      <SupportChatWidget />

      {/* Mobile bottom nav (app-style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-line bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        {flatItems.slice(0, 5).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors",
                active ? "text-accent" : "text-soft-ink",
              )}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
