import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { Button, Field } from "@/components/ui";

export default function LoginPage() {
  return (
    <AuthShell>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Bienvenido de nuevo
      </h1>
      <p className="mt-1.5 text-sm text-soft-ink">
        Entra para gestionar tus campañas y colaboraciones.
      </p>

      <div className="mt-7 space-y-4">
        <Field label="Email" type="email" placeholder="tu@email.com" />
        <Field label="Contraseña" type="password" placeholder="••••••••" />
        <div className="flex items-center justify-between text-[13px]">
          <label className="flex items-center gap-2 text-soft-ink">
            <input type="checkbox" className="accent-[var(--color-accent)]" />
            Recuérdame
          </label>
          <a href="#" className="font-semibold text-accent hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <Button href="/brand" full>
          Entrar
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-dim">
        <span className="h-px flex-1 bg-line" />o continúa con
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary">Google</Button>
        <Button variant="secondary">Apple</Button>
      </div>

      <p className="mt-7 text-center text-sm text-soft-ink">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-accent hover:underline">
          Regístrate
        </Link>
      </p>

      <div className="mt-6 rounded-[10px] border border-line bg-soft p-3 text-center text-xs text-dim">
        Demo: entra directo a los portales de{" "}
        <Link href="/brand" className="font-semibold text-accent">
          marca
        </Link>
        ,{" "}
        <Link href="/creator" className="font-semibold text-accent">
          creador
        </Link>{" "}
        o{" "}
        <Link href="/admin" className="font-semibold text-accent">
          admin
        </Link>
        .
      </div>
    </AuthShell>
  );
}
