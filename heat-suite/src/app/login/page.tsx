"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button, Field } from "@/components/ui";
import { authenticate } from "@/lib/auth-actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(authenticate, undefined);

  return (
    <AuthShell>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Bienvenido de nuevo
      </h1>
      <p className="mt-1.5 text-sm text-soft-ink">
        Entra para gestionar tus campañas y colaboraciones.
      </p>

      <form action={action} className="mt-7 space-y-4">
        <Field label="Email" type="email" name="email" placeholder="tu@email.com" required />
        <Field label="Contraseña" type="password" name="password" placeholder="••••••••" required />
        {state?.error && (
          <p className="rounded-[10px] bg-danger-bg px-3 py-2 text-sm font-semibold text-danger">
            {state.error}
          </p>
        )}
        <Button type="submit" full>
          {pending ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-soft-ink">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-accent hover:underline">
          Regístrate
        </Link>
      </p>

      <div className="mt-6 rounded-[10px] border border-line bg-soft p-3 text-center text-xs text-dim">
        Cuentas demo (contraseña <strong>demo1234</strong>):<br />
        <span className="font-semibold text-soft-ink">brand@heat.test</span> ·{" "}
        <span className="font-semibold text-soft-ink">creator@heat.test</span> ·{" "}
        <span className="font-semibold text-soft-ink">admin@heat.test</span>
      </div>
    </AuthShell>
  );
}
