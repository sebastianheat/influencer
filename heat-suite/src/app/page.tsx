import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui";

const stats = [
  { value: "12K+", label: "Creadores verificados" },
  { value: "850+", label: "Marcas activas" },
  { value: "€4.8M", label: "Pagado a creadores" },
  { value: "98%", label: "Campañas completadas" },
];

const features = [
  {
    icon: "🎯",
    title: "Campañas inteligentes",
    desc: "Define brief, presupuesto y entregables. Nuestro matching te sugiere los creadores ideales para cada objetivo.",
  },
  {
    icon: "🔍",
    title: "Descubrimiento avanzado",
    desc: "Filtra por nicho, plataforma, audiencia y engagement real. Datos verificados, sin métricas infladas.",
  },
  {
    icon: "🤝",
    title: "Reclutamiento sin fricción",
    desc: "Recibe postulaciones, preselecciona y aprueba en un panel único. Gestión de colaboraciones de principio a fin.",
  },
  {
    icon: "📊",
    title: "Métricas en tiempo real",
    desc: "Seguimiento de entregables, alcance y rendimiento de cada creador en una vista clara.",
  },
  {
    icon: "💳",
    title: "Pagos protegidos",
    desc: "Fondos en garantía liberados al cumplir los entregables. Tranquilidad para marcas y creadores.",
  },
  {
    icon: "⚡",
    title: "Onboarding HEAT",
    desc: "Activa tu cuenta en minutos con el flujo guiado de Heat Suite. Sin complicaciones.",
  },
];

const steps = [
  {
    n: "01",
    title: "Crea tu campaña",
    desc: "Describe tu marca, define objetivos y publica el brief en minutos.",
  },
  {
    n: "02",
    title: "Recibe creadores",
    desc: "Los influencers se postulan o tú los invitas desde el buscador.",
  },
  {
    n: "03",
    title: "Lanza y mide",
    desc: "Aprueba contenido, gestiona entregables y analiza resultados.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-page">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo variant="dark" />
          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex">
            <a href="#features" className="hover:text-ink">
              Producto
            </a>
            <a href="#how" className="hover:text-ink">
              Cómo funciona
            </a>
            <a href="#creators" className="hover:text-ink">
              Para creadores
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button href="/login" variant="ghost" size="sm">
              Entrar
            </Button>
            <Button href="/register" size="sm">
              Empezar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="heat-gradient absolute inset-0 opacity-[0.97]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.18),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur">
            ✦ Heat Suite · Influencer Marketing
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            Conecta tu marca con los{" "}
            <span className="bg-gradient-to-r from-white to-sky bg-clip-text text-transparent">
              creadores correctos
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
            La plataforma de reclutamiento de influencers de Heat Suite. Crea
            campañas, recluta creadores verificados y gestiona colaboraciones
            desde un solo lugar.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href="/register?role=brand"
              className="bg-white !text-ink shadow-lg hover:bg-white/90"
            >
              Soy una marca →
            </Button>
            <Button
              href="/register?role=creator"
              className="border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              Soy creador
            </Button>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-white/15 bg-white/10 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/[0.06] px-4 py-6 backdrop-blur">
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="mt-1 text-xs text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">
            Plataforma todo-en-uno
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Todo lo que necesitas para reclutar
          </h2>
          <p className="mt-4 text-soft-ink">
            Desde el brief hasta el pago. Heat Suite cubre el ciclo completo de
            tus campañas con creadores.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-[14px] border border-line bg-surface p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-accent-soft text-2xl">
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soft-ink">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-soft py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              Cómo funciona
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Tu primera campaña en 3 pasos
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-[14px] border border-line bg-surface p-7">
                <div className="heat-text-gradient text-4xl font-extrabold">
                  {s.n}
                </div>
                <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-soft-ink">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creators CTA */}
      <section id="creators" className="mx-auto max-w-6xl px-5 py-24">
        <div className="relative overflow-hidden rounded-[24px] heat-gradient-blue px-8 py-16 text-center text-white sm:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,255,255,0.2),transparent)]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              ¿Eres creador? Monetiza tu audiencia
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85">
              Explora campañas de marcas reales, postúlate con un clic y cobra
              de forma segura. Sin intermediarios, sin comisiones ocultas.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                href="/register?role=creator"
                className="bg-white !text-accent hover:bg-white/90"
              >
                Crear mi perfil de creador
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
          <Logo variant="dark" />
          <p className="text-sm text-dim">
            © 2026 Heat Suite. Todos los derechos reservados.
          </p>
          <div className="flex gap-5 text-sm font-semibold text-muted">
            <Link href="/login" className="hover:text-ink">
              Entrar
            </Link>
            <Link href="/register" className="hover:text-ink">
              Registro
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
