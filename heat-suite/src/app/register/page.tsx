"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button, Field } from "@/components/ui";
import { cn } from "@/lib/cn";

function RegisterForm() {
  const params = useSearchParams();
  const initial = params.get("role") === "creator" ? "creator" : "brand";
  const [role, setRole] = useState<"brand" | "creator">(initial);

  const roles = [
    {
      key: "brand" as const,
      icon: "🏢",
      title: "Soy una marca",
      desc: "Quiero crear campañas y reclutar creadores.",
    },
    {
      key: "creator" as const,
      icon: "✨",
      title: "Soy creador",
      desc: "Quiero descubrir campañas y monetizar.",
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Crea tu cuenta
      </h1>
      <p className="mt-1.5 text-sm text-soft-ink">
        Empieza gratis. Sin tarjeta de crédito.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {roles.map((r) => (
          <button
            key={r.key}
            onClick={() => setRole(r.key)}
            className={cn(
              "rounded-[12px] border p-4 text-left transition-all",
              role === r.key
                ? "border-accent bg-accent-soft ring-2 ring-accent/15"
                : "border-line bg-surface hover:border-line-strong",
            )}
          >
            <div className="text-2xl">{r.icon}</div>
            <div className="mt-2 text-sm font-bold text-ink">{r.title}</div>
            <div className="mt-0.5 text-xs text-soft-ink">{r.desc}</div>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <Field
          label={role === "brand" ? "Nombre de la marca" : "Nombre completo"}
          placeholder={role === "brand" ? "Aurora Studio" : "Lucía Marín"}
        />
        <Field label="Email" type="email" placeholder="tu@email.com" />
        <Field label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
        <Button href={role === "brand" ? "/brand" : "/creator"} full>
          Crear cuenta
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-soft-ink">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="text-sm text-dim">Cargando…</div>}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
