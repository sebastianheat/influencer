import { Button, Card, Field, PageHeader } from "@/components/ui";

export default function Settings() {
  return (
    <>
      <PageHeader
        title="Configuración"
        subtitle="Gestiona los datos de tu marca y tu cuenta."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-bold text-ink">Datos de la marca</h2>
          <div className="mt-4 space-y-4">
            <Field label="Nombre de la marca" defaultValue="Nueva Isapre" />
            <Field label="Sitio web" defaultValue="nuevaisapre.cl" />
            <Field label="Email de contacto" type="email" defaultValue="marketing@nuevaisapre.cl" />
            <Field label="País" defaultValue="Chile" />
            <Button>Guardar cambios</Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="font-bold text-ink">Plan</h2>
            <p className="mt-2 text-sm text-soft-ink">Tu plan actual</p>
            <p className="text-2xl font-extrabold text-ink">Growth</p>
            <Button variant="secondary" full className="mt-4">
              Gestionar suscripción
            </Button>
          </Card>
          <Card>
            <h2 className="font-bold text-ink">Equipo</h2>
            <p className="mt-2 text-sm text-soft-ink">
              Invita a tu equipo a colaborar en las campañas.
            </p>
            <Button variant="secondary" full className="mt-4">
              + Invitar miembro
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
