import { Button } from "@/components/ui";

const integrations = [
  {
    name: "Instagram",
    glyph: "IG",
    bg: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)",
    desc: "Conecta Instagram para visualizar las métricas de tu contenido orgánico.",
    cta: "Conectar Instagram",
  },
  {
    name: "TikTok",
    glyph: "TT",
    bg: "#000000",
    desc: "Conecta TikTok para visualizar las métricas de tu contenido orgánico.",
    cta: "Conectar TikTok",
  },
  {
    name: "Ecommerce",
    glyph: "🛍️",
    bg: "linear-gradient(135deg,#34D399,#10B981)",
    desc: "Conecta Shopify o WooCommerce para sincronizar tu catálogo y crear campañas más rápido. También podrás activar afiliados.",
    cta: "Conectar ecommerce",
  },
];

export default function BrandDashboard() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        ¡Bienvenido a Heat Suite! 👋
      </h1>
      <p className="mt-1.5 text-soft-ink">
        Empecemos por construir tu primera activación con creadores.
      </p>

      {/* Activation hero */}
      <div className="relative mt-6 overflow-hidden rounded-[20px] border border-accent/15 bg-accent-soft p-8 sm:p-10">
        <div className="absolute -right-10 top-1/2 hidden h-72 w-72 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18),transparent_70%)] sm:flex">
          <span className="text-[120px] drop-shadow-[0_8px_24px_rgba(37,99,235,0.4)]">
            ⚡
          </span>
        </div>
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
            ⚡ Empezar
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Construye campañas con creadores reales.
          </h2>
          <p className="mt-3 text-soft-ink">
            Lanza tu primera activación, descubre creadores que encajan con tu
            marca y mide los resultados en un solo lugar.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/brand/campaigns/new">+ Crear primera campaña</Button>
            <Button variant="secondary">📅 Agendar onboarding call</Button>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <h2 className="mt-10 text-lg font-bold text-ink">Integraciones</h2>
      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        {integrations.map((it) => (
          <div
            key={it.name}
            className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[12px] text-sm font-bold text-white"
                  style={{ background: it.bg }}
                >
                  {it.glyph}
                </span>
                <div>
                  <p className="font-bold text-ink">{it.name}</p>
                  <p className="text-xs text-dim">Sin conectar</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-dim">
                <span className="h-2 w-2 rounded-full bg-line-strong" />
                No conectado
              </span>
            </div>
            <p className="mt-4 min-h-[40px] text-sm text-soft-ink">{it.desc}</p>
            <Button variant="secondary" full className="mt-4">
              {it.cta}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
