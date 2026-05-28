"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui";
import { ChatPanel } from "@/components/ChatPanel";
import { cn } from "@/lib/cn";
import type { ChatConvo } from "@/lib/queries";

function shortDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
}

export function ChatList({ convos, emptyLabel }: { convos: ChatConvo[]; emptyLabel: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filtered = convos.filter((c) =>
    `${c.peerName} ${c.campaignTitle}`.toLowerCase().includes(q.toLowerCase()),
  );
  const active = convos.find((c) => c.applicationId === activeId) ?? null;

  return (
    <div className="flex h-[calc(100vh-9rem)] overflow-hidden rounded-[16px] border border-line bg-surface shadow-[var(--shadow-soft)]">
      {/* Lista */}
      <div className="flex w-full flex-col border-r border-line sm:w-80">
        <div className="border-b border-line p-4">
          <h1 className="text-lg font-extrabold text-ink">Mensajes</h1>
          <div className="relative mt-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar"
              className="h-10 w-full rounded-[10px] border border-line bg-soft pl-9 pr-3 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim">
              ⌕
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-dim">{emptyLabel}</p>
          )}
          {filtered.map((c) => (
            <button
              key={c.applicationId}
              onClick={() => setActiveId(c.applicationId)}
              className={cn(
                "flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors",
                c.applicationId === activeId ? "bg-accent-soft" : "hover:bg-soft",
              )}
            >
              <Avatar name={c.peerName} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-ink">{c.peerName}</p>
                  <span className="shrink-0 text-[11px] text-dim">{shortDate(c.lastAt)}</span>
                </div>
                <p className="truncate text-xs text-dim">{c.campaignTitle}</p>
                <p className="mt-0.5 truncate text-xs text-soft-ink">
                  {c.lastBody ?? "—"}
                </p>
              </div>
              {c.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <div className="hidden min-w-0 flex-1 flex-col sm:flex">
        {!active ? (
          <div className="flex flex-1 flex-col items-center justify-center bg-soft text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-accent-soft text-4xl text-accent">
              💬
            </div>
            <p className="mt-4 text-lg font-bold text-ink">Selecciona una conversación</p>
            <p className="mt-1 max-w-xs text-sm text-soft-ink">
              Elige un chat de la lista para leer o responder mensajes.
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col p-4">
            <ChatPanel applicationId={active.applicationId} peerName={active.peerName} />
          </div>
        )}
      </div>
    </div>
  );
}
