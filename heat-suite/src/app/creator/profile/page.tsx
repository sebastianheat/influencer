import {
  Avatar,
  Badge,
  Button,
  Card,
  Field,
  StatCard,
} from "@/components/ui";
import { notFound } from "next/navigation";
import { currentCreatorId, getConnectedProviders, getCreator } from "@/lib/queries";
import { compact, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CreatorProfile() {
  const id = await currentCreatorId();
  const me = id ? await getCreator(id) : null;
  if (!me) notFound();
  const connected = await getConnectedProviders();

  return (
    <>
      <Card className="overflow-hidden !p-0">
        <div className="heat-gradient h-28" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="rounded-full border-4 border-surface">
                <Avatar name={me.name} size={84} />
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-ink">
                    {me.name}
                  </h1>
                  {me.verified && <Badge tone="accent">✓ Verificado</Badge>}
                </div>
                <p className="text-sm text-dim">
                  {me.handle} · {me.location}
                </p>
              </div>
            </div>
            <Button variant="secondary">Ver como marca</Button>
          </div>
        </div>
      </Card>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Seguidores" value={compact(me.followers)} icon="👥" />
        <StatCard label="Engagement" value={`${me.engagement}%`} icon="❤️" />
        <StatCard label="Rating" value={`${me.rating} / 5`} icon="⭐" />
        <StatCard label="Colaboraciones" value={String(me.completedCampaigns)} icon="✅" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-bold text-ink">Editar perfil</h2>
          <div className="mt-4 space-y-4">
            <Field label="Nombre" defaultValue={me.name} />
            <Field label="Handle" defaultValue={me.handle} />
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                Bio
              </span>
              <textarea
                rows={3}
                defaultValue={me.bio}
                className="w-full rounded-[10px] border border-line bg-surface p-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
            </label>
            <Field label="Ubicación" defaultValue={me.location} />
            <Field
              label="Tarifa base (€)"
              type="number"
              defaultValue={String(me.priceFrom)}
            />
            <Button>Guardar cambios</Button>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="font-bold text-ink">Nichos</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {me.niche.map((n) => (
                <Badge key={n} tone="neutral">
                  {n}
                </Badge>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="font-bold text-ink">Conexiones</h2>
            <p className="mt-1 text-sm text-soft-ink">
              Vincula tus cuentas para verificar métricas y mejorar tu match
              score.
            </p>
            <div className="mt-4 space-y-2.5">
              {[
                { id: "instagram", label: "Instagram", glyph: "IG", bg: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)" },
                { id: "tiktok", label: "TikTok", glyph: "TT", bg: "#000000" },
              ].map((p) => {
                const done = connected.has(p.id);
                return (
                  <div key={p.id} className="flex items-center gap-3 rounded-[10px] border border-line p-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-[10px] text-xs font-bold text-white"
                      style={{ background: p.bg }}
                    >
                      {p.glyph}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-ink">{p.label}</span>
                    {done ? (
                      <span className="text-sm font-bold text-success">Conectado ✓</span>
                    ) : (
                      <a href={`/api/connect/${p.id}`} className="text-sm font-bold text-accent hover:underline">
                        Vincular
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
          <Card>
            <h2 className="font-bold text-ink">Tarifa base</h2>
            <p className="mt-2 text-3xl font-extrabold text-ink">
              {money(me.priceFrom)}
            </p>
            <p className="text-xs text-dim">por colaboración</p>
          </Card>
        </div>
      </div>
    </>
  );
}
