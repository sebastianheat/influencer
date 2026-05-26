"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { Avatar } from "./ui";
import { cn } from "@/lib/cn";

export type NavItem = { label: string; href: string; icon: string };

export function AppShell({
  nav,
  roleLabel,
  userName,
  switchHref,
  switchLabel,
  children,
}: {
  nav: NavItem[];
  roleLabel: string;
  userName: string;
  switchHref: string;
  switchLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <div className="flex min-h-screen bg-page">
      {/* Sidebar */}
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

        <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
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
          })}
        </nav>

        <div className="border-t border-white/[0.08] p-3">
          <Link
            href={switchHref}
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white/55 transition-colors hover:bg-[var(--color-sidebar-hover)] hover:text-white"
          >
            <span className="text-base">🔄</span>
            {switchLabel}
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white/55 transition-colors hover:bg-[var(--color-sidebar-hover)] hover:text-white"
          >
            <span className="text-base">↩︎</span>
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-surface/80 px-5 backdrop-blur-md lg:px-8">
          <button
            className="-ml-1 rounded-lg p-2 text-ink lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <div className="relative hidden flex-1 max-w-md md:block">
            <input
              placeholder="Buscar campañas, creadores…"
              className="h-10 w-full rounded-[10px] border border-line bg-soft pl-10 pr-4 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dim">
              ⌕
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-surface text-soft-ink hover:text-ink">
              🔔
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
            </button>
            <Avatar name={userName} size={36} />
          </div>
        </header>

        <main className="flex-1 px-5 py-7 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
