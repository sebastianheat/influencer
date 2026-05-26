"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, Field } from "@/components/ui";
import { cn } from "@/lib/cn";

const platforms = ["Instagram", "TikTok", "YouTube", "Twitch"];
const collabTypes = ["UGC", "Post", "Reel", "Story", "Clip", "Afiliación"];
const niches = [
  "Moda",
  "Belleza",
  "Fitness",
  "Gaming",
  "Tecnología",
  "Comida",
  "Viajes",
  "Lifestyle",
  "Finanzas",
  "Música",
];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-line bg-surface text-muted hover:border-line-strong",
      )}
    >
      {label}
    </button>
  );
}

export default function NewCampaign() {
  const [selPlatforms, setSelPlatforms] = useState<string[]>(["Instagram"]);
  const [selTypes, setSelTypes] = useState<string[]>(["Reel"]);
  const [niche, setNiche] = useState("Moda");

  const toggle = (
    val: string,
    list: string[],
    set: (v: string[]) => void,
  ) =>
    set(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  return (
    <>
      <Link
        href="/brand/campaigns"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-soft-ink hover:text-ink"
      >
        ← Volver a campañas
      </Link>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Nueva campaña
      </h1>
      <p className="mt-1 text-sm text-soft-ink">
        Define el brief y empieza a recibir creadores.
      </p>

      <div className="mt-7 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="font-bold text-ink">Información básica</h2>
            <div className="mt-4 space-y-4">
              <Field
                label="Título de la campaña"
                placeholder="Ej: Lanzamiento colección primavera"
              />
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                  Brief
                </span>
                <textarea
                  rows={4}
                  placeholder="Describe qué buscas, el tono y los objetivos…"
                  className="w-full rounded-[10px] border border-line bg-surface p-3.5 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
              </label>
              <div>
                <span className="mb-2 block text-[13px] font-semibold text-ink">
                  Nicho
                </span>
                <div className="flex flex-wrap gap-2">
                  {niches.map((n) => (
                    <Chip
                      key={n}
                      label={n}
                      active={niche === n}
                      onClick={() => setNiche(n)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-bold text-ink">Plataformas y formatos</h2>
            <div className="mt-4 space-y-4">
              <div>
                <span className="mb-2 block text-[13px] font-semibold text-ink">
                  Plataformas
                </span>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <Chip
                      key={p}
                      label={p}
                      active={selPlatforms.includes(p)}
                      onClick={() => toggle(p, selPlatforms, setSelPlatforms)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="mb-2 block text-[13px] font-semibold text-ink">
                  Tipos de colaboración
                </span>
                <div className="flex flex-wrap gap-2">
                  {collabTypes.map((t) => (
                    <Chip
                      key={t}
                      label={t}
                      active={selTypes.includes(t)}
                      onClick={() => toggle(t, selTypes, setSelTypes)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-bold text-ink">Presupuesto y plazas</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field label="Presupuesto total (€)" type="number" placeholder="12000" />
              <Field label="Pago por creador (€)" type="number" placeholder="850" />
              <Field label="Nº de plazas" type="number" placeholder="12" />
              <Field label="Seguidores mínimos" type="number" placeholder="20000" />
              <Field label="Fecha de cierre" type="date" />
            </div>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-20">
            <h2 className="font-bold text-ink">Resumen</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-soft-ink">Nicho</dt>
                <dd className="font-semibold text-ink">{niche}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-soft-ink">Plataformas</dt>
                <dd className="font-semibold text-ink">
                  {selPlatforms.length || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-soft-ink">Formatos</dt>
                <dd className="font-semibold text-ink">{selTypes.length || "—"}</dd>
              </div>
            </dl>
            <div className="mt-5 space-y-2">
              <Button href="/brand/campaigns" full>
                Publicar campaña
              </Button>
              <Button href="/brand/campaigns" variant="secondary" full>
                Guardar borrador
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-dim">
              Podrás editar el brief después de publicar.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
