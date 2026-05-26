"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CampaignPreview } from "@/components/campaign-wizard/Preview";
import {
  ContentBlock,
  type ContentType,
} from "@/components/campaign-wizard/ContentBlock";
import { Field } from "@/components/ui";
import { cn } from "@/lib/cn";

const STEP_TITLES = [
  "Campaña",
  "Objetivo de la campaña",
  "Contenido",
  "Requisitos del creador",
  "Resumen",
];

function SelectCard({
  selected,
  onClick,
  title,
  desc,
  icon,
  badge,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  icon?: string;
  badge?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-[12px] border-2 p-4 text-left transition-all",
        selected
          ? "border-accent bg-accent-soft"
          : "border-line bg-surface hover:border-line-strong",
        className,
      )}
    >
      <p
        className={cn(
          "flex items-center gap-2 font-bold",
          selected ? "text-accent" : "text-ink",
        )}
      >
        {icon && <span>{icon}</span>}
        {title}
      </p>
      <p className="mt-1 text-sm text-soft-ink">{desc}</p>
      {badge && (
        <span className="mt-2 inline-block rounded-md bg-success-bg px-2 py-0.5 text-[11px] font-bold text-success">
          {badge}
        </span>
      )}
    </button>
  );
}

const input =
  "h-11 w-full rounded-[10px] border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

let blockSeq = 0;

