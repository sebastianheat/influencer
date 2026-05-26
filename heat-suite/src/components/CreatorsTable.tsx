"use client";

import { useState } from "react";
import { Avatar } from "./ui";
import { CreatorModal } from "./CreatorModal";
import type { Influencer } from "@/lib/types";
import { socialCount } from "@/lib/format";
import { cn } from "@/lib/cn";

function CountPill({ value }: { value: string }) {
  return (
    <span className="inline-flex min-w-[44px] items-center justify-center rounded-md border border-line bg-soft px-2 py-1 text-xs font-semibold text-ink">
      {value}
    </span>
  );
}

function NicheCell({ niches }: { niches: string[] }) {
  if (niches.length === 0) return <span className="text-dim">-</span>;
  return (
    <span className="inline-flex items-center gap-1">
      <span className="rounded-md bg-card px-2 py-1 text-xs font-semibold text-muted">
        {niches[0]}
      </span>
      {niches.length > 1 && (
        <span className="text-xs font-bold text-soft-ink">
          +{niches.length - 1}
        </span>
      )}
    </span>
  );
}

export function CreatorsTable({ creators }: { creators: Influencer[] }) {
  const [tab, setTab] = useState<"all" | "fav">("all");
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Influencer | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const toggleFav = (id: string) =>
    setFavs((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const list = creators.filter((c) => {
    const okTab = tab === "all" || favs.has(c.id);
    const okQ =
      q === "" ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.handle.toLowerCase().includes(q.toLowerCase());
    return okTab && okQ;
  });

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Creadores
        </h1>
        <button className="text-sm font-semibold text-accent hover:underline">
          Filtrar
        </button>
      </div>

      <div className="relative mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar"
          className="h-12 w-full rounded-[12px] border border-line bg-surface pl-11 pr-4 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
        />
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dim">
          ⌕
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("all")}
            className={cn(
              "flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-sm font-semibold transition-colors",
              tab === "all" ? "bg-card text-ink" : "text-soft-ink hover:bg-soft",
            )}
          >
            Todos
            <span className="rounded-full bg-surface px-1.5 py-0.5 text-[11px] text-dim">
              +8000
            </span>
          </button>
          <button
            onClick={() => setTab("fav")}
            className={cn(
              "flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-sm font-semibold transition-colors",
              tab === "fav" ? "bg-card text-ink" : "text-soft-ink hover:bg-soft",
            )}
          >
            Favoritos
            <span className="rounded-full bg-surface px-1.5 py-0.5 text-[11px] text-dim">
              {favs.size}
            </span>
          </button>
        </div>
        <button className="cursor-not-allowed rounded-[10px] border border-line bg-soft px-4 py-2 text-sm font-semibold text-dim">
          Acción ▾
        </button>
      </div>

      <div className="overflow-x-auto rounded-[14px] border border-line bg-surface shadow-[var(--shadow-soft)]">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-soft-ink">
              <th className="w-10 px-4 py-3"></th>
              <th className="px-3 py-3">Nombre</th>
              <th className="px-3 py-3">Edad</th>
              <th className="px-3 py-3">Región</th>
              <th className="px-3 py-3">Comuna</th>
              <th className="px-3 py-3">Instagram</th>
              <th className="px-3 py-3">TikTok</th>
              <th className="px-3 py-3">Nichos</th>
              <th className="px-3 py-3">Reviews</th>
              <th className="px-3 py-3">Favorito</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((c) => (
              <tr
                key={c.id}
                onClick={() => setOpen(c)}
                className="cursor-pointer hover:bg-soft"
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="accent-[var(--color-accent)]" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} size={36} />
                    <span className="font-semibold text-ink">{c.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-soft-ink">{c.age ?? "-"}</td>
                <td className="px-3 py-3 text-soft-ink">{c.region ?? "-"}</td>
                <td className="px-3 py-3 text-soft-ink">{c.comuna ?? "-"}</td>
                <td className="px-3 py-3">
                  {c.igFollowers !== null ? (
                    <CountPill value={socialCount(c.igFollowers)} />
                  ) : (
                    <CountPill value="-" />
                  )}
                </td>
                <td className="px-3 py-3">
                  {c.ttFollowers !== null ? (
                    <CountPill value={socialCount(c.ttFollowers)} />
                  ) : (
                    <CountPill value="-" />
                  )}
                </td>
                <td className="px-3 py-3">
                  <NicheCell niches={c.niche} />
                </td>
                <td className="px-3 py-3">
                  {c.reviewScore ? (
                    <span className="rounded-md bg-success-bg px-2 py-1 text-xs font-bold text-success">
                      {c.reviewScore.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-dim">-</span>
                  )}
                </td>
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleFav(c.id)}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                      favs.has(c.id)
                        ? "bg-accent text-white"
                        : "text-dim hover:bg-card hover:text-ink",
                    )}
                    title={favs.has(c.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                  >
                    {favs.has(c.id) ? "★" : "✕"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <p className="py-12 text-center text-sm text-soft-ink">
            No hay creadores que coincidan.
          </p>
        )}
      </div>

      {open && (
        <CreatorModal
          creator={open}
          onClose={() => setOpen(null)}
          onAction={(kind) => {
            if (kind === "favorite") {
              toggleFav(open.id);
              showToast(`${open.name} añadido a favoritos`);
            } else if (kind === "shortlist") {
              showToast(`${open.name} preseleccionado`);
            } else {
              showToast(`Mensaje a ${open.name} (demo)`);
            }
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-[12px] bg-ink px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-card)]">
          {toast}
        </div>
      )}
    </>
  );
}
