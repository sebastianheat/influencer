import { Avatar, Badge, Card, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { dateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

const roleLabel: Record<string, string> = { BRAND: "Marca", CREATOR: "Creador", ADMIN: "Admin" };

export default async function AdminUsers() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader title="Usuarios" subtitle={`${users.length} cuentas registradas en la plataforma.`} />

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
                    <Avatar name={u.name} size={36} />
                    <div>
                      <p className="font-semibold text-ink">{u.name}</p>
                      <p className="text-xs text-dim">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <Badge tone={u.role === "BRAND" ? "accent" : u.role === "ADMIN" ? "warning" : "neutral"}>
                    {roleLabel[u.role] ?? u.role}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-soft-ink">{dateShort(u.createdAt.toISOString())}</td>
                <td className="px-5 py-3">
                  <Badge tone="success">Activo</Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="rounded-lg px-2 py-1 text-soft-ink hover:bg-card hover:text-ink">⋯</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
