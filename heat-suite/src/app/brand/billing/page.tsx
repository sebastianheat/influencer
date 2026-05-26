import { Badge, Button, Card, PageHeader, StatCard } from "@/components/ui";
import { money } from "@/lib/format";

const invoices = [
  { id: "INV-1042", concept: "Campaña: Review tech Pulse", amount: 11200, date: "12 may 2026", status: "Pagada" },
  { id: "INV-1038", concept: "Campaña: Reto fitness 30 días", amount: 2400, date: "05 may 2026", status: "Pagada" },
  { id: "INV-1031", concept: "Campaña: Primavera (anticipo)", amount: 5950, date: "28 abr 2026", status: "Pagada" },
  { id: "INV-1029", concept: "Recarga de saldo en garantía", amount: 8000, date: "20 abr 2026", status: "Pendiente" },
];

export default function Billing() {
  return (
    <>
      <PageHeader
        title="Pagos"
        subtitle="Gestiona tu saldo en garantía, métodos de pago y facturas."
        action={<Button>+ Recargar saldo</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Saldo en garantía" value={money(8400)} icon="🔒" />
        <StatCard label="Gastado este mes" value={money(13600)} icon="💸" />
        <StatCard label="Próximo pago" value={money(2100)} icon="📅" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 !p-0">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-bold text-ink">Facturas</h2>
            <button className="text-sm font-semibold text-accent hover:underline">
              Descargar todas
            </button>
          </div>
          <div className="divide-y divide-line">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent-soft text-accent">
                  🧾
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {inv.concept}
                  </p>
                  <p className="text-xs text-dim">
                    {inv.id} · {inv.date}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-ink">
                  {money(inv.amount)}
                </span>
                <Badge tone={inv.status === "Pagada" ? "success" : "warning"}>
                  {inv.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-ink">Método de pago</h2>
          <div className="mt-4 rounded-[12px] heat-gradient-blue p-5 text-white">
            <div className="flex justify-between">
              <span className="text-sm font-semibold opacity-80">Visa</span>
              <span>💳</span>
            </div>
            <p className="mt-6 font-mono text-lg tracking-widest">
              •••• •••• •••• 4242
            </p>
            <p className="mt-2 text-xs opacity-80">Aurora Studio · 08/28</p>
          </div>
          <Button variant="secondary" full className="mt-4">
            Cambiar método de pago
          </Button>
        </Card>
      </div>
    </>
  );
}