export default function NewCampaign() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [type, setType] = useState<"public" | "private">("public");
  const [contentKind, setContentKind] = useState<"ugc" | "organic" | "clips">(
    "organic",
  );
  const [objective, setObjective] = useState<"product" | "brand" | "event">(
    "brand",
  );
  const [blocks, setBlocks] = useState<{ id: number; type: ContentType }[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const addBlock = (t: ContentType) => {
    setBlocks((b) => [...b, { id: ++blockSeq, type: t }]);
    setMenuOpen(false);
  };

  const canNext = step !== 1 || name.trim().length > 0;
  const progress = (step / 5) * 100;

  return (
    <>
      <nav className="mb-4 flex items-center gap-2 text-sm text-soft-ink">
        <Link href="/brand/campaigns" className="hover:text-ink">
          Campañas
        </Link>
        <span className="text-dim">›</span>
        <span className="font-semibold text-ink">Nueva campaña</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Wizard column */}
        <div className="space-y-5">
          {/* Step header */}
          <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-dim">{step} de 5</p>
                <h1 className="mt-0.5 text-xl font-extrabold text-ink">
                  {STEP_TITLES[step - 1]}
                </h1>
              </div>
              <div className="flex gap-2">
                {step > 1 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-[10px] border border-accent px-4 py-2 text-sm font-semibold text-accent hover:bg-accent-soft"
                  >
                    Anterior
                  </button>
                )}
                {step < 5 ? (
                  <button
                    onClick={() => canNext && setStep((s) => s + 1)}
                    disabled={!canNext}
                    className={cn(
                      "rounded-[10px] px-4 py-2 text-sm font-semibold transition-colors",
                      canNext
                        ? "heat-gradient-blue text-white"
                        : "cursor-not-allowed bg-card text-dim",
                    )}
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/brand/campaigns")}
                    className="heat-gradient-blue rounded-[10px] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Publicar campaña
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-card">
              <div
                className="heat-gradient-blue h-full rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
                <h2 className="font-bold text-ink">Empecemos con tu campaña</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="mb-1.5 text-[13px] font-semibold text-ink">
                      Nombre de la campaña
                    </p>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ingresa el nombre de tu campaña"
                      className={input}
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[13px] font-semibold text-ink">
                      Descripción de la campaña
                    </p>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Escribe una breve descripción de tu campaña"
                      className="w-full rounded-[10px] border border-line bg-surface p-3.5 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[13px] font-semibold text-ink">
                      Imagen de la campaña
                    </p>
                    <button
                      onClick={() => setHasImage((v) => !v)}
                      className={cn(
                        "flex h-28 w-full flex-col items-center justify-center rounded-[12px] border-2 border-dashed text-center transition-colors",
                        hasImage
                          ? "border-accent bg-accent-soft"
                          : "border-accent/40 bg-accent-soft/40 hover:bg-accent-soft",
                      )}
                    >
                      <span className="text-2xl text-accent">▤</span>
                      <span className="mt-1 text-sm text-soft-ink">
                        {hasImage
                          ? "✓ Imagen cargada (clic para quitar)"
                          : "Arrastra fotos de tu campaña o búscalas acá"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
                <h2 className="font-bold text-ink">Tipo de campaña</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <SelectCard
                    selected={type === "public"}
                    onClick={() => setType("public")}
                    title="Pública"
                    desc="Se publicará en la app para creadores y recibirás postulaciones."
                  />
                  <SelectCard
                    selected={type === "private"}
                    onClick={() => setType("private")}
                    title="Privada"
                    desc="No se publicará en la app para creadores y deberás agregarlos de forma manual."
                  />
                </div>
                <p className="mb-1.5 mt-4 text-[13px] font-semibold text-ink">
                  Fecha límite de postulación
                </p>
                <input type="date" className={input} />
              </div>

              <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
                <h2 className="font-bold text-ink">Selecciona el tipo de contenido</h2>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <SelectCard
                    selected={contentKind === "ugc"}
                    onClick={() => setContentKind("ugc")}
                    icon="🛍"
                    title="UGC Ads"
                    desc="Consigue anuncios UGC para usar en Meta Ads o TikTok Ads."
                  />
                  <SelectCard
                    selected={contentKind === "organic"}
                    onClick={() => setContentKind("organic")}
                    icon="🛍"
                    title="Orgánico"
                    desc="Consigue recomendaciones de microinfluencers o recomendadores."
                  />
                  <SelectCard
                    selected={contentKind === "clips"}
                    onClick={() => setContentKind("clips")}
                    icon="🛍"
                    title="Clips"
                    desc="Consigue clips para destacar productos."
                    badge="Incluye MeliClips"
                  />
                </div>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
              <h2 className="font-bold text-ink">Objetivo de la campaña</h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <SelectCard
                  selected={objective === "product"}
                  onClick={() => setObjective("product")}
                  icon="🛍"
                  title="Producto"
                  desc="Quiero recomendar un producto en específico."
                />
                <SelectCard
                  selected={objective === "brand"}
                  onClick={() => setObjective("brand")}
                  icon="🛍"
                  title="Marca"
                  desc="Quiero promocionar la imagen de mi marca."
                />
                <SelectCard
                  selected={objective === "event"}
                  onClick={() => setObjective("event")}
                  icon="🛍"
                  title="Evento"
                  desc="Quiero promocionar un evento."
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
                <h2 className="font-bold text-ink">Objetivo de la campaña</h2>
                <div className="mt-4">
                  <SelectCard
                    selected
                    onClick={() => {}}
                    title="Customizable"
                    desc="Podrás seleccionar los formatos que desees para tu campaña."
                    badge="Personalizado"
                  />
                </div>
              </div>

              <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-ink">Añade el tipo de contenido</h2>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen((m) => !m)}
                      className="heat-gradient-blue rounded-[10px] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Añadir +
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-[12px] border border-line bg-surface py-1 shadow-[var(--shadow-card)]">
                        {(["Reel", "Story", "Video de TikTok"] as ContentType[]).map(
                          (t) => (
                            <button
                              key={t}
                              onClick={() => addBlock(t)}
                              className="block w-full px-4 py-2.5 text-left text-sm font-medium text-ink hover:bg-soft"
                            >
                              {t}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {blocks.length === 0 ? (
                  <p className="mt-4 rounded-[10px] border border-dashed border-line-strong bg-soft py-8 text-center text-sm text-soft-ink">
                    Añade al menos un tipo de contenido (Reel, Story o Video de
                    TikTok).
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {blocks.map((b) => (
                      <ContentBlock
                        key={b.id}
                        type={b.type}
                        onRemove={() =>
                          setBlocks((arr) => arr.filter((x) => x.id !== b.id))
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
              <h2 className="font-bold text-ink">Requisitos del creador</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Seguidores mínimos" type="number" placeholder="20000" />
                <div>
                  <p className="mb-1.5 text-[13px] font-semibold text-ink">Región</p>
                  <select className={input}>
                    <option>Todas las regiones</option>
                    <option>Región Metropolitana</option>
                    <option>Valparaíso</option>
                    <option>Biobío</option>
                    <option>Coquimbo</option>
                  </select>
                </div>
                <div>
                  <p className="mb-1.5 text-[13px] font-semibold text-ink">Género</p>
                  <select className={input}>
                    <option>Cualquiera</option>
                    <option>Femenino</option>
                    <option>Masculino</option>
                  </select>
                </div>
                <Field label="Edad mínima" type="number" placeholder="18" />
              </div>
              <div className="mt-4">
                <p className="mb-1.5 text-[13px] font-semibold text-ink">
                  Nichos preferidos
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Salud", "Lifestyle", "Belleza", "Fitness y Bienestar", "Entretenimiento"].map(
                    (n) => (
                      <span
                        key={n}
                        className="rounded-full border border-line bg-soft px-3 py-1.5 text-[13px] font-semibold text-muted"
                      >
                        {n}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
              <h2 className="font-bold text-ink">Resumen</h2>
              <p className="mt-1 text-sm text-soft-ink">
                Revisa los detalles antes de publicar tu campaña.
              </p>
              <dl className="mt-4 divide-y divide-line">
                {[
                  ["Nombre", name || "—"],
                  ["Tipo de campaña", type === "public" ? "Pública" : "Privada"],
                  [
                    "Tipo de contenido",
                    contentKind === "ugc"
                      ? "UGC Ads"
                      : contentKind === "organic"
                        ? "Orgánico"
                        : "Clips",
                  ],
                  [
                    "Objetivo",
                    objective === "product"
                      ? "Producto"
                      : objective === "brand"
                        ? "Marca"
                        : "Evento",
                  ],
                  ["Formatos", blocks.map((b) => b.type).join(", ") || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3 text-sm">
                    <dt className="text-soft-ink">{k}</dt>
                    <dd className="font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Preview column */}
        <CampaignPreview name={name} description={description} hasImage={hasImage} />
      </div>
    </>
  );
}
