"use client";

import { useEffect, useState } from "react";
import { Avatar } from "./ui";
import type { Influencer } from "@/lib/types";
import { cn } from "@/lib/cn";
import { socialCount } from "@/lib/format";

const tabs = [
  { key: "instagram", label: "Instagram", arrow: true },
  { key: "tiktok", label: "TikTok", arrow: true },
  { key: "nichos", label: "Nichos", arrow: false },
  { key: "reviews", label: "Reviews", arrow: false },
  { key: "activity", label: "Actividad con tu marca", arrow: false },
] as const;

function ScoreBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 text-[11px] font-bold text-success">
      {label} ⓘ
    </span>
  );
}

function AudienceBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-bold text-ink">{pct} %</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-card">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#5BA9FF,#8B5CF6)",
          }}
        />
      </div>
    </div>
  );
}

export function CreatorModal({
  creator,
  onClose,
  onAction,
}: {
  creator: Influencer;
  onClose: () => void;
  onAction: (kind: "shortlist" | "favorite" | "message") => void;
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("instagram");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-[20px] bg-surface shadow-[var(--shadow-card)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: tabs + manage */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-1 transition-colors",
                  tab === t.key
                    ? "text-accent"
                    : "text-soft-ink hover:text-ink",
                )}
              >
                {t.arrow && <span className="text-xs">↗</span>}
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                className="heat-gradient-blue flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-sm font-semibold text-white"
              >
                Gestionar ▾
              </button>
              {menu && (
                <div className="absolute right-0 z-10 mt-2 w-52 overflow-hidden rounded-[12px] border border-line bg-surface py-1 shadow-[var(--shadow-card)]">
                  {[
                    { k: "shortlist", label: "Preseleccionar" },
                    { k: "favorite", label: "Agregar a favoritos" },
                    { k: "message", label: "Enviar mensaje" },
                  ].map((o) => (
                    <button
                      key={o.k}
                      onClick={() => {
                        onAction(o.k as never);
                        setMenu(false);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-ink hover:bg-soft"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-soft-ink hover:bg-card hover:text-ink"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-5 lg:col-span-2">
            {tab === "instagram" || tab === "tiktok" ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[14px] border border-line p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-ink">Engagement ⓘ</p>
                      <span className="rounded-lg border border-line px-2 py-1 text-xs text-soft-ink">
                        30 días 📅
                      </span>
                    </div>
                    <p className="mt-4 text-xs text-soft-ink">Promedio</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-ink">
                        {creator.engagement.toLocaleString("es-ES")} %
                      </span>
                      <ScoreBadge label="Excelente" />
                    </div>
                  </div>
                  <div className="rounded-[14px] border border-line p-5">
                    <p className="font-bold text-ink">Alcance ⓘ</p>
                    <p className="mt-4 text-xs text-soft-ink">Promedio</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-ink">
                        {creator.reach.toLocaleString("es-ES")}
                      </span>
                      <ScoreBadge label="Excelente" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[14px] border border-line p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-ink">Audiencia</p>
                    <span className="rounded-lg border border-line px-2 py-1 text-xs text-soft-ink">
                      Género ▾
                    </span>
                  </div>
                  <div className="mt-4 space-y-4">
                    <AudienceBar label="Masculino" pct={creator.audience.male} />
                    <AudienceBar label="Femenino" pct={creator.audience.female} />
                    <AudienceBar
                      label="No especificado"
                      pct={creator.audience.other}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-3 font-bold text-ink">
                    Top posts en {tab === "instagram" ? "Instagram" : "TikTok"}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {creator.topPosts.slice(0, 6).map((p, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-[12px] border border-line"
                      >
                        <div className={`h-28 ${p.cover}`} />
                        <div className="p-2.5">
                          <p className="line-clamp-2 text-xs font-medium text-ink">
                            {p.caption}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-[11px] text-soft-ink">
                            <span>♥ {socialCount(p.likes)}</span>
                            <span>💬 {socialCount(p.comments)}</span>
                            <span>➤ {socialCount(p.shares)}</span>
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-1 rounded-md bg-soft p-1.5 text-center text-[10px] text-dim">
                            <div>
                              <p className="font-bold text-ink">
                                {socialCount(p.reach)}
                              </p>
                              Alcance
                            </div>
                            <div>
                              <p className="font-bold text-ink">
                                {socialCount(p.views)}
                              </p>
                              Views
                            </div>
                            <div>
                              <p className="font-bold text-ink">{p.engagement}%</p>
                              Eng.
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : tab === "nichos" ? (
              <div className="rounded-[14px] border border-line p-5">
                <p className="font-bold text-ink">Nichos de contenido</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {creator.niche.map((n) => (
                    <span
                      key={n}
                      className="rounded-full bg-card px-3 py-1.5 text-sm font-semibold text-muted"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            ) : tab === "reviews" ? (
              <div className="rounded-[14px] border border-line p-5">
                <p className="font-bold text-ink">Reviews de marcas</p>
                {creator.reviewScore ? (
                  <p className="mt-3 text-3xl font-extrabold text-ink">
                    {creator.reviewScore.toFixed(2)}{" "}
                    <span className="text-base font-semibold text-soft-ink">
                      / 5
                    </span>
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-soft-ink">
                    Este creador aún no tiene reviews.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-[14px] border border-line p-5 text-sm text-soft-ink">
                Aún no hay actividad de este creador con tu marca.
              </div>
            )}
          </div>

          {/* Sidebar profile */}
          <div className="space-y-4">
            <div className="rounded-[14px] border border-line p-5 text-center">
              <div className="mx-auto w-fit">
                <Avatar name={creator.name} size={88} />
              </div>
              <p className="mt-3 text-lg font-extrabold text-ink">
                {creator.name}
              </p>
              {creator.reviewScore ? (
                <p className="text-sm font-semibold text-warning">
                  {creator.reviewScore} de 5 ★
                </p>
              ) : (
                <p className="text-sm text-dim">Sin reviews</p>
              )}
              <p className="mt-3 text-left text-sm leading-relaxed text-muted">
                {creator.bio}
              </p>
              <div className="mt-4 space-y-2">
                {creator.igFollowers !== null && (
                  <div className="flex items-center justify-between rounded-[10px] bg-soft px-3 py-2 text-sm">
                    <span className="font-semibold text-ink">Instagram</span>
                    <span className="font-bold text-accent">
                      {socialCount(creator.igFollowers)} ↗
                    </span>
                  </div>
                )}
                {creator.ttFollowers !== null && (
                  <div className="flex items-center justify-between rounded-[10px] bg-soft px-3 py-2 text-sm">
                    <span className="font-semibold text-ink">TikTok</span>
                    <span className="font-bold text-accent">
                      {socialCount(creator.ttFollowers)} ↗
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[14px] border border-line p-5">
              <p className="font-bold text-ink">Datos personales</p>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-dim">País</dt>
                  <dd className="font-semibold text-ink">Chile</dd>
                </div>
                <div>
                  <dt className="text-dim">Comuna</dt>
                  <dd className="font-semibold text-ink">
                    {creator.comuna ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-dim">Género</dt>
                  <dd className="font-semibold text-ink">
                    {creator.audience.male > creator.audience.female
                      ? "Masculino"
                      : "Femenino"}
                  </dd>
                </div>
                <div>
                  <dt className="text-dim">Edad</dt>
                  <dd className="font-semibold text-ink">
                    {creator.age ? `${creator.age} años` : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
