import Link from "next/link";
import { Logo } from "./Logo";

const points = [
  "Reclutamiento de creadores verificados",
  "Pagos protegidos en garantía",
  "Métricas de campaña en tiempo real",
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="heat-gradient relative hidden w-[44%] flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_0%,rgba(255,255,255,0.18),transparent)]" />
        <div className="relative">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="relative">
          <h2 className="max-w-sm text-3xl font-extrabold leading-tight tracking-tight">
            La forma más simple de hacer influencer marketing.
          </h2>
          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-white/85">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs">
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-sm text-white/60">
          © 2026 Heat Suite
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-page px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <Logo variant="dark" />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
