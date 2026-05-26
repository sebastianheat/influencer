import { Avatar, Badge, Card, PageHeader } from "@/components/ui";
import { getInfluencer } from "@/lib/data";

const items = [
  { id: "c1", inf: "inf-8", format: "Reel", campaign: "nuevaisapre.cl", status: "review", cover: "heat-gradient-soft" },
  { id: "c2", inf: "inf-1", format: "Story", campaign: "nuevaisapre.cl", status: "approved", cover: "heat-gradient-blue" },
  { id: "c3", inf: "inf-10", format: "Reel", campaign: "Reto fitness 30 días", status: "pending", cover: "heat-gradient" },
  { id: "c4", inf: "inf-13", format: "Clip", campaign: "Review tech Pulse", status: "approved", cover: "heat-gradient-soft" },
  { id: "c5", inf: "inf-3", format: "Post", campaign: "Reto fitness 30 días", status: "review", cover: "heat-gradient-blue" },
  { id: "c6", inf: "inf-7", format: "Reel", campaign: "nuevaisapre.cl", status: "pending", cover: "heat-gradient" },
];

const statusMap = {
  pending: { label: "Pendiente", tone: "neutral" as const },
  review: { label: "En revisión", tone: "warning" as const },
  approved: { label: "Aprobado", tone: "success" as const },
};

export default function Content() {
  return (
    <>
      <PageHeader
        title="Contenidos"
        subtitle="Revisa y aprueba el contenido entregado por tus creadores."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const inf = getInfluencer(it.inf);
          const s = statusMap[it.status as keyof typeof statusMap];
          return (
            <Card key={it.id} padded={false} className="overflow-hidden">
              <div className={`relative h-40 ${it.cover}`}>
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink backdrop-blur">
                  {it.format}
                </span>
                <span className="absolute right-3 top-3">
                  <Badge tone={s.tone}>{s.label}</Badge>
                </span>
                <span className="absolute bottom-3 left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl backdrop-blur">
                  ▶
                </span>
              </div>
              <div className="flex items-center gap-3 p-4">
                {inf && <Avatar name={inf.name} size={36} />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {inf?.name}
                  </p>
                  <p className="truncate text-xs text-dim">{it.campaign}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
