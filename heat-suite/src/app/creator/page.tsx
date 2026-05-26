import Link from "next/link";
import { CampaignCard } from "@/components/CampaignCard";
import { ApplicationStatusBadge, Avatar, Card } from "@/components/ui";
import { auth } from "@/auth";
import {
  currentCreatorId,
  getApplicationsForCreator,
  getCampaigns,
  getConnectedProviders,
  getCreator,
} from "@/lib/queries";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CreatorDashboard() {
  const session = await auth();
  const firstName = (session?.user?.name ?? "").split(" ")[0] || "creador";
  const id = await currentCreatorId();
  const me = id ? await getCreator(id) : null;
  const myApps = id ? await getApplicationsForCreator(id) : [];
  const open = (await getCampaigns()).filter((c) => c.status === "active").slice(0, 4);

  const connected = await getConnectedProviders();
  const accepted = myApps.filter((a) => a.app.status === "accepted");
  const earnings = accepted.reduce((s, a) => s + a.app.proposedRate, 0);
  const socialsConnected = connected.has("instagram") || connected.has("tiktok");

  const checklist = [
    {
      icon: "IG",
      bg: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)",
      title: "Vincula Instagram",
      sub: "Conecta tu cuenta",
      href: "/api/connect/instagram",
      done: connected.has("instagram"),
    },
    {
      icon: "TT",
      bg: "#000000",
      title: "Vincula TikTok",
      sub: "Conecta tu cuenta",
      href: "/api/connect/tiktok",
      done: connected.has("tiktok"),
    },
    { icon: "🏦", bg: "#E2E8F0", title: "Completa tus datos bancarios", sub: "Para recibir pagos", href: "/creator/profile", done: false },
    { icon: "📍", bg: "#E2E8F0", title: "Completa tu dirección", sub: "Para envíos y facturación", href: "/creator/profile", done: false },
    { icon: "🏷️", bg: "#E2E8F0", title: "Completa tu portafolio", sub: "Para recomendarte campañas", href: "/creator/profile", done: false },
  ];
  const xp = myApps.length * 20 + accepted.length * 120;
  const nextLevel = 1000;
  const pct = Math.min(100, Math.round((xp / nextLevel) * 100));
  const remaining = Math.max(0, nextLevel - xp);

  return (
    <>
      {/* Hero / gamification */}
      <div className="heat-gradient relative overflow-hidden rounded-[20px] p-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_0%,rgba(255,255,255,0.18),transparent)]" />
        <div className="relative flex items-center gap-4">
          <div className="rounded-full ring-2 ring-white/40">
            <Avatar name={me?.name ?? firstName} size={56} />
          </div>
          <div>
            <p className="text-sm text-white/80">Hola,</p>
            <p className="text-2xl font-extrabold tracking-tight">{firstName} 👋</p>
          </div>
        </div>

        <div className="relative mt-5 rounded-[14px] bg-white/10 p-4 backdrop-blur">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="flex items-center gap-2">🌱 Rookie → Bronze</span>
            <span>
              {xp} <span className="text-white/70">/ {nextLevel} XP</span>
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${Math.max(pct, 4)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/70">
            Te faltan {remaining} XP para Bronze
          </p>
        </div>
      </div>

      {/* Connect socials warning */}
      {!socialsConnected && (
      <div className="mt-5 overflow-hidden rounded-[18px] bg-gradient-to-r from-warning to-[#F59E0B] p-5 text-white shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/90 text-xl text-warning">
            ⚠
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold">No puedes aplicar a campañas aún</p>
            <p className="text-sm text-white/90">
              Conecta Instagram o TikTok para continuar.
            </p>
          </div>
          <Link
            href="/creator/profile"
            className="rounded-[10px] bg-ink px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            Completar
          </Link>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/15">
          <div className="h-full w-1/2 rounded-full bg-white" />
        </div>
        <p className="mt-1.5 text-xs text-white/90">50% completo</p>
      </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Postulaciones", String(myApps.length), "📨"],
          ["Colaboraciones", String(accepted.length), "🤝"],
          ["Ganancias", money(earnings), "💰"],
        ].map(([label, value, icon]) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-soft-ink">{label}</p>
                <p className="mt-1 text-2xl font-extrabold text-ink">{value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent-soft text-lg">
                {icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Profile checklist */}
      <div className="mt-8 flex items-center gap-2">
        <h2 className="text-lg font-bold text-ink">👤 Tu perfil</h2>
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-card px-2 text-xs font-bold text-soft-ink">
          {checklist.length}
        </span>
      </div>
      <div className="mt-3 space-y-3">
        {checklist.map((c) => (
          <div
            key={c.title}
            className="flex items-center gap-3 rounded-[14px] border border-line bg-surface p-4 shadow-[var(--shadow-soft)]"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-[12px] text-sm font-bold text-white"
              style={{ background: c.bg }}
            >
              {c.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{c.title}</p>
              <p className="text-xs text-dim">{c.sub}</p>
            </div>
            {c.done ? (
              <span className="text-sm font-bold text-success">Conectado ✓</span>
            ) : (
              <Link href={c.href} className="text-sm font-bold text-accent hover:underline">
                {c.href.startsWith("/api/connect") ? "Vincular" : "Completar"}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recommended + applications */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Campañas de la semana</h2>
            <Link href="/creator/campaigns" className="text-sm font-semibold text-accent hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {open.map((c) => (
              <CampaignCard key={c.id} campaign={c} href={`/creator/campaigns/${c.id}`} ctaLabel="Postularme" />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold text-ink">Mis postulaciones</h2>
          <Card padded={false}>
            <div className="divide-y divide-line">
              {myApps.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-dim">Aún no te has postulado.</p>
              )}
              {myApps.map(({ app, campaign }) => (
                <Link
                  key={app.id}
                  href={`/creator/campaigns/${app.campaignId}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-soft"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-card text-lg">
                    {campaign.brandLogo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{campaign.title}</p>
                    <p className="truncate text-xs text-dim">{campaign.brand}</p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
