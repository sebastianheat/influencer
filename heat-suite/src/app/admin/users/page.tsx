import { Avatar, Badge, Card, PageHeader } from "@/components/ui";
import { users } from "@/lib/data";
import { dateShort } from "@/lib/format";

const roleLabel = { brand: "Marca", creator: "Creador", admin: "Admin" };
const statusTone = {
  active: "success",
  pending: "warning",
  suspended: "danger",
} as const;
const statusLabel = {
  active: "Activo",
  pending: "Pendiente",
  suspended: "Suspendido",
};

export default function AdminUsers() {
  return (
    <>
      <PageHeader
        title="Usuarios"
        subtitle={`${users.length} cuentas registradas en la plataforma.`}
      />

      <Card padded={false} className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-soft text-left text-xs uppercase tracking-wide text-dim">
              <th className="px-5 py-3 font-semibold">Usuario</th>
              <th className="px-5 py-3 font-semibold">Rol</th>
              <th className="px-5 py-3 font-semibold">Alta</th>
              <th className="px-5 py-3 font-semibold">Estado</th>
              <th className="px-5 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-soft">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {u.avatar ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-lg">
                        {u.avatar}
                      </div>
                    ) : (
                      <Avatar name={u.name} size={36} />
                    )}
                    <div>
                      <p className="font-semibold text-ink">{u.name}</p>
                      <p className="text-xs text-dim">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <Badge tone={u.role === "brand" ? "accent" : "neutral"}>
                    {roleLabel[u.role]}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-soft-ink">{dateShort(u.joinedAt)}</td>
                <td className="px-5 py-3">
                  <Badge tone={statusTone[u.status]}>{statusLabel[u.status]}</Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="rounded-lg px-2 py-1 text-soft-ink hover:bg-card hover:text-ink">
                    ⋯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
